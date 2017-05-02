let $ = window.$;
let wx = window.wx;
let helper = {};

// ajax辅助函数
helper.ajax = function (config) {
  let _this = this;

  config = config ? config : {};
  config.data = config.data ? config.data : {};
  let ajaxParam = {
    url: config.url,
    async: typeof (config.async) === 'undefined' ? true : config.async,
    cache: typeof (config.cache) === 'undefined' ? false : config.cache,
    type: config.type || 'GET',
    dataType: config.dataType || 'json',
    xhrFields: {
      withCredentials: true
    },
    data: config.data,
    success: function (data, textStatus, jqXHR) {
      if (data && data.code == 0) {
        if (config.success) { //成功处理
          config.success(data.data);
        }
      }
      else {
        if (config.fail) { //失败处理
          config.fail(data, textStatus, jqXHR);
        }
        else {
          let message = '操作失败，请重试。';
          if (data && data.message) {
            message = data.message;
          }
          _this.showNotice(message);

          if (config.failExtension) { //失败处理扩展
            config.failExtension(data, textStatus, jqXHR);
          }
        }
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      if (config.error) { //错误处理
        config.error(jqXHR, textStatus, errorThrown);
      } else {
        let message = '网络异常 ' + (textStatus ? (textStatus + ' ') : '')
          //+ (errorThrown ? (errorThrown.toString() + ' ') : '')
          + (jqXHR.status ? (jqXHR.status + ' ') : '')
          //+ (jqXHR.statusText ? (jqXHR.statusText + ' ') : '')
          //+ (jqXHR.responseURL ? (jqXHR.responseURL + ' ') : '')
          ;
        if (!message) {
          message = '操作失败，请重试。';
        }
        _this.showNotice(message);

        if (config.errorExtension) { //错误处理扩展
          config.errorExtension(jqXHR, textStatus, errorThrown);
        }
        else {
          /* eslint-disable */
          console.error(jqXHR, textStatus, errorThrown);
          /* eslint-enable */
        }
      }
    }
  };

  return $.ajax(ajaxParam);
};

// 显示通知
helper._noticeTimeoutId = 0;
helper.showNotice = function (msg) {
  let _this = this;

  let notice = $('.j-common-notice');
  notice.text(msg);
  notice.removeClass('hide');

  //最后一次调用三秒后清理
  clearTimeout(_this._noticeTimeoutId);
  _this._noticeTimeoutId = setTimeout(function () {
    notice.text('');
    notice.addClass('hide');
  }, 3000);
};

// 显示加载中
helper.showLoading = function (show) {
  let loading = $('.j-common-loading');
  if (show) {
    loading.removeClass('hide');
  }
  else {
    loading.addClass('hide');
  }
};

//微信配置
helper.wxConfig = function (share, cb) {
  let _this = this;

  if (share) {
    $.ajax({
      async: true,
      cache: false,
      type: 'GET',
      dataType: 'json',
      url: share.url,
      data: {
        currentUrl: location.href
      },
      success: function (data/*, textStatus, jqXHR*/) {
        if (data && data.flag) {
          //配置微信
          wx.config({
            debug: share.debug,
            appId: data.data.appid,
            timestamp: data.data.timestamp,
            nonceStr: data.data.nonce,
            signature: data.data.signature,
            jsApiList: [
              'onMenuShareTimeline',
              'onMenuShareAppMessage',
              'onMenuShareQQ',
              'onMenuShareWeibo',
              'onMenuShareQZone'
            ]
          });
          //验证结束
          wx.ready(function () {
            cb && cb();
          });
        }
        else {
          let message = '操作失败，请重试。';
          if (data && data.message) {
            message = data.message;
          }
          _this.showNotice(message);
        }
      },
      error: function (jqXHR, textStatus/*, errorThrown*/) {
        let message = '网络异常 ' + (textStatus ? (textStatus + ' ') : '')
          //+ (errorThrown ? (errorThrown.toString() + ' ') : '')
          + (jqXHR.status ? (jqXHR.status + ' ') : '')
          //+ (jqXHR.statusText ? (jqXHR.statusText + ' ') : '')
          //+ (jqXHR.responseURL ? (jqXHR.responseURL + ' ') : '')
          ;
        if (!message) {
          message = '操作失败，请重试。';
        }
        _this.showNotice(message);
      }
    });
  }
};

//微信分享配置  
helper.wxShareConfig = function (share) {
  this.wxConfig(share, function () {
    //分享文案
    let shareData = {
      link: share.link,
      imgUrl: share.imgUrl,
      title: share.title,
      desc: share.desc,
      success: function (/*res*/) {
      },
      cancel: function (/*res*/) {
      },
      fail: function (res) {
        /* eslint-disable */
        console.log(res);
        /* eslint-enable */
      }
    };

    //调用API
    wx.onMenuShareTimeline(shareData); //分享到朋友圈
    wx.onMenuShareAppMessage(shareData); //分享给朋友
    wx.onMenuShareQQ(shareData); //分享到QQ
    wx.onMenuShareWeibo(shareData); //分享到微博
    wx.onMenuShareQZone(shareData); //分享到QZonex
  });
};

export default helper;