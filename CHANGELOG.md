=== Head

* Ensure that `@keyframes` selectors are always skipped.

=== 2.3.0 (November 24, 2015)

* Add ability to ignore custom properties via `postcss-bem-linter: ignore` comments and the `ignoreCustomProperties` pattern.

=== 2.2.0 (November 15, 2015)

* Allow attribute selectors in BEM preset pattern.
* Fix bug causing pseudo-classes with operators like `:nth-child(3n+1)` to cause problems.
* Add flexibility (remove unnecessary strictness) in attribute part of preset patterns.

=== 2.1.0 (October 31, 2015)

* Support string patterns for everything: `componentName`, `componentSelectors` (with one description, and with `initial` and `combined`), `utilitySelectors`, and `ignoreSelectors` (with a single value or an array).

=== 2.0.0 (October 17, 2015)

* Add namespace option to BEM preset pattern.
* Light breaking change: Improve strictness of SUIT preset pattern: enforce proper camelCasing.

=== 1.2.0 (October 12, 2015)

* Support array of patterns for `ignoreSelectors`.

=== 1.1.0 (September 18, 2015)

* Support selective overriding of a chosen preset's patterns.
* Support `ignoreSelectors` pattern.
* Support ignoring utility selectors with a preceding comment.
* Add helpful error messages when user configuration is lacking patterns.

=== 1.0.1 (August 30, 2015)

* Use PostCSS's improved warning API to provide more precise locations.

=== 1.0.0 (August 26, 2015)

* Upgrade to PostCSS 5.

=== 0.6.0 (August 8, 2015)

* Support multiple definitions per file.
* Support comments to end definition enforcement.
* Support verbose comment syntax, e.g. `/* postcss-bem-linter: define ComponentName */`.

=== 0.5.0 (August 5, 2015)

* Add alternate signature for designating preset and preset options.
* Remove checks that `:root` rules only contain custom-properties, and that the `:root` selector is not grouped or combined with other selectors. Outsourcing these checks to [stylelint](https://github.com/stylelint/stylelint).

=== 0.4.0 (June 23, 2015)

* Support `/* postcss-bem-linter: ignore */` comments.

=== 0.3.0 (May 23, 2015)

* Support BEM format and custom formats.
* Make `strict mode` the default. Add `weak` mode.
* Support pseudo-selectors.
* Support utility linting.
* Add better warning logging.
* Use postcss 4.1.x.
* Allow adjoining attributes in SUITCSS selectors.

=== 0.2.0 (January 24, 2015)

* Use postcss 4.0.x API.

=== 0.1.1 (November 22, 2014)

* Skip `@keyframes` rules when validating selectors.

=== 0.1.0 (October 2, 2014)

* Initial release. Ported from rework-suit-conformance.
e1iv
