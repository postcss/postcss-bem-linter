'use strict';

/**
 * Module exports
 */

module.exports = isValidUtility;

/**
 * @param {String} selector
 * @param {RegExp} pattern
 * @returns {Boolean}
 */
function isValidUtility(selector, pattern) {
  return pattern.test(selector);
}
