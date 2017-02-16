// module
// ---------------------------------------------
import gulp from 'gulp';
import browser from 'browser-sync';
import sass from 'gulp-sass';
import autoprefixer from 'gulp-autoprefixer';
import changed from 'gulp-changed';
import del from 'del';
import plumber from 'gulp-plumber';
import browserify from 'browserify';
import xtend from 'xtend';
import watchify from 'watchify';
import source from 'vinyl-source-stream';
import babelify from 'babelify';
import uglify from 'gulp-uglify';


// Path
// ---------------------------------------------
const path = {
  dist: './public',
  src: './src',
}
const copy_files = path.src + '/**/*.+(jpg|jpeg|png|gif|svg|ico|html|php)';

// Copy
// ---------------------------------------------
gulp.task('copy', ()=> {
  gulp.src(copy_files)
    .pipe(changed(path.dist))
    .pipe(gulp.dest(path.dist));
});

// Sass
// ---------------------------------------------
gulp.task('sass', ()=> {
  gulp.src(path.src + '/**/*.scss')
    .pipe(sass({
      includePaths: ['./node_modules/bootstrap/scss'],
      outputStyle: 'compressed'
    }).on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: ['last 2 versions', 'ie 9', 'Android >= 3'],
      cascade: false
    }))
    .pipe(gulp.dest(path.dist));
});

// browserify
// ---------------------------------------------
var watching = false;
gulp.task('enable-watch-mode', ()=> watching = true);

gulp.task('watchjs', ['enable-watch-mode'], ()=> {
  gulp.start('js');
});

gulp.task('js', ()=> {
  var bundler = browserify({
    entries: [path.src + '/assets/js/entry.js'],
    extensions: ['.js'],
    transform: ['babelify'],
    plugin: ['licensify'],
    debug: true
  });

  if (watching) {
    bundler = watchify(bundler);
    bundler.on('update', ()=> rebundle());
  }
  rebundle();

  function rebundle() {
    bundler
    .bundle()
    .on('error', (err)=> {
      console.log('Error: ' + err.message);
    })
    .pipe(source('bundle.js'))
    .pipe(gulp.dest(path.dist + '/assets/js/'));
  }
});

// browsersync
// ---------------------------------------------
gulp.task('browsersync', ()=> {
  browser({
    proxy: "gulp-php-example.dev"
  });
});

// Clean
// ---------------------------------------------
gulp.task('clean', () => del([path.dist]));

// Compress
// ---------------------------------------------
gulp.task('uglify', () => {
  gulp.src(path.dist + '/assets/js/bundle.js')
    .pipe(uglify({
      preserveComments: 'license'
    }))
    .pipe(gulp.dest(path.dist + '/assets/js/'));
});

// task
// ---------------------------------------------
gulp.task('dev', ['watchjs', 'browsersync'], ()=> {
  gulp.watch(path.src + '/**/*.scss', ['sass']);
  gulp.watch(copy_files, ['copy']);

  var timer;
  gulp.watch(path.dist + '/**/*', ()=> {
    clearTimeout(timer);
    timer = setTimeout(browser.reload, 400);
  });
});
