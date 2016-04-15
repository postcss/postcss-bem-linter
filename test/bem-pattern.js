var util = require('./test-util');
var assertSingleFailure = util.assertSingleFailure;
var assertSuccess = util.assertSuccess;

describe('using BEM pattern', function() {
  it('accepts valid selectors', function() {
    assertSuccess(util.fixture('bem-valid'), 'bem');
  });

  describe('nesting selectors', function() {
    it('accepts nested rulesets', function() {
      assertSuccess(util.fixture('bem-nesting'), 'bem');
    });
  });

  describe('when given invalid selectors', function() {
    var s = util.selectorTester('/** @define block */');

    // mirroring tests from http://goo.gl/Db6QPu
    it('should not validate elem without block', function() {
      assertSingleFailure(s('__elem'), 'bem');
    });

    it('should not validate boolean mod without block', function() {
      assertSingleFailure(s('_mod'), 'bem');
    });

    it('should not validate mod without block', function() {
      assertSingleFailure(s('_mod_val'), 'bem');
    });

    it('should not validate mod of elem without block', function() {
      assertSingleFailure(s('__elem_mod_val'), 'bem');
    });

    it(
      'should not validate boolean mod of elem without block',
      function() {
        assertSingleFailure(s('__elem_mod'), 'bem');
      }
    );

    it('should not validate nested elem', function() {
      assertSingleFailure(s('block__elem1__elem2'), 'bem');
    });

    it('should not validate multi mod', function() {
      assertSingleFailure(s('block_mod_val__elem_mod_val'), 'bem');
    });

    it(
      'should not validate block name with illegal literals',
      function() {
        assertSingleFailure(s('^_^'), 'bem');
      }
    );
  });

  describe('understands namespaces', function() {
    var s = util.selectorTester('/** @define block */');

    it('and with namespace `ns` accepts `ns-block`', function() {
      assertSuccess(s('.ns-block'), 'bem', { namespace: 'ns' });
    });

    it('and with namespace `Ho04` accepts `Ho04-block`', function() {
      assertSuccess(s('.Ho04-block'), 'bem', { namespace: 'Ho04' });
    });

    it('and with namespace `ns` rejects `.block`', function() {
      assertSingleFailure(s('.block'), 'bem', { namespace: 'ns' });
    });
  });

  describe('in weak mode', function() {
    var sWeak = util.selectorTester('/** @define block; weak */');

    it('accepts `block__elem #foo`', function() {
      assertSuccess(sWeak('.block__elem #foo'), 'bem');
    });
  });
});
