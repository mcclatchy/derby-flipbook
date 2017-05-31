var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var useref = require('gulp-useref');
// minifies js
var uglify = require('gulp-uglify');
// checks if certain file type
var gulpIf = require('gulp-if');
var cssnano = require('gulp-cssnano');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var del = require('del');
var runSequence = require('run-sequence');
var imageResize = require('gulp-image-resize');
var rename = require("gulp-rename");

/*******************************************************************************
DEVELOPMENT TASKS
*******************************************************************************/

// runs all development tasks in order listed with the 'gulp' command (default)
gulp.task('default', function(callback) {
    runSequence(['image-resize', 'sass', 'browserSync', 'watch'],
        callback
    );
});

gulp.task('image-resize', function() {
    return gulp.src('build/static/assets/images/**/*.+(png|jpg|jpeg|gif|svg)')
        .pipe(imageResize({
            width: 600
        }))
        .pipe(rename(function(path) {
            path.basename += "-600";
        }))
        .pipe(gulp.dest('build/static/assets/images/resized'));
});

// reloads browser on file save
gulp.task('browserSync', function() {
    browserSync.init({
        server: {
            baseDir: 'build'
        },
        ghostMode: false,
    });
});

// compiles sass to css
gulp.task('sass', function() {
    // gets all files ending with .scss in static/sass
    return gulp.src('build/static/sass/**/*.scss')
        // .pipe(changed('prod'))
        .pipe(sass())
        .pipe(gulp.dest('build/static/css'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

gulp.task('watch', function() {
    gulp.watch('build/static/sass/**/*.scss', ['sass']);
    gulp.watch('build/*.html', browserSync.reload);
    gulp.watch('build/static/scripts/**/*.js', browserSync.reload);
});

/*******************************************************************************
PRODUCTION TASKS
*******************************************************************************/

// sequences build task to run after production tasks
gulp.task('prod', function(callback) {
    // runs each task in order listed
    runSequence('clean:prod', ['sass', 'useref', 'images', 'fonts'],
        callback
    );
});

// combines simliar file to one file in prod/static folder
gulp.task('useref', function() {
    return gulp.src('build/*.html')
        .pipe(useref())
        // minifies only if it's a JS file
        .pipe(gulpIf('*.js', uglify()))
        // minifies only if it's a CSS file
        .pipe(gulpIf('*.css', cssnano()))
        .pipe(gulp.dest('prod'));
});

// optimiazes images
gulp.task('images', function() {
    return gulp.src('build/static/images/**/*.+(png|jpg|jpeg|gif|svg)')
        // caches images that ran through imagemin
        .pipe(cache(imagemin([
                imagemin.gifsicle({
                    interlaced: true
                }),
                imagemin.jpegtran({
                    progressive: true
                }),
                imagemin.optipng({
                    optimizationLevel: 5
                }),
                imagemin.svgo({
                    plugins: [{
                        removeViewBox: true
                    }]
                }), {
                    verbose: true
                }
            ]))
            .pipe(gulp.dest('prod/static/images')));
});

// copies fonts to prod/static/fonts
gulp.task('fonts', function() {
    return gulp.src('build/static/fonts/**/*')
        .pipe(gulp.dest('prod/static/fonts'));
});

// deletes unused files in prod
gulp.task('clean:prod', function() {
    return del.sync('prod');
});

/*
 * clears cache (usually means images)
 * must be manually run (not set up with build task)
 */
gulp.task('cache:clear', function(callback) {
    return cache.clearAll(callback);
});
