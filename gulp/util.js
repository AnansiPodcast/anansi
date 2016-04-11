var gulp = require("gulp")
  , rimraf = require('rimraf')
  , watch = require('gulp-watch');

gulp.task('clean', function(cb) {
  rimraf('./compile', cb);
});

gulp.task('build', ['clean'], function() {
  ['assets', 'es6'].forEach(function(task) {
    gulp.start(task);
  });
});

gulp.task('watch', ['build'], function() {
  gulp.watch( [ './src/index.html', './src/index.js' ], [ 'index' ] );
  gulp.watch( [ './src/renderer/**/*.js'], [ 'renderer' ] );
  gulp.watch( [ './src/**/*.js'], [ 'es6' ] );
  gulp.watch( [ './src/renderer/**/*.html'], [ 'views' ] );
  gulp.watch( [ './assets/**/*.scss'], [ 'sass' ] );
  // return watch('./src', function() {
  //   gulp.start('build');
  // });
});
