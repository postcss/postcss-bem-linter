var util = require('./test-util');
var assertSuccess = util.assertSuccess;

var primaryRegexOnly = {
  componentName: '[a-z0-9]+(?:-[a-z0-9]+)*',
  componentSelectors: {
    initial: '^\\.[a-z0-9]+(?:-[a-z0-9]+)*(?:__[a-z0-9]+(?:-[a-z0-9]+)*)*(?:--[a-z0-9]+(?:-[a-z0-9]+)*)*$',
    combined: '^\\.[a-z0-9]+(?:-[a-z0-9]+)*(?:__[a-z0-9]+(?:-[a-z0-9]+)*)*(?:--[a-z0-9]+(?:-[a-z0-9]+)*)?|\\.(?:is|has)-[a-z0-9]+(?:-[a-z0-9]+)*$',
  },
}

var primaryInterpolated = {
  componentName: '[a-z0-9]+(?:-[a-z0-9]+)*',
  componentSelectors: {
    initial: '^\\.{componentName}(?:__{componentName})*(?:--{componentName})*$',
    combined: '^\\.{componentName}(?:__{componentName})*(?:--{componentName})?|\\.(?:is|has)-{componentName}$',
  },
}

describe('using hyphenated BEM pattern', function() {
  it('accepts valid selectors by custom RegEx', function () {
    assertSuccess(util.fixture('bem-hyphenated'), primaryRegexOnly);
  });

  it('accepts valid selectors by interpolated RegEx', function () {
    assertSuccess(util.fixture('bem-hyphenated'), primaryInterpolated);
  });
});