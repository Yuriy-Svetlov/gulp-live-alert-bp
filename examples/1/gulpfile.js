
const 
  gulp = require('gulp'),
  liveAlertBP = require("gulp-live-alert-bp"),
  liveAlertFormatterSass = require("live-alert-bp-formatter-sass"),
  plumber = require('gulp-plumber'),
  sass = require('gulp-sass'),
  postcss = require('gulp-postcss'),
  cssnano = require('cssnano'),
  webServer = require('./web-server');

const 
  cssWatch = 'src/scss/**/*.scss',
  cssSrc = ['src/scss/*.scss'],
  cssDest = 'dest/css';

const 
  liveAlert = new liveAlertBP({host: '127.0.0.1', port: '8080'});


function css() {
  return gulp.src(cssSrc)
  .pipe(plumber({errorHandler: onError}))     
  .pipe(sass().on('error', sass.logError))
  .pipe(postcss([
      cssnano({zindex: false, reduceIdents: false})
  ]))    
  .pipe(gulp.dest(cssDest))
  .pipe(liveAlert.close()) // It is not mandatory (If the web page reloads completely)
  .pipe(liveAlert.reloadNotification());  // It is not mandatory (If the web page reloads completely)
}


function onError(err){
  if(liveAlert.hasError() === false){
    if(err.plugin === 'gulp-sass'){
      // Without using a formatter
      //liveAlert.open([
      //  { label: 'File', message: err.file },
      //  { label: 'Message', message: err.message }
      //]);

      // Using the formatter
      liveAlert.open(
        liveAlertFormatterSass(err)
      );
    }
  }

  this.emit('end');
}


function watch(){
  liveAlert.run();
  webServer();

  gulp.watch(cssWatch, gulp.series(css));
}


exports.css = css;
exports.watch = watch;
exports.start = gulp.series(css, watch);
