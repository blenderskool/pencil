const gulp = require('gulp');
const sass = require('gulp-sass');
const htmlmin = require('gulp-htmlmin');
const babel = require('gulp-babel');
const bs = require('browser-sync');

/**
 * Parses the SCSS files, and minifies the stylesheets
 */
gulp.task('styles', function() {
  return gulp.src('src/core/templates/scss/**/*.scss')
    .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
    .pipe(gulp.dest('build/core/templates/css'));
});

/**
 * Transpiling using Babel, based on config in .babelrc
 */
gulp.task('scripts', function() {
  return gulp.src('src/**/*.js')
    .pipe(babel())
    .pipe(gulp.dest('build'));
});

/**
 * Minifies the HTML template files
 */
gulp.task('html', function() {
  return gulp.src('src/core/templates/**/*.html')
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
gulp.task('default', gulp.parallel('scripts', 'styles', 'html'));


/**
 * Development task that runs the watcher
 */
gulp.task('dev', gulp.series('default', function server() {

  const { join } = require('path');
  const decache = require('decache');
  const chalk = require('chalk');

  console.log(chalk.blue.bold('Starting development server'));

  const buildOptions = {
    dev: true,
    basePath: join(process.cwd(), 'playground'),
    deployDir: '.dev'
  };

  const build = require('./build').default;

  /**
   * Initial build to start the server
   */
  build(buildOptions)
  .then(() => {

    bs.init({
      server: {
        baseDir: 'playground/.dev'
      },
      snippetOptions: {
        rule: {
          match: /<!-- browsersync -->/i,
          fn: (snippet, match) => snippet + match
        }
      },
      notify: false,
      ui: false
    });

    decache('./build');

  })
  .catch(err => {
    console.log(chalk.red(err));
  });

  /**
   * File watcher
   * Watches for changes in src and playground directories.
   */
  return gulp.watch([
    'src/**/*',
    'playground/**/*',
    '!playground/*/{.dev, .dev/**, dist/, dist/**, node_modules, node_modules/**}'
  ], gulp.series('default', function watcher(done) {
    const build = require('./build').default;
    const time = new Date();

    console.log(chalk.blue.bold('Starting build process'));

    /**
     * Build the playground
     */
    build(buildOptions)
    .then(() => {
      // Successful build

      console.log(chalk.green.bold('Build successfull in '+((new Date()) - time)/1000+'s'));
      // Reload the browser
      bs.reload();

      /**
       * Remove the build module from cache.
       * This would allow it use changes in the build module in next build process
       */
      decache('./build');
    })
    .catch(err => {
      console.log(chalk.red(err));
    });

    done();
  }));
}));