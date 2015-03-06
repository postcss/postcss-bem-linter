'use strict';

/**
 * Module dependencies
 */

var isValidSelectorInComponent = require('./is-valid-selector');

/**
 * Module exports
 */

module.exports = validateSelectors;

/**
 * @param {Object} styles
 * @param {String} componentName
 */
function validateSelectors(styles, componentName, strict, pattern) {
  styles.eachRule(function (rule) {
    if (rule.parent && rule.parent.name == 'keyframes') {
      return;
    }
    var column = rule.source.start.column;
    var line = rule.source.start.line;
    var selectors = rule.selectors;

    selectors.forEach(function (selector) {
      // selectors must start with the componentName class, or be `:root`
      if (!isValidSelectorInComponent(selector, componentName, strict, pattern)) {
        throw new Error(
          'Invalid selector "' + selector + '" near line ' +
          line + ':' + column + '. ' + 'Please refer to the SUIT CSS naming ' +
          'conventions: github.com/suitcss/suit.'
        );
      }
    });
  });
}
