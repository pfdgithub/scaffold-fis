import app from './app';

let Vue = window.Vue;

// 单例
let _app = null;

// 初始化
let init = (selector, props) => { // 初始化
  if (!selector) {
    selector = document.createElement('div');
    document.body.appendChild(selector);
  }

  if (_app === null) {
    let Comp = Vue.extend(app);
    _app = new Comp({
      propsData: props
    }).$mount(selector);
  }
};

// 销毁
let destroy = () => {
  if (_app !== null) {
    _app.$destroy();
    _app.$el.remove();
    _app = null;
  }
};

// 更新数据
let updateData = (data) => {
  if (_app && data) {
    for (let key in data) {
      let val = data[key];
      Vue.set(_app.$data, key, val);
    }
  }
};

// 计时器 ID
let _timeoutId = 0;

// 关闭后回调
let _onClose = null;

// 隐藏
let hide = () => {
  clearTimeout(_timeoutId);
  destroy();
  _onClose && _onClose();
};

// 显示
let show = (type, content, duration, onClose, mask) => {
  if (typeof (duration) === 'undefined') {
    duration = 1.5;
  }
  if (typeof (mask) === 'undefined') {
    mask = true;
  }

  // 销毁上一个未结束的实例
  if (_timeoutId) {
    hide();
  }

  // 创建一个新的实例
  init(undefined, {
    type: type,
    content: content,
    mask: mask
  });
  if (duration > 0) {
    _timeoutId = setTimeout(() => {
      hide();
    }, duration * 1000);
  }
  _onClose = onClose;
};

let info = (content, duration, onClose, mask) => {
  show('', content, duration, onClose, mask);
};

let success = (content, duration, onClose, mask) => {
  show('success', content, duration, onClose, mask);
};

let fail = (content, duration, onClose, mask) => {
  show('fail', content, duration, onClose, mask);
};

let offline = (content, duration, onClose, mask) => {
  show('offline', content, duration, onClose, mask);
};

let loading = (content, duration, onClose, mask) => {
  show('loading', content, duration, onClose, mask);
};

export default {
  init,
  destroy,
  updateData,

  hide,
  show,
  info,
  success,
  fail,
  offline,
  loading
};