let util = require('./common/util');
let helper = require('./common/helper');
let config = require('./common/config');

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
