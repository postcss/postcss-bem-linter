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
    var firstNode = styles.childs[0];
    var initialComment;

    if (firstNode.type !== 'comment') {
      return;
    } else {
      initialComment = firstNode.text;
    }

    var isDefinition = (initialComment && initialComment.match(/@define/));
    var isComponent = (initialComment && initialComment.match(RE_DIRECTIVE));
    if (!isDefinition) { return; }
    if (isDefinition && !isComponent) {
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
