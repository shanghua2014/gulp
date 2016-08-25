'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();


// 合并、压缩js文件
gulp.task('js', ['clean'], function() {
	return gulp.src('app/**/*.js')
		.pipe() //内容替换
		.pipe() //重命名
		// .pipe($.uglify())//压缩
		// .pipe(gulp.dest('dist/js'))
		.pipe($.notify({
			message: 'js task ok'
		}));
});
gulp.task('index', ['clean'], function() {
	return gulp.src('index.html')
		.pipe($.usemin({
			js: [
				$.concat('all.js'),
				$.rename({
					suffix: '.min'
				}),
				$.uglify()
			],
			css: [$.minifyCss()]
		}))
		.pipe(gulp.dest('dist/'));
});

gulp.task('clean', function() {
	return gulp.src('dist/*', {
			read: false
		})
		.pipe($.clean());
});

gulp.task('default', ['index']);