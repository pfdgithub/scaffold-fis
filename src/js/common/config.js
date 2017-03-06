// 辅助函数
let util = require('./util');

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
    static: envCfg.origin + 'test/static.json'
  },
  link: { //外部链接
  }
};

module.exports = {
  envCfg: envCfg,
  uriHub: uriHub
};
