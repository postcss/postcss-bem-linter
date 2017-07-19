var util = require('./test-util');
var assertSuccess = util.assertSuccess;
var assertSingleFailure = util.assertSingleFailure;
var selectorTester = util.selectorTester;

describe('ignoring custom properties', () => {
  it('without ignore, fails', () => {
    var css = '/** @define Foo */ :root { --Bar: 2px; }';
    assertSingleFailure(css);
  });

  it('ignore a custom property with a comment', () => {
    var css = '/** @define Foo */ :root { /* postcss-bem-linter: ignore */ --Bar: 2px; }';
    assertSuccess(css);
  });

  it('ignore a custom property with an ignoreCustomProperties pattern', () => {
    var config = { preset: 'suit', ignoreCustomProperties: /Bar/ };
    var css = '/** @define Foo */ :root { --Bar: 2px; }';
    assertSuccess(css, config);
  });
});
