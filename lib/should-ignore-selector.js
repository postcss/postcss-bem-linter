// patterns can be a single regexp or an array of regexps
module.exports = (selector, patterns) => {
  if (!patterns) return;
  return [].concat(patterns).some(p => p.test(selector));
}
