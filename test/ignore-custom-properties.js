var util = require('./test-util');
var assertSuccess = util.assertSuccess;
var assertSingleFailure = util.assertSingleFailure;
var selectorTester = util.selectorTester;

describe('ignoring custom properties', function() {
  it('without ignore, fails', function() {
    var css = '/** @define Foo */ :root { --Bar: 2px; }';
    assertSingleFailure(css);
  });

  it('ignore a custom property with a comment', function() {
    var css = '/** @define Foo */ :root { /* postcss-bem-linter: ignore */ --Bar: 2px; }';
    assertSuccess(css);
  });

  it('ignore a custom property with an ignoreCustomProperties pattern', function() {
    var config = { preset: 'suit', ignoreCustomProperties: /Bar/ };
    var css = '/** @define Foo */ :root { --Bar: 2px; }';
    assertSuccess(css, config);
  });
});
