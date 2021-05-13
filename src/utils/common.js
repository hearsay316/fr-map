import Cookies from 'js-cookie';

// 公共方法

/**
 * @description 检查屏幕分辨率
 * @author jinlei
 * @date 2020-02-04
 * @export
 * @returns Boolean
 */
export function checkScreen() {
    console.log(screen);
    return screen.width === 1920 && screen.height === 1080;
}

/**
 * @description cookie操作
 * @author jinlei
 * @date 2020-02-04
 * @export
 * @param {*} type 新增/设置/删除
 * @param {*} name cookie key
 * @param {*} data cookie value
 */
export function cookie(type, name, data, time, path) {
    switch (type) {
        case 'set':
            Cookies.set(name, data, { expires: time || 1 / 24, path: path || './' });
            break;
        case 'get':
            return Cookies.get(name);
        case 'remove':
            Cookies.remove(name, { path: path || './' });
            break;
        default:
            return Cookies.get(name);
    }
}

/**
 * 清除cookie 和localStorage
 */
export function clearAll() {
    clearAllCookie();
    localStorage.clear();
}
/**
 * 清除所有cookie
 */
export function clearAllCookie() {
    const keys = document.cookie.match(/[^ =;]+(?=\=)/g);
    if (keys) {
        for (let i = keys.length; i--; )
            document.cookie = keys[i] + '=0;expires=' + new Date(0).toUTCString();
    }
}

/**
 * @description 热力图假数据
 * @author jinlei
 * @date 2019-12-18
 * @export
 * @param {*} lng 经度
 * @param {*} lat 纬度
 */
export function heatmap(lng, lat) {
    const arr = [];
    for (let i = 0; i < 100; i++) {
        const random1 = Math.random();
        const random2 = Math.random();
        arr.push({
            name: i,
            lng:
                random1 > 0.5
                    ? parseFloat(lng) + Math.random() / 100
                    : parseFloat(lng) - Math.random() / 100,
            lat:
                random2 > 0.5
                    ? parseFloat(lat) - Math.random() / 100
                    : parseFloat(lat) + Math.random() / 100,
            count: parseInt(Math.random() * 1000)
        });
    }
    console.log(arr);
    return arr;
}

/**
 * @description 返回数据类型
 * @author jinlei
 * @date 2020-02-04
 * @export
 * @param {*} obj 数据
 * @returns 类型
 */
export function checkType(obj) {
    return Object.prototype.toString.call(obj).slice(8, -1).toLowerCase();
}
// 下载文件
export function downloadFile(obj, name, suffix) {
    const url = window.URL.createObjectURL(new Blob([obj]));
    const link = document.createElement('a');
    link.style.display = 'none';
    link.href = url;
    const fileName = parseTime(new Date()) + '-' + name + '.' + suffix;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
/**
 * @description async await 封装
 * @author jinlei
 * @date 2020-02-04
 * @export
 * @param {*} promise
 * @returns [错误信息, 请求结果]
 */
export function wait(promise) {
    if (!promise || checkType(promise) !== 'promise') {
        return new Promise((resolve, reject) => {
            reject(new Error('requires promises as the param'));
        }).catch((err) => {
            return [err, null];
        });
    }
    return promise
        .then(function () {
            return [null, ...arguments];
        })
        .catch((err) => {
            return [err, null];
        });
}

/**
 * @description 打开窗口
 * @author jinlei
 * @date 2020-02-04
 * @export
 * @param {*} url 地址
 * @param {*} title 标题
 * @param {*} w 宽度
 * @param {*} h 高度
 */
export function windowOpen(url, title, w, h) {
    // Fixes dual-screen position                            Most browsers       Firefox
    const dualScreenLeft = window.screenLeft !== undefined ? window.screenLeft : screen.left;
    const dualScreenTop = window.screenTop !== undefined ? window.screenTop : screen.top;

    const width = window.innerWidth
        ? window.innerWidth
        : document.documentElement.clientWidth
        ? document.documentElement.clientWidth
        : screen.width;
    const height = window.innerHeight
        ? window.innerHeight
        : document.documentElement.clientHeight
        ? document.documentElement.clientHeight
        : screen.height;

    const left = width / 2 - w / 2 + dualScreenLeft;
    const top = height / 2 - h / 2 + dualScreenTop;
    const newWindow = window.open(
        url,
        title,
        'channelmode=yes,toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=' +
            w +
            ', height=' +
            h +
            ', top=' +
            top +
            ', left=' +
            left
    );

    // Puts focus on the newWindow
    if (window.focus) {
        newWindow.focus();
    }
}

/**
 * @description 删除html标签
 * @author jinlei
 * @date 2020-02-07
 * @export
 * @param {*} data html字符串
 * @returns String
 */
export function removeTags(data) {
    if (data) {
        return data.replace(/<[^>]+>|&nbsp;|\n|\|+|\r/g, '');
    } else {
        return '';
    }
}

/**
 * @description 深拷贝
 * @author jinlei
 * @date 2020-02-07
 * @export
 * @param {*} obj
 * @returns 拷贝的对象
 */
export function deepCopy(obj) {
    let result;
    const type = checkType(obj);
    if (type === 'array' || type === 'object') {
        result = type === 'array' ? [] : {};
        Object.keys(obj).forEach((index) => {
            if (typeof obj[index] === 'object' && obj[index] !== null) {
                result[index] = deepCopy(obj[index]);
            } else {
                result[index] = obj[index];
            }
        });
    } else {
        result = obj;
    }
    return result;
}

/**
 * @description  转化各种格式时间为Date对象
 * @author jinlei
 * @date 2020-02-07
 * @export Date
 * @param {*} time
 */
export function checkoutTimeType(time) {
    if (!time) {
        return '';
    }
    let date;
    if (checkType(date) === 'date') {
        date = time;
    } else {
        if (typeof time === 'string' && /^[0-9]+$/.test(time)) {
            time = parseInt(time);
        }
        if (typeof time === 'number' && time.toString().length === 10) {
            time = time * 1000;
        }
        date = new Date(time);
    }
    return date;
}

/**
 * @description 时间格式化
 * @author jinlei
 * @date 2020-02-07
 * @export
 * @param {*} time
 * @param {*} cFormat
 * @returns
 */
export function parseTime(time, cFormat) {
    const date = checkoutTimeType(time);
    if (!date) return time;
    const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}';
    const formatObj = {
        y: date.getFullYear(),
        m: date.getMonth() + 1,
        d: date.getDate(),
        h: date.getHours(),
        i: date.getMinutes(),
        s: date.getSeconds(),
        a: date.getDay()
    };
    const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
        let value = formatObj[key];
        // Note: getDay() returns 0 on Sunday
        if (key === 'a') {
            return ['日', '一', '二', '三', '四', '五', '六'][value];
        }
        if (result.length > 0 && value < 10) {
            value = '0' + value;
        }
        return value || 0;
    });
    return time_str;
}

