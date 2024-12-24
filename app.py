from flask import Flask, request, jsonify, render_template
from flask_cors import CORS  # 导入 CORS
import os  # 导入 os 模块来获取环境变量
import schedule
import time
import requests
from threading import Thread
import random
import json
from my_logging import configure_logging

app = Flask(__name__)
CORS(app, resources={r"/submit": {"origins": "*"}})

# 调用日志配置函数
configure_logging(app)

@app.route('/')
def index():
    return render_template('index.html') 
    
# 定义一个路由，用于接收表单提交的数据
@app.route('/submit', methods=['POST'])
def submit_form():
    print("Request headers:", request.headers)
    print("Request data:", request.json)

    data = request.get_json()  # 获取表单数据（JSON 格式）

    # 获取具体字段的数据
    name = data.get('name')
    location = data.get('location')
    description = data.get('description')

    # 在这里可以对数据进行处理，例如存储在文件、数据库或发送邮件
    print(f"收到提交信息: 姓名={name}, 地点={location}, 描述={description}")

    # 构造要保存的字典信息
    try:
        data = {
            "name": name,
            "location": "",
            "type": "",  # 若类型为空则存空字符串
            "address": location or "",  # 若地址为空则存空字符串
            "description": description or "",  # 若描述为空则存空字符串
            "price": ""  # 若价格为空则存空字符串
        }
    except:
        pass
    # 保存为 JSON 格式到 txt 文件中
    file_path = os.path.join(os.getcwd(), 'submitted_info.txt')

    # 检查文件是否存在，读取已有内容
    if os.path.exists(file_path):
        with open(file_path, 'r', encoding='utf-8') as f:
            try:
                existing_data = json.load(f)  # 读取已有 JSON 数据
                # 如果不是列表，重置为列表
                if not isinstance(existing_data, list):
                    existing_data = []
            except json.JSONDecodeError:
                existing_data = []  # 如果文件为空或格式错误，初始化为空列表
    else:
        existing_data = []  # 如果文件不存在，初始化为空列表

    # 追加新的数据到列表
    existing_data.append(data)

    # 将更新后的数据重新写入文件
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(existing_data, f, ensure_ascii=False, indent=4)

    # 可以返回给前端一些信息，告知提交成功
    return jsonify({"message": "提交成功", "status": "success"}), 200


# 定时请求自身服务器以保持活跃
def keep_alive():
    try:
        requests.get("https://8.147.131.246:5000/submit")
        print("Sent keep-alive request to the server")
    except Exception as e:
        print(f"Error sending keep-alive request: {e}")

# 动态调整的调度任务
def dynamic_schedule():
    while True:
        # 生成 1 到 2 之间的随机数作为等待时间
        wait_time = random.randint(1, 2)
        print(f"Next request in {wait_time} minutes...")
        schedule.every(wait_time).minutes.do(keep_alive)

        # 运行任务并等待下一次调度
        while schedule.jobs:
            schedule.run_pending()
            time.sleep(1)

        # 重置任务以生成新的随机时间
        schedule.clear()

# 启动服务器
if __name__ == '__main__':
    # 启动定时器线程
    # scheduler_thread = Thread(target=dynamic_schedule)
    # scheduler_thread.start()

    port = int(os.environ.get('PORT', 5000))  # 从环境变量获取端口，默认为 5000
    app.run(host='0.0.0.0', port=port)  # 监听所有公网 IP 地址
