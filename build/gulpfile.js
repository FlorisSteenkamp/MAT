'use strict';

var gulp       = require('gulp');
var browserify = require('browserify');
var source     = require('vinyl-source-stream');
var buffer     = require('vinyl-buffer');
var uglify     = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var concat     = require('gulp-concat');
var es2015     = require('babel-preset-es2015');
var rename     = require('gulp-rename');


gulp.task('default',    browserifyTask);
gulp.task('browserify', browserifyTask);


function browserifyTask() {
	
	function showOnError(err) {	if (err) { console.error(err.stack); } } 
	
    return browserify({
    		entries: '../js/mat-lib.js',
    		plugins: ["transform-es2015-arrow-functions"]
    	})
		.transform("babelify", { presets: [es2015] })
    	.bundle(showOnError)
    	.pipe(source('mat-lib.js'))
    	.pipe(gulp.dest('../dist/'))
    	.pipe(rename({ extname: '.min.js' }))
    	.pipe(buffer())
    	.pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('../dist/'));
}


