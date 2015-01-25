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
 */
function validateCustomProperties(styles, componentName) {
  styles.eachRule(function (rule) {
    if (!isValidRule(rule) || rule.selectors[0] !== ':root') { return; }

    rule.eachDecl(function (declaration, i) {
      var property = declaration.prop;

      if (property.indexOf('--') !== 0) {
        throw declaration.error(
          'Invalid property name "' + property + '". ' +
          'A component\'s `:root` rule must only contain custom properties.'
        );
      }
      if (property.indexOf(componentName + '-') !== 2) {
        throw declaration.error(
          'Invalid custom property name "' + property + '". ' +
          'Custom properties must contain the component name.'
        );
      }
    });
  });
}
