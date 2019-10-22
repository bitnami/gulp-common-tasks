const download = require('gulp-download');
const rename = require('gulp-rename');
const chmod = require('gulp-chmod');
const untar = require('gulp-vinyl-untar');
const gunzip = require('gulp-gunzip');
const filter = require('gulp-filter');

module.exports = function(gulp) {
  /**
   * tasks:
   * - `install-node`
   * @param {object} opts
   * @param {string} opts.version - Node version to install
   * @param {array|string} [opts.destination='./runtime'] - Folder where to save node binary
   */
  function npm(opts) {
    opts = opts || {};
    const {version} = opts;
    const destination = opts.destination || './runtime';
    const namespace = opts.namespace || null;

    function taskName(n) {
      return namespace ? `${namespace}-${n}` : n;
    }

    gulp.task(taskName('install-node'), () => {
      return download(`https://nodejs.org/dist/v${version}/node-v${version}-linux-x64.tar.gz`)
        .pipe(gunzip())
        .pipe(untar())
        .pipe(filter([`node-v${version}-linux-x64/bin/node`]))
        .pipe(rename('node'))
        .pipe(chmod(755))
        .pipe(gulp.dest(destination));
    });
  }
  return npm;
};
