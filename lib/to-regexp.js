module.exports = function(source) {
  if (Array.isArray(source)) {
    return source.map(regexpify);
  } else {
    return regexpify(source);
  }
};

function regexpify(source) {
  if (typeof source === 'string') {
    if (!source.length) {
      throw new Error('`ignorePattern` is empty');
    }

    try {
      return new RegExp(source);
    } catch (e) {
      throw new Error('"' + source + '" is not a valid regular expression');
    }
  } else {
    return source;
  }
}
