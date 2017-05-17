/**
 * gulpfile.js运行逻辑
 * app目录为开发目录  dist目录为文件生成目录
 * $符号，表示不需要再手动require引入插件，可能通过 gulp-load-plugins 插件直接调用其他插件
 * 
 * 模块执行顺序依次为：
 * 1，clean：清空dist目录
 * 2，lint：检测js语法
 * 3，js：压缩，合并js，但不会压缩带 min 关键字的文件
 * 4，css：压缩，合并css，给css中引入的文件添加md5版本号，但不会压缩带 min 关键字的文件
 * 5，html：替换html文件中资源路径，并压缩html
 */


'use strict';
var gulp = require('gulp'),
	$ = require("gulp-load-plugins")(),
	cssmin = require('gulp-clean-css'),	//css压缩
	cssver = require('gulp-make-css-url-version');//css内容中的文件生成版本号

// var jshint = require('gulp-jshint');
var packageJSON  = require('./package');	//js检测
var jshintConfig = packageJSON.jshintConfig;
	jshintConfig.lookup = false;

var connect = require('gulp-connect');

var path = {
	app : 'app',
	dist : 'dist',
	js : '/js',
	css : '/css',
	public : '/**'
}


//|**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//| ✓ css模块
//'~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
gulp.task('css', function () {
    gulp.src([ path.app + path.public + '/*.css', '!'+ path.app+ path.public +'/*.*.css' ])
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
        .pipe($.concat('all')) //内容合并
        .pipe($.rename("all.min.css")) //重命名
        .pipe(gulp.dest( path.dist + path.css ))
        .pipe($.notify({ message: 'CSS----------------------------ok' }));
});

//|**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//| ✓ js模块
//'~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
// 检查js
gulp.task('jslint', function() {
  return gulp.src([ path.app + path.public + '/*.js', '!'+ path.app+ path.public +'/*.*.js' ])
    .pipe($.jshint(jshintConfig))
    .pipe($.jshint.reporter('default'))
});
gulp.task('js', ['jslint'], function() {
	return gulp.src([ path.app + path.public + '/*.js', '!'+ path.app+ path.public +'/*.*.js' ])
		.pipe(connect.reload())
		.pipe($.concat('all')) //内容合并
		.pipe($.rename("all.min.js")) //重命名
		.pipe($.uglify())//压缩
		.pipe(gulp.dest( path.dist + path.js ))
		.pipe($.notify({ message: 'JS----------------------------ok' }));
});

//|**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//| ✓ html模块
//'~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
gulp.task('html', ['js','css'], function() {
	var target = gulp.src('./*.html');
	var sources = gulp.src(['./' + path.dist + path.js + '/*.js', './' + path.dist + path.css + '/*.css'], {read: false},{relative:true});
	return target.pipe($.inject(sources))
	.pipe(gulp.dest( path.dist ))
});
gulp.task('htmlReplace', ['html'], function() {
	var htmlConfig = {
		removeComments: true,//清除HTML注释
		collapseWhitespace: true,//压缩HTML
		removeEmptyAttributes: true,//删除所有空格作属性值 <input id="" /> ==> <input />
	};
	gulp.src([ path.dist + '/*.html' ])
		.pipe(connect.reload())
		.pipe($.htmlmin(htmlConfig))
		.pipe($.replace('\/'+ path.dist +'\/', ''))
		.pipe(gulp.dest( path.dist ))
		.pipe($.notify({ message: 'HTML----------------------------ok' }));
});

//|**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//| ✓ clean模块
//'~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
gulp.task('clean', function() {
	return gulp.src( path.dist + '*', { read: false })
		.pipe($.clean());
});

//|**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//| ✓ WEBServer模块
//'~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

// 开发目录
gulp.task('server', function() {
  connect.server({
    root: './',
    livereload: true
  })
});
gulp.task('watch', function () {
  gulp.watch(['*.html'], ['htmlReplace']);
  gulp.watch([path.app + path.css + '/*.css'], ['css']);
  gulp.watch([path.app + path.js + '/*.js'], ['js']);
});


// 开始
gulp.task('default', ['clean'], function() {
	gulp.start('htmlReplace');
});

gulp.task('serve', ['default','server','watch']);