var gulp = require('gulp'),
    watch = require('./watch'),
    tasks = require('./tasks');
    src = require('./src');

var task;

for(task in tasks){
    gulp.task(task, tasks[task]);
}

var allWatchTasks = [];

for(task in watch.logic){
    var taskName = "watch--"+task;
    allWatchTasks.push(taskName);
    gulp.task(taskName, ()=> { gulp.watch(watch[task].files, watch[task].tasks); });
}

gulp.task("watch-all", allWatchTasks);

gulp.task('nodemon', ['watch-all'], src.nodemon);
gulp.task('serve', ['nodemon'], src.browser_sync);

gulp.task('prepare', ['arch-server', 'build-all']);