module.exports = function(source) {
  if (typeof source === 'string') {
    var splitSource = source.split('{componentName}');
    return function(componentName) {
      try {
        return new RegExp(splitSource[0] + componentName + splitSource[1]);
      } catch (e) {
        throw new Error('"' + source + '" does not produce a valid regular expression');
      }
    }
  } else {
    return source;
  }
}
