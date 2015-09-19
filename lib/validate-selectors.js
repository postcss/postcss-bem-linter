var listSequences = require('./list-sequences');
var shouldIgnoreRule = require('./should-ignore-rule');

/**
 * @param {Object} config
 * @param {Rule} config.rule - PostCSS Rule
 * @param {String} config.componentName
 * @param {Boolean} config.weakMode
 * @param {Object} config.selectorPattern
 * @param {Object} config.selectorPatternOptions
 * @param {RegExp} config.ignorePattern
 * @param {Result} config.result - PostCSS Result, for registering warnings
 */
module.exports = function(config) {
  if (config.rule.parent && config.rule.parent.name === 'keyframes') return;
  if (shouldIgnoreRule(config.rule)) return;

  var initialPattern = (config.selectorPattern.initial)
    ? config.selectorPattern.initial(config.componentName, config.selectorPatternOptions)
    : config.selectorPattern(config.componentName, config.selectorPatternOptions);
  var combinedPattern = (config.selectorPattern.combined)
    ? config.selectorPattern.combined(config.componentName, config.selectorPatternOptions)
    : initialPattern;
  var selectors = config.rule.selectors;

  selectors.forEach(function(selector) {
    // Don't bother with :root
    if (selector === ':root') return;

    var allSequences = listSequences(selector);
    var sequence;
    for (var i = 0, l = allSequences.length; i < l; i++) {
      if (config.weakMode && i !== 0) return;
      sequence = allSequences[i];
      if (config.ignorePattern && config.ignorePattern.test(sequence)) continue;
      if (i === 0 && initialPattern.test(sequence)) continue;
      if (i !== 0 && combinedPattern.test(sequence)) continue;

      config.result.warn(
        'Invalid component selector "' + selector + '"',
        {
          node: config.rule,
          word: selector,
        }
      );
      return;
    }
  });
}
