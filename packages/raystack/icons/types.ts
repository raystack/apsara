// `import type *` is erased, so this module has no runtime import and adds
// nothing to any bundle. The union is read straight off the exports of
// `icons.tsx`, so it cannot drift from them.
//
// The cycle with `icons.tsx` — which imports `create-icon.tsx`, which imports
// this file — exists only in the type graph, where it is legal. At runtime the
// graph is `icons.tsx -> create-icon.tsx` and stops there.
import type * as icons from './icons';

/** Every icon key Apsara ships. A consumer overrides an icon by key. */
export type IconName = keyof typeof icons;
