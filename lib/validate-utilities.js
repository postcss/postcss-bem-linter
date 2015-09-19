var listSequences = require('./list-sequences');
var shouldIgnoreRule = require('./should-ignore-rule');

/**
 * @param {Object} config
 * @param {Rule} config.rule - PostCSS Rule
 * @param {RegExp} config.utilityPattern
 * @param {RegExp} config.ignorePattern
 * @param {Result} config.result - PostCSS Result, for registering warnings
 */
module.exports = function(config) {
  if (shouldIgnoreRule(config.rule)) return;

  config.rule.selectors.forEach(function(selector) {
    var allSequences = listSequences(selector);
    var sequence;
    for (var i = 0, l = allSequences.length; i < l; i++) {
      sequence = allSequences[i];
      if (config.ignorePattern && config.ignorePattern.test(sequence)) continue;
      if (config.utilityPattern.test(sequence)) continue;
      config.result.warn(
        'Invalid utility selector "' + selector + '"',
        {
          node: config.rule,
          word: selector,
        }
      );
      return;
    }
  });
}
