'use strict';

const util = require('./test-util');
const assert = require('assert');

const assertSuccess = util.assertSuccess;
const assertSingleFailure = util.assertSingleFailure;
const selectorTester = util.selectorTester;
const fixture = util.fixture;

describe('using SUIT pattern (default)', () => {
  it('accepts valid component classes', () => {
    assertSuccess(fixture('suit-valid'));
  });

  const s = selectorTester('/** @define Foo */');

  describe('selectors must begin with the component name', () => {
    it('rejects `.potentialFalseMatch`', () => {
      assertSingleFailure(s('.potentialFalseMatch'));
    });

    it('rejects `div`', () => {
      assertSingleFailure(s('div'));
    });

    it('rejects `.Error`', () => {
      assertSingleFailure(s('.Error'));
    });
  });

  describe('understands namespaces', () => {
    it('and with namespace `ns` accepts `ns-Foo`', () => {
      assertSuccess(s('.ns-Foo'), 'suit', {namespace: 'ns'});
    });

    it('and with namespace `Ho04__d` accepts `Ho04__d-Foo`', () => {
      assertSuccess(s('.Ho04__d-Foo'), 'suit', {namespace: 'Ho04__d'});
    });

    it('and with namespace `ns` rejects `.Foo`', () => {
      assertSingleFailure(s('.Foo'), 'suit', {namespace: 'ns'});
    });
  });

  describe('understands alternate preset/presetOptions signature', () => {
    it('and with namespace `ns` accepts `ns-Foo`', () => {
      assertSuccess(s('.ns-Foo'), {
        preset: 'suit',
        presetOptions: {namespace: 'ns'},
      });
    });

    it('and with namespace `ns` rejects `.Foo`', () => {
      assertSingleFailure(s('.Foo'), {
        preset: 'suit',
        presetOptions: {namespace: 'ns'},
      });
    });
  });

  it('rejects invalid combined classes', () => {
    const sInvalid = selectorTester('/** @define StrictInvalidSelector */');
    assertSingleFailure(sInvalid('.StrictInvalidSelector .Another'));
  });

  describe('deals fairly with utility classes', () => {
    const sUtil = util.selectorTester('/** @define utilities */');

    it('accepts `u-foo`', () => {
      assertSuccess(sUtil('.u-foo'));
    });

    it('accepts `u-fooBar`', () => {
      assertSuccess(sUtil('.u-fooBar'));
    });

    it('accepts `u-fooBar17`', () => {
      assertSuccess(sUtil('.u-fooBar17'));
    });

    it('rejects `Foo`', () => {
      assertSingleFailure(sUtil('.Foo'));
    });

    it('rejects `u-Foo`', () => {
      assertSingleFailure(sUtil('.u-Foo'));
    });

    it('accepts `u-16by9`', () => {
      assertSuccess(sUtil('.u-16by9'));
    });

    it('accepts `u-sm-fooBar`', () => {
      assertSuccess(sUtil('.u-sm-fooBar'));
    });

    it('accepts `u-md-fooBar`', () => {
      assertSuccess(sUtil('.u-md-fooBar'));
    });

    it('accepts `u-lg-fooBar`', () => {
      assertSuccess(sUtil('.u-lg-fooBar'));
    });

    it('rejects `u-sm-Foo`', () => {
      assertSingleFailure(sUtil('.u-sm-FooBar'));
    });

    it('rejects `u-foo-bar`', () => {
      assertSingleFailure(sUtil('.u-foo-bar'));
    });

    it('rejects `u-sm-foo-bar`', () => {
      assertSingleFailure(sUtil('.u-sm-foo-bar'));
    });
  });

  it('accepts chained modifier selectors', () => {
    assertSuccess(s('.Foo--big.Foo--colored'));
    assertSuccess(s('.Foo--big.Foo--colored .Foo-input'));
    assertSuccess(s('.Foo-input--big.Foo-input--colored'));
  });

  it('accepts chained state selectors', () => {
    assertSuccess(s('.Foo.is-open.is-disabled .Foo-input'));
    assertSuccess(s('.Foo--big.is-open.is-disabled .Foo-input.is-invalid'));
    assertSuccess(s('.Foo.is-open.is-disabled .Foo-input.is-invalid'));
  });

  it('accepts chained attribute selectors', () => {
    assertSuccess(s('.Foo-input[type=number]'));
    assertSuccess(s('.Foo[disabled]'));
    assertSuccess(s('.Foo-input[disabled] ~ .Foo-label'));
    assertSuccess(s('.Foo-inner--password .Foo-input[type="password"]'));
  });

  describe('nesting selectors', () => {
    it('accepts nested rulesets', () => {
      assertSuccess(fixture('suit-nesting'));
    });

    it('rejects an incorrect nested ruleset', () => {
      assertSingleFailure(
        '/** @define Component */ \n .Component { &--Modifier {} }'
      );
      assertSingleFailure(
        '/** @define Component */ \n .Component { .component-elem {} }'
      );
    });

    it('rejects with a single warning when the parent has no declarations', () => {
      assertSingleFailure(
        '/** @define Component */ \n .component { &--modifier {} }'
      );
    });

    it('rejects with multiple warnings if the parent has declarations', () => {
      const result = util.test(
        '/** @define Component */ \n .component { color:red; &--modifier {} }'
      );
      assert.equal(result.warnings().length, 2);
    });

    it('correctly reports line number', () => {
      const result = util.test(
        '/** @define Component */ \n .Component {\n &--modifier {}\n .component-element {} \n}'
      );
      assert.equal(result.warnings()[0].line, 4);
    });
  });

  describe('strict SUIT syntax', () => {
    const sComponent = util.selectorTester('/** @define Component */');

    it('accepts `Component--modifier`', () => {
      assertSuccess(sComponent('.Component--modifier'));
    });

    it('accepts `Component-descendant`', () => {
      assertSuccess(sComponent('.Component-descendant'));
    });

    it('accepts `Component-descendantName`', () => {
      assertSuccess(sComponent('.Component-descendantName'));
    });

    it('accepts `Component-descendantNameThing`', () => {
      assertSuccess(sComponent('.Component-descendantNameThing'));
    });

    it('accepts `Component-descendant--modifer`', () => {
      assertSuccess(sComponent('.Component-descendant--modifer'));
    });

    it('accepts `Component-descendant--16by9`', () => {
      assertSuccess(sComponent('.Component-descendant--16by9'));
    });

    it('accepts `Component-16by9--modifier`', () => {
      assertSuccess(sComponent('.Component-16by9--modifier'));
    });

    it('rejects `Component--16by9-descendant`', () => {
      assertSingleFailure(sComponent('.Component--16by9-descendant'));
    });

    it('rejects `Component-DescendantName`', () => {
      assertSingleFailure(sComponent('.Component-DescendantName'));
    });

    it('rejects `Component-descendant--Modifier`', () => {
      assertSingleFailure(sComponent('.Component-descendant--Modifier'));
    });

    it('accepts `Component-0escendantNameThing`', () => {
      assertSuccess(sComponent('.Component-0escendantNameThing'));
    });

    it('rejects `Component-descendant--`', () => {
      assertSingleFailure(sComponent('.Component-descendant--'));
    });

    it('rejects `Component-`', () => {
      assertSingleFailure(sComponent('.Component-'));
    });
  });

  describe('in weak mode', () => {
    it('accepts arbitrary combined classes', () => {
      const sWeak = selectorTester('/** @define ValidRules; weak */');
      assertSuccess(sWeak('.ValidRules .Another'));
    });
  });
});
