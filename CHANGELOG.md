# Changelog

Any notable updates will be listed here, alongside the date it was updated. I don't plan on supporting multiple versions, only the latest (checked into `main`). Sorry :P

## [0.2.0] - 2026-11-07

Refactor update for the dataset stuff.

### Added

- New constructor parameters on the `SvgChart` class for controlling whether or not empty datasets are allowed.
- New `sample.html` file to quickly see the charts in action.
	- Small style tweaks added for the new `sample.html` file.
- Included a `title` element on the generated `svg`.

### Changed

- Reworked the datasets property on the `SvgChart` class to be a `Map` type, where the unique identifier is a descriptor name of the dataset.
	- Intended to allow for scalability for displaying multiple datasets in the future.
- Reordered constructor parameters for the `SvgChart` class.

### Housekeeping

- Switched to tab indentation (VS Code settings were scuffed on init commit).
- Touched up the README for better readability.
- Added this'ere changelog