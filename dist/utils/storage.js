let Storage = {
    get(key) {
        if (localStorage.getItem(key)) {
            return JSON.parse(localStorage.getItem(key));
        } else {
            return '';
        }
    },

    set(key, val) {
        localStorage.setItem(key, JSON.stringify(val));
    },

    delete(keys) {
        if (typeof keys === 'string') {
            if (localStorage.getItem(keys)) localStorage.removeItem(keys);
        } else if (typeof keys === 'object' && Array.isArray(keys)) {
            for (let key of keys) {
                if (localStorage.getItem(key)) localStorage.removeItem(key);
            }
        }
    },

    clear() {
        localStorage.clear();
    }
};

export default Storage;