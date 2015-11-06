var gulp = require("gulp");
var babel = require("gulp-babel");
var sass = require('gulp-sass');

gulp.task("browser", function () {
  return gulp.src("browser/**/*.js")
    .pipe(babel())
    .pipe(gulp.dest("dist/browser"));
});

gulp.task("renderer-js", function () {
  return gulp.src("renderer/app/**/*.js")
    .pipe(babel())
    .pipe(gulp.dest("dist/renderer/app"));
});

gulp.task('sass', function () {
  gulp.src('renderer/assets/sass/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./dist/renderer/assets/css'));
});

gulp.task('css', function () {
  gulp.src('renderer/assets/css/**/*.css')
    .pipe(gulp.dest('./dist/renderer/assets/css'));
});

gulp.task('html', function () {
  gulp.src('./renderer/**/*.html')
    .pipe(gulp.dest('./dist/renderer'));
});

gulp.task('main', function () {
  gulp.src('./index.js')
    .pipe(gulp.dest('./dist'));
});

gulp.task('package', function () {
  gulp.src('./package.json')
    .pipe(gulp.dest('./dist'));
});

gulp.task('modules', function () {
  gulp.src('./node_modules')
    .pipe(gulp.dest('./dist'));
});


gulp.task( 'default', [ 'browser', 'renderer-js', 'sass', 'css', 'html', 'main', 'package', 'modules' ] );
