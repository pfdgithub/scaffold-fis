let util = {};

//解析URL查询参数
util.parseQueryString = function () {
  let query = {};
  let search = window.location.search;

  if (search.indexOf('?') == 0) {
    let parameters = search.slice(1).split('&');
    for (let i = 0; i < parameters.length; i++) {
      let p = parameters[i];
      let kv = p.split('=');
      if (kv.length == 2) {
        let k = kv[0];
        let v = kv[1];
        if (k) {
          query[k] = decodeURIComponent(v);
        }
      }
    }
  }

  return query;
};

//拼接URL查询参数
util.joinQueryString = function (query) {
  let search = '?';

  for (let key in query) {
    let value = query[key];
    if (typeof (value) === 'undefined') {
      value = '';
    }
    value = encodeURIComponent(value);
    search += key + '=' + value + '&';
  }
  if (search[search.length - 1] == '&') {
    search = search.substring(0, search.length - 1);
  }

  return search;
};

//解析hash查询参数
util.parseHashString = function () {
  let query = {};
  let hash = window.location.hash;

  if (hash.indexOf('#') == 0) {
    let parameters = hash.slice(1).split('&');
    for (let i = 0; i < parameters.length; i++) {
      let p = parameters[i];
      let kv = p.split('=');
      if (kv.length == 2) {
        let k = kv[0];
        let v = kv[1];
        if (k) {
          query[k] = decodeURIComponent(v);
        }
      }
    }
  }

  return query;
};

//拼接hash查询参数
util.joinHashString = function (query) {
  let hash = '#';

  for (let key in query) {
    let value = query[key];
    value = encodeURIComponent(value);
    hash += key + '=' + value + '&';
  }
  if (hash[hash.length - 1] == '&') {
    hash = hash.substring(0, hash.length - 1);
  }

  return hash;
};

