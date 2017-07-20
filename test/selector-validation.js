const assert = require('assert');
const util = require('./test-util');

const assertSuccess = util.assertSuccess;
const assertSingleFailure = util.assertSingleFailure;
const selectorTester = util.selectorTester;

describe('selector validation', () => {
  describe('with no `componentSelectors` pattern', () => {
    it('throws an error', () => {
      util.test('/** @define Foo */ .Foo {}', {})
        .catch((err) => {
          assert.equal(err.message.indexOf('You tried to `@define` a component'), 0);
        });
    });
  });

  describe('with a custom `componentName` pattern /^[A-Z]+$/', () => {
    describe('as a regular expression', () => {
      runTests(/^[A-Z]+$/);
    });
    describe('as a string', () => {
      runTests('^[A-Z]+$');
    });

    function runTests(componentName) {
      const p1 = {
        componentName,
        componentSelectors() {return /.*/;},
      };

      it('rejects component name Foo', () => {
        assertSingleFailure('/** @define Foo */', p1);
      });

      it('accepts component name FOO', () => {
        assertSuccess('/** @define FOO */', p1);
      });
    }
  });

  describe('with a custom `componentName` pattern /^[a-z]+1$/', () => {
    describe('as a regular expression', () => {
      runTests(/^[a-z]+1$/);
    });
    describe('as a string', () => {
      runTests('^[a-z]+1$');
    });

    function runTests(componentName) {
      const p2 = {
        componentName,
        componentSelectors() {return /.*/;},
      };

      it('rejects component name foo2', () => {
        assertSingleFailure('/** @define foo2 */', p2);
      });

      it('accepts component name abc1', () => {
        assertSuccess('/** @define abc1 */', p2);
      });
    }
  });

  describe(
    'with a single `componentSelectors` pattern ' +
    'RegExp("^\\.[a-z]+-" + cmpt + "(?:_[a-z]+)?$")',
    () => {
      describe('as a regular expression', () => {
        runTests(cmpt => new RegExp(`^\\.[a-z]+-${cmpt}(?:_[a-z]+)?$`));
      });
      describe('as a string', () => {
        runTests('^\\.[a-z]+-{componentName}(?:_[a-z]+)?$');
      });

      function runTests(componentSelectors) {
        const patternA = {componentSelectors};
        const s = selectorTester('/** @define Foo */');

        it('accepts valid initial componentSelectors', () => {
          const valid = util.fixture('patternA-valid');
          assertSuccess(valid, patternA);
        });

        it('rejects initial componentSelector `.Foo`', () => {
          assertSingleFailure(s('.Foo'), patternA);
        });

        it(
          'rejects initial componentSelectors in media queries',
          () => {
            assertSingleFailure(
                          '/** @define Foo */ @media all { .Bar {} }'
            );
          }
        );

        describe('with pseudo-selectors', () => {
          it('ignores `:hover` at the end of a sequence', () => {
            assertSuccess(s('.f-Foo:hover'), patternA);
          });

          it('ignores `::before` at the end of a sequence', () => {
            assertSuccess(s('.f-Foo::before'), patternA);
          });

          it(
            'ignores `:not(".is-open")` at the end of a sequence',
            () => {
              assertSuccess(s('.f-Foo:not(\'.is-open\')'), patternA);
            }
          );
        });

        describe('with combining', () => {
          it('accepts `.f-Foo .f-Foo`', () => {
            assertSuccess(s('.f-Foo .f-Foo'), patternA);
          });

          it('accepts `.f-Foo > .f-Foo`', () => {
            assertSuccess(s('.f-Foo > .f-Foo'), patternA);
          });

          it('rejects `.f-Foo > div`', () => {
            assertSingleFailure(s('.f-Foo > div'), patternA);
          });

          it('rejects `.f-Foo + #baz`', () => {
            assertSingleFailure(s('.f-Foo + #baz'), patternA);
          });

          it('rejects `.f-Foo~li>a.link#baz.foo`', () => {
            assertSingleFailure(s('.f-Foo~li>a.link#baz.foo'), patternA);
          });
        });

        describe('in weak mode', () => {
          const sWeak = selectorTester('/** @define Foo; weak */');

          it('accepts `.f-Foo .f-Foo`', () => {
            assertSuccess(sWeak('.f-Foo .f-Foo'), patternA);
          });

          it('accepts `.f-Foo > div`', () => {
            assertSuccess(sWeak('.f-Foo > div'), patternA);
          });

          it('accepts `.f-Foo + #baz`', () => {
            assertSuccess(sWeak('.f-Foo + #baz'), patternA);
          });

          it('accepts `.f-Foo~li>a.link#baz.foo`', () => {
            assertSuccess(sWeak('.f-Foo~li>a.link#baz.foo'), patternA);
          });
        });
      }
    }
  );

  describe(
    'with different `initial` ("^\\." + cmpt + "(?:-[a-z]+)?$") and ' +
    '`combined` ("^\\.c-" + cmpt + "(?:-[a-z]+)?$") selector patterns',
    () => {
      describe('as regular expressions', () => {
        runTests({
          initial(cmpt) {
            return new RegExp(`^\\.${cmpt}(?:-[a-z]+)?$`);
          },
          combined(cmpt) {
            return new RegExp(`^\\.c-${cmpt}(?:-[a-z]+)?$`);
          },
        });
      });
      describe('as strings', () => {
        runTests({
          initial: '^\\.{componentName}(?:-[a-z]+)?$',
          combined: '^\\.c-{componentName}(?:-[a-z]+)?$',
        });
      });

      function runTests(componentSelectors) {
        const patternB = {componentSelectors};
        const s = selectorTester('/** @define Foo */');

        it('accepts `.Foo .c-Foo`', () => {
          assertSuccess(s('.Foo .c-Foo'), patternB);
        });

        it('accepts `.Foo-bar > .c-Foo-bar`', () => {
          assertSuccess(s('.Foo-bar > .c-Foo-bar'), patternB);
        });

        it('accepts `.Foo-bar>.c-Foo-bar`', () => {
          assertSuccess(s('.Foo-bar>.c-Foo-bar'), patternB);
        });

        it('rejects `.Foo .cc-Foo`', () => {
          assertSingleFailure(s('.Foo .cc-Foo'), patternB);
        });

        it('rejects `.Foo > .Foo-F`', () => {
          assertSingleFailure(s('.Foo > .Foo-F'), patternB);
        });

        it('rejects `.Foo, .cc-Foo`', () => {
          assertSingleFailure(s('.Foo, .cc-Foo'), patternB);
        });

        describe('in weak mode', () => {
          const sWeak = selectorTester('/** @define Foo; weak*/');

          it('accepts `.Foo .c-Foo`', () => {
            assertSuccess(sWeak('.Foo .c-Foo'), patternB);
          });

          it('accepts `.Foo .Foo`', () => {
            assertSuccess(sWeak('.Foo .Foo'), patternB);
          });

          it('accepts `.Foo > div`', () => {
            assertSuccess(sWeak('.Foo > div'), patternB);
          });

          it('accepts `.Foo + #baz`', () => {
            assertSuccess(sWeak('.Foo + #baz'), patternB);
          });

          it('accepts `.Foo~li>a.link#baz.foo`', () => {
            assertSuccess(sWeak('.Foo~li>a.link#baz.foo'), patternB);
          });
        });
      }
    }
  );

  describe(
    'with different `initial` ("^\\.prefix$") and ' +
    '`combined` ("^\\.prefix-" + cmpt + "(?:-[a-z]+)?$") selector patterns, ' +
    'where the initial selector does not contain the component name',
    () => {
      describe('as regular expressions', () => {
        runTests({
          initial() {
            return new RegExp('^\\.prefix$');
          },
          combined(cmpt) {
            return new RegExp(`^\\.prefix-${cmpt}(?:-[a-z]+)?$`);
          },
        });
      });
      describe('as strings', () => {
        runTests({
          initial: '^\\.prefix$',
          combined: '^\\.prefix-{componentName}(?:-[a-z]+)?$',
        });
      });

      function runTests(componentSelectors) {
        const patternB = {componentSelectors};
        const s = selectorTester('/** @define foo */');

        it('accepts `.prefix .prefix-foo`', () => {
          assertSuccess(s('.prefix .prefix-foo'), patternB);
        });

        it('rejects `.prefix-foo`', () => {
          assertSingleFailure(s('.prefix-foo'), patternB);
        });

        it('rejects `.prefix .foo`', () => {
          assertSingleFailure(s('.prefix .foo'), patternB);
        });
      }
    }
  );

  describe('with @keyframes rule', () => {
    it('does not complain about keyframe selectors', () => {
      assertSuccess('/** @define Foo */ @keyframes fade { 0% { opacity: 0; } 100% { opacity: 1; } }');
    });
  });
});
