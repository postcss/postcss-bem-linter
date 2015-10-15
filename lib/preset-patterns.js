module.exports = {
  suit: {
    componentName: /[A-Z][a-zA-Z]+/,
    componentSelectors: suitSelector,
    utilitySelectors: /^\.u(?:-[a-z][a-zA-Z0-9]*)+$/,
  },
  bem: {
    componentName: /[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*/,
    componentSelectors: bemSelector,
  },
};

/**
 * @param {String} componentName
 * @param {Object} [presetOptions]
 * @param {String} [presetOptions.namespace]
 * @returns {RegExp}
 */
function suitSelector(componentName, presetOptions) {
  var ns = (presetOptions && presetOptions.namespace) ? presetOptions.namespace + '-' : '';
  var OPTIONAL_PART = '(?:-[a-z][a-zA-Z0-9]*)?';
  var OPTIONAL_MODIFIER = '(?:--[a-z][a-zA-Z0-9]*)?';
  var OPTIONAL_ATTRIBUTE = '(?:\\[\\S+\\])?';
  var OPTIONAL_STATE = '(?:\\.is-[a-z][a-zA-Z0-9]*)?';
  var OPTIONAL = OPTIONAL_PART +
    OPTIONAL_MODIFIER +
    OPTIONAL_ATTRIBUTE +
    OPTIONAL_STATE;
  return new RegExp('^\\.' + ns + componentName + '\\b' + OPTIONAL + '$');
}

/**
 * @param {String} block
 * @returns {RegExp}
 */
function bemSelector(block) {
  var WORD = '[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*';
  var element = '(?:__' + WORD + ')?';
  var modifier = '(?:_' + WORD + '){0,2}';
  return new RegExp('^\\.' + block + element + modifier + '$');
}
