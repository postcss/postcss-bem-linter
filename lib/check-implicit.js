var minimatchList = require('minimatch-list');
var path = require('path');

/**
 * Check the file matches on of the globs.
 *
 * @param {string} filename - The filename to test
 * @param {string[]} globs - An array of glob strings to test the filename against
 * @return {boolean}
 */
function checkGlob(filename, globs) {
  // PostCSS turns relative paths into absolute paths
  filename = path.relative(process.cwd(), filename);
  return minimatchList(filename, globs);
}

/**
 * @param {string[]|boolean} implicitComponentsConfig - The configuration value implicitComponents
 * @param {string} filename - The filename of the CSS file being checked
 * @returns {boolean}
 */
function isImplicitComponent(implicitComponentsConfig, filename) {
  if (implicitComponentsConfig instanceof Array) {
    return checkGlob(filename, implicitComponentsConfig);
  }

  return Boolean(implicitComponentsConfig);
}

/**
 * @param {string[]|boolean} implicitUtilitiesConfig - The configuration value implicitUtilities
 * @param {string} filename - The filename of the CSS file being checked
 * @return {boolean}
 */
function isImplicitUtilities(implicitUtilitiesConfig, filename) {
  if (implicitUtilitiesConfig instanceof Array) {
    return checkGlob(filename, implicitUtilitiesConfig);
  }

  return false;
}

module.exports = {
  isImplicitComponent: isImplicitComponent,
  isImplicitUtilities: isImplicitUtilities,
};
