'use strict';

var gulp = require('gulp');
var path = require('path');
var conf = require('../gulpfile.config');

var $ = require('gulp-load-plugins')();

gulp.task('images', function() {
  return gulp.src(path.join(conf.paths.src, 'images/**'))
    .pipe($.cache($.imagemin({
      optimizationLevel: 3,
      progressive: true,
      interlaced: true
    })))
    .pipe(gulp.dest(path.join(conf.paths.dist, 'images')))
    .pipe($.size());
});
