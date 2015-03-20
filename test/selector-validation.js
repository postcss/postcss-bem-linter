var util = require('./test-util');
var assertSuccess = util.assertSuccess;
var assertFailure = util.assertFailure;
var selectorTester = util.selectorTester;

describe('selector validation', function () {
  describe('with a custom `componentName` pattern', function () {
    var p1 = { componentName: /^[A-Z]+$/, selectors: function () { return /.*/; } };
    var p2 = { componentName: /^[a-z]+1$/, selectors: function () { return /.*/; } };

    it('rejects invalid component names', function () {
      assertFailure('/** @define Foo */', p1);
      assertFailure('/** @define foo2 */', p2);
    });

    it('accepts valid component names', function () {
      assertSuccess('/** @define FOO */', p1);
      assertSuccess('/** @define abc1 */', p2);
    });
  });

  describe('with a single `selectors` pattern', function () {
    var patternA = {
      selectors: function (cmpt) {
        return new RegExp('^\\.[a-z]+-' + cmpt + '(?:_[a-z]+)?$');
      }
    };

    it('accepts valid initial selectors', function () {
      assertSuccess(util.fixture('patternA-valid-initial'), patternA);
    });

    it('rejects invalid initial selectors', function () {
      assertFailure('/** @define Foo */ .Foo {}', patternA);
    });

    it('accepts any combined selectors in non-strict mode', function () {
      var s = selectorTester('/** @define Foo */');

      assertSuccess(s('.f-Foo .f-Foo'), patternA);
      assertSuccess(s('.f-Foo > div'), patternA);
      assertSuccess(s('.f-Foo + #baz'), patternA);
      assertSuccess(s('.f-Foo~li>a.link#baz.foo'), patternA);
    });

    it('ignores pseudo-selectors at the end of a sequence', function () {
      var s = selectorTester('/** @define Foo */');

      assertSuccess(s('.f-Foo:hover'), patternA);
      assertSuccess(s('.f-Foo::before'), patternA);
      assertSuccess(s('.f-Foo:not(\'.is-open\')'), patternA);
    });

    describe('in strict mode', function () {
      var s = selectorTester('/** @define Foo; use strict */');

      it('accepts valid combined selectors', function () {
        assertSuccess(s('.f-Foo .f-Foo'), patternA);
        assertSuccess(s('.f-Foo > .f-Foo'), patternA);
      });

      it('rejects invalid combined selectors', function () {
        assertFailure(s('.f-Foo > div'), patternA);
        assertFailure(s('.f-Foo + #baz'), patternA);
        assertFailure(s('.f-Foo~li>a.link#baz.foo'), patternA);
      });
    });
  });

  describe(
    'with different `initial` and `combined` selector patterns',
    function () {
    var patternB = {
      selectors: {
        initial: function (cmpt) {
          return new RegExp('^\\.' + cmpt + '(?:-[a-z]+)?$');
        },
        combined: function (cmpt) {
          return new RegExp('^\\.c-' + cmpt + '(?:-[a-z]+)?$');
        }
      }
    };

    it('accepts any combined selectors in non-strict mode', function () {
      var s = selectorTester('/** @define Foo */');

      assertSuccess(s('.Foo .c-Foo'), patternB);
      assertSuccess(s('.Foo .Foo'), patternB);
      assertSuccess(s('.Foo > div'), patternB);
      assertSuccess(s('.Foo + #baz'), patternB);
      assertSuccess(s('.Foo~li>a.link#baz.foo'), patternB);
    });

    describe('in strict mode', function () {
      var s = selectorTester('/** @define Foo; use strict */');

      it('accepts valid combined selectors', function () {
        assertSuccess(s('.Foo .c-Foo'), patternB);
        assertSuccess(s('.Foo-bar > .c-Foo-bar'), patternB);
        assertSuccess(s('.Foo-bar>.c-Foo-bar'), patternB);
      });

      it('rejects invalid combined selectors', function () {
        assertFailure(s('.Foo .cc-Foo'), patternB);
        assertFailure(s('.Foo > .Foo-F'), patternB);
      });
    });
  });

  describe('checking utility classes', function () {
    var patternC = {
      utilities: /^\.UTIL-[a-z]+$/
    };
    var s = selectorTester('/** @define utilities */');

    it('accepts valid utility selectors', function () {
      assertSuccess(s('.UTIL-foo'), patternC);
      assertSuccess(s('.UTIL-foobarbaz'), patternC);
    });

    it('rejects invalid utility selectors', function () {
      assertFailure(s('.Foo'), patternC);
      assertFailure(s('.U-foo'), patternC);
    });
  });
});
