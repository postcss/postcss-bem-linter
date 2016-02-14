var util = require('./test-util');
var assertSuccess = util.assertSuccess;
var assertSingleFailure = util.assertSingleFailure;
var selectorTester = util.selectorTester;
var fixture = util.fixture;

describe('ranges', function() {
  it('two valid', function() {
    assertSuccess(fixture('ranges-two-valid'));
  });

  it('one valid, one invalid', function() {
    assertSingleFailure(fixture('ranges-one-valid-one-invalid'));
  });

  it('two valid, one invalid', function() {
    assertSingleFailure(fixture('ranges-two-valid-one-invalid'));
  });

  it('one valid that is ended, then some extra stuff', function() {
    assertSuccess(fixture('ranges-one-ended-valid'));
  });

  it('one valid that is ended, then some extra stuff, then one invalid', function() {
    assertSingleFailure(fixture('ranges-one-ended-valid-one-invalid'));
  });

  it('with verbose directives', function() {
    assertSuccess(fixture('verbose-directives'));
  });
});
