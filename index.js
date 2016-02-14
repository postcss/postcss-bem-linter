var postcss = require('postcss');
var validateCustomProperties = require('./lib/validate-custom-properties');
var validateUtilities = require('./lib/validate-utilities');
var validateSelectors = require('./lib/validate-selectors');
var generateConfig = require('./lib/generate-config');
var toRegexp = require('./lib/to-regexp');

var DEFINE_VALUE = '([-_a-zA-Z0-9]+)\\s*(?:;\\s*(weak))?';
var DEFINE_DIRECTIVE = new RegExp(
  '(?:\\*\\s*@define ' + DEFINE_VALUE + ')|' +
  '(?:\\s*postcss-bem-linter: define ' + DEFINE_VALUE + ')\\s*'
);
var END_DIRECTIVE = new RegExp(
  '(?:\\*\\s*@end\\s*)|' +
  '(?:\\s*postcss-bem-linter: end)\\s*'
);
var UTILITIES_IDENT = 'utilities';
var WEAK_IDENT = 'weak';

/**
 * Set things up and call the validators.
 *
 * If the input CSS does not have any
 * directive defining a component name according to the specified pattern,
 * do nothing -- or warn, if the directive is there but the name does not match.
 *
 * @param {Object|String} primaryOptions
 * @param {Object} [secondaryOptions]
 */
module.exports = postcss.plugin('postcss-bem-linter', function(primaryOptions, secondaryOptions) {
  var config = generateConfig(primaryOptions, secondaryOptions);
  var patterns = config.patterns;

  return function(root, result) {
    var ranges = findRanges(root);

    root.walkRules(function(rule) {
      if (rule.parent && rule.parent.name === 'keyframes') return;

      var ruleStartLine = (rule.source) ? rule.source.start.line : null;
      ranges.forEach(function(range) {
        if (ruleStartLine && ruleStartLine < range.start) return;
        if (ruleStartLine && range.end && ruleStartLine > range.end) return;
        checkRule(rule, range);
      })
    });

    function checkRule(rule, range) {
      if (range.defined === UTILITIES_IDENT) {
        if (!patterns.utilitySelectors) {
          throw new Error(
            'You tried to `@define utilities` but have not provided ' +
            'a `utilitySelectors` pattern'
          );
        }
        validateUtilities({
          rule: rule,
          utilityPattern: toRegexp(patterns.utilitySelectors),
          ignorePattern: toRegexp(patterns.ignoreSelectors),
          result: result,
        });
        return;
      }

      if (!patterns.componentSelectors) {
        throw new Error(
          'You tried to `@define` a component but have not provided ' +
          'a `componentSelectors` pattern'
        );
      }
      validateCustomProperties({
        rule: rule,
        componentName: range.defined,
        result: result,
        ignorePattern: toRegexp(patterns.ignoreCustomProperties),
      });
      validateSelectors({
        rule: rule,
        componentName: range.defined,
        weakMode: range.weakMode,
        selectorPattern: patterns.componentSelectors,
        selectorPatternOptions: config.presetOptions,
        ignorePattern: toRegexp(patterns.ignoreSelectors),
        result: result,
      });
    }

    function findRanges(root) {
      var ranges = [];
      root.walkComments(function(comment) {
        var commentStartLine = (comment.source) ? comment.source.start.line : 0;

        if (END_DIRECTIVE.test(comment.text)) {
          endCurrentRange(commentStartLine);
          return;
        }

        var directiveMatch = comment.text.match(DEFINE_DIRECTIVE);
        if (!directiveMatch) return;
        var defined = (directiveMatch[1] || directiveMatch[3]).trim();
        if (defined !== UTILITIES_IDENT && !defined.match(toRegexp(config.componentNamePattern))) {
          result.warn(
            'Invalid component name in definition /*' + comment + '*/',
            { node: comment }
          );
        }
        endCurrentRange(commentStartLine);
        ranges.push({
          defined: defined,
          start: commentStartLine,
          weakMode: directiveMatch[2] === WEAK_IDENT,
        });
      });
      return ranges;

      function endCurrentRange(line) {
        if (!ranges.length) return;
        var lastRange = ranges[ranges.length - 1];
        if (lastRange.end) return;
        lastRange.end = line;
      }
    }
  };
});
