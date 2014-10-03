/**
 * JavaScript code style rules
 *
 * source: https://github.com/mdevils/node-jscs
 * list of available rules: http://catatron.com/node-jscs/rules/
 */
module.exports = {
  // plugins and their options
  additionalRules: [
    'node_modules/jscs-jsdoc/lib/rules/*.js'
  ],
  jsDoc: {
    checkParamNames: true,
    checkRedundantParams: true,
    requireParamTypes: true,
    checkReturnTypes: true,
    checkRedundantReturns: true,
    checkTypes: true,
    requireReturnTypes: true
  },

  disallowKeywordsOnNewLine: [
    'else'
  ],
  disallowMixedSpacesAndTabs: true,
  disallowMultipleLineBreaks: true,
  disallowMultipleLineStrings: true,
  disallowMultipleVarDecl: true,
  disallowSpaceAfterObjectKeys: true,
  disallowSpaceAfterPrefixUnaryOperators: true,
  disallowSpaceBeforePostfixUnaryOperators: true,
  disallowSpacesInFunctionDeclaration: {
    beforeOpeningRoundBrace: true,
  },
  disallowSpacesInNamedFunctionExpression: {
    beforeOpeningRoundBrace: true
  },
  disallowSpacesInsideParentheses: true,
  disallowTrailingWhitespace: true,
  disallowYodaConditions: true,

  excludeFiles: [
    'node_modules/**'
  ],

  maximumLineLength: {
    allowRegex: true,
    allowUrlComments: true,
    value: 80
  },

  requireCamelCaseOrUpperCaseIdentifiers: true,
  requireCapitalizedConstructors: true,
  requireCurlyBraces: [
    'catch',
    'do',
    'else',
    'for',
    'if',
    'try',
    'while'
  ],
  requireDotNotation: true,
  requireLineFeedAtFileEnd: true,
  requireOperatorBeforeLineBreak: true,
  requireParenthesesAroundIIFE: true,
  requireSpaceAfterBinaryOperators: true,
  requireSpaceAfterKeywords: [
    'catch',
    'do',
    'else',
    'for',
    'if',
    'return',
    'switch',
    'try',
    'while'
  ],
  requireSpaceBeforeBinaryOperators: true,
  requireSpaceBeforeBlockStatements: true,
  requireSpacesInConditionalExpression: true,
  requireSpacesInAnonymousFunctionExpression: {
    beforeOpeningRoundBrace: true,
    beforeOpeningCurlyBrace: true
  },
  requireSpacesInsideArrayBrackets: 'allButNested',
  requireSpacesInsideObjectBrackets: 'allButNested',

  validateIndentation: 2,
  validateQuoteMarks: '\''
};
