// patterns can be a single regexp or an array of regexps
module.exports = function(selector, patterns) {
  patterns = [].concat(patterns).map(function(p) {
    if (typeof p === 'string') {
      if (!p.length) {
        throw (new Error('`ignorePattern` is empty'));
      }

      try {
        p = new RegExp(p);
      } catch (err) {
        throw (new Error(p + ' is not a valid regex'));
      }
    }

    return p;
  });

  return patterns.some(function(p) {
    return p.test(selector);
  });
}
