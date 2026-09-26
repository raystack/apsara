// The package's own manifest, read from the workspace so the badge in the
// header never drifts from the published version. The package's `exports`
// map does not expose package.json, so it is reached by path.
import pkg from '../../../../../packages/raystack/package.json';

export const VERSION = `v${pkg.version}`;
