const util = require('./test-util');

const assertSuccess = util.assertSuccess;
const assertSingleFailure = util.assertSingleFailure;
const fixture = util.fixture;

describe('property validation', () => {
  it(
    'accepts custom properties that begin with the component name',
    () => {
      assertSuccess(fixture('properties-valid'));
    }
  );

  const invDef = '/** @define InvalidRootVars */';

  it('accepts an empty root', () => {
    assertSuccess(`${invDef}:root {}`);
  });

  it(
    'rejects custom properties that do not being with the component name',
    () => {
      assertSingleFailure(`${invDef}:root { --invalid-InvalidRootVars-color: green; }`);
    }
  );
});
