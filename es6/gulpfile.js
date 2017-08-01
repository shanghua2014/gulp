'use strict';
/**
 * 编译ES6
 * 编译TS
 * 
 * sourcemaps：生成map
 * babel：编译ES6
 * concat：文件合并
 * sass：编译SASSS
 * typescript：编译TS
 * nodemon：TS改动重编
 * watch：监听
 */

const gulp = require("gulp");
const sourcemaps = require("gulp-sourcemaps");
const babel = require("gulp-babel");
const concat = require("gulp-concat");
const sass = require("gulp-sass");
const watch = require('gulp-watch');
const ts = require('gulp-typescript');
const nodemon    = require('gulp-nodemon');  

var tsProject = ts.createProject('tsconfig.json');

gulp.task('compile', function () {
    return tsProject.src()

        // 注意顺序
        .pipe(sourcemaps.init())
        .pipe(tsProject())
        .pipe(sourcemaps.write('../mpas'))
        .pipe(gulp.dest('dist/js'));
});

gulp.task('sass',function(){
    // gulp.src('app/sass/*.scss') //*表示所有的scss文件
    //     .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    //     .pipe(sourcemaps.write('../mpas'))
    //     .pipe(gulp.dest('dist/css'));
});


gulp.task("es6toes5", ['sass'], function () {
  return gulp.src("js/*.js")
    .pipe(sourcemaps.init())
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(concat("all.js"))
    .pipe(sourcemaps.write("../mpas"))
    .pipe(gulp.dest("dist/js"));
});


gulp.task('default',['es6toes5'],function(){
    // gulp.watch('app/sass/**/*.scss',['sass']);
    return nodemon({
        script: './server.js',  // 服务的启动文件
        watch: 'ts',    // 源代码目录
        tasks: ['compile'], // 在重启服务前需要执行的任务
        ext: 'ts', // 监听.ts结尾的文件 必须
        // 设置环境
        env: {
            'NODE_ENV': 'development'
        },
        // 必须开启debug模式
        exec: 'node'
    });
});