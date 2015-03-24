var util = require('./test-util');
var assertSuccess = util.assertSuccess;
var assertFailure = util.assertFailure;
var fixture = util.fixture;

describe('property validation', function () {
  it(
    'accepts custom properties that begin with the component name',
    function () {
      assertSuccess(fixture('properties-valid'));
    }
  );

  var invDef = '/** @define InvalidRootVars */';

  it('accepts an empty root', function () {
    assertSuccess(invDef + ':root {}');
  });

  it(
    'rejects custom properties that do not being with the component name',
    function () {
      assertFailure(
        invDef + ':root { --invalid-InvalidRootVars-color: green; }'
      );
    }
  );

  it('rejects invalid root properties', function () {
    assertFailure(invDef + ':root { color: green; }');
  });

  it('rejects root selectors grouped with other selectors', function () {
    assertFailure(invDef + ':root, .InvalidRootSelector {}');
  });
});
