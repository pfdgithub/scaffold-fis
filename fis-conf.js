let path = require('path');

// 当前环境类型
let currentEnv = fis.project.currentMedia();

// 资源路径
let assetPath = {
  dev: {
    domain: '',
    url: '$0'
  },
  test: {
    domain: '//static1.wdai.com',
    url: '/static/fed/group/project$0'
  },
  prod: {
    domain: '//static1.weidai.com.cn',
    url: '/static/fed/group/project$0'
  }
};

// 编译参数
let defineParam = {
  '__WD_DEFINE_ENV__': JSON.stringify(currentEnv)
};

// 依赖打包
let depsPack = {
  useTrack: false, // 将合并前的文件路径写入注释中
  useSourceMap: true, // 开启 souremap 功能
  'pkg/common.js': [ // 公共脚本
    '/js/common/**.js',
    '/js/common/**.js:deps'
  ],
  'pkg/common.css': [ // 公共样式
    '/css/common/**.css',
    '/css/common/**.css:deps',
    '/css/common/**.less',
    '/css/common/**.less:deps'
  ]
};

// 增加 vue 文本文件类型
fis.set('project.fileType.text', 'vue');

// 使用 CommonJs 模块化方案，配合 mod.js 加载器。
fis.hook('commonjs', {
  extList: ['.js', '.vue']
});

// 共享环境配置
fis.match('**', {
  query: '', // url 后追加查询字符串
  useHash: true // 使用 MD5 文件名
})
  .match('{/mock/**,/html/part/**}', { // 模拟数据和 html 片段不发布
    release: false
  })
  .match('{/lib/**,/html/**.html}', { // 第三方库和 html 文件不使用 MD5 文件名
    useHash: false
  })
  .match('/component/**.vue', { // 解析 vue 单文件组件——基础
    rExt: '.js',
    isMod: true, // 使用 define 包装为 AMD 模块。
    useSameNameRequire: true, // 同名引用
    parser: fis.plugin('vue-component', { // 解析 vue 单文件组件
      runtimeOnly: true, // template 在构建时转为 render 方法
      extractCSS: false // 内联样式
    })
  })
  .match('{/js/**.js,/component/**.vue:js}', { // 处理脚本文件
    rExt: 'js',
    isMod: true, // 使用 define 包装为 AMD 模块。
    useSameNameRequire: true, // 同名引用
    parser: fis.plugin('babel-6.x', { // 解析 ES 语法
      presets: [], // 禁用插件自带配置
      babelrc: true, // 使用自定义配置
      extends: path.join(__dirname, '.babelrc') // 配置文件路径
    }),
    preprocessor: [
      fis.plugin('js-require-file', { // 解析文件引用
        useEmbedWhenSizeLessThan: 0 // 内联文件尺寸下限
      }),
      fis.plugin('js-require-css', { // 解析文件引用
        mode: 'inline' // 内联 CSS 文件
      })
    ]
  })
  .match('{/css/**.css,/css/**.less,/component/**.vue:less}', { // 处理样式文件
    rExt: '.css',
    parser: fis.plugin('less-2.x'), // 编译 less 文件
    postprocessor: fis.plugin('autoprefixer') // 浏览器兼容处理
  })
  .match('{/js/**.js,/html/**.html}', { // 替换文本文件
    preprocessor: fis.plugin('define', { // 替换字符串定义
      defines: defineParam
    }, 'prepend')
  })
  .match('::package', {
    packager: fis.plugin('deps-pack', depsPack), // 依赖打包
    postpackager: fis.plugin('loader', { // 分析处理页面依赖资源
      obtainScript: false, // 忽略页面中已存在的脚本
      obtainStyle: false, // 忽略页面中已存在的样式
      useInlineMap: true // 在页面中输出 mod.js 异步依赖配置
    })
  });

// 开发环境配置
fis.media('dev')
  .match('**', {
    domain: assetPath.dev.domain,
    url: assetPath.dev.url,
    useHash: false
  })
  .match('/mock/**', { // 发布模拟数据
    release: true
  });

// 测试环境配置 和 生产环境配置
['test', 'prod'].forEach((env) => {
  fis.media(env)
    .match('**', {
      domain: assetPath[env].domain,
      url: assetPath[env].url
    })
    .match('/html/**.html', { // 压缩页面
      optimizer: fis.plugin('htmlmin', {
        ignoreCustomComments: [/^!/, /ignore/, /SCRIPT_PLACEHOLDER/, /STYLE_PLACEHOLDER/
          , /RESOURCEMAP_PLACEHOLDER/, /DEPENDENCIES_INJECT_PLACEHOLDER/], // 忽略 fis3-postpackager-loader 占位符
        removeComments: true,
        collapseWhitespace: false,
        conservativeCollapse: true,
        minifyJS: true,
        minifyCSS: true
      })
    })
    .match('{/js/**.js,/component/**.vue}', { // 压缩脚本
      optimizer: fis.plugin('uglify-js', {
        sourceMap: true
      })
    })
    .match('{/css/**.css,/css/**.less}', { // 压缩样式
      optimizer: fis.plugin('clean-css', {
        keepBreaks: true
      })
    });
});
