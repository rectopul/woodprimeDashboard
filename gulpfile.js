var { watch, src, dest, series } = require('gulp'),
   stylus = require('gulp-stylus'),
   autoprefixer = require('autoprefixer-stylus'),
   jsImport = require('gulp-js-import'),
   minify = require('gulp-minify'),
   rename = require('gulp-rename'),
   concat = require('gulp-concat')

const css = () => {
   return src('assets/css/**/*.styl')
      .pipe(
         stylus({
            'include css': true,
            use: [autoprefixer('iOS >= 7', 'last 1 Chrome version')],
            compress: true,
            linenos: false,
            import: __dirname + '/assets/css/settings.styl',
         })
      )
      .pipe(rename('app.min.css'))
      .pipe(concat('app.min.css'))
      .pipe(dest('./public/css'))
}

const js = () => {
   return src(['assets/js/**/*.js'], {
      sourcemaps: false,
   })
      .pipe(jsImport({ hideConsole: true }))
      .pipe(concat('scripts.js'))
      .pipe(
         minify({
            ext: {
               src: '.js',
               min: '.min.js',
            },
            exclude: ['tasks'],
            ignoreFiles: ['.combo.js', '-min.js'],
         })
      )
      .pipe(dest('./public/js', { sourcemaps: false }))
}

exports.js = js
exports.css = css

exports.init = series(css, js)

exports.default = function() {
   watch('assets/css/**/*.styl', series(css))
   watch(['assets/js/**/*.js'], series(js))
}
