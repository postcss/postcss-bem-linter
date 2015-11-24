var constants = require('./constants');

module.exports = function(rule) {
  var previousNode = rule.prev();
  return (
    previousNode
    && previousNode.type === 'comment'
    && previousNode.text === constants.IGNORE_COMMENT
  );
}
