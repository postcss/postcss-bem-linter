# postcss-bem-linter

[![Build Status](https://travis-ci.org/postcss/postcss-bem-linter.svg?branch=master)](https://travis-ci.org/postcss/postcss-bem-linter)

A [PostCSS](https://github.com/postcss/postcss) plugin to lint *BEM-style* CSS.

*BEM-style* describes CSS that follows a more-or-less strict set of conventions determining
what selectors can be used. Typically, these conventions require that classes begin with
the name of the component (or "block") that contains them, and that all characters after the
component name follow a specified pattern. Original BEM methodology refers to "blocks", "elements",
and "modifiers"; SUIT refers to "components", "descendants", and "modifiers". You might have your
own terms for similar concepts.

With this plugin, you can check the validity of stylesheets against a set of BEM-style conventions.
You can use preset patterns (SUIT and BEM, currently) or insert your own. The plugin will register
warnings if it finds CSS that does not follow the specified conventions.

## Installation

```
npm install postcss-bem-linter
```

This plugin registers warnings via PostCSS. Therefore, you'll want to use it with a PostCSS runner that prints warnings (e.g. [`gulp-postcss`](https://github.com/postcss/gulp-postcss)) or another PostCSS plugin that prints warnings (e.g. [`postcss-reporter`](https://github.com/postcss/postcss-reporter)).

## Conformance tests

**Default mode**:

* Only allow selector sequences that match the defined convention.
* Only allow custom-property names that *begin* with the defined `ComponentName`.

**Weak mode**:

* While *initial* selector sequences (before combinators) must match the defined convention,
  sequences *after* combinators are not held to any standard.

*Prior to 0.5.0, this plugin checked two other details: that `:root` rules only contain custom-properties; and that the `:root` selector is not grouped or combined with other selectors. These checks can now be performed by [stylelint](https://github.com/stylelint/stylelint). So from 0.5.0 onwards, this plugin leaves that business to stylelint to focus on its more unqiue task.*

## Use

```
bemLinter([pattern[, options]])
```

### Defining your pattern

Patterns consist of regular expressions, and functions that return regular expressions,
which describe valid selector sequences.

Please note that *patterns describe sequences, not just simple selectors*. So if, for example,
you would like to be able to chain state classes to your component classes, as in
`.Component.is-open`, your regular expression needs to allow for this chaining.

Also note that *pseudo-classes and pseudo-elements must be at the end of sequences, and
will be ignored*. Instead of `.Component:first-child.is-open` you should use
`.Component.is-open:first-child`. The former will trigger a warning.

#### Preset Patterns

You can use a preset pattern by passing a string as the `pattern`, and, if needed, an `options` object,
as in `bemLinter('suit', { namespace: 'twt' })`. Options are pattern-specific.

The following preset patterns are available:

- `'suit'` (default), as defined [here](https://github.com/suitcss/suit/blob/master/doc/naming-conventions.md).
  Options:
  - `namespace`: a namespace to prefix valid classes, as described
    [in the SUIT docs](https://github.com/suitcss/suit/blob/master/doc/naming-conventions.md#namespace-optional)
- `'bem'`, as defined [here](https://en.bem.info/tools/bem/bem-naming/).

**`'suit'` is the default pattern**; so if you do not pass any `pattern` argument,
SUIT conventions will be enforced.

#### Custom Patterns

You can define a custom pattern by passing an object with the following properties:

- `componentName` (optional): A regular expression describing valid component names.
  Default is `/[-_a-zA-Z0-9]+/`.
- `componentSelectors`: Either of the following:
  - A single function that accepts a component name and returns a regular expression describing
    all valid selector sequences for the stylesheet.
  - An object consisting of two methods, `initial` and `combined`. Both methods accept a
    component name and return a regular expression. `initial` returns a description of valid
    initial selector sequences — those occurring at the beginning of a selector, before any
    combinators. `combined` returns a description of valid selector sequences allowed *after* combinators.
    Two things to note: If you do not specify a combined pattern, it is assumed that combined
    sequences must match the same pattern as initial sequences.
    And in weak mode, *any* combined sequences are accepted.
- `utilitySelectors`: A regular expression describing valid utility selectors. This will be use
  if the stylesheet uses `/** @define utilities */`, as explained below.

So you might call the plugin in any of the following ways:

```js
// use 'suit' conventions
bemLinter();
bemLinter('suit');
bemLinter('suit', { namespace: 'twt' });

// use 'bem' conventions
bemLinter('bem');

// define a RegExp for component names
bemLinter({
  componentName: /[A-Z]+/
});

// define a single RegExp for all selector sequences, initial or combined
bemLinter({
  componentSelectors: function(componentName) {
    return new RegExp('^\\.' + componentName + '(?:-[a-z]+)?$');
  }
});

// define separate `componentName`, `initial`, `combined`, and `utilities` RegExps
bemLinter({
  componentName: /[A-Z]+/,
  componentSelectors: {
    initial: function(componentName) {
      return new RegExp('^\\.' + componentName + '(?:-[a-z]+)?$');
    },
    combined: function(componentName) {
      return new RegExp('^\\.combined-' + componentName + '-[a-z]+$');
    }
  },
  utilitySelectors: /^\.util-[a-z]+$/
});
```

### Defining a component

The plugin will only run against files that explicitly declare that they
are defining either a named component or utilities, using either
`/** @define ComponentName */` or `/** @define utilities */` in the first line
of the file.

Weak mode is turned on by adding `; weak` to this definition,
e.g. `/** @define ComponentName; weak */`.

```css
/** @define MyComponent */

:root {
  --MyComponent-property: value;
}

.MyComponent {}

.MyComponent-other {}
```

Weak mode:

```css
/** @define MyComponent; weak */

:root {
  --MyComponent-property: value;
}

.MyComponent {}

.MyComponent .other {}
```

Utilities:

```css
/** @define utilities */

.u-sizeFill {}

.u-sm-horse {}
```

If a component is defined and the component name does not match your `componentName` pattern,
the plugin will throw an error.

### Ignoring specific selectors

If you need to ignore a specific selector but do not want to ignore the entire stylesheet,
you can do so by preceding the selector with this comment: `/* postcss-bem-linter: ignore */`.

```css
/** @define MyComponent */

.MyComponent {
  display: flex;
}

/* postcss-bem-linter: ignore */
.no-flexbox .Component {
  display: block;
}
```

This will cause the linter to ignore *only* the very next selector.

### Testing CSS files

Pass your individual CSS files through the plugin. It will register warnings for
conformance failures, which you can print to the console using
[`postcss-reporter`](https://github.com/postcss/postcss-reporter) or relying
on a PostCSS runner (such as [`gulp-postcss`](https://github.com/postcss/gulp-postcss)).

```js
var postcss = require('postcss');
var bemLinter = require('postcss-bem-linter');
var reporter = require('postcss-reporter');

files.forEach(function (file) {
  var css = fs.readFileSync(file, 'utf-8');
  postcss()
    .use(bemLinter())
    .use(reporter())
    .process(css)
    .then(function(result) { .. });
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
