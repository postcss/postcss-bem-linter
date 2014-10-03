'use strict';

/**
 * Module exports
 */

module.exports = isValidRule;

/**
 * @param {Object} rule
 */

function isValidRule(rule) {
  var selectors = rule.selectors;

  if (selectors.length > 1 && containsRoot(selectors)) {
    return false;
  }

  function containsRoot(selectors) {
    var hasRoot = false;

    selectors.forEach(function (selector) {
      if (selector.indexOf(':root') !== -1) {
        hasRoot = true;
      }
    });

    return hasRoot;
  }

  return true;
}
