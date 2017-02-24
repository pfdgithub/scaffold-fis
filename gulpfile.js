let gulp = require('gulp');
let util = require('gulp-util');
let eslint = require('gulp-eslint');
let del = require('del');
let open = require('open');
let path = require('path');
let shell = require('shelljs');
let yargs = require('yargs');
let iconv = require('iconv-lite');

let pkg = require('./package.json');

// 环境枚举
let envEnum = {
  dev: 'dev',
  test: 'test',
  prod: 'prod'
};
let src = 'src'; // 源文件目录
let dist = 'dist'; // 构建文件目录
let fis3Command = path.resolve('./node_modules/.bin/fis3'); // FIS3 命令
let fixMessyCode = false; // 处理乱码（Windows 下 CMD 默认使用 GBK 代码页）
let serverPort = 8000; // 静态服务器端口

// 输出日志
let log = (name, ...message) => {
  util.log(`Log in plugin '${name}'`, '\nMessage:\n    ', ...message);
};

// 获取错误
let getError = (name, message) => {
  return new util.PluginError(`${name}`, message, {
    // showStack: true
  });
};

// 获取 package 中版本号
let getPkgVersion = () => {
  let ver = pkg && pkg.version;

  log('getPkgVersion', ver);

  return ver;
};

// 获取当前分支名
let getGitBranch = () => {
  let branch = '';

  // http://stackoverflow.com/questions/6245570/how-to-get-the-current-branch-name-in-git/12142066
  let shellObj = shell.exec('git symbolic-ref --short HEAD', {
    async: false,
    silent: true
  });

  let code = shellObj.code;
  let stderr = shellObj.stderr;
  let stdout = shellObj.stdout;
  if (code !== 0 && stderr.length > 0) {
    throw getError('getGitBranch', stderr);
  }
  else if (stdout.length > 0) {
    branch = stdout.replace(/\n$/, ''); // 结尾含有\n字符
    log('getGitBranch', stdout);
  }
  else {
    log('getGitBranch', 'No output');
  }

  return branch;
};

// 获取环境参数
let getProcessEnv = () => {
  let env = undefined;
  let argv = yargs.argv;

  if (argv.env && envEnum[argv.env]) {
    env = envEnum[argv.env];
  }

  if (env) {
    log('getProcessEnv', env);
  }
  else {
    throw getError('getProcessEnv', 'Invalid environment type (e.g. --env=prod)');
  }

  return env;
};

// 检查分支名与版本号是否匹配
let checkVersion = (cb) => {
  let pkgVersionStr = getPkgVersion(); // 1.0.0
  let gitBranchStr = getGitBranch(); // dev-v1.0.0
  let pkgVersionArr = pkgVersionStr.match(/^(\d+)\.(\d+)\.(\d+)$/);
  let gitBranchArr = gitBranchStr.match(/^([\w\-]+)-v((\d+)\.(\d+)\.(\d+))$/);

  if (pkgVersionArr && gitBranchArr) {
    let pkgVersion = pkgVersionArr[0]; // 1.0.0
    // let gitBranchEnv = gitBranchArr[1]; // dev
    let gitBranchVer = gitBranchArr[2]; // 1.0.0

    if (pkgVersion === gitBranchVer) {
      log('checkVersion', `packageVersion (${pkgVersion}) branchName (${gitBranchVer})`);
      return cb();
    }
  }

  let gErr = getError('checkVersion', 'Invalid packageVersion (e.g. 1.0.0) or branchName (e.g. dev-v1.0.0)');
  cb(gErr);
};

// 清理构建文件
let cleanBuild = (cb) => {
  del([`${dist}/**`], {
    dryRun: false
  }).then((paths) => {
    log('cleanBuild', paths.length);
    log('cleanBuild', paths.join('\n'));
    cb && cb();
  }).catch((err) => {
    let gErr = getError('cleanBuild', err);
    if (cb) {
      cb(gErr);
    }
    else {
      throw gErr;
    }
  });
};

// 同步执行FIS3
let syncFis3 = (name, command, cb) => {
  let shellObj = shell.exec(command, {
    encoding: fixMessyCode ? 'base64' : 'utf8',
    async: false, // 使用同步模式
    silent: true // 禁止实时输出
  });

  let code = shellObj.code;
  let stderr = shellObj.stderr;
  let stdout = shellObj.stdout;
  if (code !== 0 && stderr.length > 0) {
    stderr = fixMessyCode ? iconv.decode(iconv.encode(stderr, 'base64'), 'GBK') : stderr;
    let gErr = getError(name, stderr);
    if (cb) {
      cb(gErr);
    }
    else {
      throw gErr;
    }
  }
  else if (stdout.length > 0) {
    stdout = fixMessyCode ? iconv.decode(iconv.encode(stdout, 'base64'), 'GBK') : stdout;
    log(name, stdout);
    cb && cb();
  }
};

// 异步执行FIS3
let asyncFis3 = (name, command, cb) => {
  /*let child = */shell.exec(command, {
    encoding: fixMessyCode ? 'base64' : 'utf8',
    async: true, // 使用异步模式
    silent: false // 启用实时输出
  }, (code, stdout, stderr) => {
    if (code !== 0 && stderr.length > 0) {
      stderr = fixMessyCode ? iconv.decode(iconv.encode(stderr, 'base64'), 'GBK') : stderr;
      let gErr = getError(name, stderr);
      if (cb) {
        cb(gErr);
      }
      else {
        throw gErr;
      }
    }
    else if (stdout.length > 0) {
      stdout = fixMessyCode ? iconv.decode(iconv.encode(stdout, 'base64'), 'GBK') : stdout;
      // log(name, stdout);
      cb && cb();
    }
  });
};

// 启动服务器（前台常驻）
let devServer = (cb) => {
  let command = `${fis3Command} server start -p ${serverPort} --root ${dist} --no-browse --no-daemon --qrcode`;

  shell.mkdir('-p', dist); // 创建构建文件目录，避免服务器启动报错
  asyncFis3('devServer', command, cb);
};

// 监听项目（前台常驻）
let watchProject = (cb) => {
  let env = getProcessEnv();
  let command = `${fis3Command} release ${env} -d ${dist} -l -w -L -c -u -r ${src}`;
  asyncFis3('watchProject', command, cb);
};

// 构建项目
let buildProject = (cb) => {
  let env = getProcessEnv();
  let command = `${fis3Command} release ${env} -d ${dist} -l -c -u -r ${src}`; // --verbose
  syncFis3('buildProject', command, cb);
};

// 检查版本号
gulp.task('check', (cb) => {
  checkVersion(cb);
});

// 校验代码
gulp.task('lint', () => {
  return gulp.src([`${src}/js/**/*.js`])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

// 清理目录
gulp.task('clean', (cb) => {
  cleanBuild(cb);
});

// 开发服务器
gulp.task('server', ['clean'], (/*cb*/) => {
  // 监听项目
  watchProject();
  // 启动服务器
  devServer();
  // 延时一段时间再打开浏览器，避免还没完成构建
  setTimeout(() => {
    let uri = `http://127.0.0.1:${serverPort}/html/home.index.html`;
    open(uri);
  }, 0);
});

// 构建项目
gulp.task('build', ['clean'], (cb) => {
  buildProject(cb);
});

// 默认任务
gulp.task('default', () => {
  log('default', 'Please use npm script');
});