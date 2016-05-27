var gulp = require("gulp")
  , copy = require( 'gulp-copy');

gulp.task('copy-package', ['build'], function(cb) {
  return gulp.src('package.json')
  .pipe(copy('./compile'));
});

gulp.task('dist', ['build', 'copy-package']);
