var util = require('./test-util');
var assertSuccess = util.assertSuccess;
var assertSingleFailure = util.assertSingleFailure;
var fixture = util.fixture;

describe('property validation', function() {
  it(
    'accepts custom properties that begin with the component name',
    function(done) {
      assertSuccess(done, fixture('properties-valid'));
    }
  );

  var invDef = '/** @define InvalidRootVars */';

  it('accepts an empty root', function(done) {
    assertSuccess(done, invDef + ':root {}');
  });

  it(
    'rejects custom properties that do not being with the component name',
    function(done) {
      assertSingleFailure(done,
        invDef + ':root { --invalid-InvalidRootVars-color: green; }'
      );
    }
  );

  it('rejects invalid root declarations', function(done) {
    assertSingleFailure(done, invDef + ':root { color: green; }');
  });
});
