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
      var column = declaration.source.start.column;
      var line = declaration.source.start.line;
      var property = declaration.prop;

      if (property.indexOf('--') !== 0) {
        throw new Error(
          'Invalid property name "' + property + '" near line ' +
          line + ':' + column + '. ' +
          'A component\'s `:root` rule must only contain custom properties.'
        );
      }
      if (property.indexOf(componentName + '-') !== 2) {
        throw new Error(
          'Invalid custom property name "' + property + '" near line ' +
          line + ':' + column + '. ' +
          'Custom properties must contain the component name.'
        );
      }
    });
  });
}
