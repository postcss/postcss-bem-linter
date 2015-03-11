var assert = require('assert');
var linter = require('..');
var fs = require('fs');
var postcss = require('postcss');

function processCss(css, opts) {
  return postcss().use(linter(opts)).process(css);
}

function fixture(name) {
  return fs.readFileSync('test/fixtures/' + name + '.css', 'utf8').trim();
}

function assertSuccess(css, opts) {
  var result = function () {
    processCss(css, opts);
  };
  assert.doesNotThrow(result);
}

function assertFailure(css, opts) {
  var result = function () {
    processCss(css, opts);
  };
  assert.throws(result);
}

function selectorTester(def) {
  return function (selector) {
    return [ def, selector, '{}' ].join(' ');
  };
}

module.exports = {
  fixture: fixture,
  assertSuccess: assertSuccess,
  assertFailure: assertFailure,
  selectorTester: selectorTester
};
