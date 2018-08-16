var gulp = require('gulp'),
	sass = require('gulp-sass'),
	browserSync = require('browser-sync'),
	autoprefixer = require('gulp-autoprefixer'),
	sourcemaps = require('gulp-sourcemaps'),
	notify = require('gulp-notify'),
	plumber = require('gulp-plumber'),
	del = require('del');

var onError = function(error){
	return error.messageOriginal ?
	"File: " + error.file +
	"\rAt: " + error.line + error.column +
	"r" + error.messageOriginal :
	error;
};

gulp.task('sass', function(){
    return gulp.src('app/scss/*.scss')
	.pipe(sourcemaps.init())
	.pipe(plumber({
		errorHandler: notify.onError({
			title: 'SCSS error',
			message: onError
		})
	}))
    .pipe(sass())
    .pipe(autoprefixer({
		browsers: ['last 2 versions'],
		cascade: false
	}))
	.pipe(sourcemaps.write('.'))
	.pipe(plumber.stop())
    .pipe(gulp.dest('app/css'))
    .pipe(notify('SCSS complete'))
    .pipe(browserSync.reload({stream: true}))
    // .pipe(notify({message: 'SCSS created', onLast: true}))

});

gulp.task('browser-sync', function(){
	 browserSync({
		server: {
			baseDir:'app'
		},
        notify: false
	});
});


gulp.task('watch', ['browser-sync', 'sass'], function(){
	gulp.watch('app/scss/**/*.scss', ['sass']);
	gulp.watch('app/*.html', browserSync.reload);
	gulp.watch('app/js/*.js', browserSync.reload);
});


gulp.task('clean', function() {
    return del.sync('dist');
});


gulp.task('build', ['clean', 'sass'], function() {
	var buildCss = gulp.src([
		'app/css/style.css',
		'app/css/style.css.map'
		])

	.pipe(gulp.dest('dist/css'))

	var buildFonts = gulp.src('app/fonts/**/*')

	.pipe(gulp.dest('dist/fonts'))

	var buildJs = gulp.src('app/js/**/*')

	.pipe(gulp.dest('dist/js'))

	 var buildHtml = gulp.src('app/*.html')

	 .pipe(gulp.dest('dist'));
});

gulp.task('default', ['watch']);