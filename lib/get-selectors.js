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
        (child.name === 'extend' || child.name === 'media')
      ) {
        containsAllowed = true;
      } else if (child.type !== 'comment') {
        containsNotAllowed = true;
      }
    });
  }
  return containsAllowed && !containsNotAllowed;
}

function getComponentRootRule(node) {
  while (node.root() !== node.parent) {
    node = node.parent;
  }
  return node;
}

function unWrapSelectors(parent, rule) {
  let selectors = [];
  parent.walkRules(node => {
    // Only unwrap as far as the current rule being linted
    if (node.selector !== rule.selector) {
      return;
    }
    node.selectors.forEach(selector => {
      selectors = selectors.concat(resolveNestedSelector(selector, node));
    });
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
    const componentRootRule = getComponentRootRule(rule);
    const nestedSelectors = unWrapSelectors(componentRootRule, rule);
    return nestedSelectors;
  }

  return rule.selectors;
}

module.exports = getSelectors;
