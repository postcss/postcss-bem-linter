var util = require('./test-util');
var assertFailure = util.assertFailure;

describe('using BEM pattern', function () {
  it('accepts valid selectors in strict mode', function () {
    util.assertSuccess(util.fixture('strict-bem-valid'), 'bem');
  });

  describe('when given invalid selectors', function () {
    var s = util.selectorTester('/** @define block; use strict */');

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
