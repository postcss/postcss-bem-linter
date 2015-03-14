# postcss-bem-linter

[![Build Status](https://secure.travis-ci.org/necolas/postcss-bem-linter.png?branch=master)](http://travis-ci.org/necolas/postcss-bem-linter)

A [PostCSS](https://github.com/postcss/postcss) plugin to lint *BEM-style* CSS.

*BEM-style* describes CSS that follows a more-or-less strict set of conventions determining
what selectors can be used. Typically, these conventions require that classes be namespaced
according to the component (or "block") that contains them, and that all characters after the
namespace follow a specified pattern. Original BEM methodology refers to "blocks", "elements",
and "modifiers"; SUIT refers to "components", "descendants", and "modifiers". You might have your
own terms for similar concepts.

With this plugin, you can check the validity of stylesheets against a set of BEM-style conventions.
You can use preset patterns (SUIT and BEM, currently) or insert your own. The plugin will throw an
error if it finds CSS that does not follow the specified conventions.

## Installation

```
npm install postcss-bem-linter
```

## Conformance tests

**Default mode**:

* Only allow selectors that *begin* with a selector sequence matching the defined convention.
* Only allow custom-property names that *begin* with the defined `ComponentName`.
* The `:root` selector can only contain custom-properties.
* The `:root` cannot be combined with other selectors.

**Strict mode**:

* All the tests in "default mode".
* Disallow selectors that contain chained selector sequences that do not match the
  defined convention. (The convention for chained sequences can be the same as or different from
  that for initial sequences.)

## Use

```
postcss().use(bemLinter([pattern]));
```

### Defining your pattern

Patterns consist of regular expressions that describe valid selector sequences.

Please note that *patterns define sequences, not just simple selectors*. So if, for example,
you would like to be able to chain state classes to your component classes, as in
`.Component.is-open`, your pattern needs to allow for this chaining.

Also note that *pseudo-classes and pseudo-elements must be at the end of sequences, and
will be ignored*. Instead of `.Component:first-child.is-open` you should use
`.Component.is-open:first-child`. The former will cause an error.

#### Preset Patterns

You can use a preset pattern by passing a string. The following preset patterns are available:

- `'suit'` (default), as defined [here](https://github.com/suitcss/suit/blob/master/doc/naming-conventions.md).
- `'bem'`, as defined [here](https://en.bem.info/tools/bem/bem-naming/).

**`'suit'` is the default pattern**; so if you do not pass any `pattern` argument,
SUIT conventions will be enforced.

#### Custom Patterns

You can define a custom pattern by passing an object with the following properties:

- `componentName` (optional): A regular expression describing valid component names.
  Default is `/[-_a-zA-Z0-9]+/`.
- `selectors`: Either of the following:
  - A single function that accepts a component name and returns a regular expression describing
    all valid selectors.
  - An object consisting of two methods, `initial` and `chainable`. Both methods accept a
    component name and return a regular expression. `initial` returns a description of valid
    initial selector sequences — those occurring at the beginning of a selector. `chainable` returns
    a description of valid chainable selector sequences — those occurring after the first sequence.
    Two things to note: In non-strict mode, *any* chained sequences are accepted.
    And if you do not specify a chainable pattern, in strict mode it is assumed that chained
    selectors must match the same pattern as initial selectors.

So you might call the plugin in any of the following ways:

```js
// use 'suit' conventions
bemLinter();
bemLinter('suit');

// use 'bem' conventions
bemLinter('bem');

// define a RegExp for component names
bemLinter({
  componentName: /[A-Z]+/
});

// define a single RegExp for all selector sequences, initial or chained
bemLinter({
  selectors: function(componentName) {
    return new RegExp('^\\.' + componentName + '(?:-[a-z]+)?$');
  }
});

// define separate `componentName`, `initial`, and `chainable` RegExps
bemLinter({
  componentName: /[A-Z]+/,
  selectors: {
    initial: function(componentName) {
      return new RegExp('^\\.' + componentName + '(?:-[a-z]+)?$');
    },
    chainable: function(componentName) {
      return new RegExp('^\\.chained-' + componentName + '-[a-z]+$');
    }
  }
});
```

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

If the component name does not match your `componentName` pattern, the plugin will throw an error.

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
