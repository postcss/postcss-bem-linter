var util = require('./test-util');
var assertSuccess = util.assertSuccess;
var assertSingleFailure = util.assertSingleFailure;
var selectorTester = util.selectorTester;

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
  var s = selectorTester('/** @define Foo */');
  var config = { preset: 'suit', ignoreSelectors: /\.isok-.+/ };

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
});

describe('ignore a selector with an `ignoreSelectors` array of patterns', function() {
  var s = selectorTester('/** @define Foo */');
  var config = { preset: 'suit', ignoreSelectors: [/\.isok-.+/, /#fine/] };

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
