const util = require('./test-util');

const assertSuccess = util.assertSuccess;
const assertSingleFailure = util.assertSingleFailure;

describe('ignoring custom properties', () => {
  it('without ignore, fails', () => {
    const css = '/** @define Foo */ :root { --Bar: 2px; }';
    assertSingleFailure(css);
  });

  it('ignore a custom property with a comment', () => {
    const css = '/** @define Foo */ :root { /* postcss-bem-linter: ignore */ --Bar: 2px; }';
    assertSuccess(css);
  });

  it('ignore a custom property with an ignoreCustomProperties pattern', () => {
    const config = {preset: 'suit', ignoreCustomProperties: /Bar/};
    const css = '/** @define Foo */ :root { --Bar: 2px; }';
    assertSuccess(css, config);
  });
});
