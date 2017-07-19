'use strict';

const assert = require('assert');
const path = require('path');
const linter = require('..');
const fs = require('fs');
const postcss = require('postcss');

function getPostcssResult(css, primary, secondary, filename) {
  const result = postcss()
    .use(linter(primary, secondary))
    .process(css, {from: filename});
  return result;
}

function fixture(name) {
  return fs.readFileSync(path.join(__dirname, 'fixtures', `${name}.css`), 'utf8').trim();
}

function assertSuccess(css, primary, secondary, filename) {
  const result = getPostcssResult(css, primary, secondary, filename);
  assert.equal(result.warnings().length, 0);
}

function assertSingleFailure(css, primary, secondary, filename) {
  const result = getPostcssResult(css, primary, secondary, filename);
  assert.equal(result.warnings().length, 1);
}

function assertFailure(css, primary, secondary, filename) {
  const result = getPostcssResult(css, primary, secondary, filename);
  assert.ok(result.warnings().length > 0);
}

function selectorTester(def) {
  return selector => `${def}\n${selector} {}`;
}

module.exports = {
  fixture,
  assertSuccess,
  assertFailure,
  assertSingleFailure,
  selectorTester,
  test: getPostcssResult,
};
