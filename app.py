from flask import Flask, request, jsonify
from flask_cors import CORS  # 导入 CORS
import os  # 导入 os 模块来获取环境变量

app = Flask(__name__)
CORS(app)  # 启用 CORS 支持


# 定义一个路由，用于接收表单提交的数据
@app.route('/submit', methods=['POST'])
def submit_form():
    data = request.get_json()  # 获取表单数据（JSON 格式）

    # 获取具体字段的数据
    name = data.get('name')
    location = data.get('location')
    lat = data.get('lat')
    lon = data.get('lon')
    description = data.get('description')

    # 在这里可以对数据进行处理，例如存储在文件、数据库或发送邮件
    print(f"收到提交信息: 姓名={name}, 地点={location}, 描述={description}")

    # 可以返回给前端一些信息，告知提交成功
    return jsonify({"message": "提交成功", "status": "success"}), 200

# 启动服务器
if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))  # 从环境变量获取端口，默认为 5000
    app.run(host='0.0.0.0', port=port)  # 监听所有公网 IP 地址