module.exports = {
    set(key, data) {
        // 默认使用同步的方式设置
        // 为防止小程序设置缓存错误，采用异步容错
        try {
            wx.setStorageSync(key, data);
        } catch (err) {
            wx.setStorage({
                key,
                data
            });
        }
    },

    get(key) {
        return wx.getStorageSync(key);
    },

    delete(key) {
        wx.removeStorageSync(key);
    },
    
    clear() {
        wx.clearStorageSync();
    }
};