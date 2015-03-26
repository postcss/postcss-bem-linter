var util = require('./test-util');
var assertSuccess = util.assertSuccess;
var assertFailure = util.assertFailure;
var selectorTester = util.selectorTester;
var fixture = util.fixture;

describe('using SUIT pattern (default)', function () {
  it('accepts valid component classes', function () {
    assertSuccess(fixture('suit-valid'));
  });

  var s = selectorTester('/** @define Foo */');

  it('selectors must begin with the component name', function () {
    assertFailure(s('.potentialFalseMatch'));
    assertFailure(s('div'));
    assertFailure(s('.Error'));
  });

  it('understands namespaces', function () {
    assertSuccess(s('.ns-Foo'), 'suit', { namespace: 'ns' });
    assertFailure(s('.Foo'), 'suit', { namespace: 'ns' });
    assertSuccess(s('.Ho04__d-Foo'), 'suit', { namespace: 'Ho04__d' });
  });

  it('rejects invalid combined classes', function () {
    var sInvalid = selectorTester('/** @define StrictInvalidSelector */');
    assertFailure(sInvalid('.StrictInvalidSelector .Another'));
  });

  it('deals fairly with utility classes', function () {
    var sUtil = util.selectorTester('/** @define utilities */');
    assertSuccess(sUtil('.u-foo'));
    assertSuccess(sUtil('.u-fooBar'));
    assertSuccess(sUtil('.u-fooBar17'));
    assertFailure(sUtil('.Foo'));
    assertFailure(sUtil('.u-Foo'));
  });

  describe('in weak mode', function () {
    it('accepts arbitrary combined classes', function () {
      var sWeak = selectorTester('/** @define ValidRules; weak */');
      assertSuccess(sWeak('.ValidRules .Another'));
    });
  });
});
