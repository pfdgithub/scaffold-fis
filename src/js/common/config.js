// 辅助函数
import util from './util';

// 查询参数
let query = util.parseQueryString();

// 环境配置
let envCfg = (function () {
  let config = {
    entryDir: util.guessEntryDir(),
    origin: '//activity.weidai.com.cn/',
    isMock: false,
    isDebug: false
  };

  /* eslint-disable */
  let env = query.env ? query.env : __WD_DEFINE_ENV__;
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
    dynamic: envCfg.origin + 'test/dynamic.json',
    static: envCfg.origin + 'test/static.json',

    getShareCfg: envCfg.origin + "share/getShareCfg.json",
    isLogin: envCfg.origin + 'login/isLogin.json',
    logout: envCfg.origin + 'login/logout.json',
    checkMobile: envCfg.origin + 'login/checkMobile.json',
    mobileLogin: envCfg.origin + 'login/mobileLogin.json'
  },
  link: { //外部链接
  }
};

export default {
  envCfg: envCfg,
  uriHub: uriHub
};
