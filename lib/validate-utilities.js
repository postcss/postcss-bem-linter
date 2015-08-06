var isValid = require('./is-valid-utility');

/**
 * @param {Object} styles
 * @param {RegExp} pattern
 * @param {Result} result - PostCSS Result, for registering warnings
 */
module.exports = function(styles, pattern, result) {
  styles.eachRule(function(rule) {
    rule.selectors.forEach(function(selector) {
      if (!isValid(selector, pattern)) {
        result.warn(
          'Invalid utility selector "' + selector + '"',
          { node: rule }
        );
      }
    });
  });
}
