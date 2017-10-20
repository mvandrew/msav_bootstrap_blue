var gulp                = require("gulp"),
    sass                = require("gulp-sass"),
    cssnano             = require("gulp-cssnano"),
    autoprefixer        = require("gulp-autoprefixer"),
    coffee              = require('gulp-coffee'),
    rename              = require('gulp-rename'),
    plumber             = require('gulp-plumber'),
    uglify              = require('gulp-uglify'),
    concat              = require('gulp-concat'),
    stripComments       = require('gulp-strip-comments'), // Удаление js комментариев
    stripCssComments    = require('gulp-strip-css-comments'),
    browserSync         = require('browser-sync'),
    reload              = browserSync.reload,
    notify              = require('gulp-notify'),
    gutil               = require('gulp-util'),
    remoteSrc           = require('gulp-remote-src'),
    imagemin            = require('gulp-imagemin'),
    imageminPngquant    = require('imagemin-pngquant'),
    cache               = require('gulp-cache'),
    spritesmith         = require('gulp.spritesmith'),
    buffer              = require('vinyl-buffer'),
    merge               = require('merge-stream'),
    imageResize         = require('gulp-image-resize'),
    gcmq                = require('gulp-group-css-media-queries'),
    runSequence         = require('run-sequence');

var workFiles           = [
    './**/*.php',
    './**/*.css',
    './js/**/*.js',

    // Exclude system and core files
    '!./src/**/*',
    '!./node_modules/**/*'
];

gulp.task('browser-sync', function () {
    browserSync.init(workFiles, {
        proxy: {
            target: 'http://santehnika-kupi.ru/'
        },
        injectChanges: true
    });
});


//
// Копирование файлов шрифта Font Awesome
//
gulp.task( 'font-awesome', function () {
    return gulp.src( './src/vendor/font-awesome/fonts/**/*.+(otf|eot|svg|ttf|woff|woff2)' )
        .pipe( plumber({ errorHandler: function(err) {
            notify.onError({
                title: "Gulp error in " + err.plugin,
                message:  err.toString()
            })(err);
        }}) )
        .pipe( gulp.dest('./fonts/font-awesome/') );
});


//
// Копирование файлов шрифта Open Sans
//
gulp.task( 'font-open-sans', function () {
    return gulp.src( './src/vendor/open-sans-fontface/fonts/**/*.+(otf|eot|svg|ttf|woff|woff2)' )
        .pipe( plumber({ errorHandler: function(err) {
            notify.onError({
                title: "Gulp error in " + err.plugin,
                message:  err.toString()
            })(err);
        }}) )
        .pipe( gulp.dest('./fonts/open-sans/') );
});


//
// Копирование шрифтов поставщиков во Front End
//
gulp.task( 'fonts', function () {
   return runSequence('font-awesome', 'font-open-sans');
});


//
// Компиляция SCSS файлов
//
gulp.task('sass', function () {
    return gulp.src( './src/theme/**/*.scss' )
        .pipe( plumber({ errorHandler: function(err) {
            notify.onError({
                title: "Gulp error in " + err.plugin,
                message:  err.toString()
            })(err);
        }}) )
        .pipe( sass() )
        .pipe( autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }) )
        .pipe( gcmq() )
        //.pipe( cssnano() )
        .pipe( gulp.dest('./') )
        .pipe( reload({stream:true}) )
        .pipe( notify({ message: 'Styles task complete', onLast: true }) );
});


//
// Компиляция Coffee Script файлов
//
gulp.task('coffee', function() {
    gulp.src( './src/coffee/**/*.coffee' )
        .pipe( plumber({ errorHandler: function(err) {
            notify.onError({
                title: "Gulp error in " + err.plugin,
                message:  err.toString()
            })(err);
        }}) )
        .pipe( coffee({bare: true}) )
        .pipe( gulp.dest('./js/') )
        .pipe( uglify() )
        .pipe( rename({suffix: '.min'}) )
        .pipe( gulp.dest('./js/') )
        .pipe( reload({stream:true}) )
        .pipe( notify({ message: 'Javascript task complete', onLast: true }) );
});


//
// Оптимизация изображений для Front End
//
gulp.task('img', ['clear'], function() {
    return gulp.src('./src/theme/images/**/*')
        .pipe( plumber({ errorHandler: function(err) {
            notify.onError({
                title: "Gulp error in " + err.plugin,
                message:  err.toString()
            })(err);
        }}) )
        .pipe( imagemin({
                interlaced: true,
                progressive: true,
                optimizationLevel: 5,
                svgoPlugins: [{removeViewBox: false}],
                use: [imageminPngquant()]
            })
        )
        .pipe( gulp.dest('./images/') );
});

gulp.task('clear', function (done) {
    return cache.clearAll(done);
});

gulp.task('watch', [ 'clear', 'fonts', 'img', 'sass', 'coffee', 'browser-sync' ], function () {

    gulp.watch('./src/theme/**/*.scss', ['sass']);
    gulp.watch('./src/coffee/**/*.coffee', ['coffee']);

});

gulp.task("default", ["watch"]);