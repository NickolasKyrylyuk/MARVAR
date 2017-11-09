var gulp = require('gulp'),
  csso = require('gulp-csso'),
  eslint = require('gulp-eslint'),
  htmllint = require('gulp-htmllint'),
  htmlmin = require('gulp-htmlmin'),
  gulpif = require('gulp-if'),
  imagemin = require('gulp-imagemin'),
  jade = require('gulp-jade'),
  notify = require('gulp-notify'),
  plumber = require('gulp-plumber'),
  pug = require('gulp-pug'),
  sass = require('gulp-sass'),
  size = require('gulp-size'),
  stylelint = require('gulp-stylelint'),
  uglify = require('gulp-uglify'),
  useref = require('gulp-useref'),
  gutil = require('gulp-util'),
  sourcemaps = require('gulp-sourcemaps'),
  chalk = require('chalk'),
  gradient = require('gradient-string'),
  rename = require('gulp-rename')

const red = "#ff2205";
const blue = "#00ff83";

gulp.task('sass', () => {
  return gulp.src('app/scss/github.scss')
    .pipe(sourcemaps.init())
    .pipe(stylelint())
    .pipe(sass())
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
});

gulp.task('minify:css', () => {
  return gulp.src('app/css/*.css')
    .pipe(sourcemaps.init())
    .pipe(csso())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('app/css/min'))
})

gulp.task('views', function buildHTML() {
  return gulp.src('app/pug/*.pug')
    .pipe(pug())
    .on('error', function (err) {
      const type = err.type || '';
      const message = err.message || '';
      const extract = err.extract || [];
      const line = err.line || '';
      const column = err.column || '';
      gutil.log(chalk.bgHex(blue).bold('[PUG COMPILATION ERROR]') + ' ' + chalk.bgHex(blue)(type) + ' (' + line + ':' + column + ')');
      gutil.log(chalk.hex(blue).bold('message:') + ' ' + chalk.bgHex(blue).bold(message));
      this.emit('end');
    })
    .pipe(gulp.dest('app/html'));
});