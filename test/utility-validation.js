var assert = require('assert');
var util = require('./test-util');

describe('utility validation', function() {
  describe('with no `utilitySelectors` pattern', function() {
    it('throws an error', function() {
      util.test('/** @define utilities */ .foo {}', {})
        .catch(function(err) {
          assert.equal(err.message.indexOf('You tried to `@define utilities`'), 0);
        });
    });
  });

  describe('with a `utilitySelectors` pattern', function() {
    describe('as a regular expression', function() {
      runTests(/\.[a-z]+/);
    });
    describe('as a string', function() {
      runTests('.[a-z]+');
    });

    function runTests(utilitySelectors) {
      var config = { utilitySelectors: utilitySelectors };

      it('accepts valid selectors', function() {
        util.assertSuccess('/** @define utilities */ .foo {}', config);
      });

      it('rejects valid selectors', function() {
        util.assertSingleFailure('/** @define utilities */ .FOO {}', config);
      });
    }
  });
});
