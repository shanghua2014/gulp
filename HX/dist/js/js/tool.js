var FV=function(){var e={notNull:function(e){return!/\s+/.test(e)},name:function(e){return!!/^[\u4e00-\u9fa5]{2,4}$/.test(e)},userName:function(e){return!!/^[\u4e00-\u9fa5\w]+$/.test(e)},phone:function(e){return!!/^(\+86)*0*1[3|4|5|7|8]\d{9}$/.test(e)},email:function(e){return!!/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(e)},number:function(e){return!!/^[0-9]/.test(e)},float:function(e){return!!/^[0-9]+(\.[0-9]$)^/.test(e)}},t=function(e){var t=["傻逼","傻比","傻笔","草你","操你","SB","JB","鸡巴","阴道","阴径","法轮","射精","自慰","肛门","共产党","国民党","屁","屎","尿","妈逼","妈B","我操","我日","我草","我靠","你大爷","你妈","test","admin","root"];for(var n in t)if(e.indexOf(t[n])>=0)return!0};return{versions:function(){var e=navigator.userAgent;navigator.appVersion;return{trident:e.indexOf("Trident")>-1,presto:e.indexOf("Presto")>-1,webKit:e.indexOf("AppleWebKit")>-1,gecko:e.indexOf("Gecko")>-1&&e.indexOf("KHTML")==-1,mobile:!!e.match(/AppleWebKit.*Mobile.*/),ios:!!e.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),android:e.indexOf("Android")>-1||e.indexOf("Linux")>-1,iPhone:e.indexOf("iPhone")>-1,iPad:e.indexOf("iPad")>-1,webApp:e.indexOf("Safari")==-1}},popup:function(e){var t='<div id="popup"><div id="mask"></div><div id="maskMessage"><h6 class="wid tac">友情提示</h6><a href="javascript:;" class="messageA block pa" id="messageA"></a><p class="mar tac">'+e+'</p><a href="javascript:;" class="block mar tac" id="messageSub" ng-click="user.confirmClear()" >确  定</a></div></div>';$("#footer").after(t),$("#mask").css({width:$(window).width(),height:$(window).height()}),$("#messageA").click(function(){$("#popup").remove(),$(window).off("keyup")}),$("#messageSub").click(function(){return $("#popup").remove(),$(window).off("keyup"),!1}),$(window).on("keyup",function(e){27==e.which&&$("#messageA").trigger("click")})},check:function(t,n){return n=n.replace(/^\s+|\s+$/g,""),e[t]?e[t](n):"没有该类型的验证!"},JSNameFilter:function(e){if(_JSfilter(e))return!0},JSTextFilter:function(e){if(t(e))return!0},timeFormat:function(e,t){t=t?t:1;var e=1e3*e,n=new Date(e),i=n.getFullYear(),r=n.getMonth()+1,a=n.getDate(),o=n.getHours(),u=n.getMinutes(),c=n.getSeconds();return 1==t?i:2==t?i+"-"+r+"-"+a+" "+o+":"+u+":"+c:void 0},timeFormmat2:function(e){var t;return e.element.each(function(){t=new Date(parseInt(1e3*$(this).text().match(/\d{10}/)[0])).toISOString().match(/\d{4}-\d{2}-\d{2}/)[0]}),e.element.text(t),t},addStrategy:function(t,n){e[t]=n}}}();