const { src, dest, parallel, watch, series,stream } = require('gulp');
const package = require('./package.json');
const gulp = require('gulp');
const gap = require('gulp-append-prepend');
const sourcemaps = require('gulp-sourcemaps');
const babel = require('gulp-babel');
const rename = require('gulp-rename');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const sass = require('gulp-sass');
const ts = require('gulp-typescript');
const tsProject = ts.createProject('tsconfig.json');
const browserSync = require('browser-sync').create();
const tap = require('gulp-tap');
const fs = require('fs');
const srcPath = 'src/';
const themePath = `${srcPath}theme/`;
const modulePath = `${srcPath}module/`;
function css() {
    return src(`${themePath}**/*.scss`)
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(sourcemaps.write())
        .pipe(dest('dist/theme'))
        .pipe(browserSync.reload({ stream: true }));
}
function cssMin() {
    return src(`${modulePath}**/*.scss`)
        // .pipe(sourcemaps.init())
        .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
        // .pipe(sourcemaps.write())
        .pipe(dest(modulePath))
        .pipe(browserSync.reload({ stream: true }));
}
function cssDev() {
    return src(`${modulePath}**/*.scss`)
        .pipe(sourcemaps.init())
        .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
        .pipe(sourcemaps.write())
        .pipe(dest(modulePath))
        .pipe(browserSync.reload({ stream: true }));
}

function js() {
    return src(`${modulePath}**/*.ts`)
        .pipe(tap(function(file, t) {
            const str = file.path.split('.')[0].split(`/${modulePath}`)[1];
            let path = str.split('/'),
            name = path.pop();
            path = path.join('/');
            return t.through(srcToString, [file.path, path, name]);
        }))
        .pipe(sourcemaps.init())
        .pipe(tsProject())
        .pipe(babel({
            presets: ['@babel/env']
        }))
        // .pipe(concat(`${package.name}.js`))
        .pipe(sourcemaps.write())
        .pipe(rename(function (path) {
            path.basename = path.dirname;
            path.dirname = '';
            return path
          }))
        .pipe(dest('dist/module'))
        .pipe(browserSync.reload({ stream: true }));
}

function jsMin() {
    return src(`${modulePath}**/*.ts`)
        .pipe(tap(function(file, t) {
            const str = file.path.split('.')[0].split(`/${modulePath}`)[1];
            let path = str.split('/'),
            name = path.pop();
            path = path.join('/');
            return t.through(srcToString, [file.path, path, name]);
        }))
        .pipe(sourcemaps.init())
        .pipe(tsProject())
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(uglify())
        // .pipe(concat(`${package.name}.min.js`))
        .pipe(sourcemaps.write())
        .pipe(rename(function (path) {
            path.basename = path.dirname;
            path.dirname = '';
            return path
          }))
        .pipe(dest('dist/module'))
        .pipe(browserSync.reload({ stream: true }));
}
function srcToString(file, path, name) {
    const css = fs.readFileSync(`${modulePath}${path}/${name}.css`,'utf8',(err,data)=>data).replace(/\n/g, '');
    const html = fs.readFileSync(`${modulePath}${path}/${name}.html`,'utf8',(err,data)=>data).replace(/\n/g, '');
    return src(file)
        // .pipe(gap.prependText('var ' + name + 'STYLE = `' + css + '`;var ' + name + 'HTML = `' + html + '`;'))
        .pipe(gap.prependText('var STYLE = `' + css + '`;var HTML = `' + html + '`;'))
}

function watching() {
    (series(cssDev,css,js)());
    watch([`${modulePath}**/*.html`,`${modulePath}**/*.scss`,`${modulePath}**/*.ts`], series(cssDev, js));
    watch(`${themePath}**/*.scss`, css);
}

function browser() {
    return browserSync.init({ port: 3333, server: { index: './demo/index.html' } });
}

exports.watch = parallel(watching, browser);
exports.default = series(css, cssMin, js, jsMin);