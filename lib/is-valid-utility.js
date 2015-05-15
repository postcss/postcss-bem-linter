'use strict';

/**
 * Module dependencies
 */

var listSequences = require('./listSequences');

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
  var sequences = listSequences(selector);
  return sequences.every(function (sequence) {
    return pattern.test(sequence);
  });
}
