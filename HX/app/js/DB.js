window.DB = {
    config : {
        url:'https://beta.huanxi.com',
        server : 'qa',
        pageSize:4,
        curPage:0,
        maxPage:0,
        vtype:0, // 详情页：片源类型，1:正片，3:片花
        stype:0, // 聊电影：短片类型，1有片 2宣传片
        mid:$('#SourceID').val(),
        flag:1,
        refreshTime:'',
        userinfo : {
            username:'hahaah',
            signature : '', //签名
            vipendtime:'',
            vipstarttime:'',
            pageSize:50
        },
        memberRes : {
            res : '',   // 支付页面返回数据
            index : 0,    // 支付页面，会员套餐的选择下标
            playTime : '', // 支付接口轮循定时器
            tradeId : ''    // 轮播接口参数
        },
        timer : {
            a : 300000,  // 定时刷新支付二维码(300000毫秒, 5分钟)
            b : 2000    // 支付接口轮循用户支付状态(2000毫秒, 2秒)
        },
        getAPI : function ( tul ) {
            var url = '';
            for (var i in window.apis) {
                if (tul == apis[i].code) {
                    url = apis[i].url;
                    return url;
                }
            }
        }
    },
    isLogin : function () {
        if (typeof $.cookie('uid') == 'undefined') {
            return false;
        } else {
            return true;
        }
    },

    /**
     * [ajax异步请求]
     * @param request.url 请求地址
     * @param request.datas 传递参数
     * @param request.fn 处理返回数据的函数
     */
    request : function ( request ) {
        var url = DB.config.getAPI(request.datas.tul);
        $.post(url, request.datas, function ( result ) {
                if (request.datas.stream_url) result.stream_url = request.datas.stream_url;
                if (request.element) result.element = request.element;
                Request.show( result, request.fn );
            }
        );
    }
}


