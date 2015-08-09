var postcss = require('postcss');
var validateCustomProperties = require('./lib/validate-custom-properties');
var validateUtilities = require('./lib/validate-utilities');
var validateSelectors = require('./lib/validate-selectors');
var generateConfig = require('./lib/generate-config');

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

  return function(root, result) {
    var ranges = findRanges(root);

    root.eachRule(function(rule) {
      var ruleStartLine = rule.source.start.line;
      ranges.forEach(function(range) {
        if (ruleStartLine < range.start) return;
        if (range.end && ruleStartLine > range.end) return;
        checkRule(rule, range);
      })
    });

    function checkRule(rule, range) {
      if (range.defined === UTILITIES_IDENT) {
        validateUtilities(rule, config.patterns.utilitySelectors, result);
        return;
      }
      validateCustomProperties(rule, range.defined, result);
      validateSelectors({
        rule: rule,
        componentName: range.defined,
        weakMode: range.weakMode,
        selectorPattern: config.patterns.componentSelectors,
        selectorPatternOptions: config.presetOptions,
        result: result,
      });
    }

    function findRanges(root) {
      var ranges = [];
      root.eachComment(function(comment) {
        var startLine = comment.source.start.line;

        if (END_DIRECTIVE.test(comment.text)) {
          endCurrentRange(startLine);
          return;
        }

        var directiveMatch = comment.text.match(DEFINE_DIRECTIVE);
        if (!directiveMatch) return;
        var defined = (directiveMatch[1] || directiveMatch[3]).trim();
        if (defined !== UTILITIES_IDENT && !defined.match(config.componentNamePattern)) {
          result.warn(
            'Invalid component name in definition /*' + comment + '*/',
            { node: comment }
          );
        }
        endCurrentRange(startLine);
        ranges.push({
          defined: defined,
          start: startLine,
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
