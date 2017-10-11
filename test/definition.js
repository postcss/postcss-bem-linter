'use strict';

const util = require('./test-util');

describe('`@define` notation', () => {
  describe('empty CSS', () => {
    it('must be ignored', () => {
      util.assertSuccess('');
    });
  });

  describe('CSS that lacks a definition', () => {
    it('must be ignored', () => {
      util.assertSuccess('.horse { color: pink; }');
    });
  });

  describe('CSS with a malformed definition', () => {
    it('must be ignored', () => {
      util.assertSuccess('/** @deforne Foo */ .Foo { color: pink; }');
    });
  });

  describe('CSS with a rule violating defintion', () => {
    it('should complain', () => {
      util.assertFailure('/** @define Foo */ .Bar { color: pink; }');
      util.assertFailure('/* @define Foo */ .Bar { color: pink; }');
    });
  });

  describe('CSS with a definition violating the `componentName` pattern', () => {
    it('must complain', () => {
      util.assertSingleFailure('/** @define my-_-__Component */ .my-_-__Component { color: pink; }');
    });
  });
});

describe('Implicit @define', () => {
  describe('based on filename', () => {
    const filename = `${process.cwd()}/css/c/implicit-component.css`;
    const filenameWithUnderscore = `${process.cwd()}/css/c/_implicit-component.scss`;
    const css = '.implicit-component-broken {}';

    it('must complain when true', () => {
      util.assertSingleFailure(css, {implicitComponents: true, preset: 'bem'}, null, filename);
      util.assertSingleFailure(css, {implicitComponents: true, preset: 'bem'}, null, filenameWithUnderscore);
    });

    it('must complain when string', () => {
      util.assertSingleFailure(css, {implicitComponents: 'css/**/*.css', preset: 'bem'}, null, filename);
      util.assertSingleFailure(css, {implicitComponents: 'css/**/*.scss', preset: 'bem'}, null, filenameWithUnderscore);
    });

    it('must complain when array', () => {
      util.assertSingleFailure(css, {implicitComponents: ['css/c/*.css'], preset: 'bem'}, null, filename);
      util.assertSingleFailure(css, {implicitComponents: ['css/c/*.scss'], preset: 'bem'}, null, filenameWithUnderscore);
    });

    it('must use the parent directory if the file name is index.css', () => {
      util.assertSuccess('.implicit-component {}', {
        implicitComponents: true,
        preset: 'bem',
      }, null, `${process.cwd()}/css/implicit-component/index.css`);
      util.assertSuccess('.implicit-component {}', {
        implicitComponents: true,
        preset: 'bem',
      }, null, `${process.cwd()}/css/implicit-component/_index.css`);
    });

    it('must complain about component name', () => {
      util.assertSingleFailure(
        css,
        {
          implicitComponents: true,
          componentName: /[A-Z]+/,
          componentSelectors() {return /.*/;},
        },
        null,
        filename
      );
      util.assertSingleFailure(
        css,
        {
          implicitComponents: true,
          componentName: /[A-Z]+/,
          componentSelectors() {return /.*/;},
        },
        null,
        filenameWithUnderscore
      );
    });
  });

  describe('utilities', () => {
    it('must complain', () => {
      util.assertSingleFailure('.foo-bar {}', {implicitUtilities: ['utils/*.css'], preset: 'suit'}, null, 'utils/foo-bar.css');
    });
  });
});
