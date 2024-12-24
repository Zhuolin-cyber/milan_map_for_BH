import logging
from logging.handlers import RotatingFileHandler
import os

def configure_logging(app, log_file_name='access.log', max_bytes=10 * 1024 * 1024, backup_count=5):
    """
    配置 Flask 的日志记录功能，日志将写入文件。

    Args:
        app: Flask 应用实例。
        log_file_name (str): 日志文件名，默认是 'access.log'。
        max_bytes (int): 日志文件的最大字节数，超过后会创建新文件。
        backup_count (int): 备份的日志文件数量。
    """
    # 获取当前工作目录并构造日志文件路径
    log_file_path = os.path.join(os.getcwd(), log_file_name)

    # 创建一个 RotatingFileHandler
    handler = RotatingFileHandler(log_file_path, maxBytes=max_bytes, backupCount=backup_count, encoding='utf-8')

    # 设置日志格式
    formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')
    handler.setFormatter(formatter)

    # 配置 Werkzeug 日志（Flask 内部请求日志）
    werkzeug_logger = logging.getLogger('werkzeug')
    werkzeug_logger.setLevel(logging.INFO)
    werkzeug_logger.addHandler(handler)

    # 配置应用日志
    app.logger.setLevel(logging.INFO)
    app.logger.addHandler(handler)

    app.logger.info("Logging is configured successfully.")
