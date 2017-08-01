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

export default {
  init,
  destroy,
  updateData
};