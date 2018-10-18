var gulp = require('gulp')
var uglify = require('gulp-uglify')
var concat = require('gulp-concat')
var rename = require('gulp-rename')

var jsInput = './src/*.js'
var jsOutput = './dist'

/* MAIN GULP TASKS */
gulp.task('default', function() {
    return gulp.src(jsInput)
        .pipe(concat('main.js'))
        .pipe(gulp.dest(jsOutput))
        .pipe(rename('main.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(jsOutput))
});
