var assert = require('assert');
var util = require('./test-util');
var assertSuccess = util.assertSuccess;
var assertSingleFailure = util.assertSingleFailure;
var selectorTester = util.selectorTester;

describe('selector validation', function() {
  describe('with no `componentSelectors` pattern', function() {
    it('throws an error', function() {
      util.test('/** @define Foo */ .Foo {}', {})
        .catch(function(err) {
          assert.equal(err.message.indexOf('You tried to `@define` a component'), 0);
        });
    });
  });

  describe('with a custom `componentName` pattern /^[A-Z]+$/', function() {
    var p1 = {
      componentName: /^[A-Z]+$/,
      componentSelectors: function() { return /.*/; },
    };

    it('rejects component name Foo', function() {
      assertSingleFailure('/** @define Foo */', p1);
    });

    it('accepts component name FOO', function() {
      assertSuccess('/** @define FOO */', p1);
    });
  });

  describe('with a custom `componentName` pattern /^[a-z]+1$/', function() {
    var p2 = {
      componentName: /^[a-z]+1$/,
      componentSelectors: function() { return /.*/; },
    };

    it('rejects component name foo2', function() {
      assertSingleFailure('/** @define foo2 */', p2);
    });

    it('accepts component name abc1', function() {
      assertSuccess('/** @define abc1 */', p2);
    });
  });

  describe(
    'with a single `componentSelectors` pattern ' +
    'RegExp("^\\.[a-z]+-" + cmpt + "(?:_[a-z]+)?$")',
    function() {
      var patternA = {
        componentSelectors: function(cmpt) {
          return new RegExp('^\\.[a-z]+-' + cmpt + '(?:_[a-z]+)?$');
        },
      };
      var s = selectorTester('/** @define Foo */');

      it('accepts valid initial componentSelectors', function() {
        var valid = util.fixture('patternA-valid');
        assertSuccess(valid, patternA);
      });

      it('rejects initial componentSelector `.Foo`', function() {
        assertSingleFailure(s('.Foo'), patternA);
      });

      it(
        'rejects initial componentSelectors in media queries',
        function() {
          assertSingleFailure(
                        '/** @define Foo */ @media all { .Bar {} }'
          );
        }
      );

      describe('with pseudo-selectors', function() {
        it('ignores `:hover` at the end of a sequence', function() {
          assertSuccess(s('.f-Foo:hover'), patternA);
        });

        it('ignores `::before` at the end of a sequence', function() {
          assertSuccess(s('.f-Foo::before'), patternA);
        });

        it(
          'ignores `:not(".is-open")` at the end of a sequence',
          function() {
            assertSuccess(s('.f-Foo:not(\'.is-open\')'), patternA);
          }
        );
      });

      describe('with combining', function() {
        it('accepts `.f-Foo .f-Foo`', function() {
          assertSuccess(s('.f-Foo .f-Foo'), patternA);
        });

        it('accepts `.f-Foo > .f-Foo`', function() {
          assertSuccess(s('.f-Foo > .f-Foo'), patternA);
        });

        it('rejects `.f-Foo > div`', function() {
          assertSingleFailure(s('.f-Foo > div'), patternA);
        });

        it('rejects `.f-Foo + #baz`', function() {
          assertSingleFailure(s('.f-Foo + #baz'), patternA);
        });

        it('rejects `.f-Foo~li>a.link#baz.foo`', function() {
          assertSingleFailure(s('.f-Foo~li>a.link#baz.foo'), patternA);
        });
      });

      describe('in weak mode', function() {
        var sWeak = selectorTester('/** @define Foo; weak */');

        it('accepts `.f-Foo .f-Foo`', function() {
          assertSuccess(sWeak('.f-Foo .f-Foo'), patternA);
        });

        it('accepts `.f-Foo > div`', function() {
          assertSuccess(sWeak('.f-Foo > div'), patternA);
        });

        it('accepts `.f-Foo + #baz`', function() {
          assertSuccess(sWeak('.f-Foo + #baz'), patternA);
        });

        it('accepts `.f-Foo~li>a.link#baz.foo`', function() {
          assertSuccess(sWeak('.f-Foo~li>a.link#baz.foo'), patternA);
        });
      });
    }
  );

  describe(
    'with different `initial` ("^\\." + cmpt + "(?:-[a-z]+)?$") and ' +
    '`combined` ("^\\.c-" + cmpt + "(?:-[a-z]+)?$") selector patterns',
    function() {
    var patternB = {
      componentSelectors: {
        initial: function(cmpt) {
          return new RegExp('^\\.' + cmpt + '(?:-[a-z]+)?$');
        },
        combined: function(cmpt) {
          return new RegExp('^\\.c-' + cmpt + '(?:-[a-z]+)?$');
        },
      },
    };
    var s = selectorTester('/** @define Foo */');

    it('accepts `.Foo .c-Foo`', function() {
      assertSuccess(s('.Foo .c-Foo'), patternB);
    });

    it('accepts `.Foo-bar > .c-Foo-bar`', function() {
      assertSuccess(s('.Foo-bar > .c-Foo-bar'), patternB);
    });

    it('accepts `.Foo-bar>.c-Foo-bar`', function() {
      assertSuccess(s('.Foo-bar>.c-Foo-bar'), patternB);
    });

    it('rejects `.Foo .cc-Foo`', function() {
      assertSingleFailure(s('.Foo .cc-Foo'), patternB);
    });

    it('rejects `.Foo > .Foo-F`', function() {
      assertSingleFailure(s('.Foo > .Foo-F'), patternB);
    });

    it('rejects `.Foo, .cc-Foo`', function() {
      assertSingleFailure(s('.Foo, .cc-Foo'), patternB);
    });

    describe('in weak mode', function() {
      var sWeak = selectorTester('/** @define Foo; weak*/');

      it('accepts `.Foo .c-Foo`', function() {
        assertSuccess(sWeak('.Foo .c-Foo'), patternB);
      });

      it('accepts `.Foo .Foo`', function() {
        assertSuccess(sWeak('.Foo .Foo'), patternB);
      });

      it('accepts `.Foo > div`', function() {
        assertSuccess(sWeak('.Foo > div'), patternB);
      });

      it('accepts `.Foo + #baz`', function() {
        assertSuccess(sWeak('.Foo + #baz'), patternB);
      });

      it('accepts `.Foo~li>a.link#baz.foo`', function() {
        assertSuccess(sWeak('.Foo~li>a.link#baz.foo'), patternB);
      });
    });
  });

  describe('checking utilitySelectors', function() {
    var patternC = {
      utilitySelectors: /^\.UTIL-[a-z]+$/,
    };
    var s = selectorTester('/** @define utilities */');

    it('accepts `.UTIL-foo`', function() {
      assertSuccess(s('.UTIL-foo'), patternC);
    });

    it('accepts `.UTIL-foobarbaz`', function() {
      assertSuccess(s('.UTIL-foobarbaz'), patternC);
    });

    it('accepts `.UTIL-foo:hover`', function() {
      assertSuccess(s('.UTIL-foo:hover'), patternC);
    });

    it('accepts `.UTIL-foo::before`', function() {
      assertSuccess(s('.UTIL-foo::before'), patternC);
    });

    it('rejects `.Foo`', function() {
      assertSingleFailure(s('.Foo'), patternC);
    });

    it('rejects `.U-foo`', function() {
      assertSingleFailure(s('.U-foo'), patternC);
    });
  });

  describe('ignore a selector with a comment', function() {
    var s = selectorTester('/** @define Foo */');

    it(
      'ignores selectors after special comments a line before',
      function() {
        assertSuccess(s('/* postcss-bem-linter: ignore */\n.Foo a'));
      }
    );

    it(
      'ignores selectors after special comments inline with the selector',
      function() {
        assertSuccess(s(
          '/* postcss-bem-linter: ignore */ .no-flexbox .Foo'
        ));
      }
    );
  });

  describe('ignore a selector with an `ignoreSelectors` pattern', function() {
    var s = selectorTester('/** @define Foo */');
    var config = { preset: 'suit', ignoreSelectors: /\.isok-.+/ };

    it(
      'ignores selectors that match the `ignoreSelectors` pattern',
      function() {
        assertSuccess(s('.isok-BLERGH'), config);
      }
    );

    it(
      'ignores grouped selectors that match the `ignoreSelectors` pattern',
      function() {
        assertSuccess(s('.Foo .isok-BLERGH'), config);
      }
    );

    it(
      'rejects selectors that do not match valid pattern or `ignoreSelectors` pattern',
      function() {
        assertSingleFailure(s('.blergh'), config);
      }
    );
  });

  describe('ignore a selector with an `ignoreSelectors` array of patterns', function() {
    var s = selectorTester('/** @define Foo */');
    var config = { preset: 'suit', ignoreSelectors: [/\.isok-.+/, /#fine/] };

    it(
      'ignores selectors that match any of the `ignoreSelectors` pattern',
      function() {
        assertSuccess(s('.isok-BLERGH'), config);
      }
    );

    it(
      'ignores selectors that match any of the `ignoreSelectors` pattern (take 2)',
      function() {
        assertSuccess(s('#fine'), config);
      }
    );

    it(
      'ignores grouped selectors that match any of the `ignoreSelectors` pattern',
      function() {
        assertSuccess(s('.Foo .isok-BLERGH'), config);
      }
    );

    it(
      'ignores grouped selectors that match any of the `ignoreSelectors` pattern (take 2)',
      function() {
        assertSuccess(s('.Foo #fine'), config);
      }
    );

    it(
      'rejects selectors that do not match valid pattern or `ignoreSelectors` pattern',
      function() {
        assertSingleFailure(s('.blergh'), config);
      }
    );
  });
});
