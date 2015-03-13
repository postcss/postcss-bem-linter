'use strict';

/**
 * Module dependencies
 */

var isValid = require('./is-valid-selector');

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
    var selectors = rule.selectors;

    selectors.forEach(function (selector) {
      // selectors must start with the componentName class, or be `:root`
      if (!isValid(selector, componentName, strict, pattern)) {
        throw rule.error('Invalid selector "' + selector + '". ');
      }
    });
  });
}
