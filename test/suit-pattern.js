var util = require('./test-util');
var assertSuccess = util.assertSuccess;
var assertFailure = util.assertFailure;
var assertSingleFailure = util.assertSingleFailure;
var selectorTester = util.selectorTester;
var fixture = util.fixture;

describe('using SUIT pattern (default)', function() {
  it('accepts valid component classes', function() {
    assertSuccess(fixture('suit-valid'));
  });

  var s = selectorTester('/** @define Foo */');

  describe('selectors must begin with the component name', function() {
    it('rejects `.potentialFalseMatch`', function() {
      assertSingleFailure(s('.potentialFalseMatch'));
    });

    it('rejects `div`', function() {
      assertSingleFailure(s('div'));
    });

    it('rejects `.Error`', function() {
      assertSingleFailure(s('.Error'));
    });
  });

  describe('understands namespaces', function() {
    it('and with namespace `ns` accepts `ns-Foo`', function() {
      assertSuccess(s('.ns-Foo'), 'suit', { namespace: 'ns' });
    });

    it('and with namespace `Ho04__d` accepts `Ho04__d-Foo`', function() {
      assertSuccess(s('.Ho04__d-Foo'), 'suit', { namespace: 'Ho04__d' });
    });

    it('and with namespace `ns` rejects `.Foo`', function() {
      assertSingleFailure(s('.Foo'), 'suit', { namespace: 'ns' });
    });
  });

  describe('understands alternate preset/presetOptions signature', function() {
    it('and with namespace `ns` accepts `ns-Foo`', function() {
      assertSuccess(s('.ns-Foo'), { preset: 'suit', presetOptions: { namespace: 'ns' }});
    });

    it('and with namespace `ns` rejects `.Foo`', function() {
      assertSingleFailure(s('.Foo'), { preset: 'suit', presetOptions: { namespace: 'ns' }});
    });
  });

  it('rejects invalid combined classes', function() {
    var sInvalid = selectorTester('/** @define StrictInvalidSelector */');
    assertSingleFailure(sInvalid('.StrictInvalidSelector .Another'));
  });

  describe('deals fairly with utility classes', function() {
    var sUtil = util.selectorTester('/** @define utilities */');

    it('accepts `u-foo`', function() {
      assertSuccess(sUtil('.u-foo'));
    });

    it('accepts `u-fooBar`', function() {
      assertSuccess(sUtil('.u-fooBar'));
    });

    it('accepts `u-fooBar17`', function() {
      assertSuccess(sUtil('.u-fooBar17'));
    });

    it('rejects `Foo`', function() {
      assertSingleFailure(sUtil('.Foo'));
    });

    it('rejects `u-Foo`', function() {
      assertSingleFailure(sUtil('.u-Foo'));
    });

    it('accepts `u-16by9`', function() {
      assertSuccess(sUtil('.u-16by9'));
    });
  });

  it('accepts chained modifier selectors', function() {
    assertSuccess(s('.Foo--big.Foo--colored'));
    assertSuccess(s('.Foo--big.Foo--colored .Foo-input'));
    assertSuccess(s('.Foo-input--big.Foo-input--colored'));

  });

  it('accepts chained state selectors', function() {
    assertSuccess(s('.Foo.is-open.is-disabled .Foo-input'));
    assertSuccess(s('.Foo--big.is-open.is-disabled .Foo-input.is-invalid'));
    assertSuccess(s('.Foo.is-open.is-disabled .Foo-input.is-invalid'));
  });

  it('accepts chained attribute selectors', function() {
    assertSuccess(s('.Foo-input[type=number]'));
    assertSuccess(s('.Foo[disabled]'));
    assertSuccess(s('.Foo-input[disabled] ~ .Foo-label'));
    assertSuccess(s('.Foo-inner--password .Foo-input[type="password"]'));
  });

  describe('strict SUIT syntax', function() {
    var sComponent = util.selectorTester('/** @define Component */');

    it('accepts `Component--modifier`', function() {
      assertSuccess(sComponent('.Component--modifier'));
    });

    it('accepts `Component-descendant`', function() {
      assertSuccess(sComponent('.Component-descendant'));
    });

    it('accepts `Component-descendantName`', function() {
      assertSuccess(sComponent('.Component-descendantName'));
    });

    it('accepts `Component-descendantNameThing`', function() {
      assertSuccess(sComponent('.Component-descendantNameThing'));
    });

    it('accepts `Component-descendant--modifer`', function() {
      assertSuccess(sComponent('.Component-descendant--modifer'));
    });

    it('accepts `Component-descendant--16by9`', function() {
      assertSuccess(sComponent('.Component-descendant--16by9'));
    });

    it('accepts `Component-16by9--modifier`', function() {
      assertSuccess(sComponent('.Component-16by9--modifier'));
    });

    it('rejects `Component--16by9-descendant`', function() {
      assertSingleFailure(sComponent('.Component--16by9-descendant'));
    });

    it('rejects `Component-DescendantName`', function() {
      assertSingleFailure(sComponent('.Component-DescendantName'));
    });

    it('rejects `Component-descendant--Modifier`', function() {
      assertSingleFailure(sComponent('.Component-descendant--Modifier'));
    });

    it('accepts `Component-0escendantNameThing`', function() {
      assertSuccess(sComponent('.Component-0escendantNameThing'));
    });

    it('rejects `Component-descendant--`', function() {
      assertSingleFailure(sComponent('.Component-descendant--'));
    });

    it('rejects `Component-`', function() {
      assertSingleFailure(sComponent('.Component-'));
    });
  });

  describe('in weak mode', function() {
    it('accepts arbitrary combined classes', function() {
      var sWeak = selectorTester('/** @define ValidRules; weak */');
      assertSuccess(sWeak('.ValidRules .Another'));
    });
  });
});
