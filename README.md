# postcss-bem-linter

[![Build Status](https://secure.travis-ci.org/necolas/postcss-bem-linter.png?branch=master)](http://travis-ci.org/necolas/postcss-bem-linter)

A [PostCSS](https://github.com/postcss/postcss) plugin to lint BEM-style CSS,
ported from [rework-suit-conformance](https://github.com/suitcss/rework-suit-conformance)
Currently only supports the [SUIT CSS](https://github.com/suitcss/suit) methodology.

## Installation

```
npm install postcss-bem-linter
```

## Conformance tests

**Default mode**:

* Only allow selectors that *begin* with a class matching the defined `ComponentName`.
* Only allow custom-property names that *begin* with the defined `ComponentName`.
* The `:root` selector can only contain custom-properties.
* The `:root` cannot be combined with other selectors.

**Strict mode**:

* All the tests in "default mode".
* Disallow selectors that contain any classes that do not match the SUIT CSS conventions.
* Disallow selectors that contain classes of other components.

## Use

### Defining a component

The plugin will only run against files that explicitly define themselves as a
named component, using a `/** @define ComponentName */` or `/** @define
ComponentName; use strict */` comment on the first line of the file.

```css
/** @define MyComponent */

:root {
  --MyComponent-property: value;
}

.MyComponent {}

.MyComponent .other {}
```

Strict mode:

```css
/** @define MyComponent; use strict */

:root {
  --MyComponent-property: value;
}

.MyComponent {}

.MyComponent-other {}
```

### Testing CSS files

Pass your individual CSS files through the plugin. It will throw errors for
conformance failures, which you can log when caught by your build tools.

```js
var postcss = require('postcss');
var bemLinter = require('postcss-bem-linter');

files.forEach(function (file) {
  var css = fs.readFileSync(file, 'utf-8');
  postcss().use(bemLinter()).process(css);
});
```

## Development

Install the dependencies.

```
npm install
```

Run the tests.

```
npm test
```

Watch and automatically re-run the unit tests.

```
npm start
```
