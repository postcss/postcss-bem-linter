var util = require('./test-util');
var assertSuccess = util.assertSuccess;
var assertFailure = util.assertFailure;
var assertSingleFailure = util.assertSingleFailure;
var selectorTester = util.selectorTester;
var fixture = util.fixture;

describe('using SUIT pattern (default)', function() {
  it('accepts valid component classes', function(done) {
    assertSuccess(done, fixture('suit-valid'));
  });

  var s = selectorTester('/** @define Foo */');

  describe('selectors must begin with the component name', function() {
    it('rejects `.potentialFalseMatch`', function(done) {
      assertSingleFailure(done, s('.potentialFalseMatch'));
    });

    it('rejects `div`', function(done) {
      assertSingleFailure(done, s('div'));
    });

    it('rejects `.Error`', function(done) {
      assertSingleFailure(done, s('.Error'));
    });
  });

  describe('understands namespaces', function() {
    it('and with namespace `ns` accepts `ns-Foo`', function(done) {
      assertSuccess(done, s('.ns-Foo'), 'suit', { namespace: 'ns' });
    });

    it('and with namespace `Ho04__d` accepts `Ho04__d-Foo`', function(done) {
      assertSuccess(done, s('.Ho04__d-Foo'), 'suit', { namespace: 'Ho04__d' });
    });

    it('and with namespace `ns` rejects `.Foo`', function(done) {
      assertSingleFailure(done, s('.Foo'), 'suit', { namespace: 'ns' });
    });
  });

  describe('understands alternate preset/presetOptions signature', function() {
    it('and with namespace `ns` accepts `ns-Foo`', function(done) {
      assertSuccess(done, s('.ns-Foo'), { preset: 'suit', presetOptions: { namespace: 'ns' }});
    });

    it('and with namespace `ns` rejects `.Foo`', function(done) {
      assertSingleFailure(done, s('.Foo'), { preset: 'suit', presetOptions: { namespace: 'ns' }});
    });
  });

  it('rejects invalid combined classes', function(done) {
    var sInvalid = selectorTester('/** @define StrictInvalidSelector */');
    assertSingleFailure(done, sInvalid('.StrictInvalidSelector .Another'));
  });

  describe('deals fairly with utility classes', function() {
    var sUtil = util.selectorTester('/** @define utilities */');

    it('accepts `u-foo`', function(done) {
      assertSuccess(done, sUtil('.u-foo'));
    });

    it('accepts `u-fooBar`', function(done) {
      assertSuccess(done, sUtil('.u-fooBar'));
    });

    it('accepts `u-fooBar17`', function(done) {
      assertSuccess(done, sUtil('.u-fooBar17'));
    });

    it('rejects `Foo`', function(done) {
      assertSingleFailure(done, sUtil('.Foo'));
    });

    it('rejects `u-Foo`', function(done) {
      assertSingleFailure(done, sUtil('.u-Foo'));
    });


    it('rejects `u-16by9`', function(done) {
      assertSingleFailure(done, sUtil('.u-16by9'));
    });
  });

  it('accepts chained attribute selectors', function() {
    assertSuccess(s('.Foo-input[type=number]'));
    assertSuccess(s('.Foo[disabled]'));
    assertSuccess(s('.Foo-input[disabled] ~ .Foo-label'));
    assertSuccess(s('.Foo-inner--password .Foo-input[type="password"]'));

    
  });
  
  describe('strict SUIT syntax', function() {
    var sComponent = util.selectorTester('/** @define Component */');

    it('accepts `Component--modifier`', function(done) {
      assertSuccess(done, sComponent('.Component--modifier'));
    });

    it('accepts `Component-descendant`', function(done) {
      assertSuccess(done, sComponent('.Component-descendant'));
    });

    it('accepts `Component-descendantName`', function(done) {
      assertSuccess(done, sComponent('.Component-descendantName'));
    });

    it('accepts `Component-descendantNameThing`', function(done) {
      assertSuccess(done, sComponent('.Component-descendantNameThing'));
    });

    it('accepts `Component-descendant--modifer`', function(done) {
      assertSuccess(done, sComponent('.Component-descendant--modifer'));
    });

    it('accepts `Component-descendant--16by9`', function(done) {
      assertSuccess(done, sComponent('.Component-descendant--16by9'));
    });

    it('rejects `Component--16by9-descendant`', function(done) {
      assertSingleFailure(done, sComponent('.Component--16by9-descendant'));
    });

    it('rejects `Component-DescendantName`', function(done) {
      assertSingleFailure(done, sComponent('.Component-DescendantName'));
    });

    it('rejects `Component-descendant--Modifier`', function(done) {
      assertSingleFailure(done, sComponent('.Component-descendant--Modifier'));
    });

    it('rejects `Component-0escendantNameThing`', function(done) {
      assertSingleFailure(done, sComponent('.Component-0escendantNameThing'));
    });

    it('rejects `Component-descendant--`', function(done) {
      assertSingleFailure(done, sComponent('.Component-descendant--'));
    });

    it('rejects `Component-`', function(done) {
      assertSingleFailure(done, sComponent('.Component-'));
    });
  });

  describe('in weak mode', function() {
    it('accepts arbitrary combined classes', function(done) {
      var sWeak = selectorTester('/** @define ValidRules; weak */');
      assertSuccess(done, sWeak('.ValidRules .Another'));
    });
  });
});
