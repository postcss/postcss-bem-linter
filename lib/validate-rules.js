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
    var column = rule.source.start.column;
    var line = rule.source.start.line;

    if (!isValidRule(rule)) {
      throw new Error(
        'Invalid selectors in rule near line ' + line + ':' + column + '. ' +
        'Cannot combine `:root` with other selectors in a rule.'
      );
    }
  });
}
