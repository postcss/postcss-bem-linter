'use strict';

const resolveNestedSelector = require('postcss-resolve-nested-selector');

function isNestedRule(node) {
  return /(?:at)?rule/.test(node.parent.type);
}

function hasChildNodes(node) {
  return node.nodes && node.nodes.length;
}

function hasNoDeclarations(node) {
  return hasChildNodes(node) && node.every(child => child.type !== 'decl');
}

function hasOnlyExtends(node) {
  return (
    hasChildNodes(node) &&
    node.every(child => child.type === 'atrule' && child.name === 'extend')
  );
}

function unWrapSelectors(rule) {
  let selectors = [];
  rule.selectors.forEach(selector => {
    selectors = selectors.concat(resolveNestedSelector(selector, rule));
  });
  return selectors;
}

function getSelectors(rule) {
  // Skip validation on rules with no declarations
  // as these don't exist after rules have been unwrapped (unless the selector contains only a @extend)
  if (hasNoDeclarations(rule) && !hasOnlyExtends(rule)) {
    return [];
  }

  if (isNestedRule(rule)) {
    return unWrapSelectors(rule);
  }

  return rule.selectors;
}

module.exports = getSelectors;
