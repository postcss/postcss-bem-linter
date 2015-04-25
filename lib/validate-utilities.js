'use strict';

/**
 * Module dependencies
 */

var isValid = require('./is-valid-utility');

/**
 * Module exports
 */

module.exports = validateSelectors;

/**
 * @param {Object} styles
 * @param {RegExp} pattern
 * @param {Result} result - PostCSS Result, for registering warnings
 */
function validateSelectors(styles, pattern, result) {
  styles.eachRule(function (rule) {
    rule.selectors.forEach(function (selector) {
      if (!isValid(selector, pattern)) {
        result.warn(
          'Invalid utility selector "' + selector + '"',
          { node: rule }
        );
      }
    });
  });
}
