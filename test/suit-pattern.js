var util = require('./test-util');
var assertSuccess = util.assertSuccess;
var assertSingleFailure = util.assertSingleFailure;
var selectorTester = util.selectorTester;
var fixture = util.fixture;

describe('using SUIT pattern (default)', function () {
  it('accepts valid component classes', function (done) {
    assertSuccess(done, fixture('suit-valid'));
  });

  var s = selectorTester('/** @define Foo */');

  describe('selectors must begin with the component name', function () {
    it('rejects `.potentialFalseMatch`', function (done) {
      assertSingleFailure(done, s('.potentialFalseMatch'));
    });

    it('rejects `div`', function (done) {
      assertSingleFailure(done, s('div'));
    });

    it('rejects `.Error`', function (done) {
      assertSingleFailure(done, s('.Error'));
    });
  });

  describe('understands namespaces', function () {
    it('and with namespace `ns` accepts `ns-Foo`', function (done) {
      assertSuccess(done, s('.ns-Foo'), 'suit', { namespace: 'ns' });
    });

    it('and with namespace `Ho04__d` accepts `Ho04__d-Foo`', function (done) {
      assertSuccess(done, s('.Ho04__d-Foo'), 'suit', { namespace: 'Ho04__d' });
    });

    it('and with namespace `ns` rejects `.Foo`', function (done) {
      assertSingleFailure(done, s('.Foo'), 'suit', { namespace: 'ns' });
    });
  });

  it('rejects invalid combined classes', function (done) {
    var sInvalid = selectorTester('/** @define StrictInvalidSelector */');
    assertSingleFailure(done, sInvalid('.StrictInvalidSelector .Another'));
  });

  describe('deals fairly with utility classes', function () {
    var sUtil = util.selectorTester('/** @define utilities */');

    it('accepts `u-foo`', function (done) {
      assertSuccess(done, sUtil('.u-foo'));
    });

    it('accepts `u-fooBar`', function (done) {
      assertSuccess(done, sUtil('.u-fooBar'));
    });

    it('accepts `u-fooBar17`', function (done) {
      assertSuccess(done, sUtil('.u-fooBar17'));
    });

    it('rejects `.Foo`', function (done) {
      assertSingleFailure(done, sUtil('.Foo'));
    });

    it('rejects `.u-Foo`', function (done) {
      assertSingleFailure(done, sUtil('.u-Foo'));
    });
  });

  it('accepts chained attribute selectors', function () {
    assertSuccess(s('.Foo-input[type=number]'));
    assertSuccess(s('.Foo[disabled]'));
    assertSuccess(s('.Foo-input[disabled] ~ .Foo-label'));
    assertSuccess(s('.Foo-inner--password .Foo-input[type="password"]'));
  });

  describe('in weak mode', function () {
    it('accepts arbitrary combined classes', function (done) {
      var sWeak = selectorTester('/** @define ValidRules; weak */');
      assertSuccess(done, sWeak('.ValidRules .Another'));
    });
  });
});
