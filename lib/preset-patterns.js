module.exports = {
  suit: {
    componentName: /[A-Z][a-zA-Z0-9]+/,
    componentSelectors: suitSelector,
    utilitySelectors: /^\.u(?:-[a-z0-9][a-zA-Z0-9]*)+$/,
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
  var OPTIONAL_PART = '(?:-[a-z0-9][a-zA-Z0-9]*)?';
  var OPTIONAL_MODIFIER = '(?:--[a-z0-9][a-zA-Z0-9]*)?';
  var OPTIONAL_ATTRIBUTE = '(?:\\[\\S+\\])?';
  var OPTIONAL_STATE = '(?:\\.is-[a-z0-9][a-zA-Z0-9]*)?';
  var OPTIONAL = OPTIONAL_PART +
    OPTIONAL_MODIFIER +
    OPTIONAL_ATTRIBUTE +
    OPTIONAL_STATE;
  return new RegExp('^\\.' + ns + componentName + '\\b' + OPTIONAL + '$');
}

/**
 * @param {String} block
 * @param {Object} [presetOptions]
 * @param {String} [presetOptions.namespace]
 * @returns {RegExp}
 */
function bemSelector(block, presetOptions) {
  var ns = (presetOptions && presetOptions.namespace) ? presetOptions.namespace + '-': '';
  var WORD = '[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*';
  var element = '(?:__' + WORD + ')?';
  var modifier = '(?:_' + WORD + '){0,2}';
  return new RegExp('^\\.' + ns + block + element + modifier + '$');
}
