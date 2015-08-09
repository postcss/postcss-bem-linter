var listSequences = require('./list-sequences');

var IGNORE_COMMENT = 'postcss-bem-linter: ignore';

/**
 * @param {Object} config
 * @param {Rule} config.rule - PostCSS Rule
 * @param {String} config.componentName
 * @param {Boolean} config.weakMode
 * @param {Object} config.selectorPattern
 * @param {Object} config.selectorPatternOptions
 * @param {Result} config.result - PostCSS Result, for registering warnings
 */
module.exports = function(config) {
  if (config.rule.parent && config.rule.parent.name === 'keyframes') return;

  var prev = config.rule.prev();
  if (
    prev
    && prev.type === 'comment'
    && prev.text === IGNORE_COMMENT
  ) return;

  var selectors = config.rule.selectors;

  selectors.forEach(function(selector) {
    if (isValid(selector)) return;
    config.result.warn(
      'Invalid component selector "' + selector + '"',
      { node: config.rule }
    );
  });

  function isValid(selector) {
    // Don't bother with :root
    if (selector === ':root') return true;

    var initialPattern = (config.selectorPattern.initial) ?
      config.selectorPattern.initial(config.componentName, config.selectorPatternOptions) :
      config.selectorPattern(config.componentName, config.selectorPatternOptions);
    var combinedPattern = (config.selectorPattern.combined) ?
      config.selectorPattern.combined(config.componentName, config.selectorPatternOptions) :
      initialPattern;
    var sequences = listSequences(selector);

    // Not valid if an initialPattern does not begin the selector
    if (!initialPattern.test(sequences[0])) return false;

    // Unless in weak mode, not valid if combined simple selectors do not match the
    // combinedPattern
    if (config.weakMode) return true;

    return sequences.slice(1).every(function(combinedSequence) {
      return initialPattern.test(combinedSequence)
        || combinedPattern.test(combinedSequence);
    });
  }
}