//解析URL
util.parseUrl = function (url) {
  let a = document.createElement('a');
  a.href = url;
  return {
    hash: a.hash,
    host: a.host,
    hostname: a.hostname,
    href: a.href,
    origin: a.origin,
    pathname: a.pathname,
    port: a.port,
    protocol: a.protocol,
    search: a.search,

    username: a.username,
    password: a.password,

    params: (function () {
      let ret = {},
        seg = a.search.replace(/^\?/, '').split('&'),
        len = seg.length,
        i = 0,
        s;
      for (; i < len; i++) {
        if (!seg[i]) {
          continue;
        }
        s = seg[i].split('=');
        ret[s[0]] = s[1];
      }
      return ret;
    })(),
    file: (a.pathname.match(/\/([^\/?#]+)$/i) || ['', ''])[1],
    path: a.pathname.replace(/^([^\/])/, '/$1'),
    relative: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || ['', ''])[1],
    segments: a.pathname.replace(/^\//, '').split('/')
  };
};

//检查指定URL是否同域
util.isEqOrigin = function (url) {
  let remote = util.parseUrl(url);
  let local = window.location;

  return remote.origin.toLowerCase() == local.origin.toLowerCase();
};

//安全过滤
util.safetyFilter = function (unsafeString) {
  if (unsafeString) {
    let text = document.createTextNode(unsafeString);
    let div = document.createElement('div');
    div.appendChild(text);
    return div.innerHTML;
  }

  return unsafeString;
};

//替换br为CRLF
util.brToCrlf = function (brString) {
  let reg = /<\s*br\s*\/?\s*>/ig;

  if (brString) {
    return brString.replace(reg, '\n');
  }

  return brString;
};

//替换CRLF为br
util.crlfToBr = function (crlfString) {
  let reg = /(\r\n)|(\n)/g;

  if (crlfString) {
    return crlfString.replace(reg, '<br/>');
  }

  return crlfString;
};

//检验身份证号码
util.isIDNo = function (cid) {
  let arrExp = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
  let arrValid = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2];
  if (/^\d{17}\d|x$/i.test(cid)) {
    let sum = 0,
      idx;
    for (let i = 0; i < cid.length - 1; i++) {
      sum += parseInt(cid.substr(i, 1), 10) * arrExp[i];
    }
    idx = sum % 11;
    return (arrValid[idx] == cid.substr(17, 1).toUpperCase());
  } else if (/^\d{15}$/.test(cid)) {
    let year = cid.substring(6, 8);
    let month = cid.substring(8, 10);
    let day = cid.substring(10, 12);
    let temp_date = new Date(year, parseInt(month) - 1, parseInt(day));
    return (temp_date.getFullYear() == (parseInt(year) + 1900) && temp_date.getMonth() == (parseInt(month) - 1) && temp_date.getDate() == parseInt(day));
  } else {
    return false;
  }
};

//检验手机号
util.isMobile = function (mobile) {
  let reg = /^1\d{10}$/;
  return reg.test(mobile);
};

//检验银行卡号
util.isBankCard = function (cardId) {
  let reg = /^\d{16,}$/;
  return reg.test(cardId);
};

// 掩盖手机号码
util.maskMobile = function (mobile) {
  if (mobile && mobile.length == 11) {
    return mobile.slice(0, 3) + '****' + mobile.slice(7);
  }

  return mobile;
};

//字符串格式化
util.stringFormat = function (format, args) {
  let result = format;
  if (arguments.length > 1) {
    if (arguments.length == 2 && typeof (args) == 'object') {
      for (let key in args) {
        if (args[key] != undefined) {
          let reg = new RegExp('({' + key + '})', 'g');
          result = result.replace(reg, args[key]);
        }
      }
    }
    else {
      for (let i = 1; i < arguments.length; i++) {
        if (arguments[i] != undefined) {
          let reg = new RegExp('({)' + (i - 1) + '(})', 'g');
          result = result.replace(reg, arguments[i]);
        }
      }
    }
  }
  return result;
};

//毫秒转换为 yyyy-MM-dd HH:mm:ss
util.msecToString = function (timestamp, format) {
  let ret = '';

  if (timestamp && format) {
    let time = new Date(timestamp);

    let year = time.getFullYear();
    let month = time.getMonth() + 1;
    let date = time.getDate();
    let hour = time.getHours();
    let minutes = time.getMinutes();
    let second = time.getSeconds();
    let millisecond = time.getMilliseconds();

    month = month < 10 ? ('0' + month) : month;
    date = date < 10 ? ('0' + date) : date;
    hour = hour < 10 ? ('0' + hour) : hour;
    minutes = minutes < 10 ? ('0' + minutes) : minutes;
    second = second < 10 ? ('0' + second) : second;
    millisecond = millisecond < 10 ? ('00' + millisecond) : (millisecond < 100 ? ('0' + millisecond) : millisecond);

    ret = format;
    ret = ret.replace(/yyyy/g, year);
    ret = ret.replace(/MM/g, month);
    ret = ret.replace(/dd/g, date);
    ret = ret.replace(/HH/g, hour);
    ret = ret.replace(/mm/g, minutes);
    ret = ret.replace(/ss/g, second);
    ret = ret.replace(/fff/g, millisecond);
  }
  return ret;
};

//yyyy-MM-dd HH:mm:ss 转换为Date
util.stringToDate = function (dateString) {
  let ret = undefined;

  let r = '([0-9]{4})-([0-9]{1,2})-([0-9]{1,2})( ([0-9]{1,2}):([0-9]{1,2})(:([0-9]{1,2}))?)?';
  if (dateString) {
    let d = dateString.match(new RegExp(r));
    if (d) {
      ret = new Date(d[1] - 0, d[2] - 1, d[3] - 0);
      if (d[5]) {
        ret.setHours(d[5] - 0);
      }
      if (d[6]) {
        ret.setMinutes(d[6] - 0);
      }
      if (d[8]) {
        ret.setSeconds(d[8] - 0);
      }
    }
  }

  return ret;
};

//千分位分割数字（保留len位小数）
util.thousandSeparator = function (number, len) {
  let strNum = '';
  let decLen = 0;

  if (typeof (len) === 'number' && len > 0) {
    decLen = len;
  }

  if (typeof (number) === 'number') {
    strNum = number.toFixed(decLen);
  }
  else if (typeof (number) !== 'undefined') {
    strNum = number.toString();
  }

  if (strNum) {
    let match = strNum.match(/^(\-)?(\d+)(\.\d+)?$/);
    if (match) {
      let symbol = match[1] ? match[1] : '';
      let integer = match[2] ? match[2] : '';
      let fraction = match[3] ? match[3] : '';

      if (integer.length > 3) {
        let source = integer.split('');
        let target = [];

        for (let i = 0; i < source.length; i++) {
          let index = (source.length - 1) - i;
          let item = source[index];

          target.push(item);
          if (((i + 1) % 3) == 0 && i != (source.length - 1)) {
            target.push(',');
          }
        }

        integer = target.reverse().join('');
      }

      for (let i = 0; i < decLen; i++) {
        fraction = fraction + '0';
      }
      fraction = fraction.substring(0, (decLen === 0 ? decLen : (decLen + 1)));

      return symbol + integer + fraction;
    }
  }

  return number;
};

//过滤字符串中特殊字符，避免破坏JSON结构。
util.stringJsonFilter = function (source, hideCode) {
  /*
    * 参考资料：
    * http://blog.codemonkey.cn/archives/437
    */
  // let toString = Object.prototype.toString;
  // let isArray = Array.isArray || function (a) {
  //   return toString.call(a) === '[object Array]';
  // };
  let escMap = {
    '"': '\\"',
    '\\': '\\\\',
    '\b': '\\b',
    '\f': '\\f',
    '\n': '\\n',
    '\r': '\\r',
    '\t': '\\t'
  };
  let escFunc = function (m) {
    let value = escMap[m];
    if (value) {
      //后台可正常处理这些字符，故而不再处理。
      //return value;
      return m;
    } else if (hideCode) {
      return ' '; //用空格占位
    } else {
      return '\\u' + (m.charCodeAt(0) + 0x10000).toString(16).substring(1);
    }
  };
  let escRE = /[\\"\u0000-\u001F\u2028\u2029]/g;

  //只处理字符串类型
  if (typeof (source) != 'string') {
    return source;
  } else {
    let target = source.replace(escRE, escFunc);
    return target;
  }
};

//猜测入口页面所在路径
util.guessEntryDir = function () {
  //注意：对此类型url无效。http://example.com/index.html/a/b/c
  let href = window.location.href;
  let dir = href.substring(0, href.lastIndexOf('/') + 1);

  return dir;
};

module.exports = util;