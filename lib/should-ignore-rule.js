var IGNORE_COMMENT = 'postcss-bem-linter: ignore';

module.exports = function(rule) {
  var prev = rule.prev();
  return (
    prev
    && prev.type === 'comment'
    && prev.text === IGNORE_COMMENT
  );
}
