'use strict';

/**
 * Module dependencies
 */

var selectorPatterns = require('./selector-patterns');

/**
 * Module exports
 */

module.exports = isValidSelector;

/**
 * A SelectorPatternObject defines acceptable patterns for selectors
 * in component stylesheets.
 *
 * `selector-patterns.js` contains pre-defined
 * and tested SelectorPatternObjects that the user can references by name.
 * Alternately, users can provide their own SelectorPatternObject to
 * enforce custom conventions.
 *
 * The default SelectorPatternObject is "suit".
 *
 * @typedef SelectorPatternObject
 * @type {Object}
 * @property {Function} component - Takes a component's name
 *   and returns a regular expression that matches acceptable
 *   component selectors
 * @property {RegExp} [chainable] - A regular expression that matches
 *   all selectors that can be chained to component selectors,
 *   via combinators. If undefined, any chained selector will be accepted.
 */

/**
 * @param {String} selector - The selector to test
 * @param {String} componentName - The component's name
 * @param {Boolean} strict - Whether to use strict mode
 * @param {String|SelectorPatternObject} [patternDef="suit"] - Either a string
 *   identifying a pre-defined SelectorPatternObject to use, or a custom
 *   SelectorPatternObject, as described above
 * @returns {Boolean}
 */
function isValidSelector(selector, componentName, isStrictMode, patternDef) {

  // Don't bother with :root
  if (selector === ':root') {
    return true;
  }

  patternDef = patternDef || 'suit';
  var patternObj = (typeof patternDef === 'string')
    ? selectorPatterns[patternDef]
    : patternDef;
  var componentPattern = patternObj.component(componentName);
  var chainablePattern = patternObj.chainable || /(.*)/g;
  var simpleSelectors = listSimpleSelectors(selector);

  // Error if an acceptable componentPattern does not begin the selector
  if (!componentPattern.test(simpleSelectors[0])) {
    return false;
  }

  // In strict mode, error if chained simple selectors do not match the
  // chainablePattern
  if (isStrictMode) {
    return simpleSelectors.slice(1).every(function (chainedSelector) {
      return componentPattern.test(chainedSelector)
        || chainablePattern.test(chainedSelector);
    });
  }

  return true;
}

/**
 * Extract an array of simple selectors from a selector string ---
 * all the selectors that were chained with combinators.
 *
 * CSS combinators are whitespace, >, +, ~
 * (cf. http://www.w3.org/TR/css3-selectors/#selector-syntax)
 *
 * @param {String} selector
 * @returns {String[]}
 */
function listSimpleSelectors(selector) {
  return selector.split(/[ >\+~]/).filter(function (s) {
    return s !== ''
  });
}
