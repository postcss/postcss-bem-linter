var assert = require('assert');
var linter = require('..');
var fs = require('fs');
var postcss = require('postcss');

function processFixture(name, opts) {
  var css = fs.readFileSync('test/fixtures/' + name + '.css', 'utf8').trim();
  return postcss().use(linter(opts)).process(css);
}

function assertSuccess(fixture, opts) {
  var result = function () {
    processFixture(fixture, opts);
  };
  assert.doesNotThrow(result);
}

function assertFailure(fixture, opts) {
  var result = function () {
    processFixture(fixture, opts);
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

describe('linting alternate patterns', function () {
  describe('a user-defined pattern', function () {
    assertSuccess('strict-valid-altpattern', function(componentName) {
      var OPTIONAL_PART =  '(?:\\-[a-zA-Z0-9]+)?';
      var OPTIONAL_MODIFIER = '(?:\\-\\-[a-zA-Z0-9]+)?';
      var OPTIONAL_STATE = '(?:\\.is\\-[a-zA-Z0-9]+)?';
      var OPTIONAL = OPTIONAL_PART + OPTIONAL_MODIFIER + OPTIONAL_STATE;
      return new RegExp('\\.nm-' + componentName + '\\b' + OPTIONAL, 'g');
    });
  });
});
