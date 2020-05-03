const gulp = require('gulp');
const rename = require('gulp-rename');
const postcss = require('gulp-postcss');
const browserSync = require('browser-sync').create();
const reload = browserSync.reload;
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const uglify = require('gulp-uglify');
const fileinclude = require('gulp-file-include');

const processors = [
    require('postcss-import'),
    require('postcss-custom-properties'),
    require('postcss-custom-media'),
    require('postcss-nesting'),
    require('postcss-nested'),
    require('postcss-inline-svg'),
    require('postcss-pxtorem'),
    // require('cssnano')({
    //     autoprefixer: false,
    //     reduceIdents: false
    // })
];

gulp.task('pcss', (done)=> {
    return gulp
        .src('./src/css/*.pcss')
        .pipe(postcss(processors))
        .pipe(rename({
            extname: ".css"
        }))
        .pipe(gulp.dest('./public/css/'))
        .on('finish', ()=> {
            done();
        });
});

gulp.task('js', ()=> {

    var b = browserify({
        entries: './src/js/main.js',
        debug: true
    });

    return b.bundle()
        .pipe(source('app.js'))
        .pipe(buffer())
        .pipe(uglify())
        .pipe(gulp.dest('./public/js/'));
});

gulp.task('browser-sync', ()=> {
    browserSync.init({
        files: ['./index.html'],
        server: {
            baseDir: "./",
            directory: true
        },

    });
});

gulp.task('fileinclude', (done) => {
    return gulp
        .src(['src/*.html'])
        .pipe(fileinclude({
        prefix: '@@',
        }))
        // .pipe(rename({ extname: '.php' }))
        .pipe(gulp.dest('./public/'))
        .on('finish', ()=> {
            done();
        });
});


gulp.task('server-reload', (done)=> {
    browserSync.reload();
    done();
});

gulp.task('watch:pcss', ()=> {
    gulp.watch('./src/css/*', gulp.series('pcss', 'server-reload'));
});

gulp.task('watch:html', ()=> {
    gulp.watch('./src/**/*.html', gulp.series('fileinclude','server-reload'));
});

gulp.task('watch:js', ()=> {
    gulp.watch('./src/js/*', gulp.series('js', 'server-reload'));
});

gulp.task('watch', gulp.parallel('browser-sync', 'watch:pcss', 'watch:html', 'watch:js'));
gulp.task('build', gulp.parallel('pcss', 'js','fileinclude'));
