var util = require('./test-util');
var assertSingleFailure = util.assertSingleFailure;

describe('using BEM pattern', function () {
  it('accepts valid selectors', function (done) {
    util.assertSuccess(done, util.fixture('bem-valid'), 'bem');
  });

  describe('when given invalid selectors', function () {
    var s = util.selectorTester('/** @define block */');

    // mirroring tests from
    // https://github.com/bem/bem-naming/blob/master/test/original/validate.test.js
    it('should not validate elem without block', function (done) {
      assertSingleFailure(done, s('__elem'), 'bem');
    });

    it('should not validate boolean mod without block', function (done) {
      assertSingleFailure(done, s('_mod'), 'bem');
    });

    it('should not validate mod without block', function (done) {
      assertSingleFailure(done, s('_mod_val'), 'bem');
    });

    it('should not validate mod of elem without block', function (done) {
      assertSingleFailure(done, s('__elem_mod_val'), 'bem');
    });

    it(
      'should not validate boolean mod of elem without block',
      function (done) {
        assertSingleFailure(done, s('__elem_mod'), 'bem');
      }
    );

    it('should not validate nested elem', function (done) {
      assertSingleFailure(done, s('block__elem1__elem2'), 'bem');
    });

    it('should not validate multi mod', function (done) {
      assertSingleFailure(done, s('block_mod_val__elem_mod_val'), 'bem');
    });

    it(
      'should not validate block name with illegal literals',
      function (done) {
        assertSingleFailure(done, s('^_^'), 'bem');
      }
    );
  });
});
