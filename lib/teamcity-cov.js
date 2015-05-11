/**
 * Module dependencies.
 */

var JSONCov = require('mocha/lib/reporters/json-cov');

/**
 * Expose `Teamcity`.
 */

exports = module.exports = TeamcityCov;

/**
 * Initialize a new `Teamcity` reporter.
 *
 * @param {Runner} runner
 * @api public
 */

function TeamcityCov(runner, options) {
  var reporterOptions = options.reporterOptions;

  var absCoverageBKey = reporterOptions.absCoverageBKey || 'CodeCoverageB';
  var absLCoveredKey = reporterOptions.absLCoveredKey || 'CodeCoverageAbsLCovered';
  var absLTotalKey = reporterOptions.absLTotalKey || 'CodeCoverageAbsLTotal';
  var absCoverageLKey = reporterOptions.absCoverageLKey || 'CodeCoverageL';

  JSONCov.call(this, runner, false);

  runner.on('end', function(){
    var data = this.cov;
    var threshold = this.threshold || 0;
    if (!data) {
      console.log("##teamcity[message text='CODE-COVERAGE CHECK FAILED' errorDetails='Error reading report file.' status='ERROR']");
      return;
    }

    var cov = Number(data.coverage).toFixed(2);

    console.log("##teamcity[message text='Code Coverage is " + cov + "%']");
    console.log("##teamcity[blockOpened name='Code Coverage Summary']");
    console.log("##teamcity[buildStatisticValue key='" + absCoverageBKey + "' value='" + cov + "']");
    console.log("##teamcity[buildStatisticValue key='" + absLCoveredKey + "' value='" + data.hits + "']");
    console.log("##teamcity[buildStatisticValue key='" + absLTotalKey + "' value='" + data.sloc + "']");
    console.log("##teamcity[buildStatisticValue key='" + absCoverageLKey + "' value='" + cov + "']");
    console.log("##teamcity[blockClosed name='Code Coverage Summary']");

    if (cov >= threshold) {
      console.log("##teamcity[message text='CODE-COVERAGE CHECK PASSED' status='NORMAL']");
    } else {
      console.log("##teamcity[message text='CODE-COVERAGE CHECK FAILED' errorDetails='Insufficient code coverage.' status='ERROR']");
    }

  }.bind(this));
}
