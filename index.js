'use strict';

/**
 * Module dependencies
 */

var validateCustomProperties = require('./lib/validate-properties');
var validateSelectors = require('./lib/validate-selectors');
var validateRules = require('./lib/validate-rules');

/**
 * Module exports
 */

module.exports = conformance;

/**
 * Constants
 */

var RE_DIRECTIVE = /\* @define ([A-Z][a-zA-Z]+)(?:; (use strict))?\s*/;

/**
 * @param {Object} options
 */
function conformance(options) {
  return function (styles) {
    var firstNode = styles.nodes[0];
    var initialComment = firstNode.text;

    if (firstNode.type !== 'comment' || !initialComment.match(/@define/)) {
      return;
    }

    if (!initialComment.match(RE_DIRECTIVE)) {
      console.warn(
        'WARNING: invalid component name in definition /*' +
        initialComment + '*/.',
        'Component names must be pascal-case, e.g., ComponentName.'
      );
      return;
    }

    var componentName = initialComment.match(RE_DIRECTIVE)[1].trim();
    var isStrict = initialComment.match(RE_DIRECTIVE)[2] === 'use strict';

    validateRules(styles);
    validateSelectors(styles, componentName, isStrict);
    validateCustomProperties(styles, componentName);
  };
}
