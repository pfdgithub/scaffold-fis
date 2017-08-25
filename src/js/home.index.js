import util from './common/util';
import helper from './common/helper';
import config from './common/config';
import loginDialog from '../component/loginDialog';

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


loginDialog.init(undefined, {
  destroyCb: () => {
    setTimeout(() => {
      loginDialog.destroy();
    }, 0);
  },
  checkCb: (username, c) => {
    if (!util.isMobile(username)) {
      c('无效手机格式');
      return;
    }

    helper.ajax({
      url: config.uriHub.rpc.checkMobile,
      data: {
        mobile: username
      },
      success: () => {
        c && c();
      },
      failExtension: () => {
        c && c('操作失败，请重试。');
      },
      errorExtension: () => {
        c && c('操作失败，请重试。');
      }
    });
  },
  loginCb: (username, password, c) => {
    if (password.length < 6) {
      c('无效密码格式');
      return;
    }

    helper.ajax({
      url: config.uriHub.rpc.mobileLogin,
      data: {
        mobile: username,
        passwd: password
      },
      success: () => {
        c && c();
      },
      failExtension: () => {
        c && c('操作失败，请重试。');
      },
      errorExtension: () => {
        c && c('操作失败，请重试。');
      }
    });
  }
});