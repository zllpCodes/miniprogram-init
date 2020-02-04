module.exports = {
  // 获取当前运行环境
  getEnv() {
    let NODE_ENV = 'pro';

    // 尝试读取某个非线上存在的文件
    // 若读取成功，则为dev环境
    try {
      const fileManager = wx.getFileSystemManager();
      fileManager.accessSync('../mocker.js');
      NODE_ENV = 'dev';
    } catch (e) {}

    return NODE_ENV;
  },
  // 获取api请求host
  getHost() {
    let host = '';
    const NODE_ENV = this.getEnv();

    if (NODE_ENV === 'pro') {
      host = 'https://mi.com';
    } else {
      host = 'http://localhost';
    }

    return host;
  },
  // 格式化日期
  formatTime(date) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();

    return [year, month, day].map(this.formatNumber).join('/') + ' ' + [hour, minute, second].map(this.formatNumber).join(':');
  },
  // 格式化数字
  formatNumber(n) {
    n = n.toString();
    return n[1] ? n : '0' + n;
  }
};