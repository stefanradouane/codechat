import gulp from "gulp";

(function () {
  gulp.src(["./src/assets/**/*.*"]).pipe(gulp.dest("./public/assets"));
})();
