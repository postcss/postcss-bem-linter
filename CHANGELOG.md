=== Head

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
