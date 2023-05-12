import gulp from "gulp";

(function () {
  gulp.src(["./src/css/**/*.*"]).pipe(gulp.dest("./public"));
})();
