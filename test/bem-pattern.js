var util = require('./test-util');
var assertSingleFailure = util.assertSingleFailure;
var assertSuccess = util.assertSuccess;

describe('using BEM pattern', function() {
  it('accepts valid selectors', function(done) {
    util.assertSuccess(done, util.fixture('bem-valid'), 'bem');
  });

  describe('when given invalid selectors', function() {
    var s = util.selectorTester('/** @define block */');

    // mirroring tests from http://goo.gl/Db6QPu
    it('should not validate elem without block', function(done) {
      assertSingleFailure(done, s('__elem'), 'bem');
    });

    it('should not validate boolean mod without block', function(done) {
      assertSingleFailure(done, s('_mod'), 'bem');
    });

    it('should not validate mod without block', function(done) {
      assertSingleFailure(done, s('_mod_val'), 'bem');
    });

    it('should not validate mod of elem without block', function(done) {
      assertSingleFailure(done, s('__elem_mod_val'), 'bem');
    });

    it(
      'should not validate boolean mod of elem without block',
      function(done) {
        assertSingleFailure(done, s('__elem_mod'), 'bem');
      }
    );

    it('should not validate nested elem', function(done) {
      assertSingleFailure(done, s('block__elem1__elem2'), 'bem');
    });

    it('should not validate multi mod', function(done) {
      assertSingleFailure(done, s('block_mod_val__elem_mod_val'), 'bem');
    });

    it(
      'should not validate block name with illegal literals',
      function(done) {
        assertSingleFailure(done, s('^_^'), 'bem');
      }
    );
  });

  describe('understands namespaces', function() {
    var s = util.selectorTester('/** @define block */');

    it('and with namespace `ns` accepts `ns-block`', function(done) {
      assertSuccess(done, s('.ns-block'), 'bem', { namespace: 'ns' });
    });

    it('and with namespace `Ho04` accepts `Ho04-block`', function(done) {
      assertSuccess(done, s('.Ho04-block'), 'bem', { namespace: 'Ho04' });
    });

    it('and with namespace `ns` rejects `.block`', function(done) {
      assertSingleFailure(done, s('.block'), 'bem', { namespace: 'ns' });
    });
  });
});
