'use strict';

const assert = require('assert');
const util = require('./test-util');

describe('utility validation', () => {
  describe('with no `utilitySelectors` pattern', () => {
    it('throws an error', () => {
      util.test('/** @define utilities */ .foo {}', {})
        .catch((err) => {
          assert.equal(err.message.indexOf('You tried to `@define utilities`'), 0);
        });
    });
  });

  describe('with a `utilitySelectors` pattern', () => {
    describe('as a regular expression', () => {
      runTests(/\.[a-z]+/);
    });
    describe('as a string', () => {
      runTests('.[a-z]+');
    });

    function runTests(utilitySelectors) {
      const config = {utilitySelectors};

      it('accepts valid selectors', () => {
        util.assertSuccess('/** @define utilities */ .foo {}', config);
      });

      it('rejects valid selectors', () => {
        util.assertSingleFailure('/** @define utilities */ .FOO {}', config);
      });
    }
  });

  describe('with @keyframes rule', () => {
    it('does not complain about keyframe selectors', () => {
      util.assertSuccess('/** @define utilities */ @keyframes fade { 0% { opacity: 0; } 100% { opacity: 1; } }');
    });
  });
});
