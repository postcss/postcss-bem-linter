var postcss = require('postcss');
var validateCustomProperties = require('./lib/validate-properties');
var validateUtilities = require('./lib/validate-utilities');
var validateSelectors = require('./lib/validate-selectors');
var presetPatterns = require('./lib/preset-patterns');

var RE_DIRECTIVE = /\*\s*@define ([-_a-zA-Z0-9]+)\s*(?:;\s*(weak))?\s*/;
var UTILITIES_IDENT = 'utilities';

/**
 * Set things up and call the validators.
 *
 * If the input CSS does not have a
 * directive defining a component name according to the specified pattern,
 * do nothing -- or warn, if the directive is there but the name does not match.
 *
 * @param {Object|String} [primaryOptions = 'suit']
 * @param {RegExp} [primaryOptions.componentName]
 * @param {RegExp} [primaryOptions.utilitySelectors]
 * @param {Object|Function} [primaryOptions.componentSelectors]
 * @param {String} [primaryOptions.preset] - The same as passing a string for `primaryOptions`
 * @param {Object} [primaryOptions.presetOptions] - Options that are can be used by
 *   a pattern (e.g. `namespace`)
 * @param {Object} [secondaryOptions] - The same as `primaryOptions.presetOptions`
 */
module.exports = postcss.plugin('postcss-bem-linter', function(primaryOptions, secondaryOptions) {
  var patterns = primaryOptions || 'suit';
  if (typeof patterns === 'string') {
    patterns = presetPatterns[patterns];
  } else if (patterns.preset) {
    patterns = presetPatterns[patterns.preset];
  }

  var presetOptions = secondaryOptions || {};
  if (primaryOptions && primaryOptions.presetOptions) {
    presetOptions = primaryOptions.presetOptions;
  }

  var componentNamePattern = patterns.componentName || /[-_a-zA-Z0-9]+/;

  return function(root, result) {
    var firstNode = root.nodes[0];
    if (!firstNode || firstNode.type !== 'comment') return;

    var initialComment = firstNode.text;
    if (!initialComment || !initialComment.match(RE_DIRECTIVE)) return;

    var defined = initialComment.match(RE_DIRECTIVE)[1].trim();
    var isUtilities = defined === UTILITIES_IDENT;
    if (!isUtilities && !defined.match(componentNamePattern)) {
      result.warn(
        'Invalid component name in definition /*' + initialComment + '*/',
        { node: firstNode }
      );
    }

    var weakMode = initialComment.match(RE_DIRECTIVE)[2] === 'weak';

    if (isUtilities) {
      validateUtilities(root, patterns.utilitySelectors, result);
      return;
    }

    validateSelectors(
      root, defined, weakMode, patterns.componentSelectors, presetOptions, result
    );
    validateCustomProperties(root, defined, result);
    console.log(result.messages)
  };
});
