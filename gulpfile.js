const { src, dest, series } = require('gulp');

const zip = require('gulp-zip');

function copyTypescript() {
    return src('out/*.js')
        .pipe(dest('dist/out/'));
}

function copyManifest() {
    return src('manifest.json')
        .pipe(dest('dist/'));
}


function copyData() {
    return src('data/**')
        .pipe(dest('dist/data/'));
}

function copyData() {
    return src('_locales/**')
        .pipe(dest('dist/_locales/'));
}

function zipAll() {
    return src('dist/**').pipe(zip('mute-all-chrome-extension.zip')).pipe(dest('.'))
}

exports.default = series(copyTypescript, copyManifest, copyData, zipAll);