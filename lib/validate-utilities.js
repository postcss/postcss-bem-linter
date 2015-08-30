var listSequences = require('./list-sequences');

/**
 * @param {Rule} rule - PostCSS Rule
 * @param {RegExp} pattern
 * @param {Result} result - PostCSS Result, for registering warnings
 */
module.exports = function(rule, pattern, result) {
  rule.selectors.forEach(function(selector) {
    if (isValid(selector, pattern)) return;
    result.warn(
      'Invalid utility selector "' + selector + '"',
      {
        node: rule,
        word: selector,
      }
    );
  });
}

function isValid(selector, pattern) {
  var sequences = listSequences(selector);
  return sequences.every(function(sequence) {
    return pattern.test(sequence);
  });
}
