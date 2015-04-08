'use strict';

/**
 * Module dependencies
 */

var isValidRule = require('./is-valid-rule');

/**
 * Module exports
 */

module.exports = validateCustomProperties;

/**
 * @param {Object} styles
 * @param {String} componentName
 * @param {Result} result - PostCSS Result, for registering warnings
 */
function validateCustomProperties(styles, componentName, result) {
  styles.eachRule(function (rule) {
    if (!isValidRule(rule) || rule.selectors[0] !== ':root') { return; }

    rule.eachDecl(function (declaration, i) {
      var property = declaration.prop;

      if (property.indexOf('--') !== 0) {
        result.warn(
          'Invalid custom property name "' + property + '": ' +
          '`:root` rules must only contain custom properties',
          { node: declaration }
        );
      } else if (property.indexOf(componentName + '-') !== 2) {
        result.warn(
          'Invalid custom property name "' + property + '": ' +
          'a component\'s custom properties must start with the ' +
          'component name',
          { node: declaration }
        );
      }
    });
  });
}
