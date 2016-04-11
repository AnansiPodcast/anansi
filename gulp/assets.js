var gulp = require("gulp")
  , concat = require('gulp-concat')
  , copy = require( 'gulp-copy')
  , sass = require('gulp-sass')
  , babel = require("gulp-babel");

var vendors = [
  'node_modules/angular/angular.js',  
  'node_modules/angular-route/angular-route.js',
  'node_modules/alertify.js/dist/js/ngAlertify.js',
  'src/renderer/lib/player.js',
];

var vendorsCSS = [
  'node_modules/alertify.js/dist/css/alertify.css',
];

gulp.task('sass', function () {
  return gulp.src('./assets/sass/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./compile/assets/css'));
});

gulp.task ('style', function() {
	return gulp.src('./assets/css/**/*.css')
	  .pipe(gulp.dest( './compile/assets/css'))
});

gulp.task ('views', function() {
	return gulp.src('./src/renderer/view/**/*.html')
	  .pipe(gulp.dest( './compile/renderer/view'))
});

gulp.task ('font', function() {
	return gulp.src('./assets/fonts/*')
	  .pipe(gulp.dest('./compile/assets/fonts'))
});

gulp.task ('images', function() {
  return gulp.src('./assets/images/*')
    .pipe(gulp.dest('./compile/assets/images'))
});


gulp.task ('index', function() {
	return gulp.src(['./src/index.html'])
	  .pipe(gulp.dest('./compile'))
});

gulp.task('renderer', function() {
  return gulp.src(['./src/renderer/**/*.js'])
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(concat('renderer.js'))
    .pipe(gulp.dest('./compile'));
});

gulp.task('vendor', function() {
  return gulp.src(vendors)
    .pipe(concat('vendor.js'))
    .pipe(gulp.dest('./compile'));
});

gulp.task('vendor-css', function() {
  return gulp.src(vendorsCSS)
    .pipe(concat('vendor.css'))
    .pipe(gulp.dest('./compile/assets/css'));
});

gulp.task('assets', ['index', 'renderer', 'sass', 'style', 'font', 'images','vendor', 'vendor-css', 'views']);
