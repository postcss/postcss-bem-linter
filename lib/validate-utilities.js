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
 */
function validateSelectors(styles, pattern) {
  styles.eachRule(function (rule) {
    rule.selectors.forEach(function (selector) {
      if (!isValid(selector, pattern)) {
        throw rule.error(
          'Invalid selector "' + selector +
          '": does not match the utility class convention.'
        );
      }
    });
  });
}
