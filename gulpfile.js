const { src, dest, parallel, watch, series,stream } = require('gulp');
const package = require('./package.json');
const gulp = require('gulp');
const gap = require('gulp-append-prepend');
const sourcemaps = require('gulp-sourcemaps');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const sass = require('gulp-sass');
const ts = require('gulp-typescript');
const tsProject = ts.createProject('tsconfig.json');
const browserSync = require('browser-sync').create();
const tap = require('gulp-tap');
const path = require('path');
const fs = require('fs');
// function css() {
//     return src('src/scss/**/*.scss')
//         .pipe(sourcemaps.init())
//         .pipe(sass().on('error', sass.logError))
//         .pipe(sourcemaps.write())
//         .pipe(dest('dist/css'))
// }
function cssMin() {
    return src('src/**/*.scss')
        // .pipe(sourcemaps.init())
        .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
        // .pipe(sourcemaps.write())
        .pipe(dest('src'))
        .pipe(browserSync.reload({ stream: true }));
}
function cssDev() {
    return src('src/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
        .pipe(sourcemaps.write())
        .pipe(dest('src'))
        .pipe(browserSync.reload({ stream: true }));
}

function js() {
    return src('src/**/*.ts')
        .pipe(tap(function(file, t) {
            const name = file.path.split('.')[0].split('/src/')[1];
            return t.through(srcToString, [file.path, name]);
        }))
        .pipe(sourcemaps.init())
        .pipe(tsProject())
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(concat(`js/${package.name}.js`))
        .pipe(sourcemaps.write())
        .pipe(dest('dist'))
        .pipe(browserSync.reload({ stream: true }));
}

function jsMin() {
    return src('src/**/*.ts')
        .pipe(tap(function(file, t) {
            const name = file.path.split('.')[0].split('/src/')[1];
            return t.through(srcToString, [file.path, name]);
        }))
        .pipe(sourcemaps.init())
        .pipe(tsProject())
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(uglify())
        .pipe(concat(`js/${package.name}.min.js`))
        .pipe(sourcemaps.write())
        .pipe(dest('dist'))
        .pipe(browserSync.reload({ stream: true }));
}
function srcToString(file, name) {
    const css = fs.readFileSync(`src/${name}.css`,'utf8',(err,data)=>data).replace(/\n/g, '');
    const html = fs.readFileSync(`src/${name}.html`,'utf8',(err,data)=>data).replace(/\n/g, '');
    return src(file)
        .pipe(gap.prependText('var STYLE = `' + css + '`;var HTML = `' + html + '`;'))
}

function watching() {
    cssDev();
    js();
    watch(['src/**/*.html','src/**/*.scss','src/**/*.ts'], series(cssDev, js));
}

function browser() {
    return browserSync.init({ port: 3333, server: { index: './demo/index.html' } });
}

exports.watch = parallel(watching, browser);
exports.default = series(cssMin, js, jsMin);