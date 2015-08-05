'use strict';

/**
 * Module dependencies
 */

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
    if (rule.selectors[0] !== ':root') { return; }

    rule.eachDecl(function (declaration, i) {
      var property = declaration.prop;

      if (property.indexOf(componentName + '-') !== 2) {
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
