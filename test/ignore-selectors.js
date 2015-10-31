var util = require('./test-util');
var assertSuccess = util.assertSuccess;
var assertSingleFailure = util.assertSingleFailure;
var selectorTester = util.selectorTester;

describe('ignoring selectors', function() {
  describe('ignore a selector with a comment', function() {
    var s = selectorTester('/** @define Foo */');

    it(
      'ignores selectors after special comments a line before',
      function() {
        assertSuccess(s('/* postcss-bem-linter: ignore */\n.Foo a'));
      }
    );

    it(
      'ignores selectors after special comments inline with the selector',
      function() {
        assertSuccess(s(
          '/* postcss-bem-linter: ignore */ .no-flexbox .Foo'
        ));
      }
    );
  });

  describe('ignore a selector with an `ignoreSelectors` pattern', function() {
    describe('that is a regular expression', function() {
      runTests(/\.isok-.+/);
    });
    describe('that is a string', function() {
      runTests('.isok-.+');
    });

    function runTests(ignoreSelectors) {
      var s = selectorTester('/** @define Foo */');
      var config = { preset: 'suit', ignoreSelectors: ignoreSelectors };

      it(
        'ignores selectors that match the `ignoreSelectors` pattern',
        function() {
          assertSuccess(s('.isok-BLERGH'), config);
        }
      );

      it(
        'ignores grouped selectors that match the `ignoreSelectors` pattern',
        function() {
          assertSuccess(s('.Foo .isok-BLERGH'), config);
        }
      );

      it(
        'rejects selectors that do not match valid pattern or `ignoreSelectors` pattern',
        function() {
          assertSingleFailure(s('.blergh'), config);
        }
      );
    }
  });

  describe('ignore a selector with an `ignoreSelectors` array of patterns', function() {
    describe('each item of which is a regular expression', function() {
      runTests([/\.isok-.+/, /#fine/]);
    });
    describe('each item of which is a string', function() {
      runTests(['.isok-.+', '#fine']);
    });

    function runTests(ignoreSelectors) {
      var s = selectorTester('/** @define Foo */');
      var config = { preset: 'suit', ignoreSelectors: ignoreSelectors };

      it(
        'ignores selectors that match any of the `ignoreSelectors` pattern',
        function() {
          assertSuccess(s('.isok-BLERGH'), config);
        }
      );

      it(
        'ignores selectors that match any of the `ignoreSelectors` pattern (take 2)',
        function() {
          assertSuccess(s('#fine'), config);
        }
      );

      it(
        'ignores grouped selectors that match any of the `ignoreSelectors` pattern',
        function() {
          assertSuccess(s('.Foo .isok-BLERGH'), config);
        }
      );

      it(
        'ignores grouped selectors that match any of the `ignoreSelectors` pattern (take 2)',
        function() {
          assertSuccess(s('.Foo #fine'), config);
        }
      );

      it(
        'rejects selectors that do not match valid pattern or `ignoreSelectors` pattern',
        function() {
          assertSingleFailure(s('.blergh'), config);
        }
      );
    }
  });

  describe('ignore utility selectors with a comment', function() {
    var config = { utilitySelectors: /\.[a-z]+/ };

    it(
      'ignores selectors after special comments a line before',
      function() {
        var css = '/** @define utilities */\n/* postcss-bem-linter: ignore */\n.394 {}'
        util.assertSuccess(css, config);
      }
    );

    it(
      'ignores selectors after special comments a line before',
      function() {
        var css = '/** @define utilities */ /* postcss-bem-linter: ignore */ .394 {}'
        util.assertSuccess(css, config);
      }
    );
  });

  describe('ignore utility selectors with an `ignoreSelectors` pattern', function() {
    describe('that is a regular expression', function() {
      runTests(/\.isok-[a-z]+$/);
    });
    describe('that is a string', function() {
      runTests('.isok-[a-z]+$');
    })

    function runTests(ignoreSelectors) {
      var configWithIgnore = {
        utilitySelectors: /\.[A-Z]+/,
        ignoreSelectors: ignoreSelectors,
      };

      it('accepts valid selectors', function() {
        util.assertSuccess('/** @define utilities */ .FOO {}', configWithIgnore);
      });

      it('rejected invalid selectors that do not match ignore pattern', function() {
        util.assertSingleFailure('/** @define utilities */ .foo {}', configWithIgnore);
      });

      it('ignores selectors that match ignore pattern', function() {
        util.assertSuccess('/** @define utilities */ .isok-bar {}', configWithIgnore);
      });
    }
  });
});
