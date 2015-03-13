var util = require('./test-util');
var assertSuccess = util.assertSuccess;
var assertFailure = util.assertFailure;

describe('rule validation', function () {
  it('allows `:root` not grouped with other selectors', function () {
    assertSuccess('/** @define Foo */ :root {} .Foo {}');
  });

  it('errors if `:root` is grouped with other selectors', function () {
    assertFailure('/** @define Foo */ :root, .Foo {}');
  });
});
