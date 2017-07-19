module.exports = source => {
  if (typeof source === 'string') {
    var splitSource = source.split('{componentName}');
    return componentName => {
      try {
        return new RegExp(splitSource.length > 1 ? splitSource[0] + componentName + splitSource[1] : splitSource[0]);
      } catch (e) {
        throw new Error('"' + source + '" does not produce a valid regular expression');
      }
    };
  } else {
    return source;
  }
}
