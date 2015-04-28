'use strict';

/**
 * Module dependencies
 */

var postcss = require('postcss');
var validateCustomProperties = require('./lib/validate-properties');
var validateUtilities = require('./lib/validate-utilities');
var validateSelectors = require('./lib/validate-selectors');
var validateRules = require('./lib/validate-rules');
var presetPatterns = require('./lib/preset-patterns');

var RE_DIRECTIVE = /\*\s*@define ([-_a-zA-Z0-9]+)\s*(?:;\s*(weak))?\s*/;
var UTILITIES_IDENT = 'utilities';

/**
 * Check patterns or setup defaults. If the input CSS does not have a
 * directive defining a component name according to the specified pattern,
 * do nothing -- or warn, if the directive is there but the name does not match.
 * Then call all of the validators.
 *
 * @param {Object} [patterns = 'suit']
 * @param {RegExp} [patterns.componentName]
 * @param {RegExp} [patterns.utilitySelectors]
 * @param {Object|Function} [patterns.componentSelectors]
 * @param {Object} [opts] - Options that are can be used by
 *   a pattern (e.g. `namespace`)
 */
module.exports = postcss.plugin(
  'postcss-bem-linter',
  function (patterns, opts) {
    patterns = patterns || 'suit';
    if (typeof patterns === 'string') {
      patterns = presetPatterns[patterns];
    }
    var componentNamePattern = patterns.componentName || /[-_a-zA-Z0-9]+/;

    return function (styles, result) {
      return new Promise(function (resolve) {
        var firstNode = styles.nodes[0];
        if (!firstNode || firstNode.type !== 'comment') { resolve(); }

        var initialComment = firstNode.text;
        if (!initialComment || !initialComment.match(RE_DIRECTIVE)) {
          resolve();
        }

        var defined = initialComment.match(RE_DIRECTIVE)[1].trim();
        var isUtilities = defined === UTILITIES_IDENT;
        if (!isUtilities && !defined.match(componentNamePattern)) {
          result.warn(
            'Invalid component name in definition /*' + initialComment + '*/',
            { node: firstNode }
          );
        }

        var weakMode = initialComment.match(RE_DIRECTIVE)[2] === 'weak';

        validateRules(styles, result);
        if (isUtilities) {
          validateUtilities(styles, patterns.utilitySelectors, result);
        } else {
          validateSelectors(
            styles, defined, weakMode, patterns.componentSelectors, opts, result
          );
        }
        validateCustomProperties(styles, defined, result);
        resolve();
      });
    };
  }
);
