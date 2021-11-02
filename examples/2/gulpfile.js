
const 
  gulp = require('gulp'),
  liveAlertBP = require("gulp-live-alert-bp"),
  liveAlertFormatterSass = require("live-alert-bp-formatter-sass"),
  liveAlertFormatterStylelint = require("live-alert-bp-formatter-stylelint"),
  stylelint = require('gulp-stylelint'),
  autoprefixer = require('gulp-autoprefixer'),
  plumber = require('gulp-plumber'),
  sass = require('gulp-sass'),
  postcss = require('gulp-postcss'),
  cssnano = require('cssnano');

const 
  cssWatch = 'src/scss/*.scss',
  cssSrc = ['src/scss/*.scss'],
  cssDest = 'build/css';

const 
  liveAlert = new liveAlertBP({host: '127.0.0.1', port: '8080'});


function css() {
  return gulp.src(cssSrc)
  .pipe(plumber({errorHandler: onError}))
  .pipe(stylelint({
    customSyntax: 'postcss-scss',
    failAfterError: true,
    fix: false,
    reporters: [
      { formatter: formatterStylelint },
      { formatter: 'string', console: true }
    ]
  })) 
  .pipe(sass().on('error', sass.logError))
  .pipe(autoprefixer())
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


function formatterStylelint(results, returnValue) {
  if(liveAlert.hasError() === false){ 
    liveAlert.open(
      liveAlertFormatterStylelint(results)
    ); 
  }

  return results;
}


function watch(){
  liveAlert.run();

  gulp.watch(cssWatch, gulp.series(css));
}


exports.css = css;
exports.watch = watch;
exports.start = gulp.series(css, watch);
