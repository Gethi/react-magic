/**
 *  Copyright (c) 2014, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 *
 */

var babel = require('gulp-babel');
var del = require('del');
var githubPages = require('gulp-gh-pages');
var gulp = require('gulp');
const { series } = require('gulp');
var gulpWebpack = require('gulp-webpack');
var merge = require('merge-stream');
var rename = require('gulp-rename');
var spawn = require('child_process').spawn;
var webpack = require('webpack');
var uglify = require('gulp-uglify');

var SITE_OUTPUT_DIR = 'build/site/';
var PACKAGE_OUTPUT_DIR = 'build/package/';


//gulp.task('default', gulp.series('build-htmltojsx', function() { 
  // default task code here
//}));
/*gulp.task('build', [
  'build-htmltojsx', 'build-magic', 'build-site-htmltojsx',
  'build-package'
]);*/

function buildHtmltojsx() {
  return gulp.src('src/htmltojsx.js')
    .pipe(gulpWebpack({
      output: {
        library: 'HTMLtoJSX',
        libraryTarget: 'umd',
        filename: 'htmltojsx.js',
      },
      plugins: [
        new webpack.DefinePlugin({
          IN_BROWSER: true,
          'process.env.NODE_ENV': '"production"'
        }),
      ],
    }))
    .pipe(gulp.dest(SITE_OUTPUT_DIR))
    .pipe(uglify({ preserveComments: 'some' }))
    .pipe(rename({ extname: '.min.js' }))
    .pipe(gulp.dest(SITE_OUTPUT_DIR));
};

function buildMagic() {
  return gulp.src('src/magic.js')
    .pipe(gulpWebpack({
      output: {
        library: 'ReactMagic',
        libraryTarget: 'umd',
        filename: 'magic.js',
      },
      plugins: [
        new webpack.DefinePlugin({
          IN_BROWSER: true,
          'process.env.NODE_ENV': '"production"'
        }),
      ],
    }))
    .pipe(gulp.dest(SITE_OUTPUT_DIR))
    .pipe(uglify({ preserveComments: 'some' }))
    .pipe(rename({ extname: '.min.js' }))
    .pipe(gulp.dest(SITE_OUTPUT_DIR));
};

function buildSiteHtmltojsx() {   
  return gulp.src('src/htmltojsx-component.js')
    .pipe(babel())
     .pipe(gulp.dest(SITE_OUTPUT_DIR));
};

function buildPackage() {
   var main = gulp
     .src([
       '**/*', '!README*.md', '!node_modules{,/**}', '!build{,/**}',
       '!site{,/**}', '!temp{,/**}',
     ])
     .pipe(gulp.dest(PACKAGE_OUTPUT_DIR));

   var readme = gulp.src('README-htmltojsx.md')
     .pipe(rename('README.md'))
     .pipe(gulp.dest(PACKAGE_OUTPUT_DIR));

   return merge(main, readme);
 };

 exports.default = series(buildHtmltojsx, buildMagic, buildSiteHtmltojsx, buildPackage);

// gulp.task('publish-site', gulp.series('build', function() { 
//   return gulp.src('build/site/**/*')
//   .pipe(githubPages({}));
// }));

// gulp.task('publish-package', gulp.series('build', function() { 
//   spawn(
//     'npm',
//     ['publish', PACKAGE_OUTPUT_DIR],
//     { stdio: 'inherit' }
//   ).on('close', callback);
// }));

// gulp.task('clean', function(callback) {
//   del(['build'], callback);
// });