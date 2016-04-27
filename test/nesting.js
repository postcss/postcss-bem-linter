var assert = require('assert');
var rewire = require('rewire');
var postcss = require('postcss');
var validateSelectors = rewire('../lib/validate-selectors');

describe('getSelectors function', function() {
  var getSelectors = validateSelectors.__get__('getSelectors');
  var root, componentRoot;

  beforeEach(function() {
    root = postcss.root();
    componentRoot = postcss.rule({selector: '.Component'});
    root.append(componentRoot);
  });

  it('should return the selector', function() {
    assert.deepEqual(getSelectors(componentRoot), ['.Component']);
  });

  describe('ruleset declarations with nested rulesets', function() {
    it('should ignore a ruleset that has no declarations', function() {
      componentRoot.append({selector: '.Component-d'});
      componentRoot.append({text: 'comment'});

      assert.deepEqual(getSelectors(componentRoot), null);
    });

    it('should return a selector if the ruleset has declarations', function() {
      componentRoot.append({prop: 'color', value: 'green'});
      componentRoot.append({selector: '.Component-d'});
      componentRoot.append({text: 'comment'});

      assert.deepEqual(getSelectors(componentRoot), ['.Component']);
    });
  });

  describe('nested rulesets', function() {
    it('should unwrap selectors down from the parent to the current rule', function() {
      var rule = postcss.rule({selector: '.Component-d'});
      componentRoot.append(rule);

      assert.deepEqual(getSelectors(rule), ['.Component .Component-d']);
    });

    it('should unwrap `&` selectors', function() {
      var rule = postcss.rule({selector: '&.is-active'});
      componentRoot.append(rule);

      assert.deepEqual(getSelectors(rule), ['.Component.is-active']);
    });

    it('should unwrap multiple levels of nested rulesets and skip rules with no declarations', function() {
      var descendant = postcss.rule({selector: '.Component-d'});
      var hover = postcss.rule({selector: '&:hover'});
      var state = postcss.rule({selector: '&.is-active'});
      descendant.append([hover, state]);
      componentRoot.append(descendant);

      assert.deepEqual(getSelectors(componentRoot), null);
      assert.deepEqual(getSelectors(descendant), null);
      assert.deepEqual(getSelectors(hover), ['.Component .Component-d:hover']);
      assert.deepEqual(getSelectors(state), ['.Component .Component-d.is-active']);
    });

    describe('grouped selectors', function() {
      it('should unwrap grouped selectors without declarations', function() {
        var componentRoot = postcss.rule({selector: '.Component, .Component-d'});
        var hover = postcss.rule({selector: '&:hover'});
        var state = postcss.rule({selector: '&.is-active'});
        componentRoot.append([hover, state]);
        root.append(componentRoot);

        assert.deepEqual(getSelectors(componentRoot), null);
        assert.deepEqual(getSelectors(hover), ['.Component:hover', '.Component-d:hover']);
        assert.deepEqual(getSelectors(state), ['.Component.is-active', '.Component-d.is-active']);
      });

      it('should unwrap grouped selectors with declarations', function() {
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

  describe('ruleset within an atrule block', function() {
    it('should unwrap selectors as normal', function() {
      var rule = postcss.rule({selector: '.Component-d'});
      var media = postcss.atRule({name: 'media'});
      componentRoot.append(rule);
      media.append(componentRoot);

      assert.deepEqual(getSelectors(componentRoot), null);
      assert.deepEqual(getSelectors(rule), ['.Component .Component-d']);
    });
  });

  describe('media queries nested in a ruleset', function() {
    it('should return a selector for a child rule inside a nested media query', function() {
      var rule = postcss.rule({selector: '.Component-d'});
      var media = postcss.atRule({name: 'media'});
      media.append(rule);
      componentRoot.append(media);

      assert.deepEqual(getSelectors(rule), ['.Component .Component-d']);
      assert.deepEqual(getSelectors(componentRoot), null);
    });

    it('should return a selector for a ruleset with declarations and nested media query', function() {
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
