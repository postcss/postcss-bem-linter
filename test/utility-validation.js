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
    var config = { utilitySelectors: /\.[a-z]+/ };

    it('accepts valid selectors', function() {
      util.assertSuccess('/** @define utilities */ .foo {}', config);
    });

    it('rejects valid selectors', function() {
      util.assertSingleFailure('/** @define utilities */ .FOO {}', config);
    });
  });
});
