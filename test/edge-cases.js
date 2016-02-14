var postcss = require('postcss');
var assert = require('assert');
var linter = require('..');

describe('nodes without sources', function() {
  it('works and does not throw an error', function(done) {
    var sourcelessAST = postcss.root();
    var comment = postcss.comment({ text: 'postcss-bem-linter: define Foo' });
    var rule = postcss.rule({ selector: '#bar' });
    sourcelessAST.append(comment);
    sourcelessAST.append(rule);
    postcss()
      .use(linter({ preset: 'suit' }))
      .process(sourcelessAST)
      .then(function(result) {
        var warnings = result.warnings();
        assert.equal(warnings[0].text, 'Invalid component selector "#bar"');
        done();
      }).catch(done);
  });
});
