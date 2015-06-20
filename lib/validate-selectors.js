'use strict';

/**
 * Module dependencies
 */

var isValid = require('./is-valid-selector');
var IGNORE_COMMENT = 'postcss-bem-linter: ignore';

/**
 * Module exports
 */

module.exports = validateSelectors;

/**
 * @param {Object} styles
 * @param {String} componentName
 * @param {Boolean} weakMode
 * @param {Object} pattern
 * @param {Object} opts
 * @param {Result} result - PostCSS Result, for registering warnings
 */
function validateSelectors(
  styles, componentName, weakMode, pattern, opts, result
) {
  styles.eachRule(function (rule) {
    if (rule.parent && rule.parent.name === 'keyframes') { return; }

    var prev = rule.prev();
    if (prev && prev.type === 'comment'
      && prev.text === IGNORE_COMMENT) { return; }

    var selectors = rule.selectors;

    selectors.forEach(function (selector) {
      // selectors must start with the componentName class, or be `:root`
      if (!isValid(selector, componentName, weakMode, pattern, opts)) {
        result.warn(
          'Invalid component selector "' + selector + '"',
          { node: rule }
        );
      }
    });
  });
}
