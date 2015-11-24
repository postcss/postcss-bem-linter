var constants = require('./constants');

// patterns can be a single regexp or an array of regexps
module.exports = function(customProperty, declaration, patterns) {
  var previousNode = declaration.prev();
  if (
    previousNode
    && previousNode.type === 'comment'
    && previousNode.text === constants.IGNORE_COMMENT
  ) return true;

  if (!patterns) return;

  return [].concat(patterns).some(function(p) {
    return p.test(customProperty);
  });
}