/**
 * @description 最近七天
 * @author jinlei
 * @date 2020-02-07
 * @export Array [before, now]
 * @param {*} date 时间
 */
export function sevenDays(time, cFormat = '{y}-{m}-{d} {h}:{i}:{s}') {
    const date = checkoutTimeType(time);
    const now = parseTime(date, cFormat); // 当前时间
    const before = parseTime(new Date(date).setDate(date.getDate() - 7), cFormat);
    return [before, now];
}
// 节流函数
export function throttle(fn, interval = 1000, that) {
    let timer = null;
    let firstTime = true;
    console.log('~~~~');
    return function (...args) {
        if (firstTime) {
            // 第一次加载
            fn.apply(that, args);
            firstTime = false;
            return;
        }
        if (timer) {
            // 定时器正在执行中，跳过
            return;
        }
        timer = setTimeout(() => {
            clearTimeout(timer);
            timer = null;
            fn.apply(that, args);
        }, interval);
    };
}

/**
 * @param {Function} func
 * @param {number} wait
 * @param {boolean} immediate
 * @return {*}
 */
export function debounce(func, wait, immediate) {
    let timeout, args, context, timestamp, result;

    const later = function () {
        // 据上一次触发时间间隔
        const last = +new Date() - timestamp;

        // 上次被包装函数被调用时间间隔 last 小于设定时间间隔 wait
        if (last < wait && last > 0) {
            timeout = setTimeout(later, wait - last);
        } else {
            timeout = null;
            // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
            if (!immediate) {
                result = func.apply(context, args);
                if (!timeout) context = args = null;
            }
        }
    };

    return function (...args) {
        context = this;
        timestamp = +new Date();
        const callNow = immediate && !timeout;
        // 如果延时不存在，重新设定延时
        if (!timeout) timeout = setTimeout(later, wait);
        if (callNow) {
            result = func.apply(context, args);
            context = args = null;
        }

        return result;
    };
}
/**
 * @param {string} input value
 * @returns {number} output value
 */
export function byteLength(str) {
    // returns the byte length of an utf8 string
    let s = str.length;
    for (var i = str.length - 1; i >= 0; i--) {
        const code = str.charCodeAt(i);
        if (code > 0x7f && code <= 0x7ff) s++;
        else if (code > 0x7ff && code <= 0xffff) s += 2;
        if (code >= 0xdc00 && code <= 0xdfff) i--;
    }
    return s;
}
/**
 * Merges two objects, giving the last one precedence
 * @param {Object} target
 * @param {(Object|Array)} source
 * @returns {Object}
 */
export function objectMerge(target, source) {
    if (typeof target !== 'object') {
        target = {};
    }
    if (Array.isArray(source)) {
        return source.slice();
    }
    Object.keys(source).forEach((property) => {
        const sourceProperty = source[property];
        if (typeof sourceProperty === 'object') {
            target[property] = objectMerge(target[property], sourceProperty);
        } else {
            target[property] = sourceProperty;
        }
    });
    return target;
}
/**
 * Check if an element has a class
 * @param {HTMLElement} elm
 * @param {string} cls
 * @returns {boolean}
 */
