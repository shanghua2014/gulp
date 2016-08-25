'use strict';

var gulp = require('gulp'),
	$ = require("gulp-load-plugins")(),
	cssmin = require('gulp-clean-css'),	//css压缩
	cssver = require('gulp-make-css-url-version');//css内容中的文件生成版本号

//|**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//| ✓ css
//'~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
gulp.task('css', function () {
    gulp.src('app/css/*.css')
        .pipe(cssmin({
            advanced: false,//类型：Boolean 默认：true [是否开启高级优化（合并选择器等）]
            compatibility: 'ie7',//保留ie7及以下兼容写法 类型：String 默认：''or'*' [启用兼容模式； 'ie7'：IE7兼容模式，'ie8'：IE8兼容模式，'*'：IE9+兼容模式]
            keepBreaks: true,//类型：Boolean 默认：false [是否保留换行]
            keepSpecialComments: '*'
            //保留所有特殊前缀 当你用autoprefixer生成的浏览器前缀，如果不加这个参数，有可能将会删除你的部分前缀
        }))
        .pipe(cssver()) //给css文件里引用文件加版本号（文件MD5）
        .pipe(cssmin())
        .pipe(gulp.dest('dist/css'))
        .pipe($.notify({ message: 'CSS----------------------------ok' }));
});

//|**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//| ✓ js
//'~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
gulp.task('js', function() {
	return gulp.src('app/**/*.js')
		.pipe($.concat('all')) //内容替换
		.pipe($.rename("all.min.js")) //重命名
		.pipe($.uglify())//压缩
		.pipe(gulp.dest('dist/js'))
		.pipe($.notify({ message: 'JS----------------------------ok' }));
});

//|**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//| ✓ html
//'~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
gulp.task('html', ['js','css'], function() {
	var target = gulp.src('./index.html');
	var sources = gulp.src(['./dist/js/*.js', './dist/css/*.css'], {read: false},{relative:true});
	return target.pipe($.inject(sources))
	.pipe(gulp.dest('./'))
	.pipe($.notify({ message: 'HTML----------------------------ok' }));
});

//|**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//| ✓ clean
//'~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
gulp.task('clean', function() {
	return gulp.src('dist/*', {
			read: false
		})
		.pipe($.clean());
});

gulp.task('default', ['clean'], function() {
	gulp.start('html');
});