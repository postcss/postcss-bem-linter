'use strict';

/**
 * Module dependencies
 */

var isValidRule = require('./is-valid-rule');

/**
 * Module exports
 */

module.exports = validateRules;

/**
 * @param {Object} styles
 * @param {Result} result - PostCSS Result, for registering warnings
 */
function validateRules(styles, result) {
  styles.eachRule(function (rule) {
    if (!isValidRule(rule)) {
      result.warn(
        'Cannot combine `:root` with other selectors in a rule',
        { node: rule }
      );
    }
  });
}
