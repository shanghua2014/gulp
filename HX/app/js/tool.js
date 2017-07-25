var FV = function () {
    var strategy = {
        notNull : function (value) {    // 空
            return /\s+/.test(value) ? false : true;
        },
        name : function (value) {   // 2-4个中文
            return /^[\u4e00-\u9fa5]{2,4}$/.test(value) ? true : false;
        },
        userName : function (value) {   // 中英文
            return /^[\u4e00-\u9fa5\w]+$/.test(value) ? true : false;
        },
        phone : function (value) {
            return /^(\+86)*0*1[3|4|5|7|8]\d{9}$/.test(value) ? true : false;
        },
        email : function (value) {
            return /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(value) ? true : false;
        },
        number : function (value) {  // 整型
            return /^[0-9]/.test(value) ? true : false;
        },
        float : function (value) {  // 符点型
            return /^[0-9]+(\.[0-9]$)^/.test(value) ? true : false;
        },
    };

    var _JSNameFilter = function (jt$$UTH1) {      var wmuSNwEs2 = ['\u8dea','\u8e72','\u5751','\u903c','\u8d27','\u4f60','\x53\x42','\u50bb','\u7a74','\u9a9a','\u7238','\u7237','\u7239','\u5a18','\u5988','\u59e5','\u59e8','\u53d4','\u4f84','\u5b59','\u5ac2','\u5a76','\u54e5','\u5f1f','\u59b9','\u59d0','\u5144','\u5a03','\u5b69','\u513f','\u599e','\u8840','\u6740','\u836f','\u963f\u6241','\u63a8\u7ffb','\u70ae','\u6ce1','\u5976','\u6002','\u529e','\u6cd5\u8f6e','\u6fc0\u60c5','\u5c04\u7cbe','\u81ea\u6170','\u5f0a','\u732a','\u72d7','\u732b','\u9e21','\u9e2d','\u809b','\u80a0','\u80be','\u8170','\u8131','\u5077','\u76d7','\u7a83','\u8d2a','\u7a0e','\u5171\u4ea7\u515a','\u4e73','\u5e01','\u5047','\u7981','\u5973','\u7537','\u8272','\u6027','\u67aa','\u5ad6','\u5904\u5973','\u88f8','\u85e5','\u8ff7','\u6bd2','\u706b','\u6deb','\u5978','\u90aa\u6076','\u5356','\u4e70','\u5c41','\u5c4e','\u5c3f','\u64e6','\u63d2','\u64cd','\u6345','\u4eba','\u724c','\u9690','\u5145\u6c14','\u50ac\u60c5','\u60e8','\u9762','\u7c89','\u8d4c','\u817f','\u811a','\u80f8','\u8089','\u86cb','\u7b28','\u5b50\u5f39','\u66b4','\u7206','\u5171','\u4ea7','\u515a','\u4e2d\u56fd','\u5395','\u4ea4','\u5511','\u6b7b','\u4ea1','\u7075','\u9b3c','\u7b26','\u9670','\u9053','\u6236','\u6237','\u9b54','\u9634','\u5c38','\u9a37','\u517d','\u5993','\u653f\u6cbb','\u51a4','\u70b8','\u5507','\u9634','\u6bdb','\u9ed1','\u4f53','\u5931','\u8eab','\u6297','\u9189','\u6211','\u4ed6','\u5979','\u54b1','\u53eb','\u5e8a','\u8b66\u5bdf','\u6016','\u5413','\u7f6a','\u6db2','\u7761','\u6655','\u660f','\u7f29','\u6263','\u7262','\u725b','\u5f04','\u6eda','\u853d','\u6025','\u6253','\u67b6','\u64b8','\u516b','\u7f94','\u7f8a','\u63f4','\u780d','\u96de','\u554a','\u5440','\u5462','\u5427','\u5417','\u5475','\u5446','\u7740','\u770b','\u60f3','\u901b','\u79bd','\u914d','\u65b0\u6d6a','\u767e\u5ea6','\u6dd8\u5b9d','\u817e\u8baf','\u6d4b','\u6ce5','\u67d0','\u6bc1','\u7535\u89c6','\u4f20\u5a92','\u5a92\u4f53','\u8111','\x73\x69\x6e\x61','\x62\x61\x69\x64\x75','\x71\x71','\x6d\x61\x69\x6c','\x74\x65\x73\x74','\x61\x64\x6d\x69\x6e','\x72\x6f\x6f\x74','\x75\x6e\x64\x65\x66\x69\x6e\x65\x64','\x6e\x75\x6c\x6c','\u5185\u5b58','\x63\x70\x75'];   for (var waJYWjNj3 in wmuSNwEs2) {if (jt$$UTH1["\x69\x6e\x64\x65\x78\x4f\x66"](wmuSNwEs2[waJYWjNj3])>=0) {return true;}}};
    var _JSTextFilter = function (XTMkEq5) {   var zksgpPVKX6 = ['\u50bb\u903c','\u50bb\u6bd4','\u50bb\u7b14','\u8349\u4f60','\u64cd\u4f60','\x53\x42','\x4a\x42','\u9e21\u5df4','\u9634\u9053','\u9634\u5f84','\u6cd5\u8f6e','\u5c04\u7cbe','\u81ea\u6170','\u809b\u95e8','\u5171\u4ea7\u515a','\u56fd\u6c11\u515a','\u5c41','\u5c4e','\u5c3f','\u5988\u903c','\u5988\x42','\u6211\u64cd','\u6211\u65e5','\u6211\u8349','\u6211\u9760','\u4f60\u5927\u7237','\u4f60\u5988','\x74\x65\x73\x74','\x61\x64\x6d\x69\x6e','\x72\x6f\x6f\x74']; for (var bsCIpukAz7 in zksgpPVKX6) {if (XTMkEq5["\x69\x6e\x64\x65\x78\x4f\x66"](zksgpPVKX6[bsCIpukAz7])>=0) {return true;}}};


    // 调用接口
    return {
        // 判断来源
        versions:function () {
            var u = navigator.userAgent, app = navigator.appVersion;
            return { //移动终端浏览器版本信息
                trident: u.indexOf("Trident") > -1, //IE内核
                presto: u.indexOf("Presto") > -1, //opera内核
                webKit: u.indexOf("AppleWebKit") > -1, //苹果、谷歌内核
                gecko: u.indexOf("Gecko") > -1 && u.indexOf("KHTML") == -1, //火狐内核
                mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
                ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
                android: u.indexOf("Android") > -1 || u.indexOf("Linux") > -1, //android终端或者uc浏览器
                iPhone: u.indexOf("iPhone") > -1 , //是否为iPhone或者QQHD浏览器
                iPad: u.indexOf("iPad") > -1, //是否iPad
                webApp: u.indexOf("Safari") == -1 //是否web应该程序，没有头部与底部
            }
        },
        // 弹层
        popup : function ( str ) {
            var h = '<div id="popup"><div id="mask"></div><div id="maskMessage"><h6 class="wid tac">友情提示</h6><a href="javascript:;" class="messageA block pa" id="messageA"></a><p class="mar tac">'+str+'</p><a href="javascript:;" class="block mar tac" id="messageSub" ng-click="user.confirmClear()" >确  定</a></div></div>';
            $('#footer').after(h);
            $('#mask').css({
                width : $(window).width(),
                height : $(window).height()
            });
            $('#messageA').click(function () {
                $('#popup').remove();
                $(window).off('keyup');
            });
            $('#messageSub').click(function () {
                $('#popup').remove();
                $(window).off('keyup');
                return false;
            });
            $(window).on('keyup', function (event) {
                if(event.which == 27) {
                    $('#messageA').trigger('click');
                }
            });
        },
        // 验证接口
        check : function (type, value) {
            // 去除首尾空白
            value = value.replace(/^\s+|\s+$/g, '');
            return strategy[type] ? strategy[type](value) : '没有该类型的验证!';
        },
        JSNameFilter : function (value) {
            if(_JSfilter(value)) {  return true; }
        },
        JSTextFilter : function (value) {
            if(_JSTextFilter(value)) {  return true; }
        },
        /**
         * 时间格式化, 非时间戳
         * @param tim 数字字符
         */
        timeFormat : function ( tim, type ) {
            type = !type ? 1 : type;
            var tim = tim * 1000;
            var now=new Date(tim);
            var year=now.getFullYear();
            var month=now.getMonth()+1;
            var date=now.getDate();
            var hour=now.getHours();
            var minute=now.getMinutes();
            var second=now.getSeconds();
            if (type == 1) {
                //return year+"-"+month+"-"+date+" "+hour+":"+minute+":"+second;
                return year;
            } else if (type == 2) {
                return year+"-"+month+"-"+date+" "+hour+":"+minute+":"+second;
            }
        },
        /**
         * 时间戳
         * @param arg 对象
         * @returns t 时间格式
         */
        timeFormmat2 : function ( arg ) {
            var t;
            arg.element.each(function () {
                t = new Date(parseInt($(this).text().match(/\d{10}/)[0]*1000)).toISOString().match(/\d{4}-\d{2}-\d{2}/)[0];
            });
            arg.element.text(t);
            return t;
        },
        //添加策略
        addStrategy : function (type, fn) {
            strategy[type] = fn;
        }
    }
}();
