var util = require('./test-util');
var assertSuccess = util.assertSuccess;
var assertSingleFailure = util.assertSingleFailure;
var selectorTester = util.selectorTester;

describe('selector validation', function () {
  describe('with a custom `componentName` pattern /^[A-Z]+$/', function () {
    var p1 = {
      componentName: /^[A-Z]+$/,
      componentSelectors: function () { return /.*/; }
    };

    it('rejects component name Foo', function (done) {
      assertSingleFailure(done, '/** @define Foo */', p1);
    });

    it('accepts component name FOO', function (done) {
      assertSuccess(done, '/** @define FOO */', p1);
    });
  });

  describe('with a custom `componentName` pattern /^[a-z]+1$/', function () {
    var p2 = {
      componentName: /^[a-z]+1$/,
      componentSelectors: function () { return /.*/; }
    };

    it('rejects component name foo2', function (done) {
      assertSingleFailure(done, '/** @define foo2 */', p2);
    });

    it('accepts component name abc1', function (done) {
      assertSuccess(done, '/** @define abc1 */', p2);
    });
  });

  describe(
    'with a single `componentSelectors` pattern ' +
    'RegExp("^\\.[a-z]+-" + cmpt + "(?:_[a-z]+)?$")',
    function () {
      var patternA = {
        componentSelectors: function (cmpt) {
          return new RegExp('^\\.[a-z]+-' + cmpt + '(?:_[a-z]+)?$');
        }
      };
      var s = selectorTester('/** @define Foo */');

      it('accepts valid initial componentSelectors', function (done) {
        var valid = util.fixture('patternA-valid');
        assertSuccess(done, valid, patternA);
      });

      it('rejects initial componentSelector `.Foo`', function (done) {
        assertSingleFailure(done, s('.Foo'), patternA);
      });

      it(
        'rejects initial componentSelectors in media queries',
        function (done) {
          assertSingleFailure(
            done,
            '/** @define Foo */ @media all { .Bar {} }'
          );
        }
      );

      describe('with pseudo-selectors', function () {
        it('ignores `:hover` at the end of a sequence', function (done) {
          assertSuccess(done, s('.f-Foo:hover'), patternA);
        });

        it('ignores `::before` at the end of a sequence', function (done) {
          assertSuccess(done, s('.f-Foo::before'), patternA);
        });

        it(
          'ignores `:not(".is-open")` at the end of a sequence',
          function (done) {
            assertSuccess(done, s('.f-Foo:not(\'.is-open\')'), patternA);
          }
        );
      });

      describe('with combining', function () {
        it('accepts `.f-Foo .f-Foo`', function (done) {
          assertSuccess(done, s('.f-Foo .f-Foo'), patternA);
        });

        it('accepts `.f-Foo > .f-Foo`', function (done) {
          assertSuccess(done, s('.f-Foo > .f-Foo'), patternA);
        });

        it('rejects `.f-Foo > div`', function (done) {
          assertSingleFailure(done, s('.f-Foo > div'), patternA);
        });

        it('rejects `.f-Foo + #baz`', function (done) {
          assertSingleFailure(done, s('.f-Foo + #baz'), patternA);
        });

        it('rejects `.f-Foo~li>a.link#baz.foo`', function (done) {
          assertSingleFailure(done, s('.f-Foo~li>a.link#baz.foo'), patternA);
        });
      });

      describe('in weak mode', function () {
        var sWeak = selectorTester('/** @define Foo; weak */');

        it('accepts `.f-Foo .f-Foo`', function (done) {
          assertSuccess(done, sWeak('.f-Foo .f-Foo'), patternA);
        });

        it('accepts `.f-Foo > div`', function (done) {
          assertSuccess(done, sWeak('.f-Foo > div'), patternA);
        });

        it('accepts `.f-Foo + #baz`', function (done) {
          assertSuccess(done, sWeak('.f-Foo + #baz'), patternA);
        });

        it('accepts `.f-Foo~li>a.link#baz.foo`', function (done) {
          assertSuccess(done, sWeak('.f-Foo~li>a.link#baz.foo'), patternA);
        });
      });
    }
  );

  describe(
    'with different `initial` ("^\\." + cmpt + "(?:-[a-z]+)?$") and ' +
    '`combined` ("^\\.c-" + cmpt + "(?:-[a-z]+)?$") selector patterns',
    function () {
    var patternB = {
      componentSelectors: {
        initial: function (cmpt) {
          return new RegExp('^\\.' + cmpt + '(?:-[a-z]+)?$');
        },
        combined: function (cmpt) {
          return new RegExp('^\\.c-' + cmpt + '(?:-[a-z]+)?$');
        }
      }
    };
    var s = selectorTester('/** @define Foo */');

    it('accepts `.Foo .c-Foo`', function (done) {
      assertSuccess(done, s('.Foo .c-Foo'), patternB);
    });

    it('accepts `.Foo-bar > .c-Foo-bar`', function (done) {
      assertSuccess(done, s('.Foo-bar > .c-Foo-bar'), patternB);
    });

    it('accepts `.Foo-bar>.c-Foo-bar`', function (done) {
      assertSuccess(done, s('.Foo-bar>.c-Foo-bar'), patternB);
    });

    it('rejects `.Foo .cc-Foo`', function (done) {
      assertSingleFailure(done, s('.Foo .cc-Foo'), patternB);
    });

    it('rejects `.Foo > .Foo-F`', function (done) {
      assertSingleFailure(done, s('.Foo > .Foo-F'), patternB);
    });

    describe('in weak mode', function () {
      var sWeak = selectorTester('/** @define Foo; weak*/');

      it('accepts `.Foo .c-Foo`', function (done) {
        assertSuccess(done, sWeak('.Foo .c-Foo'), patternB);
      });

      it('accepts `.Foo .Foo`', function (done) {
        assertSuccess(done, sWeak('.Foo .Foo'), patternB);
      });

      it('accepts `.Foo > div`', function (done) {
        assertSuccess(done, sWeak('.Foo > div'), patternB);
      });

      it('accepts `.Foo + #baz`', function (done) {
        assertSuccess(done, sWeak('.Foo + #baz'), patternB);
      });

      it('accepts `.Foo~li>a.link#baz.foo`', function (done) {
        assertSuccess(done, sWeak('.Foo~li>a.link#baz.foo'), patternB);
      });
    });
  });

  describe('checking utilitySelectors', function () {
    var patternC = {
      utilitySelectors: /^\.UTIL-[a-z]+$/
    };
    var s = selectorTester('/** @define utilities */');

    it('accepts `.UTIL-foo`', function (done) {
      assertSuccess(done, s('.UTIL-foo'), patternC);
    });

    it('accepts `.UTIL-foobarbaz`', function (done) {
      assertSuccess(done, s('.UTIL-foobarbaz'), patternC);
    });

    it('accepts `.UTIL-foo:hover`', function (done) {
      assertSuccess(done, s('.UTIL-foo:hover'), patternC);
    });

    it('accepts `.UTIL-foo::before`', function (done) {
      assertSuccess(done, s('.UTIL-foo::before'), patternC);
    });

    it('rejects `.Foo`', function (done) {
      assertSingleFailure(done, s('.Foo'), patternC);
    });

    it('rejects `.U-foo`', function (done) {
      assertSingleFailure(done, s('.U-foo'), patternC);
    });
  });

  describe('ignore a selector', function () {
    var s = selectorTester('/** @define Foo */');

    it(
      'ignores selectors after special comments a line before',
      function (done) {
        assertSuccess(done, s('/* postcss-bem-linter: ignore */\n.Foo a'));
      }
    );

    it(
      'ignores selectors after special comments inline with the selector',
      function (done) {
        assertSuccess(done, s(
          '/* postcss-bem-linter: ignore */ .no-flexbox .Foo'
        ));
      }
    );
  });
});
