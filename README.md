# gulp-live-alert-bp (Live Alert Browser Page)

![Live Alert Browser Page](https://raw.githubusercontent.com/semiromid/live-alert-bp/master/images/on_128x128_v1.png)

This module is for the browser plugin «[Live Alert Browser Page](https://live-alert-browser-page.com/)» — this is the browser plugin for real-time alert on the browser page during web development.

[live-alert-browser-page.com](https://live-alert-browser-page.com/)

Base manuals are in [live-alert-bp](https://github.com/semiromid/live-alert-bp)

## Getting Started

###  Install
```shell
npm i gulp-live-alert-bp --save-dev
```

###  How to use


```javascript
const 
  gulp = require('gulp'),
  liveAlertBP = require("gulp-live-alert-bp"),
  liveAlertFormatterSass = require("live-alert-bp-formatter-sass"),
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

      //  Using the formatter
      liveAlert.open(
      	liveAlertFormatterSass(err)
      );
    }
  }

  this.emit('end');
}


function watch(){
  liveAlert.run();

  gulp.watch(cssWatch, gulp.series(css));
}


exports.css = css;
exports.watch = watch;

```
