var listSequences = require('./list-sequences');
var shouldIgnoreRule = require('./should-ignore-rule');
var shouldIgnoreSelector = require('./should-ignore-selector');
var toInterpoloatedRegexp = require('./to-interpolated-regexp');
var resolveNestedSelector = require('postcss-resolve-nested-selector');

function isTopLevel(node) {
  return node.type === 'root';
}

function isNestedRule(node) {
  return node.parent.type === 'rule';
}

function hasNoDeclarations(node) {
  return node.nodes.length && node.every(function(child) {
    return child.type !== 'decl';
  });
}

function getComponentRootRule(node) {
  while (!isTopLevel(node.parent)) {
    node = node.parent;
  }
  return node;
}

function unWrapSelectors(parent, rule) {
  var selectors = [];
  parent.walkRules(function(node) {
    // Only unwrap as far as the current rule being linted
    if (node.selector !== rule.selector) {return;}
    node.selectors.forEach(function(selector) {
      selectors = selectors.concat(resolveNestedSelector(selector, node));
    });
  });
  return selectors;
}

function getSelectors(rule) {
  // Skip validation on parent rules with no declarations
  // as these don't exist after rules have been unwrapped
  if (isTopLevel(rule.parent) && hasNoDeclarations(rule)) {
    return null;
  }

  if (isNestedRule(rule)) {
    var componentRootRule = getComponentRootRule(rule);
    var nestedSelectors = unWrapSelectors(componentRootRule, rule);
    return nestedSelectors;
  }

  return rule.selectors;
}

/**
 * @param {Object} config
 * @param {Rule} config.rule - PostCSS Rule
 * @param {String} config.componentName
 * @param {Boolean} config.weakMode
 * @param {Object} config.selectorPattern
 * @param {Object} config.selectorPatternOptions
 * @param {RegExp} config.ignorePattern
 * @param {Result} config.result - PostCSS Result, for registering warnings
 */
module.exports = function(config) {
  if (shouldIgnoreRule(config.rule)) return;
  var rule = config.rule;

  var initialPattern = (config.selectorPattern.initial)
    ? toInterpoloatedRegexp(config.selectorPattern.initial)(config.componentName, config.selectorPatternOptions)
    : toInterpoloatedRegexp(config.selectorPattern)(config.componentName, config.selectorPatternOptions);
  var combinedPattern = (config.selectorPattern.combined)
    ? toInterpoloatedRegexp(config.selectorPattern.combined)(config.componentName, config.selectorPatternOptions)
    : toInterpoloatedRegexp(initialPattern);
  var selectors = getSelectors(rule);

  if (!selectors) {return;}

  selectors.forEach(function(selector) {
    // Don't bother with :root
    if (selector === ':root') return;

    var allSequences = listSequences(selector);
    var sequence;
    for (var i = 0, l = allSequences.length; i < l; i++) {
      if (config.weakMode && i !== 0) return;
      sequence = allSequences[i];
      if (config.ignorePattern && shouldIgnoreSelector(sequence, config.ignorePattern)) continue;
      if (i === 0 && initialPattern.test(sequence)) continue;
      if (i !== 0 && combinedPattern.test(sequence)) continue;

      config.result.warn(
        'Invalid component selector "' + selector + '"',
        {
          node: rule,
          word: selector,
        }
      );
      return;
    }
  });
}
