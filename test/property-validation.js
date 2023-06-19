const util = require('./test-util');

const assertSuccess = util.assertSuccess;
const assertSingleFailure = util.assertSingleFailure;
const assertFailure = util.assertFailure;
const fixture = util.fixture;

describe('property validation', () => {
  it('accepts custom properties that begin with the component name', () => {
    assertSuccess(fixture('properties-valid'));
    assertSuccess(fixture('properties-bem-valid'), {preset: 'bem'});
  });

  it('accepts custom properties that implicitly begin with the component name', () => {
    const filenameBlock = `${process.cwd()}/component-name.css`;
    assertSuccess(
      fixture('implicit-component-properties-valid'),
      {preset: 'bem', implicitComponents: true},
      null,
      filenameBlock
    );
  });

  it('accepts custom properties that implicitly begin with the component name in bem files', () => {
    const filenameMod = `${process.cwd()}/component-name_mod.css`;
    assertSuccess(
      fixture('implicit-component-mod-properties-valid'),
      {preset: 'bem', implicitComponents: true},
      null,
      filenameMod
    );

    const filenameElement = `${process.cwd()}/component-name__element.css`;
    assertSuccess(
      fixture('implicit-component-element-properties-valid'),
      {preset: 'bem', implicitComponents: true},
      null,
      filenameElement
    );
  });

  it('rejects custom properties that do not begin with the implicit component name in bem files', () => {
    const filenameBlock = `${process.cwd()}/component-name-invalid.css`;
    assertFailure(
      fixture('implicit-component-properties-valid'),
      {preset: 'bem', implicitComponents: true},
      null,
      filenameBlock
    );

    const filenameMod = `${process.cwd()}/component-name-invalid_mod.css`;
    assertFailure(
      fixture('implicit-component-mod-properties-valid'),
      {preset: 'bem', implicitComponents: true},
      null,
      filenameMod
    );

    const filenameElement = `${process.cwd()}/component-name-invalid__element.css`;
    assertFailure(
      fixture('implicit-component-element-properties-valid'),
      {preset: 'bem', implicitComponents: true},
      null,
      filenameElement
    );
  });

  const invDef = '/** @define InvalidRootVars */';

  it('accepts an empty root', () => {
    assertSuccess(`${invDef}:root {}`);
  });

  it('rejects custom properties that do not being with the component name', () => {
    assertSingleFailure(
      `${invDef}:root { --invalid-InvalidRootVars-color: green; }`
    );
  });
});
