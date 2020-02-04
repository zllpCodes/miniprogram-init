const
    fs = require('fs'),
    gulp = require('gulp'),
    replace = require('gulp-replace'),
    scss = require('gulp-sass'),
    postcss = require('gulp-postcss'),
    autoprefixer = require('autoprefixer'),
    rename = require('gulp-rename'),
    changed = require('gulp-changed'),
    mocker = require('./mocker.js'),
    webserver = require('gulp-webserver');


// 编译scss样式
gulp.task('compile:scss', function () {
    return gulp.src('src/**/**/*.scss')
        .pipe(replace(/\@(import\s[^@;]*)+(;import|\bimport|;|\b)?/g), ($1) => {
            let isMixin = config.filter(item => $1.indexOf(item) > -1);
            if (isMixin.length == 0) {
                return `\/*T${$1}T*\/`;
            } else {
                return $1;
            }
        })
        .pipe(scss())
        .pipe(postcss([autoprefixer(['iOS >= 8', 'Android >= 4.1'])]))
        .pipe(
            rename(function (path) {
                path.extname = '.wxss';
            })
        )
        .pipe(changed('dist'))
        .pipe(replace(/.scss/g, '.wxss'))
        .pipe(replace(/\/\*T(@import\s[^@;]*;)?(T\*\/)?/g, '$1'))
        .pipe(gulp.dest('dist'));
});

// 将除了scss的文件，拷贝到dist
gulp.task('compile:files', function () {
    return gulp.src(['src/**', '!src/**/**/**/*.scss'])
        .pipe(changed('dist'))
        .pipe(gulp.dest('dist'));
});

// 本地静态资源服务
gulp.task('webserver', function () {
    return gulp.src('.')
        .pipe(webserver({
            livereload: true,
            port: 8089,
            middleware: function (req, res, next) {
                let path = req.originalUrl.split('?')[0];
                if (path in mocker) {
                    let filename = `./json/${mocker[path]}`;
                    try {
                        fs.accessSync(filename, fs.constants.R_OK);
                        res.setHeader('Content-Type', 'application/json');
                        var data = fs.readFileSync(filename, 'utf-8');
                        res.end(data);
                    } catch (err) {
                        res.setHeader('Content-Type', 'application/json');
                        res.end(JSON.stringify({
                            "status": "404 NotFound",
                            "notFound": filename
                        }));
                    }
                } else {
                    next();
                }
            }
        }));
});

// 监听任务
gulp.task('dev', ['compile:scss', 'compile:files', 'webserver'], function () {
    gulp.watch('src/**', ['compile:scss', 'compile:files']);
});