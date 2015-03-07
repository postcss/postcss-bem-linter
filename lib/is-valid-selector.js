'use strict';

/**
 * Module exports
 */

module.exports = isValidSelector;

/**
 * A SelectorPattern defines acceptable patterns for selectors
 * in component stylesheets.
 *
 * `selector-patterns.js` contains pre-defined
 * and tested SelectorPatterns that the user can reference by name.
 * Alternately, users can provide their own SelectorPattern to
 * enforce custom conventions.
 *
 * The default SelectorPattern is "suit".
 *
 * A SelectorPattern can fit one of the following models:
 * - A function that accepts a component name and returns a regexp.
 *   The returned regexp will be used to test all selector sequences.
 * - An object that has the following properties:
 *   - initial: A function that accepts a component name and returns a regexp.
 *     This regexp will be used to test selector sequences at the beginning of the
 *     selector. If no chainable property is included, this function will also be
 *     used to test chained sequences.
 *   - chainable: A function that accepts a component name and returns a regexp.
 *     This regexp will be used to test selector sequences that are chained
 *     (not the first one), if they do not already match the initial pattern.
 */

/**
 * @param {String} selector - The selector to test
 * @param {String} componentName - The component's name
 * @param {Boolean} strict - Whether to use strict mode
 * @param {String|SelectorPattern} [patternDef="suit"] - Either a string
 *   identifying a pre-defined SelectorPattern to use, or a custom
 *   SelectorPattern, as described above
 * @returns {Boolean}
 */
function isValidSelector(selector, componentName, isStrictMode, selectorPattern) {

  // Don't bother with :root
  if (selector === ':root') { return true; }

  var initialPattern = (selectorPattern.initial)
    ? selectorPattern.initial(componentName)
    : selectorPattern(componentName);
  var chainablePattern = (selectorPattern.chainable)
    ? selectorPattern.chainable(componentName)
    : initialPattern;
  var simpleSelectors = listSimpleSelectors(selector);

  // Error if an acceptable initialPattern does not begin the selector
  if (!initialPattern.test(simpleSelectors[0])) { return false; }

  // In strict mode, error if chained simple selectors do not match the
  // chainablePattern
  if (isStrictMode) {
    return simpleSelectors.slice(1).every(function (chainedSelector) {
      return initialPattern.test(chainedSelector)
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
