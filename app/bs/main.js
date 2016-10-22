var gulp = require('gulp'),
    watch = require('./watch'),
    tasks = require('./tasks');
    src = require('./src'),
    gutil = require('gulp-util'),
    debug = require('gulp-debug'),
    uglifyjs = require('gulp-uglify'),
    concat = require('gulp-concat'),
    sass = require('gulp-sass'),
    watcher = require('gulp-watch'),
    sourcemaps = require('gulp-sourcemaps'),
    rename = require("gulp-rename");

var minifyCss = require('gulp-cssnano'),
    del = require('del'),
    browserSync = require('browser-sync'),
    nodemon = require('gulp-nodemon'),
    typescript = require('gulp-typescript'),
    config = require('../../config/buildSystem.json'),
    jade = require('gulp-jade'),
    traceur = require('gulp-traceur'),
    io = require('./io'),
    typescriptConfig = typescript.createProject('tsconfig.json'),
    postcss = require('gulp-postcss'),
    autoprefixer = require('autoprefixer'),
    cssnano = require('cssnano');

var task;

for(task in tasks){
    gulp.task(task, tasks[task]);
}

/* Watch these files for changes and run the task on update */
gulp.task('watch-css', ()=> { gulp.watch(watch.files.stylesheets, ['build-css']); });
gulp.task('watch-responsive', ()=> { gulp.watch(watch.files.responsive, ['arch-res-pages']); });
gulp.task('watch-app', ()=> { gulp.watch(watch.files.server, ['build-server']); });
gulp.task('watch-app-dev', ()=> { gulp.watch([...watch.files.server, watch.files.dev], ['build-server']); });
gulp.task('watch-js', ()=> { gulp.watch(watch.files.javascript, ['build-js']); });
gulp.task('watch-ts', ()=> { gulp.watch(watch.files.typescript, ['build-ts']); });
gulp.task('watch-views', ()=> { gulp.watch(watch.files.views, ['build-views']); });
gulp.task('watch-static', ()=> { gulp.watch(watch.files.static, ['build-static']); });

gulp.task('watch-front', ['watch-static', 'watch-views', 'watch-js', 'watch-ts', 'watch-css']);

gulp.task('watch-all', ['watch-front', 'watch-server']);
gulp.task('watch-dev', ['watch-front', 'watch-server', 'watch-server-dev']);


gulp.task('nodemon', ['watch-all'], src.nodemon);
gulp.task('nodemon-dev', ['watch-dev'], src.nodemondev);
gulp.task('serve', ['nodemon'], src.browser_sync);
gulp.task('serve-dev', ['nodemon-dev'], src.browser_sync);

gulp.task('prepare', ['arch-app', 'build-all']);