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
 */
function validateRules(styles) {
  styles.eachRule(function (rule) {
    if (!isValidRule(rule)) {
      throw rule.error(
        'Cannot combine `:root` with other selectors in a rule.'
      );
    }
  });
}
