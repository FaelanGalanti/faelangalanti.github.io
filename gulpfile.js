/**
 * Gulp configuration file.
 *
 * @module gulpfile
 */


// NPM Modules
const gulp   = require('gulp');
const header = require('gulp-header');
const pug    = require('gulp-pug');
const rename = require('gulp-rename');


// Local Modules
const pkg    = require('./package.json');


// Constants
const BANNER_TEXT = [
    `<%= pkg.title %> v<%= pkg.version %> (<%= pkg.homepage %>)`,
    `Copyright ${(new Date()).getFullYear()} <%= pkg.author %>`
];
const BANNER_HTML =
`<!--\n    ${BANNER_TEXT.join('\n    ')}\n-->\n`;


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


// Default task
gulp.task('default', gulp.parallel('pug'));


// Gulp watch
gulp.task('watch', gulp.series('default', () => {
    gulp.watch('**/*.pug', 'pug');
}));
