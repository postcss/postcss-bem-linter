'use strict';

const toRegexp = require('./to-regexp');

/**
 * @param {String} filename
 * @param {Object} config
 * @param {String} config.componentNamePattern
 */
module.exports = (filename, config) => {
  const {componentNamePattern} = config;

  if (toRegexp(componentNamePattern).test(filename)) return filename;

  for (let i = 0; i < filename.length; i++) {
    const part = filename.slice(0, -i);
    if (toRegexp(componentNamePattern).test(part)) return part;
  }

  return filename;
};
