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
      var ignoreString = {
        utilitySelectors: /\.[A-Z]+/,
        ignoreSelectors: '\\.isok-[a-z]+',
      };
      var badIgnoreString = {
        utilitySelectors: /\.[A-Z]+/,
        ignoreSelectors: '(',
      };
      var emptyIgnoreString = {
        utilitySelectors: /\.[A-Z]+/,
        ignoreSelectors: '',
      };

      it('accepts valid selectors', function(done) {
        var css = '/** @define utilities */ .FOO {}';

        util.assertSuccess(function () {
          util.assertSuccess(done, css, ignoreString);
        }, css, configWithIgnore);
      });

      it('rejected invalid selectors that do not match ignore pattern', function(done) {
        var css = '/** @define utilities */ .foo {}';

        util.assertSingleFailure(function () {
          util.assertSingleFailure(done, css, ignoreString);
        }, css, configWithIgnore);
      });

      it('ignores selectors that match ignore pattern', function(done) {
        var css = '/** @define utilities */ .isok-bar {}';

        util.assertSuccess(function () {
          util.assertSuccess(done, css, ignoreString);
        }, css, configWithIgnore);
      });

      it('rejects invalid regexp string', function(done) {
        util.test('/** @define utilities */ .isok-bar {}', badIgnoreString)
          .catch(function(err) {
            var expected = badIgnoreString.ignoreSelectors + ' is not a valid regex';
            assert.equal(err.message, expected);
            done();
          });
      });

      it('rejects empty regexp string', function(done) {
        util.test('/** @define utilities */ .isok-bar {}', badIgnoreString)
          .catch(function(err) {
            assert.notEqual(err.message, '`ignorePattern` is empty');
            done();
          });
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
