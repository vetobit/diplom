var gulp = require('gulp'),
	less = require('gulp-less'),
	autoprefixer = require('gulp-autoprefixer'),
	uglify = require('gulp-uglify'),
	jsonminify = require('gulp-jsonminify'),
	htmlmin = require('gulp-htmlmin'),
	clean = require('gulp-clean'),
	browserSync = require('browser-sync').create(),
	path={
		copy_dir:"./nwjs",
		server:"./build",
		server_watch:[
			"./build/**/*",
			"./build/*"
		],
		from:{
			js:"./src/js/*.js",
			less:"./src/less/*.less",
			json:"./src/json/*.json",
			html:"./src/*.html",
		},
		to:{
			js:"./build/js",
			css:"./build/css",
			json:"./build/json",
			html:"./build/"
		}
	};

gulp.task('serve', function() {
    browserSync.init({
        server: path.server
    });
    gulp.watch(path.server_watch[0]).on('change', browserSync.reload);
    gulp.watch(path.server_watch[1]).on('change', browserSync.reload);
});
gulp.task('clean', function () {
	return gulp.src(path.server, {read: false})
		.pipe(clean());
});
gulp.task('copy',function(){
	return gulp.src(path.copy_dir)
		.pipe(gulp.dest(path.server))
});
gulp.task('html', function() {
  return gulp.src(path.from.html)
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest(path.to.html))
});
gulp.task('json', function () {
    return gulp.src([path.from.json])
        .pipe(jsonminify())
        .pipe(gulp.dest(path.to.json));
});
gulp.task('js', function() {
  return gulp.src(path.from.js)
    .pipe(uglify())
    .pipe(gulp.dest(path.to.js));
});
gulp.task('less', function () {
  return gulp.src(path.from.less)
    .pipe(less())
    .pipe(autoprefixer({
		browsers: ['last 2 versions'],
		cascade: false
	}))
    .pipe(gulp.dest(path.to.css));
});
gulp.task('watch', function() {
	gulp.watch(path.from.js, ['js']);
	gulp.watch(path.from.less, ['less']);
	gulp.watch(path.from.json, ['json']);
	gulp.watch(path.from.html, ['html']);
});
gulp.task('default',['clean'],function(){
	gulp.run(['js','less','json','html','copy','serve','watch']);
});