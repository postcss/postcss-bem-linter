var postcss = require('postcss');
var validateCustomProperties = require('./lib/validate-custom-properties');
var validateUtilities = require('./lib/validate-utilities');
var validateSelectors = require('./lib/validate-selectors');
var generateConfig = require('./lib/generate-config');
var toRegexp = require('./lib/to-regexp');
var path = require('path');
var minimatch = require('minimatch');

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
      if (!rule.source) return;

      var ruleStartLine = rule.source.start.line;
      ranges.forEach(function(range) {
        if (ruleStartLine < range.start) return;
        if (range.end && ruleStartLine > range.end) return;
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

    function checkGlob(file, globs) {
      if (file.indexOf(process.cwd()) === 0) {
        file = file.substr(process.cwd().length);

        if (file.charAt(0) === path.sep) {
          file = file.substr(1);
        }
      }

      return globs.reduce(function (accumulator, pattern) {
        return accumulator || minimatch(file, pattern);
      }, false);
    }

    function isImplicitComponent(file) {
      if (config.implicitComponents === true) {
        return true;

      } else if (Array.isArray(config.implicitComponents)) {
        return checkGlob(file, config.implicitComponents);
      }

      return false;
    }

    function isImplicitUtilities(file) {
      if (Array.isArray(config.implicitUtilities)) {
        return checkGlob(file, config.implicitUtilities);
      }

      return false;
    }

    function findRanges(root) {
      var ranges = [];

      var filename = root.source.input.file;
      if (isImplicitUtilities(filename)) {
        ranges.push({
          defined: 'utilities',
          start: 0,
          weakMode: false,
        });
      } else if (isImplicitComponent(filename)) {
        var defined = path.basename(filename).split('.')[0]

        if (defined !== UTILITIES_IDENT && !toRegexp(config.componentNamePattern).test(defined)) {
          result.warn(
            'Invalid component name from implicit conversion from filename ' + filename
          );
        }
        ranges.push({
          defined: defined,
          start: 0,
          weakMode: false,
        });
      }

      root.walkComments(function(comment) {
        var commentStartLine = (comment.source) ? comment.source.start.line : null;
        if (!commentStartLine) return;

        if (END_DIRECTIVE.test(comment.text)) {
          endCurrentRange(commentStartLine);
          return;
        }

        var directiveMatch = comment.text.match(DEFINE_DIRECTIVE);
        if (!directiveMatch) return;
        var defined = (directiveMatch[1] || directiveMatch[3]).trim();
        if (defined !== UTILITIES_IDENT && !toRegexp(config.componentNamePattern).test(defined)) {
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
