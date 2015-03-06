'use strict';

/**
 * Module exports
 */

module.exports = isValidRule;

/**
 * @param {Object} rule
 */

function isValidRule(rule) {
  var selector = rule.selector;
  return (selector === ':root' || selector.indexOf(':root') === -1);
}
