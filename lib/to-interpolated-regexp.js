module.exports = function(source) {
  if (typeof source === 'string') {
    var splitSource = source.split('{componentName}');
    return function(componentName) {
      try {
        return new RegExp(splitSource.join(componentName));
      } catch (e) {
        throw new Error('"' + source + '" does not produce a valid regular expression');
      }
    }
  } else {
    return source;
  }
}
