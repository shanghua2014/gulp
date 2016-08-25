'use strict';

var gulp = require('gulp'),
	$ = require("gulp-load-plugins")();

gulp.task('usemin', function() {
	return gulp.src('demo1/index.html')
		.pipe($.usemin({
			js: [$.uglify()],
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

gulp.task('default', ['clean'], function() {
	gulp.start('usemin');
});