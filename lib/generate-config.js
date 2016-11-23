var presetPatterns = require('./preset-patterns');

/**
 * Given some user options, put together a config object that
 * the validators can use.
 *
 * @param {Object|String} [primaryOptions = 'suit']
 * @param {RegExp} [primaryOptions.componentName]
 * @param {RegExp} [primaryOptions.utilitySelectors]
 * @param {Object|Function} [primaryOptions.componentSelectors]
 * @param {RegExp} [primaryOptions.ignoreSelectors]
 * @param {RegExp} [primaryOptions.ignoreCustomProperties]
 * @param {String} [primaryOptions.preset] - The same as passing a string for `primaryOptions`
 * @param {Object} [primaryOptions.presetOptions] - Options that are can be used by
 *   a pattern (e.g. `namespace`)
 * @param {Object} [secondaryOptions] - The same as `primaryOptions.presetOptions`
 * @return {Object} The configuration object
 */
module.exports = function(primaryOptions, secondaryOptions) {
  var patterns = primaryOptions || 'suit';
  if (typeof patterns === 'string') {
    patterns = presetPatterns[patterns];
  } else if (patterns.preset) {
    patterns = presetPatterns[patterns.preset];

    // Enable overriding of preset patterns
    if (primaryOptions.utilitySelectors) {
      patterns.utilitySelectors = primaryOptions.utilitySelectors;
    }
    if (primaryOptions.componentName) {
      patterns.componentName = primaryOptions.componentName;
    }
    if (primaryOptions.componentSelectors) {
      patterns.componentSelectors = primaryOptions.componentSelectors;
    }
    if (primaryOptions.ignoreSelectors) {
      patterns.ignoreSelectors = primaryOptions.ignoreSelectors;
    }
    if (primaryOptions.ignoreCustomProperties) {
      patterns.ignoreCustomProperties = primaryOptions.ignoreCustomProperties;
    }
  }

  var presetOptions = secondaryOptions || {};
  if (primaryOptions && primaryOptions.presetOptions) {
    presetOptions = primaryOptions.presetOptions;
  }

  var implicitComponents = secondaryOptions && secondaryOptions.implicitComponents !== undefined ?
    secondaryOptions.implicitComponents : primaryOptions && primaryOptions.implicitComponents;
  implicitComponents = implicitComponents === undefined ? false : implicitComponents;

  if (typeof implicitComponents === 'string') {
    implicitComponents = [implicitComponents];
  }

  var implicitUtilities = secondaryOptions && secondaryOptions.implicitUtilities !== undefined ?
    secondaryOptions.implicitUtilities : primaryOptions && primaryOptions.implicitUtilities;

  if (typeof implicitUtilities === 'string') {
    implicitUtilities = [implicitUtilities];
  }

  return {
    patterns: patterns,
    presetOptions: presetOptions,
    componentNamePattern: patterns.componentName || /^[-_a-zA-Z0-9]+$/,
    implicitComponents: implicitComponents,
    implicitUtilities: implicitUtilities,
  };
}
