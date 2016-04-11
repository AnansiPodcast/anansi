var gulp = require("gulp")
  , babel = require("gulp-babel");

gulp.task('es6', function () {
  return gulp.src('./src/**/*.js')
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(gulp.dest('./compile'));
});
