$.ajax({
  type:'GET',
  url : wxconfig.php_url,
  data:{'url': wxconfig.datas_url},
  dataType:'json',
  success: function(data){
    wx.config({
        debug: false,
        appId: data.result.appId,
        timestamp: data.result.timestamp,
        nonceStr: data.result.nonceStr,
        signature: data.result.signature,
        jsApiList: ['onMenuShareTimeline','onMenuShareAppMessage','onMenuShareQQ','onMenuShareWeibo','onMenuShareQZone','chooseImage','uploadImage', 'startRecord','stopRecord','playVoice','pauseVoice','stopVoice','translateVoice','scanQRCode']
    });
  }
});
wx.ready(function () {
  wx.onMenuShareTimeline({
    title: wxconfig.title,
    link: wxconfig.link,
    imgUrl: wxconfig.imgUrl,
    cancel: function () {}
  });
  wx.onMenuShareAppMessage({
    title: wxconfig.title,
    desc: wxconfig.desc,
    link: wxconfig.link,
    imgUrl: wxconfig.imgUrl,
    type: wxconfig.type,
    dataUrl: wxconfig.dataUrl,
    success: function () {},
    cancel: function () {}
  });
  wx.onMenuShareQQ({
    title: wxconfig.title,
    desc: wxconfig.desc,
    link: wxconfig.link,
    imgUrl: wxconfig.imgUrl,
    success: function () {},
    cancel: function () {}
  });
  wx.onMenuShareWeibo({
    title: wxconfig.title,
    desc: wxconfig.desc,
    link: wxconfig.link,
    imgUrl: wxconfig.imgUrl,
    success: function () {},
    cancel: function () {}
  });
  wx.onMenuShareQZone({
    title: wxconfig.title,
    desc: wxconfig.desc,
    link: wxconfig.link,
    imgUrl: wxconfig.imgUrl,
    success: function () {},
    cancel: function () {}
  });
});
