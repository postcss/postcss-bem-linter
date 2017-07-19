var constants = require('./constants');

module.exports = rule => {
  var previousNode = rule.prev();
  return (
    previousNode
    && previousNode.type === 'comment'
    && previousNode.text === constants.IGNORE_COMMENT
  );
}
