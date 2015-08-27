/**
 * @param {Rule} rule - PostCSS rule
 * @param {String} componentName
 * @param {Result} result - PostCSS Result, for registering warnings
 */
module.exports = function(rule, componentName, result) {
  rule.walkDecls(function(declaration, i) {
    var property = declaration.prop;
    if (property.indexOf('--') !== 0) return;

    if (property.indexOf(componentName + '-') === 2) return;
    result.warn(
      'Invalid custom property name "' + property + '": ' +
      'a component\'s custom properties must start with the ' +
      'component name',
      { node: declaration }
    );
  });
}
