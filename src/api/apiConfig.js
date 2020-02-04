const
    domain = 'http://mi.com:8089',
    errMsg = '服务器异常，请稍后重试';

module.exports = {
    fetch: function ({
        loading = true,
        toast = true,
        url,
        data,
        method,
        options = {}
    }) {
        return new Promise((resolve, reject) => {
            wx.request({
                url: `${domain}${url}`, // 请求地址
                data, // 请求参数
                method: method || 'GET', // 请求方式，默认GET
                // header参数
                header: options.header || {},
                success: function (resp) {
                    let res = resp.data;

                    if (loading) {
                        wx.hideLoading();
                    }

                    // 成功状态码
                    if (res.code === '0000') {
                        // 触发后续回调
                        resolve(res);
                    } else {
                        if (toast) {
                            wx.showToast({
                                title: res.message || errMsg,
                                icon: 'none'
                            })
                        }
                        // 返回错误
                        reject(res);
                    }
                },
                fail: function (err = {
                    code: -1,
                    errMsg
                }) {
                    let msg = err.errMsg;

                    if (err.errMsg == 'request:fail timeout') {
                        msg = '服务请求超时，请稍后重试';
                    }

                    wx.showToast({
                        title: msg,
                        icon: 'none'
                    });

                    // 返回错误
                    reject(err);
                }
            })
        });
    }
}