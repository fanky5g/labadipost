var gulp = require('gulp');
var del = require('del');
var connect = require('gulp-connect');
var webpack = require('gulp-webpack');
var webpackConfig = require('./webpack.config.js');

var port = process.env.PORT || 8080;
var reloadPort = process.env.RELOAD_PORT || 35729;

gulp.task('clean', function () {
  del(['build']);
});

gulp.task('build', function () {
  return gulp.src(webpackConfig.entry.mobile)
    .pipe(webpack(webpackConfig))
    .pipe(gulp.dest('build/'));
});

gulp.task('serve', function () {
  connect.server({
    port: port,
    livereload: {
      port: reloadPort
    }
  });
});

gulp.task('reload-js', function () {
  return gulp.src('./build/*.js')
    .pipe(connect.reload());
});

gulp.task('copy-build', function() {
  return gulp.src(['./build/*', './touch-emulator.js', './lib/svg4Everybody.js', './svg-sprites/*', './icomoon.ttf', './Helvetica-Condensed.otf'])
    .pipe(gulp.dest('../server/data/static/build/mobile'));
});

gulp.task('watch-build', function() {
  gulp.watch(['./build/*.js'], ['copy-build']);
});

gulp.task('mobile', ['build', 'watch-build']);

gulp.task('watch', function () {
  gulp.watch(['./build/*.js'], ['reload-js']);
});

gulp.task('default', ['clean', 'build', 'serve', 'watch']);