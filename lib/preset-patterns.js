'use strict';

/**
 * Module exports
 */

module.exports = {
  suit: {
    componentName: /[A-Z][a-zA-Z]+/,
    selectors: suitSelector
  },
  bem: {
    componentName: /[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*/,
    selectors: bemSelector
  }
};

/**
 * @param {String} componentName
 * @returns {RegExp}
 */
function suitSelector(componentName) {
  var OPTIONAL_PART =  '(?:-[a-zA-Z0-9]+)?';
  var OPTIONAL_MODIFIER = '(?:--[a-zA-Z0-9]+)?';
  var OPTIONAL_STATE = '(?:\\.is-[a-zA-Z0-9]+)?';
  var OPTIONAL = OPTIONAL_PART + OPTIONAL_MODIFIER + OPTIONAL_STATE;
  return new RegExp('^\\.' + componentName + '\\b' + OPTIONAL + '$');
}

/**
 * @param {String} block
 * @returns {RegExp}
 */
function bemSelector(block) {
  var WORD = '[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*';
  var element = '(?:__' + WORD + ')';
  var modifier = '(?:(?:_' + WORD + '){1,2})';
  return new RegExp(
    '^\\.' + block + modifier + '?$' +
    '|^\\.' + block + element + modifier + '?$'
  );
}
