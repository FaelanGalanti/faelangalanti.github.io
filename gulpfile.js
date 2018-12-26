/**
 * Gulp configuration file.
 *
 * @module gulpfile
 */


// NPM Modules
const cleanCSS = require('gulp-clean-css');
const gulp     = require('gulp');
const header   = require('gulp-header');
const merge    = require('merge-stream');
const pug      = require('gulp-pug');
const rename   = require('gulp-rename');
const sass     = require('gulp-sass');


// Local Modules
const pkg    = require('./package.json');


// Constants
const BANNER_TEXT = [
    `<%= pkg.title %> v<%= pkg.version %> (<%= pkg.homepage %>)`,
    `Copyright ${(new Date()).getFullYear()} <%= pkg.author %>`
];
const BANNER_HTML = `<!--\n    ${BANNER_TEXT.join('\n    ')}\n-->\n`;
const BANNER_CSS = `/*\n * ${BANNER_TEXT.join('\n * ')}\n */`;


// Pug compile to html
gulp.task('pug', gulp.series(() => {

    return gulp.src([
            '**/*.pug',
            '!node_modules/**/*.pug'
        ])
        .pipe(pug())
        .pipe(header(BANNER_HTML, { pkg }))
        .pipe(gulp.dest('./'));

}));


// Compile SCSS
gulp.task('css', function() {

    return gulp.src('./src/css/*.scss')
        .pipe(sass.sync({
            outputStyle: 'expanded'
        })
        .on('error', sass.logError))
        .pipe(cleanCSS())
        .pipe(header(BANNER_CSS, {
            pkg: pkg
        }))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('./src/css/'));

});


// Copy third party libraries from /node_modules into /vendor
gulp.task('vendor', function() {

    return merge(

        // Bootstrap
        gulp.src([
            './node_modules/bootstrap/dist/**/*',
            '!./node_modules/bootstrap/dist/css/bootstrap-grid*',
            '!./node_modules/bootstrap/dist/css/bootstrap-reboot*'
        ]).pipe(gulp.dest('./vendor/bootstrap')),

        // Font Awesome 5
        gulp.src([
            './node_modules/@fortawesome/**/*'
        ]).pipe(gulp.dest('./vendor')),

        // jQuery
        gulp.src([
            './node_modules/jquery/dist/*',
            '!./node_modules/jquery/dist/core.js'
        ]).pipe(gulp.dest('./vendor/jquery')),

        // jQuery Easing
        gulp.src([
            './node_modules/jquery.easing/*.js'
        ]).pipe(gulp.dest('./vendor/jquery-easing')),

    );

});


// Default task
gulp.task('default', gulp.parallel('pug', 'css', 'vendor'));


// Gulp watch
gulp.task('watch', gulp.series('default', () => {
    gulp.watch('**/*.pug', gulp.series('pug'));
}));
