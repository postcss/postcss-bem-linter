var util = require('./test-util');
var assertSuccess = util.assertSuccess;
var assertSingleFailure = util.assertSingleFailure;

describe('rule validation', function () {
  it('allows `:root` not grouped with other selectors', function (done) {
    assertSuccess(done, '/** @define Foo */ :root {} .Foo {}');
  });

  it('errors if `:root` is grouped with other selectors', function (done) {
    assertSingleFailure(done, '/** @define Foo */ :root, .Foo {}');
  });
});
