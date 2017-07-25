var HXCTRL = function () {
    if (this instanceof HXCTRL) {
        var _navEffect = function () {
            _menusPublic($('#mobileLook'), $('#mobile_look'));
        }
        var _navCollect = function ( req ) {
            _menusPublic($('#collectPop'), $('#collect_pop'), req);
        }
        var _navComment = function () {
            _menusPublic($('#comment'), $('#comment_edit'));
        }
        var _navMovieInfo = function () {
            _menusPublic($('#movieInfo'), $('#movie_info'));
        }
        var _navSharePop = function () {
            _menusPublic($('#sharePop'), $('#share_pop'));
        }
        var _navClose = function ( eventElement ) {
            eventElement.siblings().find('.pop').slideUp();
            $('.close').click(function () {
                $(this).parent().slideUp('fast');
                return false;
            });
        }
        var _menusPublic = function ( eventElement, hideElement, req ) {
            req = !req ? false : req;
            if (req=='collect') {
                DB.request({
                    datas : { tul:107, mid:DB.config.mid, vtype:1 },
                    fn : 'playCollect'
                });
            } else {
                if(hideElement.attr('id') == 'mobile_look') {
                    hideElement.find('.downAPP').click(function () { window.location.href='/app.html' })
                }
                eventElement.click(function () {
                    if ($(this).attr('id') == 'collectPop') {
                        _isLogin();
                        _navCollect( 'collect' );
                    }
                    if ($(this).attr('id') == 'comment') {
                        _isLogin();
                    }
                    _navClose( eventElement );
                    hideElement.slideDown();
                    return false;
                });
                return;
            }
        }
        var _erCreate = function () {
            var str = DB.config.url+'/newhtml/wap/index.shtml#/'+encodeURI('mid='+$('#SourceID').val());
            $("#erCode").qrcode({
                width: 160, //宽度
                height:160, //高度
                text: str //任意内容
            });
        }
        var _moreComment = function () {
            $('#moreComment').click(function () {
                $('#loading').fadeIn();
                var start = DB.config.curPage + 1;
                if (start == DB.config.maxPage) { $(this).remove(); }
                DB.request({
                    datas:{ tul:300, mid:DB.config.mid, page:start, size:DB.config.pageSize },
                    fn : 'playComment'
                });
            });
        }
        var itemIndex = 0;
        var _player = function ( obj, childObj, tim, isItem ) {
            var tt = 0;
            var ii = 0;
            tt = _playerTimer( obj, childObj, tim, isItem, ii );
            obj.mouseenter(function () {
                if (isItem) _itemPlay(obj, childObj);
                clearInterval(tt.t);
                clearInterval(tt.t);
                return false;
            });
            obj.mouseleave(function () {
                tt = _playerTimer( obj, childObj, tim, isItem, tt.i );
                return false;
            });
        }
        var _playerTimer = function ( obj, childObj, tim, isItem,  ii) {
            var t = {i:0, t:0};
            var eleme = obj.find( childObj );
            var len = eleme.length;
            var liCount = $('.item').find('li').length;
            if (liCount==1) $('.item').remove();
            _itemPlay( obj, childObj );
            t.t = setInterval(function () {
                if (isItem) ii = itemIndex;
                ii++;
                if (ii >= len-1) ii=-1;
                if (isItem) {
                    itemIndex = ii;
                    $('.item').find('li').eq(ii).addClass('on').siblings().removeClass('on');
                }
                eleme.eq(ii).fadeIn().siblings(childObj).fadeOut();
                t.i = ii;
            }, tim);
            return t;
        }
        var _itemPlay = function ( obj, childObj ) {
            $('.item').find('li').each(function () {
                $(this).click(function () {
                    itemIndex = $(this).index();
                    $(this).addClass('on').siblings().removeClass('on');
                    obj.find(childObj).eq(itemIndex).fadeIn().siblings(childObj).fadeOut();
                    obj.find(childObj).eq(itemIndex).fadeIn().siblings(childObj).fadeOut();
                });
            });
        }
        var _isLogin = function () {
            if(!DB.isLogin()) {
                $.cookie('urlval', window.location.href,{ expires: 7,secure: true,path: '/' });
                window.location.href = DB.config.url+'/login/login.html';
                return false;
            } else {
                return true;
            }
        }
        var _getQueryString = function (name) {
             var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
             var r = window.location.search.substr(1).match(reg);
             if(r!=null)return  unescape(r[2]); return null;
        }
// 判断来源
        var _browserRedirect = function () {
            var sUserAgent = navigator.userAgent.toLowerCase();
            var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
            var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
            var bIsMidp = sUserAgent.match(/midp/i) == "midp";
            var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
            var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
            var bIsAndroid = sUserAgent.match(/android/i) == "android";
            var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
            var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
            if (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM){
                return true;
            } else {
                return false;
            }
        }


        //|**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        //| ✓ 开放接口
        //'~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
        return {
            indexJump : function () {
                var url = window.location.href.split(DB.config.url);
                if (url[1] == '/' && $.cookie('uid'))
                    window.location.href = DB.config.url + '/player.shtml';
                else
                    $('#logo').click(function () { return true; });
                
                return this;
            },
            userOut : function () {
                $('#log_out').click(function () {
                    DB.request({
                        datas:{ tul:101 },
                        fn : 'userOut'
                    });
                    // if ( DB.request ) { // 这里走index下的DB.config
                        
                    // } else {    //这里走user下的DB
                    //     $.post(DB.getAPI(101),'', function (result) {
                    //         $.cookie('urlval',null,{expires: 0,path:'/'});
                    //         $.cookie('vipendtime',null,{expires: 0,path:'/'});
                    //         window.location.href=DB.url+"/login/login.html";
                    //     });
                    // }
                    return false;
                });
                return this;
            },
            userInfo : function () {
                // 用户登录的情况下获取用户信息
                var hasUid = $.cookie('uid');
                if ( hasUid ) 
                    DB.request({
                        datas:{ tul:106 },
                        fn : 'userInfo'
                    });
                else
                    $('#tabNav').find('li:last-child').remove()

                $('#userIconA').find('a').click(function () {
                    if ( hasUid ) {
                        window.location.href="/user/index.shtml";
                    } else {
                        var date = new Date();
                        date.setTime(date.getTime() + (180*1000));
                        $.cookie('urlval', window.location.href,{ expires: date,secure: true,path: '/' });
                        window.location.href=DB.config.url+"/login/login.html";
                    }
                    return false;
                });
                var localHref = window.location.href;
                if (localHref.indexOf('player.shtml') > -1) {
                    $('.searchTerm').find('li').eq(0).find('a').addClass('active');
                } else if (localHref.indexOf('classic') > -1) {
                    $('.searchTerm').find('li').eq(1).find('a').addClass('active');
                } else if (localHref.indexOf('chat.shtml') > -1) {
                    $('.searchTerm').find('li').eq(2).find('a').addClass('active');
                }
                return this;
            },
            // 选择包月
            mathMember : function () {
                $('#price').find('li').each(function () {
                    $(this).click(function() {
                        $(this).find('div').removeClass('none');
                        $(this).siblings().find('div').addClass('none');
                        // var chooseid = $(this).find('.pay_check').find('img').attr('alt');
                        // $('#monthly').val(chooseid);
                        var index = $(this).index();
                        var imgStr = '<img src="' + DB.config.memberRes.res[index].codeurl + '" />';
                        // 提取 tradeId ，轮询时传参
                        DB.config.memberRes.tradeId = DB.config.memberRes.res[index].codeurl.split('?tradeId=')[1];
                        // 记录用户的选择状态，定时刷新二维码时调用此状态
                        DB.config.memberRes.index = index;
                        $('#wx_er_img').html(imgStr);
                    });
                });
            },
            // 会员开通
            openMember : function () {
                if ($.cookie('uid')) {
                    DB.request({
                        datas:{ tul:133,platform:1 },
                        fn:'openMember'
                    });
                } else {
                    window.location.href=DB.config.url+"/login/login.html";
                }
            },
            /*scoreColor:function () {
                $('.score').each(function () {
                    var num = parseInt($(this).text());
                    var color = '';
                    if (num >= 8) {
                        color = '#333';
                    } else if (num>=6 && num <8) {
                        color = '#666';
                    } else {
                        color = '#999';
                    }
                    $(this).css({background:color});
                });
                return this;
            },*/
            // 列表页播放正片与试看
            listPlay : function () {
                    $('.play_btn_a').each(function () {
                        $(this).click(function () {
                            var mid = $(this).attr('data-mid');
                            DB.request({
                                datas:{ tul:110, mid:mid},
                                fn : 'listPlayMovie',
                                element : $(this)
                            });
                        });
                    });
                    
                return this;
            },
            // 评论
            comment : function () {
                //影片评论
                DB.request({
                    datas:{ tul:300, mid:DB.config.mid, page:1, size:DB.config.pageSize },
                    fn : 'playComment'
                });
                //发表评论
                $('#commentPublish').click(function () {
                    var cont = $('#pubTArea').val();
                    console.log(111)
                    if (cont == '') { console.log(222); FV.popup('请输入评论内容'); return; }
                    if (cont.length > 70) { FV.popup('您输入的字数过多!'); return; }
                    if (FV.JSTextFilter(cont)) { FV.popup('内容中包含敏感字符，请重新输入!'); return; }
                    DB.request({
                        datas:{ tul:112, mid:DB.config.mid, content:cont, replyid:0},
                        fn : 'commentPublish'
                    });
                });
                return this;
            },
            // 播放正片与试看
            play : function () {
                //菜单效果
                _navEffect();
                _navComment();
                _navMovieInfo();
                _navCollect(false);  // true:是否发送请求
                _navSharePop();

                //生成手机二维码
                _erCreate();

                //播放影片
                $('#playBtn').click(function () {
                    $(this).unbind('click');
                    DB.config.vtype = 1;
                    DB.request({
                        datas:{ tul:110, mid:DB.config.mid },
                        fn : 'playMovie'
                    });
                });

                //获取片花图片
                DB.request({
                    datas:{ tul:134, mid:DB.config.mid },
                    fn : 'moveSlice'
                });

                //是否收藏
                DB.request({
                    datas:{ tul:139, mid:DB.config.mid },
                    fn : 'playCollect'
                });

                //加载更多影片评论
                _moreComment();

                return this;
            },
            // 获奖信息相关
            winning : function () {
                var awards = $('#awards').html();
                if ( awards ) {
                    var str = awards.split('\n');
                    var html = '';
                    var j = 0;

                    for (var i in str) {
                        if (str[i]) {
                            j++;               
                            html += '<dd><p>'+str[i].split('|_|')[0]+'</p><p class="pad_t15">'+str[i].split('|_|')[1]+'</p></dd>';
                        }
                    }
                    $('#winning').removeClass('none');

                    //计算获奖信息位置
                    if (j < 4) {
                        $('#winningDl').css({width: 300*j});
                    }
                    $('#winningDl').html(html);
                }
                return this;
            },
            //演职人员列表相关
            playerList : function () {
                var htm = '', htm2 = '';
                var str = $('#playerlistData').val();
                if (str) {
                    //演职人员列表
                    var str1 = str.split('===');
                    for (var i=0;i<str1.length;i++) {
                        if (str1[i].split('|')[1] == '导演') {
                            htm += '<div class="swiper-slide">';
                            htm += '<a  class="block fl"><img src="'+ str1[i].split('|')[2] +'" width="180" height="208" class="fl"></a>';
//htm += '<a href="'+ str1[i].split('|')[3] +'" target="_blank" class="block fl"><img src="'+ str1[i].split('|')[2] +'" width="180" height="208" class="fl"></a>';
                            htm += '<p>'+ str1[i].split('|')[0]  +'</p>';
                            htm += '<span>'+str1[i].split('|')[1] +'</span>';
                            htm += '</div>';
                        } else {
                            htm2 += '<div class="swiper-slide">';
                            htm2 += '<a  class="block fl"><img src="'+ str1[i].split('|')[2] +'" width="180" height="208" class="fl"></a>';
//htm2 += '<a href="'+ str1[i].split('|')[3] +'" target="_blank" class="block fl"><img src="'+ str1[i].split('|')[2] +'" width="180" height="208" class="fl"></a>';
                            htm2 += '<p>'+ str1[i].split('|')[0]  +'</p>';
                            htm2 += '<span>'+str1[i].split('|')[1] +'</span>';
                            htm2 += '</div>';
                        }
                    }
                    $('#swiper-wrapper').html(htm+htm2);

                    //演职人员轮播
                    if(str.split('===').length>6) {
                        $('.swiper-slide').css({marginLeft:0})
                        $('.swiper-button-prev').removeClass('none');
                        $('.swiper-button-next').removeClass('none');
                        new Swiper('.swiper-container', {
                            pagination: '.swiper-pagination',
                            slidesPerView: 6,
                            spaceBetween: 10,
                            loop: false,
                            prevButton:'.swiper-button-prev',
                            nextButton:'.swiper-button-next',
                        });
                    }
                }
                
                return this;
            },
            // 播放片花
            moveSlice : function () {
                $('#moveSlice').find('a').each(function (e) {
                    $(this).click(function () {
                        DB.config.vtype = 3;
                        var stream_url = $(this).attr('alt');
                        $('#moveSlicePop').removeClass('none').html('加载中,请稍后...');
                        $('#moveSliceMask').removeClass('none').html('<script>HX.moveSliceClose()<\/script>');
                        $('#moveSlicePopBack').removeClass('none');
                        DB.request({
                            datas:{ tul:110, mid:DB.config.mid, stream_url:stream_url},
                            fn : 'playMovie'
                        });
                    });
                });
                return this;
            },
            // 影片收藏
            playCollect : function () {
                _navCollect( false );
                return this;
            },
            // 轮播
            playPlayer : function ( obj, childObj, tim, isItem ) {
                _player( obj, childObj, tim, isItem );
                return this;
            },
            
            // 关闭片花
            moveSliceClose : function () {
                $('#moveSlicePopBack').click(function () {
                    $('#moveSlicePop').addClass('none').html('加载中,请稍后...');
                    $('#moveSliceMask').addClass('none');
                    $(this).addClass('none');
                });
            },
            //点赞
            playPraise : function () {
                $('.zanSpan').each(function () {
                    $(this).click(function () {
                        _isLogin();
                        var cid = $(this).attr('alt');
                        DB.request({
                            datas:{ tul:302, cid:cid },
                            fn : 'playPraise',
                            element : $(this)
                        });
                        return false;
                    });
                });
            },
            // 字数限制
            fontLimite : function ( count ) {
                var obj = $('#pubTArea');
                obj.keyup(function () {
                    var maxChars = count;   //最多字符数
                    if (obj.val().length > maxChars)
                        obj.val(obj.val().substring(0,maxChars));
                    var curr = maxChars - obj.val().length;
                    $('#count').text(curr.toString());
                });
                return this;
            },
            //秒转小时
            secondToHour : function (element, childElement) {
                element.each(function () {
                    var span = childElement ? $(this).find(childElement).find('span') : $(this).find('span');
                    var t = parseInt(span.text() / 60);
                    span.text(t);
                    childElement ? $(this).find(childElement).removeClass('none') : $(this).find('span').removeClass('none');
                });
                return this;
            },
            timeFormat : function ( element,type ) {
                element.each(function () {
                    var value = $(this).text();
                    $(this).text(FV.timeFormat( value,type ));
                    $(this).removeClass('none');
                });
                return this;
            },
            // 建议反馈
            feedback : function () {
                $('#form').submit(function () {
                    var phone = $('#phone').val();
                    var idea = $('#idea').val();
                    if (!phone || !idea) FV.popup('请填写所有内容！')
                    // DB.request({
                    //         datas:{ tul:138, num:phone, idea:idea },
                    //         fn : 'feedback'
                    //     });
                    if (FV.JSTextFilter(phone) || FV.JSTextFilter(idea)) {
                        FV.popup('内容中包含敏感字符，请重新输入！')
                    } else {
                        DB.request({
                            datas:{ tul:138, num:phone, idea:idea },
                            fn : 'feedback'
                        });
                    }
                    return false;
                });
                return this;
            }
        }
    } else {
        return new HXCTRL();
    }
};

var HX = HXCTRL();
