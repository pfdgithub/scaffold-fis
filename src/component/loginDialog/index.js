import dialog from './dialog';

let Vue = window.Vue;
Vue.config.devtools = true;

// 单例
let _app = null;

// 初始化
let init = (props) => { // 初始化
  if (_app === null) {
    let Comp = Vue.extend(dialog);
    _app = new Comp({
      propsData: props
    }).$mount();
    document.body.appendChild(_app.$el);
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

export default {
  init,
  destroy
};