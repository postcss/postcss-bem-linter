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
  var WORD = '[a-z0-9][a-zA-Z0-9]*';
  var descendant = '(?:-' + WORD + ')?';
  var modifier = '(?:--' + WORD + ')?';
  var attribute = '(?:\\[\\S+\\])?';
  var state = '(?:\\.is-' + WORD + ')?';
  var body = descendant +
    modifier +
    attribute +
    state;
  return new RegExp('^\\.' + ns + componentName + '\\b' + body + '$');
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
  var attribute = '(?:\\[\\S+\\])?';
  return new RegExp('^\\.' + ns + block + element + modifier + attribute + '$');
}
