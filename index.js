'use strict';

/**
 * Module dependencies
 */

var validateCustomProperties = require('./lib/validate-properties');
var validateUtilities = require('./lib/validate-utilities');
var validateSelectors = require('./lib/validate-selectors');
var validateRules = require('./lib/validate-rules');
var presetPatterns = require('./lib/preset-patterns');

/**
 * Module exports
 */

module.exports = conformance;

var RE_DIRECTIVE = /\*\s*@define ([-_a-zA-Z0-9]+)\s*(?:;\s*(weak))?\s*/;
var UTILITIES_IDENT = 'utilities';

/**
 * Check patterns or setup defaults. If the input CSS does not have a
 * directive defining a component name according to the specified pattern,
 * do nothing -- or warn, if the directive is there but the name does not match.
 * Then call all of the validators.
 *
 * @param {Object} [patterns = 'suit']
 * @param {RegExp} [patterns.componentName]
 * @param {RegExp} [patterns.utilitySelectors]
 * @param {Object|Function} [patterns.componentSelectors]
 * @param {Object} [opts] - Options that are can be used by
 *   a pattern (e.g. `namespace`)
 */
function conformance(patterns, opts) {
  patterns = patterns || 'suit';
  if (typeof patterns === 'string') {
    patterns = presetPatterns[patterns];
  }
  var componentNamePattern = patterns.componentName || /[-_a-zA-Z0-9]+/;

  return function (styles) {
    var firstNode = styles.nodes[0];
    if (firstNode.type !== 'comment') { return; }

    var initialComment = firstNode.text;
    if (!initialComment || !initialComment.match(RE_DIRECTIVE)) { return; }

    var defined = initialComment.match(RE_DIRECTIVE)[1].trim();
    var isUtilities = defined === UTILITIES_IDENT;
    if (!isUtilities && !defined.match(componentNamePattern)) {
      throw firstNode.error(
        'Invalid component name in definition /*' +
        initialComment + '*/.',
        'Component names must match the pattern ' + componentNamePattern
      );
    }

    var weakMode = initialComment.match(RE_DIRECTIVE)[2] === 'weak';

    validateRules(styles);
    if (isUtilities) {
      validateUtilities(styles, patterns.utilitySelectors);
    } else {
      validateSelectors(
        styles, defined, weakMode, patterns.componentSelectors, opts
      );
    }
    validateCustomProperties(styles, defined);
  };
}
