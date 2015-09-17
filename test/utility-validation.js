var assert = require('assert');
var util = require('./test-util');

describe('utility validation', function() {
  describe('with no `utilitySelectors` pattern', function() {
    it('throws an error', function(done) {
      util.test('/** @define utilities */ .foo {}', {})
        .catch(function(err) {
          assert.equal(err.message.indexOf('You tried to `@define utilities`'), 0);
          done();
        });
    });
  });

  describe('with a `utilitySelectors` pattern', function() {
    var config = { utilitySelectors: /\.[a-z]+/ };

    it('accepts valid selectors', function(done) {
      util.test('/** @define utilities */ .foo {}', config)
        .then(function() {
          done();
        });
    });

    it('rejects valid selectors', function(done) {
      util.assertSingleFailure(done, '/** @define utilities */ .FOO {}', config);
    });
  });
});