// 状态模式
var Request = function () {
    var html = '';

    /**
     * [返回状态]
     * @type {{state2000: States.state2000}}
     * @param result ajax返回数据
     * @param callBack 回调参数, 根据不同的参数走不同的[回调数据分发]模块
     */
    var States = {
        state2000 : function ( result, fn ) {
            dataHandle[fn] && dataHandle[fn]( result, fn );
        },
        state2001 : function ( result, fn ) {
            dataHandle_2001[fn] && dataHandle_2001[fn]( result, fn );
        },
        state4017 : function ( result, fn ) {
            dataHandle_4017[fn] && dataHandle_2001[fn]( result, fn );
        },
        state4019 : function (result, fn) { // 播放正片,未登录可播放
            dataHandle_4019[fn] && dataHandle_4019[fn]( result, fn );
        }
    }


    /**
     * [回调数据分发]
     *
     * 所有ajax请求的回调都在这里进行操作
     * @param   result ajax返回数据
     *          tul     当前模块id
     * @returns
     */
    var dataHandle = {
        userOut : function (result) {
            $.cookie('urlval',null,{expires: 0,path:'/'});
            $.cookie('username',null,{expires: 0,path:'/'});
            $.cookie('isvip',null,{expires: 0,path:'/'});
            $.cookie('avatar',null,{expires: 0,path:'/'});
            var href = window.location.href;
            if(href.split("play_").length == 2) {
                window.location.reload(true)
            } else if (href.split("/user/").length == 2) {
                window.location.href = "/login/login.html";
            } else {
                $('#userIconA').find('img').remove();
                $('#tabNav').find('li:last').remove();
            }
        },
        userInfo : function ( result ) {
            // 登录后更新头像
            $.cookie('username', result.result.username, { expires: 365, path: '/' });
            $.cookie('isvip', result.result.isvip, { expires: 365, path: '/' });
            $.cookie('avatar',result.result.avatar, { expires: 365, path: '/' });
            var i = '<img src="'+result.result.avatar+'" />';
            $('#userIconA').find('a').html(i);
            DB.config.userinfo.username = result.result.username;
            DB.config.userinfo.vipendtime = result.result.vipendtime;
            DB.config.userinfo.vipstarttime = result.result.vipstarttime;
            // 支付页面更新头像
            if (window.location.href.split('com')[1] == '/site/html/pay.shtml') {
                this.htm = '';
                this.htm += '<div class="img fl"><img src="'+ result.result.avatar +'" width="74" height="76"></div>';
                this.htm += '<div class="info fl">';
                this.htm += '<div class="name fl wid">'+ result.result.username +'</div>';
                if (result.result.isvip == 1) {
                    this.htm += '<div class="vip vip1 fl wid"><span class="block fl"></span>您已开通会员</div>';
                } else {
                    this.htm += '<div class="vip fl wid"><span class="block fl"></span>您还未开通会员</div>';
                }
                this.htm += '</div>';
                $('#face').html(this.htm);
            }
        },
        wxmemberRes : function ( result ) {
            var date = new Date();
            date.setTime(date.getTime()+(180 * 1000)); 
            $.cookie('playTime', 1, {expires:date, path:'/'});
            clearInterval(DB.config.memberRes.playTime);
            window.location.href = DB.config.url + '/user/index.shtml#/index';
        },
        openMember : function (result) {
            this.htm = '';
            for (var i in result.result) {
                var j = parseInt(i) + 1;
                this.htm += '<li class="li'+j+' fl" title="点击选择" alt="'+result.result[i].codeurl+'">';
                if (j==1)  this.htm += '<span class="sp1">推荐</span>';
                this.htm += '<p>'+ result.result[i].price +'元/'+result.result[i].name+'</p>';
                if (DB.config.memberRes.index == i) {
                    this.htm += '<div class="pay_check pa"><img src="../../img/pay_check.png"  /></div>';
                    // 提取 tradeId ，轮询时传参
                    DB.config.memberRes.tradeId = result.result[i].codeurl.split('?tradeId=')[1];
                } else {
                    this.htm += '<div class="pay_check pa none"><img src="../../img/pay_check.png" /></div>';
                }
                this.htm += '</li>';
            }
            this.htm += '<script>HX.mathMember()<\/script>';
            DB.config.memberRes.res = result.result;
            $('#wx_er_img').html('<img src="'+result.result[DB.config.memberRes.index].codeurl+'" />');
            $('#price').html(this.htm);

            setTimeout(function () {
                DB.request({
                    datas:{ tul:133, platform:1 },
                    fn:'openMember'
                });
            }, DB.config.timer.a);

            // 轮询用户支付状态
            DB.config.memberRes.playTime = setInterval(function () {
                if(!$.cookie('payTime')) {
                    DB.request({
                        datas:{tul:137, tradeId:DB.config.memberRes.tradeId},
                        fn:'wxmemberRes',
                    });
                }
            }, DB.config.timer.b);
        },
        playCollect : function ( result ) {
            if (result.result) {
                if (result.result.iscollect) $('#collectPop').find('span').addClass('active');
            } else {
                $('#collectPop').find('span').addClass('active');
            }
        },
        moveSlice : function ( result ) {
            this.html = '';
            var res = result.result;
            for (var i in res) {
                this.html += '<a href="javascript:;" style="z-index:'+(9-parseInt(i))+'" class="block pa" alt="'+ res[i].stream_url +'"><img src="'+ res[i].stills + '"></a>';
            }
            this.html += '<div class="itemList pa">';
            this.html += '<ul class="item mar">';
            for (var i in res) {
                if(i==0)
                    this.html += '<li class="on"></li>';
                else
                    this.html += '<li></li>';
            }
            this.html += '</ul>';
            this.html += '</div>';
            this.html += '<script>HX.playPlayer('+ "$('#moveSlice')" +',"a", 3000, true).moveSlice()</script>';
            $('#moveSlice').html(this.html);
        },
        listPlayMovie : function ( result ) {
            var uid= $.cookie('uid');
            var look_url= result.element.attr('data-lookurl');
            var stream_url= result.element.attr('data-streamurl');
            var mid= result.element.attr('data-mid'); //影片id，，页面上读取
            var parastr = 'userid='+uid+'&mid='+mid+'&look_url='+look_url+'&stream_url='+stream_url+'&ph_url='+stream_url;
            var w , h, s, l, t, flash;
            var win = $(window);
            var winW = win.width();
            var winH = win.height();
            var playBox = $('#playBox');
            var playMask = $('#playMask');

            flash = this._writeflashobject(parastr, true, '100%', '100%');
            playMask.removeClass('none');
            playBox.removeClass('none').append(flash);
            $('body').css({height: 0, overflow : "hidden"});
            s = win.scrollTop();
            l =  winW > 1201 ? (winW - 1200) / 2 : 0;
            t =  winH > 676 ? (winH - 675) / 2 : 0;
            playMask.css({width:winW, height:winH});
            win.resize(function () {
                winW = win.width();
                winH = win.height();
                l = winW > 1201 ? (winW - 1200) / 2 : 0;
                t = winH > 676 ? (winH - 675) / 2 : 0;
                playBox.css({left:l, top:t});
                winW = winW > 1200 ? winW : 1200;
                winH = winH > 675 ? winH : 675;
                playMask.css({width:winW, height:winH});
                if (winW > 1201) $('body').css({overflowX : "auto"});
            });
            playBox.css({left:l, top:t});
            
            $('#playBack').click(function () {
                $('body').css({
                    height: '100%',
                    overflowY : "auto"
                });
                playMask.addClass('none').css({width:0, height:0});
                playBox.addClass('none');
                $(this).next().remove();
                win.scrollTop(s);
            });
        },
        playMovie : function ( result ) {
            var uid= $.cookie('uid');//用户id，页面上读取
            var look_url= $('#look_url').val();//试看资源id，页面上读取
            var stream_url= result.stream_url ? result.stream_url : $('#stream_url').val();//资源id，正片页面上读取,片花是传参过来的
            var ph_url= $('#foreshow_url').val();//影片片花资源id，页面上读取
            var mid= DB.config.mid; //影片id，，页面上读取
            var parastr = 'userid='+uid+'&mid='+mid+'&look_url='+look_url+'&stream_url='+stream_url+'&vtype='+DB.config.vtype+'&ph_url='+stream_url;
            var flash = '';
            if (DB.config.vtype == 1) { // 正片逻辑
                 if ( DB.config.stype == 2 ) { // 聊电影宣传片
                    flash = this._writeflashobject(parastr, true, 914, 494);
                }  else {   // 电影详情页：正片
                    flash = this._writeflashobject(parastr, true);
                }
                $('#flashMovie').html(flash);
            } else {    // 片花逻辑
                if ( DB.config.stype == 1 ) { //聊电影短片
                    flash = this._writeflashobject(parastr, true, 914, 494);
                    $('#moveSlicePop').find('div').html(flash);
                } else {    //详情页片花
                    flash = this._writeflashobject(parastr, true, 800, 600);
                    $('#moveSlicePop').html(flash);
                }
            }
        },
        _writeflashobject : function (parastr, allowFullScreen, w, h) {
            var wid = w ? w : 1200;
            var hei = h ? h : 675;
            this.html = '';
            this.html +='<object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" codebase="http://fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=11,0,0,0" width='+wid+' height='+hei+' id="FlashVars" align="middle"><param name="allowScriptAccess" value="always" /><param name="movie" value="https://player.huanxi.com/main_'+DB.config.server+'.swf?'+Math.random()+'" /><param name="FlashVars" value="'+ parastr +'" /><param name="quality" value="high" /><param name="scale" value="noscale" /><param name="allowFullScreen" value="'+allowFullScreen+'"/><param name="bgcolor" value="#000000" /><embed id="players" src="https://player.huanxi.com/main_'+DB.config.server+'.swf?'+Math.random()+'" allowFullScreen="'+allowFullScreen+'"  scale="noscale" quality="high" bgcolor="#000000" width="'+wid+'" height="'+hei+'" name="FlashVars" align="middle" allowScriptAccess="always" FlashVars="'+ parastr +'" type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer" /></object><script>$("#players").focus()</script>';
            return this.html;
        },
        commentPublish : function ( result ) {
            $('#comment_edit').hide();
            $('#count').text(70);
            FV.popup(result.message);
            // 更新评论
            var tempComment = '';
            var today=new Date();
            var YY = today.getFullYear();
            var MM = today.getMonth()+1;
            var DD = today.getDate();
            var h=today.getHours();
            var m=today.getMinutes();
            var s=today.getSeconds();
            var tim = YY + '-' + MM + '-' + DD + ' ' + h + ':' + m + ':' +s;
            var str = '<div class="comment fl"><div class="title pr"> <div class="img_11 fl"><img src="'+ DB.config.avatar +'" width="40" height="40"></div> <div class="fl username" title="'+ DB.config.username +'">'+ DB.config.username +'</div> <span class="vipIcon vipIcon_1 pa"></span></div> <div class="info wid fl">'+$('#pubTArea').val()+'</div> <div class="tim fl wid"><span class="block fl">'+tim+'</span> <p class="zan fr"><span class="zanSpan block fl" alt="'+ result.result.cid +'"></span><span>0</span></p><input type="hidden" class="uid" value="'+ $.cookie('uid')+'"> </div> </div>';
            var cloneComment = '';
            var countComment = $('#movieComment').find('.comment').length;
            cloneComment = $('#movieComment').find('.comment').clone();
            if (!countComment) $('#movieComment').html(str);
            cloneComment.each(function ( e ) {
                // 判断是否够一行
                if (countComment < DB.config.pageSize) {
                    tempComment += '<div class="comment fl">' + $(this).html() + '</div>';
                } else {
                    if ($(this).hasClass('commentMar'))
                        $(this).removeClass('commentMar');
                    tempComment += '<div class="comment fl">' + $(this).html() + '</div>';         
                }
                $('#movieComment').html(str + tempComment);
                // 重新排版判断是否超出当前行的总个数
                countComment < DB.config.pageSize ? '' : $('.comment:last').remove();
                $('#praise').html(HX.playPraise());
            });
            $('#movieComment').find('.comment').each(function (e) {
                if (e%DB.config.pageSize == 0) $(this).addClass('commentMar');
            });
            $('#moreComment').show();
            $('#pubTArea').val('');
            console.log(111);
            $.removeCookie('isComment');
        },
        playComment : function ( result ) {
            $('#loading').hide();
            if (result.result.total == '0') { $('#movieComment').html( '暂无数据' ); return; }
            if (!DB.config.curPage){
                FV.timeFormmat2({
                    element:$('.showtimes'),
                    loop:false
                });
            }

            this.html = '';
            for (var i in result.result.comments) {
                var c = result.result.comments[i];
                if(i%DB.config.pageSize == 0) {
                    this.html += '<div class="comment commentMar fl">';
                } else {
                    this.html += '<div class="comment fl">';
                }
                this.html += '<div class="title pr">';
                this.html += '<div class="img_11 fl"><img src="'+ c.useinfo.avatar +'" width="40" height="40"/></div>';
                this.html += '<div class="fl username" title="'+ c.useinfo.username +'">'+ c.useinfo.username +'</div>';
                this.html += '<span class="vipIcon vipIcon_1 pa"></span>';
                this.html += '</div>';
                this.html += '<div class="info wid fl">'+ c.content +'</div>';
                this.html += '<div class="tim fl wid">';
                this.html += '<span class="block fl">'+ FV.timeFormat(c.createtime,2) +'</span>';
                if (parseInt(c.voted))
                    this.html += '<p class="zan fr"><span class="zanSpanBind zanSpanA block fl" alt="'+ c.id +'"></span><span>'+ c.up +'</span></p>';
                else
                    this.html += '<p class="zan fr"><span class="zanSpan block fl" alt="'+ c.id +'"></span><span>'+ c.up +'</span></p>';
                this.html += '<input type="hidden" class="uid" value="'+ c.useinfo.id +'"/>';
                this.html += '</div>';
                this.html += '</div>';
            }


            if ( !DB.config.curPage ) { // 第一次加载
                if (result.result.total <= DB.config.pageSize) { $('#moreComment').hide(); }
                $('#movieComment').html( this.html);
                DB.config.maxPage = result.result.maxpage;
            } else {
                $('#movieComment').append( this.html );
            }
            $('#praise').html(HX.playPraise());
            DB.config.curPage = result.result.curpage;

        },
        playPraise : function ( result ) {
            var num = parseInt(result.element.next().text())+1;
            result.element.unbind('click').removeClass('zanSpan').addClass('zanSpanBind zanSpanA');
            result.element.next().text(num);
        },
        feedback : function ( result ) {
            FV.popup(result.message);
        }
    }

    var dataHandle_2001 = {
        playCollect : function ( result ) {
            $('#collectPop').find('span').removeClass('active');
        }
    }

    var dataHandle_4017 = {}

    var dataHandle_4019 = {
        userInfo : function ( result ) {
            $('#log_out').trigger('click');
            window.location.href=DB.config.url + "/login/login.html";
        },
        listPlayMovie : function ( result ) {
            dataHandle.listPlayMovie( result );
        },
        playMovie : function ( result ) {
            dataHandle.playMovie( result );
        }
    }


    //|**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //| ✓ 公共方法
    //'~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var Base = {
        /**
         * 倒计时
         */
        getTime : function (tim) {

            var time =tim
            if (null != time && "" != time) {
                if (time > 60 && time < 60 * 60) {
                    time = parseInt(time / 60.0) + "分钟" + parseInt((parseFloat(time / 60.0) -
                            parseInt(time / 60.0)) * 60) + "秒";
                } else if (time >= 60 * 60 && time < 60 * 60 * 24) {
                    time = parseInt(time / 3600.0) + "小时" + parseInt((parseFloat(time / 3600.0) -
                            parseInt(time / 3600.0)) * 60) + "分钟" ;
                    /*+
                     parseInt((parseFloat((parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60) -
                     parseInt((parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60)) * 60) + "秒";*/
                } else if (time >= 60 * 60 * 24) {
                    time = parseInt(time / 3600.0/24) + "天";
                    /*+parseInt((parseFloat(time / 3600.0/24)-
                     parseInt(time / 3600.0/24))*24) + "小时" + parseInt((parseFloat(time / 3600.0) -
                     parseInt(time / 3600.0)) * 60) + "分钟" +
                     parseInt((parseFloat((parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60) -
                     parseInt((parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60)) * 60) + "秒";*/
                } else {
                    time = parseInt(time) + "秒";
                }
            }
            return time;
        }
    }

    /**
     * [状态分发]
     * @param result 返回数据
     * @param fn 数据处理函数
     */
    function show ( result, fn ) {
        switch( parseInt(result.code) ) {
            case 2000:
                States['state' + result.code] && States['state' + result.code]( result, fn );
                break;
            case 2001:
                States['state' + result.code] && States['state' + result.code]( result, fn );
                break;
            case 4017:
                States['state' + result.code] && States['state' + result.code]( result, fn );
                break;
            case 4019:
                States['state' + result.code] && States['state' + result.code]( result, fn );
                break;
            default:
                FV.popup(result.message);
            break;
        }
    }
    return {
        show : show
    }
    function myBrowser(){
        var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
        var isOpera = userAgent.indexOf("Opera") > -1;
        if (isOpera) {
            return "Opera"
        }; //判断是否Opera浏览器
        if (userAgent.indexOf("Firefox") > -1) {
            return "FF";
        } //判断是否Firefox浏览器
        if (userAgent.indexOf("Chrome") > -1){
        return "Chrome";
        }
        if (userAgent.indexOf("Safari") > -1) {
            return "Safari";
        } //判断是否Safari浏览器
        if (userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera) {
            return "IE";
        }; //判断是否IE浏览器
    }
}();

