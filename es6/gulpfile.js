'use strict';

const gulp = require("gulp");
const sourcemaps = require("gulp-sourcemaps");
const babel = require("gulp-babel");
const concat = require("gulp-concat");
const sass = require("gulp-sass");
const watch = require('gulp-watch');


gulp.task('sass',function(){
    gulp.src('app/sass/*.scss') //*表示所有的scss文件
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('dist/css'));
});


gulp.task("es6toes5", ['sass'], function () {
  return gulp.src("js/*.js")
    .pipe(sourcemaps.init())
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(concat("all.js"))
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest("dist"));
});


gulp.task('default',['es6toes5'],function(){
    gulp.watch('app/sass/*.scss',['sass']);
});