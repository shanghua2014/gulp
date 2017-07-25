/**
 * gulpfile.js运行逻辑
 * app目录为开发目录  user目录为文件生成目录
 * $符号，表示不需要再手动require引入插件，可能通过 gulp-load-plugins 插件直接调用其他插件
 *
 * 模块执行顺序依次为：
 * 1，clean：清空user目录
 * 2，lint：检测js语法
 * 3，js：压缩，合并js，但不会压缩带 min 关键字的文件
 * 4，css：压缩，合并css，给css中引入的文件添加md5版本号，但不会压缩带 min 关键字的文件
 * 5，html：替换html文件中资源路径，并压缩html
 */



'use strict';
var gulp = require('gulp'),
	$ = require("gulp-load-plugins")(),
	cssmin = require('gulp-clean-css'),	//css压缩
	cssver = require('gulp-make-css-url-version'), //css内容中的文件生成版本号,
	ngAnnotate = require('gulp-ng-annotate'),  // angular 压缩防报错插件
	ngmin = require('gulp-ngmin');  // angular 压缩防报错插件

var imagemin = require('gulp-imagemin'),//图片压缩
    pngquant = require('imagemin-pngquant'),//图片深入压缩
    imageminOptipng = require('imagemin-optipng'),
    imageminSvgo = require('imagemin-svgo'),
    imageminGifsicle = require('imagemin-gifsicle'),
    imageminJpegtran = require('imagemin-jpegtran'),
	cache = require('gulp-cache');//图片压缩缓存

// var jshint = require('gulp-jshint');
var packageJSON  = require('./package');	//js检测
var jshintConfig = packageJSON.jshintConfig;
	jshintConfig.lookup = false;

var connect = require('gulp-connect');

var path = {
	app : 'app',
	user : 'dist',
	js : '/js',
	css : '/css',
	img : '/img',
	public : '/**'
}


//|**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//| ✓ css模块
//'~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
gulp.task('css', function () {
    gulp.src([ path.app + path.public + '/*.css','!'+ path.app+ path.public +'/*.*.css' ])
        .pipe(cssmin({
            advanced: false,//类型：Boolean 默认：true [是否开启高级优化（合并选择器等）]
            compatibility: 'ie7',//保留ie7及以下兼容写法 类型：String 默认：''or'*' [启用兼容模式； 'ie7'：IE7兼容模式，'ie8'：IE8兼容模式，'*'：IE9+兼容模式]
            keepBreaks: true,//类型：Boolean 默认：false [是否保留换行]
            keepSpecialComments: '*'
            //保留所有特殊前缀 当你用autoprefixer生成的浏览器前缀，如果不加这个参数，有可能将会删除你的部分前缀
        }))
        .pipe(cssver()) //给css文件里引用文件加版本号（文件MD5）
        .pipe(cssmin())
        .pipe(connect.reload())
        // .pipe($.concat('user')) //内容合并
        // .pipe($.rename("*.min.css")) //重命名
        .pipe(gulp.dest( path.user ))
        //.pipe($.notify({ message: 'OK!' }));
});

//|**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//| ✓ js模块
//'~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
// 检查js
// gulp.task('jslint', function() {
//   return gulp.src([ path.app + path.public + '/*.js', '!'+ path.app+ path.public +'/*.*.js' ])
//     .pipe($.jshint(jshintConfig))
//     .pipe($.jshint.reporter('default'))
// });
gulp.task('js', function() {	// 需求 要 压缩 合并 的JS
	return gulp.src([ path.app + path.public + '/*.js', '!'+ path.app+ path.public +'/*.*.js' ])
		.pipe(ngAnnotate())	//angular 压缩防报错
        .pipe(ngmin({dynamic: false}))	//angular 压缩防报错
		.pipe(connect.reload())
		.pipe($.concat('hx')) //内容合并
		.pipe($.rename("hx.min.js")) //重命名
		.pipe($.uglify({outSourceMap: false})) // 参数：angular 压缩防报错
		.pipe(gulp.dest( path.user + path.js ))
		//.pipe($.notify({ message: 'JS----------------------------ok' }));
});


//|**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//| ✓ html模块
//'~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
gulp.task('html', ['js','css'], function() {
	var htmlConfig = {
		removeComments: true,//清除HTML注释
		collapseWhitespace: true,//压缩HTML
		removeEmptyAttributes: true,//删除所有空格作属性值 <input id="" /> ==> <input />
		removeScriptTypeAttributes: true,//删除<script>的type="text/javascript"
		removeStyleLinkTypeAttributes: true,//删除<style>和<link>的type="text/css"
		minifyJS: true,//压缩页面JS
		minifyCSS: true//压缩页面CSS
	};
	var target = gulp.src('./app/*.html');
	var sources = gulp.src(['./' + path.user + path.js + '/user.min.js', './' + path.user + path.css + '/*.css'], {read: false},{relative:true});
	return target.pipe($.inject(sources))
		.pipe($.htmlmin(htmlConfig))
		// .pipe($.rename("*.html")) //重命名
		.pipe(gulp.dest( path.user ))
});
gulp.task('OtherHtml', function() {
	var target = gulp.src('./app/*.html');
	return target.pipe(gulp.dest( path.user ));
});
gulp.task('htmlReplace', ['html'], function() {
	var htmlConfig = {
		removeComments: true,//清除HTML注释
		collapseWhitespace: true,//压缩HTML
		removeEmptyAttributes: true,//删除所有空格作属性值 <input id="" /> ==> <input />
		removeScriptTypeAttributes: true,//删除<script>的type="text/javascript"
        removeStyleLinkTypeAttributes: true,//删除<style>和<link>的type="text/css"
		minifyJS: true,//压缩页面JS
        minifyCSS: true//压缩页面CSS
	};
	gulp.src([ path.user + '/*.html' ])
		.pipe(connect.reload())
		.pipe($.htmlmin(htmlConfig))
		.pipe($.replace('\/'+ path.user +'\/', ''))
		.pipe(gulp.dest( path.user ))
		//.pipe($.notify({ message: 'HTML----------------------------ok' }));
});

//|**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//| ✓ img模块
//'~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
gulp.task('img', function () {
    gulp.src(path.app + path.img + '/*.{png,jpg,gif,ico}')
        .pipe(cache(imagemin({
            progressive: true, //类型：Boolean 默认：false 无损压缩jpg图片
            svgoPlugins: [{removeViewBox: false}],//不要移除svg的viewbox属性
            use: [pngquant(),imageminJpegtran({progressive: true})
            , imageminGifsicle({interlaced: true}),imageminOptipng({optimizationLevel:3}), imageminSvgo()] //使用pngquant深度压缩png图片的imagemin插件
        })))
        .pipe(gulp.dest(path.user + path.img))
		//.pipe($.notify({ message: 'IMG----------------------------ok' }));
});


//|**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//| ✓ clean模块
//'~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
gulp.task('clean', function() {
	return gulp.src( path.user + '*', { read: false })
		.pipe($.clean());
});

// 开始
gulp.task('default', function() {
	gulp.start('htmlReplace','OtherHtml');
});
