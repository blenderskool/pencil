const gulp = require('gulp');
const sass = require('gulp-sass');
const htmlmin = require('gulp-htmlmin');
const babel = require('gulp-babel');

/**
 * Parses the SCSS files, and minifies the stylesheets
 */
gulp.task('styles', function() {
  gulp.src('src/core/templates/scss/**/*.scss')
    .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
    .pipe(gulp.dest('build/core/templates/css'));
});

/**
 * Transpiling using Babel, based on config in .babelrc
 */
gulp.task('scripts', function() {
  gulp.src('src/**/*.js')
    .pipe(babel())
    .pipe(gulp.dest('build'));
});

/**
 * Minifies the HTML template files
 */
gulp.task('html', function() {
  gulp.src('src/core/templates/**/*.html')
    .pipe(htmlmin({
      collapseWhitespace: true,
      removeRedundantAttributes: true,
      removeScriptTypeAttributes: true,
      useShortDoctype: true
    }))
    .pipe(gulp.dest('build/core/templates'));
});

/**
 * Default task runs minification for all files
 */
gulp.task('default', ['scripts', 'styles', 'html']);