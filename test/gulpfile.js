var gulp = require('gulp')
  , assetus = require('../index')
  , precss = require('precss')
  , postcss = require('gulp-postcss');

gulp.task('css', function () {
  return gulp.src('./assets/css/*.css')
    .pipe(postcss([
      precss(),
      assetus(),
      //autoprefixer()
    ]))
    .pipe(gulp.dest('./public/css'));
});

gulp.task("default", ['css']);

gulp.task("watch", function () {

  gulp.watch([
    './assets/css/*.css'
  ], ['css']);

});