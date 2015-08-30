var assert = require('assert');
var linter = require('..');
var fs = require('fs');
var postcss = require('postcss');

function processCss(css, primary, secondary) {
  // Call then() at the end to make the LazyResult evaluate
  return postcss().use(linter(primary, secondary)).process(css);
}

function fixture(name) {
  return fs.readFileSync('test/fixtures/' + name + '.css', 'utf8').trim();
}

function assertSuccess(done, css, primary, secondary) {
  processCss(css, primary, secondary).then(function(result) {
    assert.equal(result.warnings().length, 0);
    done();
  }).catch(done);
}

function assertSingleFailure(done, css, primary, secondary) {
  processCss(css, primary, secondary).then(function(result) {
    assert(result.warnings().length === 1);
    done();
  }).catch(done);
}

function assertFailure(done, css, primary, secondary) {
  processCss(css, primary, secondary).then(function(result) {
    assert(result.warnings().length > 0);
    done();
  }).catch(done);
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
  test: processCss,
};
