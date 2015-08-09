var util = require('./test-util');
var assertSuccess = util.assertSuccess;
var assertSingleFailure = util.assertSingleFailure;
var selectorTester = util.selectorTester;
var fixture = util.fixture;

describe('ranges', function() {
  it('two valid', function(done) {
    assertSuccess(done, fixture('ranges-two-valid'));
  });

  it('one valid, one invalid', function(done) {
    assertSingleFailure(done, fixture('ranges-one-valid-one-invalid'));
  })

  it('two valid, one invalid', function(done) {
    assertSingleFailure(done, fixture('ranges-two-valid-one-invalid'));
  })

  it('one valid that is ended, then some extra stuff', function(done) {
    assertSuccess(done, fixture('ranges-one-ended-valid'));
  });

  it('one valid that is ended, then some extra stuff, then one invalid', function(done) {
    assertSingleFailure(done, fixture('ranges-one-ended-valid-one-invalid'));
  });

  it('with verbose directives', function(done) {
    assertSuccess(done, fixture('verbose-directives'));
  })
});
