const eslintTeamcity = require('eslint-teamcity');

module.exports = function(gulp) {
  /**
   * ci tasks:
   * - `ci-lint`
   * - `ci-test`
   * - `ci-test:prepare`
   * - `ci-test:execute`
   * - `ci-test:clean`
   * @param {object} opts
   * @param {array|string} opts.sources - Glob selector for application sources
   * @param {array|string} opts.tests - Glob selector for application tests sources
   * @param {object} [opts.reportsConfig] - Configuration parameters for reporters
   */
  function ci(opts) {
    opts = {...opts || {}};
    if (!opts.reportsConfig) {
      opts.reportsConfig = {
        test: 'mocha-teamcity-reporter',
        coverage: ['lcov', 'json', 'text-summary', 'html', 'teamcity'],
        lint: eslintTeamcity,
        cpd: 'xml'
      };
    }
    const namespace = opts.namespace || null;
    require('./test.js')(gulp)({...opts, namespace: namespace ? `${namespace}-ci` : 'ci'});
  }
  return ci;
};
