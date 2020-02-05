const util = require('./util');

// 处理url，若有参数，则将参数和url拼接
const handleUrl = (path, params = {}) => {
    if (!path || typeof path !== 'string')
        throw new Error('Url pushing in history is invalidable.');

    const
        query = util.obj2KeyVal(params),
        url = query ? `${path}?${query}` : path;

    return url;
};

// 处理是否需要延时跳转路由
const handleDuration = (cb, duration = 0) => {
    duration ? setTimeout(() => {
        cb();
    }, duration) : cb();
};

module.exports = {
    // 关闭当前所有页面，在新窗口打开路由
    launch(path, params, duration = 0) {
        const url = handleUrl(path, params),
            cb = () => {
                wx.reLaunch({
                    url
                })
            };

        handleDuration(cb, duration);
    },

    // 替换当前路由
    replace(path, params, duration = 0) {
        const url = handleUrl(path, params),
            cb = () => {
                wx.redirectTo({
                    url
                });
            };

        handleDuration(cb, duration);
    },

    // 添加一个新路由，不能超过10层页面
    push(path, params, duration = 0) {
        const url = handleUrl(path, params),
            cb = () => {
                wx.navigateTo({
                    url
                });
            };

        handleDuration(cb, duration);
    },

    // 回退上一个路由
    back(duration = 0) {
        const cb = () => {
            wx.navigateBack({
                delta: 1
            });
        };

        handleDuration(cb, duration);
    }
};