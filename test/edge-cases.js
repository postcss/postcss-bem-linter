'use strict';

const postcss = require('postcss');
const assert = require('assert');
const linter = require('..');

describe('nodes without sources', () => {
  it('should ignore both comments and rules', done => {
    const sourcelessAST = postcss.root();
    const comment = postcss.comment({text: 'postcss-bem-linter: define Foo'});
    const rule = postcss.rule({selector: '#bar'});
    sourcelessAST.append(comment);
    sourcelessAST.append(rule);
    postcss()
      .use(linter({preset: 'suit'}))
      .process(sourcelessAST, {from: undefined})
      .then(result => {
        const warnings = result.warnings();
        assert.equal(warnings.length, 0);
        done();
      })
      .catch(done);
  });
});
