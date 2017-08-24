# 项目说明

脚手架，基于 [FIS3](http://fis.baidu.com) 搭建。  
适用于以页面为中心的开发方式，外部依赖通过 Script 标签或 AMD 模块引入。  

# 目录结构

dist/ 构建文件目录。  
src/ 源文件目录。  
.babelrc Babel 配置文件。  
.eslintrc ESLint 配置文件。  
.gitignore Git 配置文件。  
fis-conf.js Fis 配置文件。  
gulpfile.js Gulp 配置文件。  
package.json 项目配置文件。  

# 常用命令

建议以 package.json 文件的 scripts 节点作为命令行入口。  

npm run check 检查 Git 分支名与 package.json 版本号是否一致。  
npm run lint 使用 ESLint 验证代码规范。  
npm run clean 清理构建目录。  
npm run server 启动本地静态服务器（开发环境）。  
npm run build:dev 构建项目（开发环境）。  
npm run build:test 构建项目（测试环境）。  
npm run build:prod 构建项目（生产环境）。  

# 注意事项

FIS3 的 fis3-hook-node_modules 插件，对 npm 的支持有限，不建议使用 node_modules 中安装的依赖。  
表现为仅查找根路径（此项目配置为 /src 目录）内的 node_modules 目录，而不向上级目录和全局目录中查找依赖。  
虽然可以将 /src 内文件放置于 / 中绕过该限制，但配置文件与业务源码混杂在一起，且实现不够友好，因此不建议使用。  
另外，该插件似乎对 npm3 中使用链接进行扁平化处理依赖的方式，支持不佳。  

对 ES6 和 ES7 的支持，虽然引入了 fis3-hook-commonjs 和 fis-parser-babel-6.x 可编译和模块化源文件。  
但是由于 babel-plugin-transform-runtime 需要在编译过程中插入 require 语句 ，而由于以上原因，造成无法解析该依赖。  
因此可以使用新语法，但请谨慎使用新内置函数、新静态方法、新实例方法和其它新功能。如必须使用，请自行引入 babel-polyfill 垫片。  

