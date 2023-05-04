const gulp = require('gulp');
const scss = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const fileinclude = require('gulp-file-include');
const browserSync = require('browser-sync').create();

const path = {
	dist: './dist/',
	assets: './assets/',
}


gulp.task('html',()=> {
  return gulp
    .src([path.assets + '/html/*.html'])
    .pipe(
      fileinclude({
        prefix: '@@',
        basepath: path.assets + '/html/include',
      }),
    )
    .pipe(gulp.dest(path.dist + '/html'))
    .pipe(browserSync.reload({ stream: true }));
});

const scssOptions = {
	outputStyle: 'expanded', /* nested, expanded, compact, compressed */
	indentType: 'space',
	indentWidth: 2,
	souceComments: true
}

gulp.task('scss', () => {
  return gulp
    .src(path.assets + 'scss/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(autoprefixer())
    .pipe(scss(scssOptions).on('error', scss.logError))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(path.dist + 'css'))
    .pipe(browserSync.reload({ stream: true }));
});

gulp.task('js', () => {
  return gulp
    .src(path.assets + 'js/**/*.js')
    .pipe(gulp.dest(path.dist + 'js'))
    .pipe(browserSync.reload({ stream: true }));
});

gulp.task('browserSync', () => {
  return browserSync.init({
    port: 200,
    server: {
      baseDir: './dist'
    }
  })
});

gulp.task('watch', () => {
  gulp.watch(path.assets + '**/*.html', gulp.series('html'));
  gulp.watch(path.assets + '**/*.scss', gulp.series('scss'));
  gulp.watch(path.assets + '**/*.js', gulp.series('js'));
});

gulp.task('default', gulp.parallel('html','scss','js','watch','browserSync'));