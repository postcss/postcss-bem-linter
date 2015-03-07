var assert = require('assert');
var linter = require('..');
var fs = require('fs');
var postcss = require('postcss');

function processCss(css, opts) {
  return postcss().use(linter(opts)).process(css);
}

function fixture(name) {
  return fs.readFileSync('test/fixtures/' + name + '.css', 'utf8').trim();
}

function assertSuccess(css, opts) {
  var result = function () {
    processCss(css, opts);
  };
  assert.doesNotThrow(result);
}

function assertFailure(css, opts) {
  var result = function () {
    processCss(css, opts);
  };
  assert.throws(result);
}

function selectorTester(def) {
  return function(selector) {
    return [def, selector, '{}'].join(' ');
  };
}

describe('`@define` notation', function () {
  describe('CSS that lacks a definition', function () {
    it('must be ignored', function () {
      assertSuccess('.horse { color: pink; }');
    });
  });

  describe('CSS with a malformed definition', function () {
    it('must be ignored', function () {
      assertSuccess('/** @deforne Foo */ .Foo { color: pink; }')
    });
  });
});

describe('rule validation', function () {
  it('allows `:root` not grouped with other selectors', function () {
    assertSuccess('/** @define Foo */ :root {} .Foo {}');
  });

  it('errors if `:root` is grouped with other selectors', function () {
    assertFailure('/** @define Foo */ :root, .Foo {}');
  });
});

describe('selector validation', function () {
  describe('using a custom pattern', function () {
    describe('with a custom `componentName` pattern', function () {
      var p1 = { componentName: /^[A-Z]+$/, selectors: function() { return /.*/; } };
      var p2 = { componentName: /^[a-z]+1$/, selectors: function() { return /.*/; } };

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
        assertSuccess(fixture('patternA-valid-initial'), patternA);
      });

      it('rejects invalid initial selectors', function () {
        assertFailure('/** @define Foo */ .Foo {}', patternA);
      });

      it('accepts any chained selectors in non-strict mode', function () {
        var s = selectorTester('/** @define Foo */');

        assertSuccess(s('.f-Foo .f-Foo'), patternA);
        assertSuccess(s('.f-Foo > div'), patternA);
        assertSuccess(s('.f-Foo + #baz'), patternA);
        assertSuccess(s('.f-Foo~li>a.link#baz.foo'), patternA);
      });

      describe('in strict mode', function () {
        var s = selectorTester('/** @define Foo; use strict */');

        it('accepts valid chained selectors', function () {
          assertSuccess(s('.f-Foo .f-Foo'), patternA);
          assertSuccess(s('.f-Foo > .f-Foo'), patternA);
        });

        it('rejects invalid chained selectors', function () {
          assertFailure(s('.f-Foo > div'), patternA);
          assertFailure(s('.f-Foo + #baz'), patternA);
          assertFailure(s('.f-Foo~li>a.link#baz.foo'), patternA);
        });
      });
    });

    describe('with different `initial` and `chainable` selector patterns', function () {
      var patternB = {
        selectors: {
          initial: function (cmpt) {
            return new RegExp('^\\.' + cmpt + '(?:-[a-z]+)?$');
          },
          chainable: function (cmpt) {
            return new RegExp('^\\.c-' + cmpt + '(?:-[a-z]+)?$');
          }
        }
      };

      it('accepts any chained selectors in non-strict mode', function () {
        var s = selectorTester('/** @define Foo */');

        assertSuccess(s('.Foo .c-Foo'), patternB);
        assertSuccess(s('.Foo .Foo'), patternB);
        assertSuccess(s('.Foo > div'), patternB);
        assertSuccess(s('.Foo + #baz'), patternB);
        assertSuccess(s('.Foo~li>a.link#baz.foo'), patternB);
      });

      describe('in strict mode', function () {
        var s = selectorTester('/** @define Foo; use strict */');

        it('accepts valid chained selectors', function () {
          assertSuccess(s('.Foo .c-Foo'), patternB);
          assertSuccess(s('.Foo-bar > .c-Foo-bar'), patternB);
          assertSuccess(s('.Foo-bar>.c-Foo-bar'), patternB);
        });

        it('rejects invalid chained selectors', function () {
          assertFailure(s('.Foo .cc-Foo'), patternB);
          assertFailure(s('.Foo > .Foo-F'), patternB);
        });
      });
    });
  });

  describe('using SUIT pattern (default)', function () {
    it('selectors must begin with the component name', function () {
      assertSuccess(fixture('valid-rules'));
      assertFailure(fixture('all-false-match'));
      assertFailure(fixture('all-invalid-selector-tag'));
      assertFailure(fixture('all-invalid-selector-component'));
    });

    it('custom properties must begin with the component name', function () {
      assertSuccess(fixture('all-valid-root-vars'));
      assertFailure(fixture('all-invalid-root-vars'));
      assertFailure(fixture('all-invalid-root-property'));
      assertFailure(fixture('all-invalid-root-selector'));
    });

    it('must apply to selectors in media queries', function () {
      assertSuccess(fixture('all-valid-selector-in-media-query'));
      assertFailure(fixture('all-invalid-selector-in-media-query'));
    });

    describe('in strict mode', function () {
      it('selectors must only contain valid component classes', function () {
        assertSuccess(fixture('strict-valid-rules'));
        assertFailure(fixture('strict-invalid-selector'));
      });
    });
  });

  describe('using BEM pattern', function () {
    it('accepts valid selectors in strict mode', function () {
      assertSuccess(fixture('strict-bem-valid'), 'bem');
    });

    describe('when given invalid selectors', function () {
      var s = selectorTester('/** @define block; use strict */');

      // mirroring tests from
      // https://github.com/bem/bem-naming/blob/master/test/original/validate.test.js
      it('should not validate elem without block', function () {
        assertFailure(s('__elem'), 'bem');
      });

      it('should not validate boolean mod without block', function () {
        assertFailure(s('_mod'), 'bem');
      });

      it('should not validate mod without block', function () {
        assertFailure(s('_mod_val'), 'bem');
      });

      it('should not validate mod of elem without block', function () {
        assertFailure(s('__elem_mod_val'), 'bem');
      });

      it('should not validate boolean mod of elem without block', function () {
        assertFailure(s('__elem_mod'), 'bem');
      });

      it('should not validate nested elem', function () {
        assertFailure(s('block__elem1__elem2'), 'bem');
      });

      it('should not validate multi mod', function () {
        assertFailure(s('block_mod_val__elem_mod_val'), 'bem');
      });

      it('should not validate block name with illegal literals', function () {
        assertFailure(s('^_^'), 'bem');
      });
    });
  });
});
