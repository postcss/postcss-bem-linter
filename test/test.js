var assert = require('assert');
var linter = require('..');
var fs = require('fs');
var postcss = require('postcss');

function processFixture(name) {
  var css = fs.readFileSync('test/fixtures/' + name + '.css', 'utf8').trim();
  return postcss().use(linter()).process(css);
}

function assertSuccess(fixture) {
  var result = function () {
    processFixture(fixture);
  };
  assert.doesNotThrow(result);
}

function assertFailure(fixture) {
  var result = function () {
    processFixture(fixture);
  };
  assert.throws(result);
}

describe('linting', function () {
  describe('a CSS file that lacks the `@define` notation', function () {
    it('must be ignored', function () {
      assertSuccess('all-ignore');
    });
  });

  describe('`@define` notation', function () {
    it('selectors must begin with the component name', function () {
      assertSuccess('valid-rules');
      assertFailure('all-false-match');
      assertFailure('all-invalid-selector-tag');
      assertFailure('all-invalid-selector-component');
    });

    it('custom properties must begin with the component name', function () {
      assertSuccess('all-valid-root-vars');
      assertFailure('all-invalid-root-vars');
      assertFailure('all-invalid-root-property');
      assertFailure('all-invalid-root-selector');
    });

    it('must apply to selectors in media queries', function () {
      assertSuccess('all-valid-selector-in-media-query');
      assertFailure('all-invalid-selector-in-media-query');
    });
  });

  describe('strict `@define` notation', function () {
    it('selectors must only contain valid component classes', function () {
      assertSuccess('strict-valid-rules');
      assertFailure('strict-invalid-selector');
    });
  });
});
