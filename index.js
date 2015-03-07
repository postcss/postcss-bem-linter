'use strict';

/**
 * Module dependencies
 */

var validateCustomProperties = require('./lib/validate-properties');
var validateSelectors = require('./lib/validate-selectors');
var validateRules = require('./lib/validate-rules');
var presetPatterns = require('./lib/preset-patterns');

/**
 * Module exports
 */

module.exports = conformance;

var RE_DIRECTIVE = /\*\s*@define ([-_a-zA-Z0-9]+)\s*(?:;\s*(use strict))?\s*/;

/**
 * Check patterns or setup defaults. If the input CSS does not have a
 * directive defining a component name according to the specified pattern,
 * do nothing -- or warn, if the directive is there but the name does not match.
 * Then call all of the validators.
 *
 * @param {Object} [patterns = 'suit']
 * @param {RegExp} [options.componentName]
 * @param {Object|Function} [options.selectors]
 */
function conformance(patterns) {
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

    var componentName = initialComment.match(RE_DIRECTIVE)[1].trim();
    if (!componentName.match(componentNamePattern)) {
      throw firstNode.error(
        'Invalid component name in definition /*' +
        initialComment + '*/.',
        'Component names must match the pattern ' + componentNamePattern
      );
      return;
    }

    var isStrict = initialComment.match(RE_DIRECTIVE)[2] === 'use strict';

    validateRules(styles);
    validateSelectors(styles, componentName, isStrict, patterns.selectors);
    validateCustomProperties(styles, componentName);
  };
}
