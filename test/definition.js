var util = require('./test-util');
var assertSuccess = util.assertSuccess;

describe('`@define` notation', function () {
  describe('CSS that lacks a definition', function () {
    it('must be ignored', function () {
      assertSuccess('.horse { color: pink; }');
    });
  });

  describe('CSS with a malformed definition', function () {
    it('must be ignored', function () {
      assertSuccess('/** @deforne Foo */ .Foo { color: pink; }')
    });
  });
});
