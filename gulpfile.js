var gulp = require('gulp'),
  csso = require('gulp-csso'),
  eslint = require('gulp-eslint'),
  htmllint = require('gulp-htmllint'),
  htmlmin = require('gulp-htmlmin'),
  imagemin = require('gulp-imagemin'),
  notify = require('gulp-notify'),
  plumber = require('gulp-plumber'),
  sass = require('gulp-sass'),
  size = require('gulp-size'),
  stylelint = require('gulp-stylelint'),
  uglify = require('gulp-uglify'),
  gutil = require('gulp-util'),
  sourcemaps = require('gulp-sourcemaps'),
  chalk = require('chalk'),
  gradient = require('gradient-string'),
  rename = require('gulp-rename'),
  ftp = require('vinyl-ftp'),
  browserSync = require('browser-sync').create();
  
const red = "#ff2205";
const blue = "#00ff83";

gulp.task('sass', () => {
  return gulp.src('app/scss/github.scss')
    .pipe(sourcemaps.init())
    .pipe(stylelint())
    .pipe(sass({
      outputStyle: "expanded"
    }))
    .on('error', function (err) {
      const type = err.type || '';
      const message = err.message || '';
      const extract = err.extract || [];
      const line = err.line || '';
      const column = err.column || '';
      gutil.log(chalk.bgHex(red).bold('[SASS COMPILATION ERROR]') + ' ' + chalk.bgHex(red)(type) + ' (' + line + ':' + column + ')');
      gutil.log(chalk.hex(red).bold('message:') + ' ' + chalk.bgHex(red).bold(message));
      this.emit('end');
    })
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('app/css'))
    .pipe(browserSync.stream());
});

gulp.task('minify:css', () => {
  return gulp.src('app/css/*.css')
    .pipe(sourcemaps.init())
    .pipe(csso())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('app/css/min'));
})

gulp.task('watcher', () => {
  browserSync.init({
    server: "./app"
  });
  gulp.watch("app/scss/*", ['sass']);
  gulp.watch("app/pug/*pug", ['views']);
});

// Task to get the size of the app project
gulp.task('size', function () {
  gulp.src('app/**')
    .pipe(size({
      showFiles: true,
    }));
});

gulp.task('build-size', () => {
  const s = size();
  let isSuccess = true;
  return gulp.src('public/*')
    .pipe(s)
    .on('error', function (err) {
      isSuccess = false;
      const type = err.type || '';
      const message = err.message || '';
      const extract = err.extract || [];
      const line = err.line || '';
      const column = err.column || '';
      gutil.log(chalk.bgHex(blue).bold('[PUG COMPILATION ERROR]') + ' ' + chalk.bgHex(blue)(type) + ' (' + line + ':' + column + ')');
      gutil.log(chalk.hex(blue).bold('message:') + ' ' + chalk.bgHex(blue).bold(message));
      this.emit('end')
    })
    .on('end', () => {
      if (isSuccess)
        gutil.log(chalk.bgHex(blue).bold(`Total size ${s.prettySize}`))
    });
});

gulp.task('build', ['sass', 'views'], function () {

  var buildCss = gulp.src('app/css/github.css')
    .pipe(gulp.dest('public/css'))

  var buildAjax = gulp.src('app/ajax/*')
    .pipe(gulp.dest('public/ajax'))

  var buildAjax = gulp.src('app/img/*')
    .pipe(gulp.dest('public/img'))

  var buildFonts = gulp.src('app/fonts/**/*')
    .pipe(gulp.dest('public/fonts'))

  var buildJs = gulp.src('app/js/**/*')
    .pipe(gulp.dest('public/js'))

  var buildHtml = gulp.src('app/*.html')
    .pipe(gulp.dest('public'));
});

function getFtpConnection() {
  return ftp.create({
    host: "files.000webhost.com",
    port: 21,
    user: "marvar",
    password: "MarvarPassword",
    parallel: 5,
    log: gutil.log
  });
}

gulp.task('ftp-deploy', function () {
  var conn = getFtpConnection();
  return gulp.src("app/css/github.css", { base: '.', buffer: false })
    .pipe(conn.newer("public_html"))
    .pipe(conn.dest("public_html"));
});
