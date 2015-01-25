'use strict';

/**
 * Module exports
 */

module.exports = {
  suit: {
    component: suitSelector,
    chainable: /\.[a-zA-Z][a-zA-Z0-9-]*/g
  }
};

/**
 * @param {String} componentName
 * @returns {RegExp}
 */
function suitSelector(componentName) {
  var OPTIONAL_PART =  '(?:\\-[a-zA-Z0-9]+)?';
  var OPTIONAL_MODIFIER = '(?:\\-\\-[a-zA-Z0-9]+)?';
  var OPTIONAL_STATE = '(?:\\.is\\-[a-zA-Z0-9]+)?';
  var OPTIONAL = OPTIONAL_PART + OPTIONAL_MODIFIER + OPTIONAL_STATE;
  return new RegExp('\\.' + componentName + '\\b' + OPTIONAL, 'g');
}
