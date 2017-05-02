import util from './common/util';
import helper from './common/helper';
import config from './common/config';
import test from '../component/test';

let Vue = window.Vue;

setTimeout(function () {
  helper.ajax({
    type: 'POST',
    url: config.uriHub.rpc.dynamic,
    data: {
      clientTime: Date.now()
    },
    success: function (data) {
      console.log(data);
    }
  });
}, 1000);

let app = new (Vue.extend(test))().$mount();
document.getElementById('app').appendChild(app.$el);

setTimeout(() => {
  app.$destroy();
  app.$el.remove();
}, 3000);