var HXCTRL=function(){if(this instanceof HXCTRL){var i=function(){l($("#mobileLook"),$("#mobile_look"))},e=function(i){l($("#collectPop"),$("#collect_pop"),i)},n=function(){l($("#comment"),$("#comment_edit"))},t=function(){l($("#movieInfo"),$("#movie_info"))},o=function(){l($("#sharePop"),$("#share_pop"))},s=function(i){i.siblings().find(".pop").slideUp(),$(".close").click(function(){return $(this).parent().slideUp("fast"),!1})},l=function(i,n,t){return t=!!t&&t,"collect"!=t?("mobile_look"==n.attr("id")&&n.find(".downAPP").click(function(){window.location.href="/app.html"}),void i.click(function(){return"collectPop"==$(this).attr("id")&&(m(),e("collect")),"comment"==$(this).attr("id")&&m(),s(i),n.slideDown(),!1})):void DB.request({datas:{tul:107,mid:DB.config.mid,vtype:1},fn:"playCollect"})},a=function(){var i=DB.config.url+"/newhtml/wap/index.shtml#/"+encodeURI("mid="+$("#SourceID").val());$("#erCode").qrcode({width:160,height:160,text:i})},r=function(){$("#moreComment").click(function(){$("#loading").fadeIn();var i=DB.config.curPage+1;i==DB.config.maxPage&&$(this).remove(),DB.request({datas:{tul:300,mid:DB.config.mid,page:i,size:DB.config.pageSize},fn:"playComment"})})},c=0,u=function(i,e,n,t){var o=0,s=0;o=f(i,e,n,t,s),i.mouseenter(function(){return t&&d(i,e),clearInterval(o.t),clearInterval(o.t),!1}),i.mouseleave(function(){return o=f(i,e,n,t,o.i),!1})},f=function(i,e,n,t,o){var s={i:0,t:0},l=i.find(e),a=l.length,r=$(".item").find("li").length;return 1==r&&$(".item").remove(),d(i,e),s.t=setInterval(function(){t&&(o=c),o++,o>=a-1&&(o=-1),t&&(c=o,$(".item").find("li").eq(o).addClass("on").siblings().removeClass("on")),l.eq(o).fadeIn().siblings(e).fadeOut(),s.i=o},n),s},d=function(i,e){$(".item").find("li").each(function(){$(this).click(function(){c=$(this).index(),$(this).addClass("on").siblings().removeClass("on"),i.find(e).eq(c).fadeIn().siblings(e).fadeOut(),i.find(e).eq(c).fadeIn().siblings(e).fadeOut()})})},m=function(){return!!DB.isLogin()||($.cookie("urlval",window.location.href,{expires:7,secure:!0,path:"/"}),window.location.href=DB.config.url+"/login/login.html",!1)};return{indexJump:function(){var i=window.location.href.split(DB.config.url);return"/"==i[1]&&$.cookie("uid")?window.location.href=DB.config.url+"/player.shtml":$("#logo").click(function(){return!0}),this},userOut:function(){return $("#log_out").click(function(){return DB.request({datas:{tul:101},fn:"userOut"}),!1}),this},userInfo:function(){var i=$.cookie("uid");i?DB.request({datas:{tul:106},fn:"userInfo"}):$("#tabNav").find("li:last-child").remove(),$("#userIconA").find("a").click(function(){if(i)window.location.href="/user/index.shtml";else{var e=new Date;e.setTime(e.getTime()+18e4),$.cookie("urlval",window.location.href,{expires:e,secure:!0,path:"/"}),window.location.href=DB.config.url+"/login/login.html"}return!1});var e=window.location.href;return e.indexOf("player.shtml")>-1?$(".searchTerm").find("li").eq(0).find("a").addClass("active"):e.indexOf("classic")>-1?$(".searchTerm").find("li").eq(1).find("a").addClass("active"):e.indexOf("chat.shtml")>-1&&$(".searchTerm").find("li").eq(2).find("a").addClass("active"),this},mathMember:function(){$("#price").find("li").each(function(){$(this).click(function(){$(this).find("div").removeClass("none"),$(this).siblings().find("div").addClass("none");var i=$(this).index(),e='<img src="'+DB.config.memberRes.res[i].codeurl+'" />';DB.config.memberRes.tradeId=DB.config.memberRes.res[i].codeurl.split("?tradeId=")[1],DB.config.memberRes.index=i,$("#wx_er_img").html(e)})})},openMember:function(){$.cookie("uid")?DB.request({datas:{tul:133,platform:1},fn:"openMember"}):window.location.href=DB.config.url+"/login/login.html"},listPlay:function(){return $(".play_btn_a").each(function(){$(this).click(function(){var i=$(this).attr("data-mid");DB.request({datas:{tul:110,mid:i},fn:"listPlayMovie",element:$(this)})})}),this},comment:function(){return DB.request({datas:{tul:300,mid:DB.config.mid,page:1,size:DB.config.pageSize},fn:"playComment"}),$("#commentPublish").click(function(){var i=$("#pubTArea").val();return console.log(111),""==i?(console.log(222),void FV.popup("请输入评论内容")):i.length>70?void FV.popup("您输入的字数过多!"):FV.JSTextFilter(i)?void FV.popup("内容中包含敏感字符，请重新输入!"):void DB.request({datas:{tul:112,mid:DB.config.mid,content:i,replyid:0},fn:"commentPublish"})}),this},play:function(){return i(),n(),t(),e(!1),o(),a(),$("#playBtn").click(function(){$(this).unbind("click"),DB.config.vtype=1,DB.request({datas:{tul:110,mid:DB.config.mid},fn:"playMovie"})}),DB.request({datas:{tul:134,mid:DB.config.mid},fn:"moveSlice"}),DB.request({datas:{tul:139,mid:DB.config.mid},fn:"playCollect"}),r(),this},winning:function(){var i=$("#awards").html();if(i){var e=i.split("\n"),n="",t=0;for(var o in e)e[o]&&(t++,n+="<dd><p>"+e[o].split("|_|")[0]+'</p><p class="pad_t15">'+e[o].split("|_|")[1]+"</p></dd>");$("#winning").removeClass("none"),t<4&&$("#winningDl").css({width:300*t}),$("#winningDl").html(n)}return this},playerList:function(){var i="",e="",n=$("#playerlistData").val();if(n){for(var t=n.split("==="),o=0;o<t.length;o++)"导演"==t[o].split("|")[1]?(i+='<div class="swiper-slide">',i+='<a  class="block fl"><img src="'+t[o].split("|")[2]+'" width="180" height="208" class="fl"></a>',i+="<p>"+t[o].split("|")[0]+"</p>",i+="<span>"+t[o].split("|")[1]+"</span>",i+="</div>"):(e+='<div class="swiper-slide">',e+='<a  class="block fl"><img src="'+t[o].split("|")[2]+'" width="180" height="208" class="fl"></a>',e+="<p>"+t[o].split("|")[0]+"</p>",e+="<span>"+t[o].split("|")[1]+"</span>",e+="</div>");$("#swiper-wrapper").html(i+e),n.split("===").length>6&&($(".swiper-slide").css({marginLeft:0}),$(".swiper-button-prev").removeClass("none"),$(".swiper-button-next").removeClass("none"),new Swiper(".swiper-container",{pagination:".swiper-pagination",slidesPerView:6,spaceBetween:10,loop:!1,prevButton:".swiper-button-prev",nextButton:".swiper-button-next"}))}return this},moveSlice:function(){return $("#moveSlice").find("a").each(function(i){$(this).click(function(){DB.config.vtype=3;var i=$(this).attr("alt");$("#moveSlicePop").removeClass("none").html("加载中,请稍后..."),$("#moveSliceMask").removeClass("none").html("<script>HX.moveSliceClose()</script>"),$("#moveSlicePopBack").removeClass("none"),DB.request({datas:{tul:110,mid:DB.config.mid,stream_url:i},fn:"playMovie"})})}),this},playCollect:function(){return e(!1),this},playPlayer:function(i,e,n,t){return u(i,e,n,t),this},moveSliceClose:function(){$("#moveSlicePopBack").click(function(){$("#moveSlicePop").addClass("none").html("加载中,请稍后..."),$("#moveSliceMask").addClass("none"),$(this).addClass("none")})},playPraise:function(){$(".zanSpan").each(function(){$(this).click(function(){m();var i=$(this).attr("alt");return DB.request({datas:{tul:302,cid:i},fn:"playPraise",element:$(this)}),!1})})},fontLimite:function(i){var e=$("#pubTArea");return e.keyup(function(){var n=i;e.val().length>n&&e.val(e.val().substring(0,n));var t=n-e.val().length;$("#count").text(t.toString())}),this},secondToHour:function(i,e){return i.each(function(){var i=e?$(this).find(e).find("span"):$(this).find("span"),n=parseInt(i.text()/60);i.text(n),e?$(this).find(e).removeClass("none"):$(this).find("span").removeClass("none")}),this},timeFormat:function(i,e){return i.each(function(){var i=$(this).text();$(this).text(FV.timeFormat(i,e)),$(this).removeClass("none")}),this},feedback:function(){return $("#form").submit(function(){var i=$("#phone").val(),e=$("#idea").val();return i&&e||FV.popup("请填写所有内容！"),FV.JSTextFilter(i)||FV.JSTextFilter(e)?FV.popup("内容中包含敏感字符，请重新输入！"):DB.request({datas:{tul:138,num:i,idea:e},fn:"feedback"}),!1}),this}}}return new HXCTRL},HX=HXCTRL();