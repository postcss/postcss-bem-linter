'use strict';

/**
 * Module exports
 */

module.exports = isValidSelector;

/**
 * A SelectorPattern defines acceptable patterns for selector sequences
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
 *   - initial: A function that accepts a component name and returns
 *   	 a regexp. This regexp will be used to test selector sequences
 *   	 at the beginning of the selector (before any combinators).
 *   	 If no combined property is included, this function will also
 *   	 be used to test sequences after combinators.
 *   - combined: A function that accepts a component name and returns
 *   	 a regexp. This regexp will be used to test selector sequences
 *   	 that come after combinators, if they do not already
 *   	 match the initial pattern.
 */

/**
 * @param {String} selector - The selector to test
 * @param {String} componentName - The component's name
 * @param {Boolean} isStrictMode - Whether to use strict mode
 * @param {String|SelectorPattern} [pattern="suit"] - Either a string
 *   identifying a pre-defined SelectorPattern to use, or a custom
 *   SelectorPattern, as described above
 * @returns {Boolean}
 */
function isValidSelector(selector, componentName, isStrictMode, pattern) {

  // Don't bother with :root
  if (selector === ':root') { return true; }

  var initialPattern = (pattern.initial) ?
    pattern.initial(componentName) :
    pattern(componentName);
  var combinedPattern = (pattern.combined) ?
    pattern.combined(componentName) :
    initialPattern;
  var sequences = listSequences(selector);

  // Error if an acceptable initialPattern does not begin the selector
  if (!initialPattern.test(sequences[0])) { return false; }

  // In strict mode, error if combined simple selectors do not match the
  // combinedPattern
  if (isStrictMode) {
    return sequences.slice(1).every(function (combinedSequence) {
      return initialPattern.test(combinedSequence) ||
      combinedPattern.test(combinedSequence);
    });
  }

  return true;
}

/**
 * Extract an array of selector sequences from a selector string ---
 * all the sequences that were combined via combinators.
 *
 * CSS combinators are whitespace, >, +, ~
 * (cf. http://www.w3.org/TR/css3-selectors/#selector-syntax)
 *
 * Ignore pseudo-selectors ... by presuming they come at the end of the
 * sequence and cutting them off from the string that gets checked.
 *
 * @param {String} selector
 * @returns {String[]}
 */
function listSequences(selector) {
  return selector
    .split(/[\s>+~]/)
    .filter(function (s) {
      return s !== '';
    })
    .map(function (s) {
      return s.split(':')[0];
    });
}
