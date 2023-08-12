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

function hasOnlyAllowedAtRules(node) {
  let containsAllowed = false;
  let containsNotAllowed = false;

  if (hasChildNodes(node)) {
    node.each(child => {
      if (
        child.type === 'atrule' &&
        (child.name === 'extend' ||
          child.name === 'media' ||
          child.name === 'include')
      ) {
        containsAllowed = true;
      } else if (child.type !== 'comment') {
        containsNotAllowed = true;
      }
    });
  }
  return containsAllowed && !containsNotAllowed;
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
  // as these don't exist after rules have been unwrapped (unless the selector contains only a @extend or @media)
  if (hasNoDeclarations(rule) && !hasOnlyAllowedAtRules(rule)) {
    return [];
  }

  if (isNestedRule(rule)) {
    return unWrapSelectors(rule);
  }

  return rule.selectors;
}

module.exports = getSelectors;
