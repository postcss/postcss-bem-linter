var util = require('./test-util');

describe('`@define` notation', function() {
  describe('empty CSS', function() {
    it('must be ignored', function() {
      util.assertSuccess('');
    });
  });

  describe('CSS that lacks a definition', function() {
    it('must be ignored', function() {
      util.assertSuccess('.horse { color: pink; }');
    });
  });

  describe('CSS with a malformed definition', function() {
    it('must be ignored', function() {
      util.assertSuccess('/** @deforne Foo */ .Foo { color: pink; }');
    });
  });

  describe('CSS with a definition violating the `componentName` pattern', function() {
    it('must complain', function() {
      util.assertSingleFailure('/** @define my-_-__Component */ .my-_-__Component { color: pink; }');
    });
  });
});

describe('Implicit @define', function() {
  describe('based on filename', function() {
    var filename = process.cwd() + '/css/c/implicit-component.css';
    var css = '.implicit-component-broken {}';

    it('must complain when true', function() {
      util.assertSingleFailure(css, {implicitComponents: true, preset: 'bem'}, null, filename);
    });

    it('must complain when string', function() {
      util.assertSingleFailure(css, {implicitComponents: 'css/**/*.css', preset: 'bem'}, null, filename);
    });

    it('must complain when array', function() {
      util.assertSingleFailure(css, {implicitComponents: ['css/c/*.css'], preset: 'bem'}, null, filename);
    });

    it('must complain about component name', function() {
      util.assertSingleFailure(
        css,
        {
          implicitComponents: true,
          componentName: /[A-Z]+/,
          componentSelectors: function() { return /.*/; },
        },
        null,
        filename
      );
    });
  });

  describe('utilities', function() {
    it('must complain', function() {
      util.assertSingleFailure('.foo-bar {}', {implicitUtilities: ['utils/*.css'], preset: 'suit'}, null, 'utils/foo-bar.css');
    });
  });
});
