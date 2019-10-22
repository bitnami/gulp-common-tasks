const fs = require('fs');
const path = require('path');
const del = require('del');
const babel = require('gulp-babel');
const runSequence = require('run-sequence');

module.exports = function(gulp) {
  /**
   * Make changes in package.json for adecuating it to the npm distributable
   * @private
   * @param {string} pkgInfo - Content of original package.json
   * @returns {object} - Resulting package.json
   */
  function _fixPackageJsonForNpm(pkgInfo) {
    delete pkgInfo.scripts;
    return pkgInfo;
  }

  /**
   * npm tasks:
   * - `npm-pack`
   * - `npm-pack:clean`
   * - `npm-pack:transpile`
   * - `npm-pack:copyMeta`
   * - `npm-pack:fixPackageInfo`
   * @param {object} opts
   * @param {string} opts.buildDir - Directory where the result of the bundle operations will be stored
   * @param {array|string} opts.sources - Glob selector for application js sources
   * @param {array|string} opts.meta - Glob selector for application source which is not js but
   * should be included in the npm package
   */
  function npm(opts) {
    opts = opts || {};
    const {buildDir} = opts;
    const namespace = opts.namespace || null;
    const npmPackageOutputDir = `${buildDir}/npm-package`;
    const {sources} = opts;
    const {meta} = opts;

    function taskName(n) {
      return namespace ? `${namespace}-${n}` : n;
    }

    gulp.task(taskName('npm-pack:clean'), () => {
      return del([
        npmPackageOutputDir
      ]);
    });

    gulp.task(taskName('npm-pack:transpile'), () => {
      return gulp.src(sources, {base: './'})
        .pipe(babel({presets: ['es2015']}))
        .pipe(gulp.dest(npmPackageOutputDir));
    });

    gulp.task(taskName('npm-pack:copyMeta'), () => {
      return gulp.src(meta, {base: './'})
        .pipe(gulp.dest(npmPackageOutputDir));
    });

    gulp.task(taskName('npm-pack:fixPackageInfo'), () => {
      return fs.writeFileSync(path.join(npmPackageOutputDir, 'package.json'), JSON.stringify(_fixPackageJsonForNpm(
        JSON.parse(fs.readFileSync('./package.json'))
      ), null, 2));
    });

    gulp.task(taskName('npm-pack'), () => {
      runSequence(
        taskName('npm-pack:clean'),
        taskName('npm-pack:transpile'),
        taskName('npm-pack:copyMeta'),
        taskName('npm-pack:fixPackageInfo')
      );
    });
  }
  return npm;
};
