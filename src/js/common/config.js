// 辅助函数
let util = require('./util');

// 环境配置
let envCfg = (function () {
  let query = util.parseQueryString();
  let config = {
    entryDir: util.guessEntryDir(),
    origin: '//activity.weidai.com.cn/',
    isMock: false,
    isDebug: false
  };

  /* eslint-disable */
  let env = query.env ? query.env : __wd_define_env__;
  /* eslint-enable */
  switch (env) {
    case 'dev': {
      config.origin = '/mock/';
      config.isMock = true;
      config.isDebug = true;
    } break;
    case 'test': {
      config.origin = '//activity.wdai.com/';
      config.isDebug = true;
    } break;
    case 'prod': {
      config.origin = '//activity.weidai.com.cn/';
    } break;
  }

  return config;
})();

// 地址集合
let uriHub = {
  rpc: {
    isLogin: envCfg.origin + 'login/isLogin.json',
    logout: envCfg.origin + 'login/logout.json',
    checkMobile: envCfg.origin + 'login/checkMobile.json',
    mobileLogin: envCfg.origin + 'login/mobileLogin.json',

    dynamic: envCfg.origin + 'test/dynamic.json',
    static: envCfg.origin + 'test/static.json'
  },
  link: { //外部链接
  }
};

module.exports = {
  envCfg: envCfg,
  uriHub: uriHub
};
