const
    fs = require('fs'),
    gulp = require('gulp'),
    replace = require('gulp-replace'),
    scss = require('gulp-sass'),
    postcss = require('gulp-postcss'),
    autoprefixer = require('autoprefixer'),
    rename = require('gulp-rename'),
    changed = require('gulp-changed'),
    clean = require('gulp-clean'),
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


// 清除dist文件夹，打包最新代码
gulp.task('clean', function () {
    gulp.src('dist/', {
            read: false
        })
        .pipe(clean())
});

// 本地开发
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

gulp.task('compile:dev', function () {
    gulp.src('src/app.js')
        .pipe(replace(/NODE_ENV/, 'dev'))
        .pipe(gulp.dest('dist'));
});

gulp.task('dev', ['compile:dev', 'webserver'], function () {
    gulp.watch('src/**', ['compile:scss', 'compile:files']);
});


// 测试环境
gulp.task('compile:stag', function () {
    gulp.src('src/app.js')
        .pipe(replace(/NODE_ENV/, 'stag'))
        .pipe(gulp.dest('dist'));
});

gulp.task('stag', ['compile:stag'], function () {
    gulp.watch('src/**', ['compile:scss', 'compile:files']);
});


// 线上生产
gulp.task('compile:prod', function () {
    gulp.src('src/app.js')
        .pipe(replace(/NODE_ENV/, 'prod'))
        .pipe(gulp.dest('dist'));
});

gulp.task('prod', ['compile:prod', 'compile:scss', 'compile:files'])