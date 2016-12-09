var assert = require('assert');
var path = require('path');
var linter = require('..');
var fs = require('fs');
var postcss = require('postcss');

function getPostcssResult(css, primary, secondary, filename) {
  var result = postcss()
    .use(linter(primary, secondary))
    .process(css, {from: filename});
  return result;
}

function fixture(name) {
  return fs.readFileSync(path.join(__dirname, 'fixtures', name + '.css'), 'utf8').trim();
}

function assertSuccess(css, primary, secondary, filename) {
  var result = getPostcssResult(css, primary, secondary, filename);
  assert.equal(result.warnings().length, 0);
}

function assertSingleFailure(css, primary, secondary, filename) {
  var result = getPostcssResult(css, primary, secondary, filename);
  assert.equal(result.warnings().length, 1);
}

function assertFailure(css, primary, secondary, filename) {
  var result = getPostcssResult(css, primary, secondary, filename);
  assert.ok(result.warnings().length > 0);
}

function selectorTester(def) {
  return function(selector) {
    return def + '\n' + selector + ' {}';
  };
}

module.exports = {
  fixture: fixture,
  assertSuccess: assertSuccess,
  assertFailure: assertFailure,
  assertSingleFailure: assertSingleFailure,
  selectorTester: selectorTester,
  test: getPostcssResult,
};