export function hasClass(ele, cls) {
    return !!ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
}

/**
 * Add class to element
 * @param {HTMLElement} elm
 * @param {string} cls
 */
export function addClass(ele, cls) {
    if (!hasClass(ele, cls)) ele.className += ' ' + cls;
}
// 替换手机字符
export function regMobile(mobile) {
    if (mobile.length > 7) {
        var new_mobile = mobile.substr(0, 3) + '****' + mobile.substr(7);
    }
    return new_mobile;
}
/**
 * Remove class from element
 * @param {HTMLElement} elm
 * @param {string} cls
 */
export function removeClass(ele, cls) {
    if (hasClass(ele, cls)) {
        const reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
        ele.className = ele.className.replace(reg, ' ');
    }
}
/**
 * @param {Array} actual
 * @returns {Array}
 */
export function cleanArray(actual) {
    const newArray = [];
    for (let i = 0; i < actual.length; i++) {
        if (actual[i]) {
            newArray.push(actual[i]);
        }
    }
    return newArray;
}

// <--------------- 物资所用到的方法↓↓ ↓↓ ↓↓ ↓↓ ↓↓ ↓↓ -------------------->
export function deepDeleteAttr(target, attr) {
    target.forEach((item) => {
        if (Array.isArray(item[attr]) && item[attr].length === 0) {
            delete item[attr];
        }
        if (Array.isArray(item[attr]) && item[attr].length > 0) {
            deepDeleteAttr(item[attr], attr);
        }
    });
}

// 将多级展开成一级
export function getListByName(target, attr, list, obj) {
    target.forEach((item) => {
        if (item[attr] && item[attr].length > 0) {
            list.push({ name: item[obj.key], id: item[obj.val], pid: item[obj.pid] });
        }
        if (Array.isArray(item[attr]) && item[attr].length > 0) {
            getListByName(item[attr], attr, list, obj);
        }
    });
    return list;
}

// 递归设置子选项的属性
export function deepSetChild(parents, childs) {
    parents.forEach((parent) => {
        parent.matTypeList = [];
        childs.forEach((child) => {
            if (child.pid === parent.id) {
                parent.matTypeList.push(child);
            } else {
                deepSetChild(parent.matTypeList, childs);
            }
        });
    });
}

// 获取所有的最后一级
export function deepGetAllLastChildren(target, attrs, list) {
    if (!Array.isArray(target)) {
        return list;
    }
    target.forEach((item) => {
        if (
            !item[attrs.children] ||
            (Array.isArray(item[attrs.children]) && item[attrs.children].length === 0)
        ) {
            list.push(item);
        } else {
            deepGetLastChildren(item[attrs.children], attrs, list);
        }
    });
    return list;
}
// 根据id找所属所有下级
export function deepGetChildren(target, id, attrs, list = []) {
    if (!Array.isArray(target)) {
        return list;
    }
    target.forEach((item) => {
        if (item[attrs.id] === id) {
            list = item[attrs.children];
            return list;
        }
        if (
            item[attrs.children] &&
            Array.isArray(item[attrs.children]) &&
            item[attrs.children].length > 0
        ) {
            list = deepGetChildren(item[attrs.children], id, attrs, list);
        }
    });
    return list;
}

// 找所有的最后一级
export function deepGetLastChildren(target, attrs, list = []) {
    if (!Array.isArray(target)) {
        return list;
    }
    target.forEach((item) => {
        if (
            !item[attrs.children] ||
            (Array.isArray(item[attrs.children]) && item[attrs.children].length === 0)
        ) {
            list.push(item);
        } else {
            deepGetLastChildren(item[attrs.children], attrs, list);
        }
    });
    return list;
}
// 获取日期
export function getDate(type) {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
    const day = date.getDate();
    if (!type) {
        return {
            year,
            month,
            day
        };
    }
    if (type === 'year') {
        return {
            year
        };
    }
    if (type === 'month') {
        return {
            month
        };
    }
    if (type === 'day') {
        return {
            day
        };
    }
}

const weatherC = {
    cloudy: ['01'],
    sun: ['00'],
    rain: [
        '03',
        '04',
        '05',
        '07',
        '08',
        '09',
        '10',
        '11',
        '12',
        '19',
        '21',
        '22',
        '23',
        '24',
        '25'
    ],
    snow: ['06', '13', '14', '15', '16', '17', '26', '27', '28'],
    overcast: ['02']
};

export function getWid(wid) {
    return Object.keys(weatherC).find((item) => {
        return weatherC[item].includes(wid);
    });
}
// <--------------- 物资所用到的方法↑↑ ↑↑ ↑↑ ↑↑ ↑↑ -------------------->
