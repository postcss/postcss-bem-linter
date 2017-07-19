var assert = require('assert');
var postcss = require('postcss');
var getSelectors = require('../lib/get-selectors');

describe('getSelectors', () => {
  var root, componentRoot;

  beforeEach(() => {
    root = postcss.root();
    componentRoot = postcss.rule({selector: '.Component'});
    root.append(componentRoot);
  });

  it('should return the selector', () => {
    assert.deepEqual(getSelectors(componentRoot), ['.Component']);
  });

  it('should check for the existence of child nodes', () => {
    var rule = postcss.rule({selector: '.Component-d'});
    rule.nodes = undefined;
    componentRoot.append(rule);

    assert.deepEqual(getSelectors(rule), ['.Component .Component-d']);
  });

  it('should return selector if selector contains @extend without other declarations', () => {
    var rule = postcss.rule({selector: '.Component-d'});
    var extend = postcss.atRule({name: 'extend'});
    rule.append(extend);
    componentRoot.append(rule);

    assert.deepEqual(getSelectors(rule), ['.Component .Component-d']);
  });

  describe('ruleset declarations with nested rulesets', () => {
    it('should ignore a ruleset that has no declarations', () => {
      componentRoot.append({selector: '.Component-d'});
      componentRoot.append({text: 'comment'});

      assert.deepEqual(getSelectors(componentRoot), []);
    });

    it('should return a selector if the ruleset has declarations', () => {
      componentRoot.append({prop: 'color', value: 'green'});
      componentRoot.append({selector: '.Component-d'});
      componentRoot.append({text: 'comment'});

      assert.deepEqual(getSelectors(componentRoot), ['.Component']);
    });
  });

  describe('nested rulesets', () => {
    it('should unwrap selectors down from the parent to the current rule', () => {
      var rule = postcss.rule({selector: '.Component-d'});
      componentRoot.append(rule);

      assert.deepEqual(getSelectors(rule), ['.Component .Component-d']);
    });

    it('should unwrap `&` selectors', () => {
      var rule = postcss.rule({selector: '&.is-active'});
      componentRoot.append(rule);

      assert.deepEqual(getSelectors(rule), ['.Component.is-active']);
    });

    it('should unwrap multiple levels of nested rulesets and skip rules with no declarations', () => {
      var descendant = postcss.rule({selector: '.Component-d'});
      var hover = postcss.rule({selector: '&:hover'});
      var state = postcss.rule({selector: '&.is-active'});
      descendant.append([hover, state]);
      componentRoot.append(descendant);

      assert.deepEqual(getSelectors(componentRoot), []);
      assert.deepEqual(getSelectors(descendant), []);
      assert.deepEqual(getSelectors(hover), ['.Component .Component-d:hover']);
      assert.deepEqual(getSelectors(state), ['.Component .Component-d.is-active']);
    });

    describe('grouped selectors', () => {
      it('should unwrap grouped selectors without declarations', () => {
        var componentRoot = postcss.rule({selector: '.Component, .Component-d'});
        var hover = postcss.rule({selector: '&:hover'});
        var state = postcss.rule({selector: '&.is-active'});
        componentRoot.append([hover, state]);
        root.append(componentRoot);

        assert.deepEqual(getSelectors(componentRoot), []);
        assert.deepEqual(getSelectors(hover), ['.Component:hover', '.Component-d:hover']);
        assert.deepEqual(getSelectors(state), ['.Component.is-active', '.Component-d.is-active']);
      });

      it('should unwrap grouped selectors with declarations', () => {
        var componentRoot = postcss.rule({selector: '.Component, .Component-d'});
        var hover = postcss.rule({selector: '&:hover'});
        var state = postcss.rule({selector: '&.is-active'});
        componentRoot.append({prop: 'color', value: 'green'});
        componentRoot.append([hover, state]);
        root.append(componentRoot);

        assert.deepEqual(getSelectors(componentRoot), ['.Component', '.Component-d']);
        assert.deepEqual(getSelectors(hover), ['.Component:hover', '.Component-d:hover']);
        assert.deepEqual(getSelectors(state), ['.Component.is-active', '.Component-d.is-active']);
      });
    });
  });

  describe('ruleset within an atrule block', () => {
    it('should unwrap selectors as normal', () => {
      var root = postcss.root();
      var componentRoot = postcss.rule({selector: '.Component'});
      var rule = postcss.rule({selector: '.Component-d'});
      var media = postcss.atRule({name: 'media'});
      componentRoot.append(rule);
      media.append(componentRoot);
      root.append(media);

      assert.deepEqual(getSelectors(componentRoot), []);
      assert.deepEqual(getSelectors(rule), ['.Component .Component-d']);
    });
  });

  describe('media queries nested in a ruleset', () => {
    it('should return a selector for a child rule inside a nested media query', () => {
      var rule = postcss.rule({selector: '.Component-d'});
      var media = postcss.atRule({name: 'media'});
      media.append(rule);
      componentRoot.append(media);

      assert.deepEqual(getSelectors(rule), ['.Component .Component-d']);
      assert.deepEqual(getSelectors(componentRoot), []);
    });

    it('should return a selector for a ruleset with declarations and nested media query', () => {
      componentRoot.append({prop: 'color', value: 'green'});
      var rule = postcss.rule({selector: '.Component-d'});
      var media = postcss.atRule({name: 'media'});
      media.append(rule);
      componentRoot.append(media);

      assert.deepEqual(getSelectors(rule), ['.Component .Component-d']);
      assert.deepEqual(getSelectors(componentRoot), ['.Component']);
    });
  })
});
