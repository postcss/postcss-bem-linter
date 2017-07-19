var util = require('./test-util');
var assertSingleFailure = util.assertSingleFailure;
var assertSuccess = util.assertSuccess;

describe('using BEM pattern', () => {
  it('accepts valid selectors', () => {
    assertSuccess(util.fixture('bem-valid'), 'bem');
  });

  describe('nesting selectors', () => {
    it('accepts nested rulesets', () => {
      assertSuccess(util.fixture('bem-nesting'), 'bem');
    });
  });

  describe('when given invalid selectors', () => {
    var s = util.selectorTester('/** @define block */');

    // mirroring tests from https://goo.gl/G0VZHZ
    it('should not validate elem without block', () => {
      assertSingleFailure(s('__elem'), 'bem');
    });

    it('should not validate boolean mod without block', () => {
      assertSingleFailure(s('_mod'), 'bem');
    });

    it('should not validate mod without block', () => {
      assertSingleFailure(s('_mod_val'), 'bem');
    });

    it('should not validate mod of elem without block', () => {
      assertSingleFailure(s('__elem_mod_val'), 'bem');
    });

    it(
      'should not validate boolean mod of elem without block',
      () => {
        assertSingleFailure(s('__elem_mod'), 'bem');
      }
    );

    it('should not validate nested elem', () => {
      assertSingleFailure(s('block__elem1__elem2'), 'bem');
    });

    it('should not validate multi mod', () => {
      assertSingleFailure(s('block_mod_val__elem_mod_val'), 'bem');
    });

    it(
      'should not validate block name with illegal literals',
      () => {
        assertSingleFailure(s('^_^'), 'bem');
      }
    );
  });

  describe('understands namespaces', () => {
    var s = util.selectorTester('/** @define block */');

    it('and with namespace `ns` accepts `ns-block`', () => {
      assertSuccess(s('.ns-block'), 'bem', { namespace: 'ns' });
    });

    it('and with namespace `Ho04` accepts `Ho04-block`', () => {
      assertSuccess(s('.Ho04-block'), 'bem', { namespace: 'Ho04' });
    });

    it('and with namespace `ns` rejects `.block`', () => {
      assertSingleFailure(s('.block'), 'bem', { namespace: 'ns' });
    });
  });

  describe('in weak mode', () => {
    var sWeak = util.selectorTester('/** @define block; weak */');

    it('accepts `block__elem #foo`', () => {
      assertSuccess(sWeak('.block__elem #foo'), 'bem');
    });
  });
});
