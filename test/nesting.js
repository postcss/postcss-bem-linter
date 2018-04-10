'use strict';

const assert = require('assert');
const postcss = require('postcss');
const getSelectors = require('../lib/get-selectors');

describe('getSelectors', () => {
  let root;
  let componentRoot;

  beforeEach(() => {
    root = postcss.root();
    componentRoot = postcss.rule({selector: '.Component'});
    root.append(componentRoot);
  });

  it('should return the selector', () => {
    assert.deepEqual(getSelectors(componentRoot), ['.Component']);
  });

  it('should check for the existence of child nodes', () => {
    const rule = postcss.rule({selector: '.Component-d'});
    rule.nodes = undefined;
    componentRoot.append(rule);

    assert.deepEqual(getSelectors(rule), ['.Component .Component-d']);
  });

  it('should return selector if selector contains @extend without other declarations', () => {
    const rule = postcss.rule({selector: '.Component-d'});
    const extend = postcss.atRule({name: 'extend'});
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
      const rule = postcss.rule({selector: '.Component-d'});
      componentRoot.append(rule);

      assert.deepEqual(getSelectors(rule), ['.Component .Component-d']);
    });

    it('should unwrap `&` selectors', () => {
      const rule = postcss.rule({selector: '&.is-active'});
      componentRoot.append(rule);

      assert.deepEqual(getSelectors(rule), ['.Component.is-active']);
    });

    it('should unwrap multiple levels of nested rulesets and skip rules with no declarations', () => {
      const descendant = postcss.rule({selector: '.Component-d'});
      const hover = postcss.rule({selector: '&:hover'});
      const state = postcss.rule({selector: '&.is-active'});
      descendant.append([hover, state]);
      componentRoot.append(descendant);

      assert.deepEqual(getSelectors(componentRoot), []);
      assert.deepEqual(getSelectors(descendant), []);
      assert.deepEqual(getSelectors(hover), ['.Component .Component-d:hover']);
      assert.deepEqual(getSelectors(state), [
        '.Component .Component-d.is-active',
      ]);
    });

    describe('grouped selectors', () => {
      it('should unwrap grouped selectors without declarations', () => {
        const componentRoot = postcss.rule({
          selector: '.Component, .Component-d',
        });
        const hover = postcss.rule({selector: '&:hover'});
        const state = postcss.rule({selector: '&.is-active'});
        componentRoot.append([hover, state]);
        root.append(componentRoot);

        assert.deepEqual(getSelectors(componentRoot), []);
        assert.deepEqual(getSelectors(hover), [
          '.Component:hover',
          '.Component-d:hover',
        ]);
        assert.deepEqual(getSelectors(state), [
          '.Component.is-active',
          '.Component-d.is-active',
        ]);
      });

      it('should unwrap grouped selectors with declarations', () => {
        const componentRoot = postcss.rule({
          selector: '.Component, .Component-d',
        });
        const hover = postcss.rule({selector: '&:hover'});
        const state = postcss.rule({selector: '&.is-active'});
        componentRoot.append({prop: 'color', value: 'green'});
        componentRoot.append([hover, state]);
        root.append(componentRoot);

        assert.deepEqual(getSelectors(componentRoot), [
          '.Component',
          '.Component-d',
        ]);
        assert.deepEqual(getSelectors(hover), [
          '.Component:hover',
          '.Component-d:hover',
        ]);
        assert.deepEqual(getSelectors(state), [
          '.Component.is-active',
          '.Component-d.is-active',
        ]);
      });
    });
  });

  describe('ruleset within an atrule block', () => {
    it('should unwrap selectors as normal', () => {
      const root = postcss.root();
      const componentRoot = postcss.rule({selector: '.Component'});
      const rule = postcss.rule({selector: '.Component-d'});
      const media = postcss.atRule({name: 'media'});
      componentRoot.append(rule);
      media.append(componentRoot);
      root.append(media);

      assert.deepEqual(getSelectors(componentRoot), []);
      assert.deepEqual(getSelectors(rule), ['.Component .Component-d']);
    });
  });

  describe('media queries nested in a ruleset', () => {
    it('should return a selector for a child rule inside a nested media query', () => {
      const rule = postcss.rule({selector: '.Component-d'});
      const media = postcss.atRule({name: 'media'});
      media.append(rule);
      componentRoot.append(media);

      assert.deepEqual(getSelectors(rule), ['.Component .Component-d']);
      assert.deepEqual(getSelectors(componentRoot), []);
    });

    it('should return a selector for a ruleset with declarations and nested media query', () => {
      componentRoot.append({prop: 'color', value: 'green'});
      const rule = postcss.rule({selector: '.Component-d'});
      const media = postcss.atRule({name: 'media'});
      media.append(rule);
      componentRoot.append(media);

      assert.deepEqual(getSelectors(rule), ['.Component .Component-d']);
      assert.deepEqual(getSelectors(componentRoot), ['.Component']);
    });
  });
});
