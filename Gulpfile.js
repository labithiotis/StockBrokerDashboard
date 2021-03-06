var gulp = require('gulp');
var del = require('del');
var gulpif = require('gulp-if');
var sourcemaps = require('gulp-sourcemaps');
var browserify = require('browserify');
var babelify = require('babelify');
var hbsfy = require('hbsfy');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');
var less = require('gulp-less');
var LessAutoprefixPlugin = require('less-plugin-autoprefix');
var minifyCSS = require('gulp-minify-css');
var rename = require('gulp-rename');
var browserSync = require('browser-sync');

var config = {
	// Production mode is disabled when running default task (dev mode)
	PRODUCTION: true,
	// Development server port
	PORT: 8080,
	// Relative paths to sources and output directories
	SRC_DIR: 'src/',
	BUILD_DIR: 'build/',

	src: function(path) {
		return this.SRC_DIR + path;
	},
	dest: function(path) {
		return this.BUILD_DIR + path;
	}
};

gulp.task('clean', function() {
	del([config.BUILD_DIR]);
});


var lessAutoprefixPlugin = new LessAutoprefixPlugin({browsers: '> 1%'});

gulp.task('scripts', function() {
	var bundler = browserify({
		entries: config.src('app/index.js'),
		debug: true,
		transform: [hbsfy]
	});

	return bundler
		.transform(babelify)
		.bundle()
		.pipe(source('bundle.js'))
		.pipe(buffer())
		.pipe(gulpif(!config.PRODUCTION, sourcemaps.init({loadMaps: true})))
		.pipe(gulpif(config.PRODUCTION, uglify()))
		.pipe(gulpif(!config.PRODUCTION, sourcemaps.write('./')))
		.pipe(gulp.dest(config.dest('js')))
		.pipe(browserSync.reload({stream: true}));
});

gulp.task('styles', function() {
	return gulp.src(config.src('styles/index.less'), {base: '.'})
		.pipe(less({
			plugins: [lessAutoprefixPlugin]
		}))
		.pipe(gulpif(config.PRODUCTION, minifyCSS()))
		.pipe(rename('bundle.css'))
		.pipe(gulp.dest(config.dest('css')))
		.pipe(browserSync.reload({stream: true}));
});

gulp.task('html', function() {
	return gulp.src(config.src('index.html'))
		.pipe(gulp.dest(config.BUILD_DIR))
		.pipe(browserSync.reload({stream: true}));
});

gulp.task('assets', function() {
	return gulp.src(config.src('assets/**/*'))
		.pipe(gulp.dest(config.dest('assets')))
		.pipe(browserSync.reload({stream: true}));
});

/*
 * Helper task to disable production mode before running build task
 */
gulp.task('dev', function() {
	config.PRODUCTION = false;
});

/*
 * Start webserver and activate watchers
 */
gulp.task('server', ['build'], function() {
	browserSync({
		port: config.PORT,
		server: {
			baseDir: config.BUILD_DIR
		}
	});

	gulp.watch([config.src('app/**/*.js'), config.src('app/**/*.hbs')], ['scripts']);
	gulp.watch(config.src('styles/**/*.less'), ['styles']);
	gulp.watch(config.src('assets/**/*.*'), ['assets']);
	gulp.watch(config.src('index.html'), ['html']);

});

/*
 * Build task - production mode
 */
gulp.task('build', ['clean', 'scripts', 'styles', 'html', 'assets']);

/*
 * Default task - development mode
 */
gulp.task('default', ['dev', 'build', 'server']);
