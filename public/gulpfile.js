let gulp = require('gulp')
let sass = require('gulp-sass')
let minifyCss = require('gulp-clean-css')
//let minifyJs = require('gulp-uglifyes') // regular uglify does not work with ES6
let rename = require("gulp-rename");
let uglify = require('gulp-uglify-es').default;
let gutil = require('gulp-util')
let plumber = require('gulp-plumber')
let autoprefixer = require('gulp-autoprefixer')
let browserSync = require('browser-sync').create()

function swallowError (error) {
  console.log(error.toString())
  this.emit('end')
}

gulp.task('sass', function () {
  gulp.src('css/*.scss')
    .pipe(sass())
    .on('error', swallowError)
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(minifyCss())
    .pipe(plumber(function (error) {
      gutil.log(error.message)
      this.emit('end')
    }))
    .pipe(gulp.dest('dist'))
    .pipe(browserSync.stream())
})

gulp.task('uglify', () => {
  gulp.src('js/*.js')
    .pipe(uglify())
    .on('error', swallowError)
    .pipe(gulp.dest('dist'))
    .pipe(browserSync.stream())
})

gulp.task('watch', function () {
  browserSync.init({
    server: {
      baseDir: './'
    }
  })
  gulp.watch('css/*.scss', ['sass'])
  gulp.watch('js/*.js', ['uglify'])
  gulp.watch('*.html', browserSync.reload)
})
