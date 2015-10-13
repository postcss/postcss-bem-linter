// patterns can be a single regexp or an array of regexps
module.exports = function(selector, patterns) {
  return [].concat(patterns).some(function(p) {
    return p.test(selector);
  });
}
