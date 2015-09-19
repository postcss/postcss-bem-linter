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
      util.assertSuccess(done, '/** @define utilities */ .foo {}', config);
    });

    it('rejects valid selectors', function(done) {
      util.assertSingleFailure(done, '/** @define utilities */ .FOO {}', config);
    });

    describe('and a `ignoreSelectors` pattern', function() {
      var configWithIgnore = {
        utilitySelectors: /\.[A-Z]+/,
        ignoreSelectors: /\.isok-[a-z]+/,
      };

      it('accepts valid selectors', function(done) {
        util.assertSuccess(done, '/** @define utilities */ .FOO {}', configWithIgnore);
      });

      it('rejected invalid selectors that do not match ignore pattern', function(done) {
        util.assertSingleFailure(done, '/** @define utilities */ .foo {}', configWithIgnore);
      });

      it('ignores selectors that match ignore pattern', function(done) {
        util.assertSuccess(done, '/** @define utilities */ .isok-bar {}', configWithIgnore);
      });
    });
  });

  describe('ignore a rule with a comment', function() {
    var config = { utilitySelectors: /\.[a-z]+/ };

    it(
      'ignores selectors after special comments a line before',
      function(done) {
        var css = '/** @define utilities */\n/* postcss-bem-linter: ignore */\n.394 {}'
        util.assertSuccess(done, css, config);
      }
    );

    it(
      'ignores selectors after special comments a line before',
      function(done) {
        var css = '/** @define utilities */ /* postcss-bem-linter: ignore */ .394 {}'
        util.assertSuccess(done, css, config);
      }
    );
  });
});
