/**
 * 跨域消息传递
 */
window.crossDomainMessage = function () {
  var self = this;

  // 定时器ID
  self._intervalId = 0;

  // 消息接受函数列表
  self._callbackList = [];

  // 分发消息
  self._trigger = function (data) {
    for (var i = 0; i < self._callbackList.length; i++) {
      self._callbackList[i].call(window, data);
    }
  };

  // 事件处理器
  self._eventHandler = function (e) {
    self._trigger(e.data);
  };

  // 发送消息
  self.send = function (target, data) {
    if (window.postMessage) {
      target.postMessage(data, '*');
    } else {
      target.name = data;
    }
  };

  // 注册消息接收函数
  self.on = function (callback) {
    if (typeof (callback) === 'function') {
      self._callbackList.push(callback);
    }
  };

  // 开始监听
  self.start = function () {
    if (window.postMessage) {
      if (window.addEventListener) {
        window.addEventListener('message', self._eventHandler, false);
      } else if (window.attachEvent) {
        window.attachEvent('onmessage', self._eventHandler);
      }
    } else {
      var hash = window.name = '';
      self._intervalId = setInterval(function () {
        if (window.name !== hash) {
          hash = window.name;
          var tmp = hash;
          hash = window.name = '';
          self._trigger(tmp);
        }
      }, 50);
    }
  };

  // 停止监听
  self.stop = function () {
    if (window.postMessage) {
      if (window.removeEventListener) {
        window.removeEventListener('message', self._eventHandler, false);
      } else if (window.detachEvent) {
        window.detachEvent('onmessage', self._eventHandler);
      }
    } else {
      window.name = '';
      clearInterval(self._intervalId);
    }
  };
};