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
    var filenameWithUnderscore = process.cwd() + '/css/c/_implicit-component.scss';
    var css = '.implicit-component-broken {}';

    it('must complain when true', function() {
      util.assertSingleFailure(css, {implicitComponents: true, preset: 'bem'}, null, filename);
      util.assertSingleFailure(css, {implicitComponents: true, preset: 'bem'}, null, filenameWithUnderscore);
    });

    it('must complain when string', function() {
      util.assertSingleFailure(css, {implicitComponents: 'css/**/*.css', preset: 'bem'}, null, filename);
      util.assertSingleFailure(css, {implicitComponents: 'css/**/*.scss', preset: 'bem'}, null, filenameWithUnderscore);
    });

    it('must complain when array', function() {
      util.assertSingleFailure(css, {implicitComponents: ['css/c/*.css'], preset: 'bem'}, null, filename);
      util.assertSingleFailure(css, {implicitComponents: ['css/c/*.scss'], preset: 'bem'}, null, filenameWithUnderscore);
    });

    it('must use the parent directory if the file name is index.css', function() {
      util.assertSuccess('.implicit-component {}', {
        implicitComponents: true,
        preset: 'bem',
      }, null, process.cwd() + '/css/implicit-component/index.css');
      util.assertSuccess('.implicit-component {}', {
        implicitComponents: true,
        preset: 'bem',
      }, null, process.cwd() + '/css/implicit-component/_index.css');
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
      util.assertSingleFailure(
        css,
        {
          implicitComponents: true,
          componentName: /[A-Z]+/,
          componentSelectors: function() { return /.*/; },
        },
        null,
        filenameWithUnderscore
      );
    });
  });

  describe('utilities', function() {
    it('must complain', function() {
      util.assertSingleFailure('.foo-bar {}', {implicitUtilities: ['utils/*.css'], preset: 'suit'}, null, 'utils/foo-bar.css');
    });
  });
});
