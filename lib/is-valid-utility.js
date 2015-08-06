var listSequences = require('./listSequences');

/**
 * @param {String} selector
 * @param {RegExp} pattern
 * @returns {Boolean}
 */
module.exports = function(selector, pattern) {
  var sequences = listSequences(selector);
  return sequences.every(function(sequence) {
    return pattern.test(sequence);
  });
}
