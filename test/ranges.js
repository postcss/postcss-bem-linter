'use strict';

const util = require('./test-util');
const assertSuccess = util.assertSuccess;
const assertSingleFailure = util.assertSingleFailure;
const selectorTester = util.selectorTester;
const fixture = util.fixture;

describe('ranges', () => {
  it('two valid', () => {
    assertSuccess(fixture('ranges-two-valid'));
  });

  it('one valid, one invalid', () => {
    assertSingleFailure(fixture('ranges-one-valid-one-invalid'));
  });

  it('two valid, one invalid', () => {
    assertSingleFailure(fixture('ranges-two-valid-one-invalid'));
  });

  it('one valid that is ended, then some extra stuff', () => {
    assertSuccess(fixture('ranges-one-ended-valid'));
  });

  it('one valid that is ended, then some extra stuff, then one invalid', () => {
    assertSingleFailure(fixture('ranges-one-ended-valid-one-invalid'));
  });

  it('with verbose directives', () => {
    assertSuccess(fixture('verbose-directives'));
  });
});
