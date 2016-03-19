var util = require('./test-util');

describe('`@define` notation', function() {
  describe('empty CSS', function() {
    it('must be ignored', function() {
      util.assertSuccess('');
    });
  });

  describe('CSS that lacks a definition', function() {
    it('must be ignored', function() {
      util.assertSuccess('.horse { color: pink; }');
    });
  });

  describe('CSS with a malformed definition', function() {
    it('must be ignored', function() {
      util.assertSuccess('/** @deforne Foo */ .Foo { color: pink; }');
    });
  });

  describe('CSS with a definition violating the `componentName` pattern', function() {
    it('must complain', function() {
      util.assertSingleFailure('/** @define my-_-__Component */ .my-_-__Component { color: pink; }');
    });
  });
});
