module.exports = {
  // 获取当前环境对应的域名
  getHost(env) {
    // 测试环境
    let host = 'http://staging.merchant-mobile.sdpay.mipay.com';

    // 本地开发
    if (env === 'dev') {
      host = 'http://localhost:8089'
    } else if (env === 'prod') {
      // 线上生产
      host = 'https://merchant-mobile.sdpay.mipay.com';
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
  },
  // 将对象的键值对变成 key = val的形式
  obj2KeyVal(obj, withEncode = true) {
    let res = '';
    // getOwnPropertyNames 获取到的key有顺序之分
    Object.getOwnPropertyNames(obj).forEach((key) => {
      // 是否对val进行转码
      if (withEncode) {
        // encodeURIComponent 必要！用于对特殊字符 如+、空格等编码
        res += `${key}=${encodeURIComponent(obj[key])}&`;
      } else {
        res += `${key}=${obj[key]}&`;
      }
    });

    res = res.slice(0, -1);

    return res;
  },
};