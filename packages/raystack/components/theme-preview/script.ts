/**
 * Pre-hydration script. Rendered as the theme element's first child, it patches
 * its own parent before first paint with what the server could not know: the
 * stored value of each persisted key, and the OS answer for a `system`
 * appearance that has nothing stored.
 */

import {
  GRAY_PAIRING,
  SETTING_ATTRIBUTES,
  STORAGE_VERSION,
  SYSTEM_APPEARANCE_QUERY,
  THEME_SETTING_KEYS,
  THEME_SETTING_VALUES,
  type ThemeSettingKey,
  type ThemeSettings
} from './settings';

/** Identifies the theme element when `document.currentScript` is unavailable. */
export const THEME_ID_ATTRIBUTE = 'data-rs-theme-id';

/** JSON that is safe to drop inside a `<script>` body. */
function inlineJson(value: unknown): string {
  return JSON.stringify(value)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
    .replace(new RegExp('\\u2028', 'g'), '\\u2028')
    .replace(new RegExp('\\u2029', 'g'), '\\u2029');
}

export interface ThemeScriptParams {
  /** Storage namespace. Without one the script reads no storage at all. */
  persistKey?: string;
  /** Keys read from storage: the namespace's uncontrolled, persisted settings. */
  keys: readonly ThemeSettingKey[];
  /**
   * The settings the server rendered from. A key with nothing stored falls
   * back to this, which is how a seeded `system` appearance resolves against
   * the OS before first paint.
   */
  seed: ThemeSettings;
  /** Fallback selector target, in case `document.currentScript` is absent. */
  elementId: string;
}

/** Builds the script source, or `null` when there is nothing for it to do. */
export function createThemeScript(params: ThemeScriptParams): string | null {
  const { persistKey, keys, seed, elementId } = params;
  const stored = persistKey ? keys : [];

  // [key, attribute, legalValues, seededValue, readsStorage]. A key takes part
  // when storage may hold it, or when its seed needs the browser to resolve it.
  const map: [string, string, readonly string[], string, boolean][] = [];
  for (const key of THEME_SETTING_KEYS) {
    const fromStore = stored.includes(key);
    const needsBrowser =
      (key === 'appearance' && seed.appearance === 'system') ||
      (key === 'grayColor' &&
        seed.grayColor === 'auto' &&
        stored.includes('accentColor'));
    if (!fromStore && !needsBrowser) continue;
    map.push([
      key,
      SETTING_ATTRIBUTES[key],
      THEME_SETTING_VALUES[key],
      seed[key],
      fromStore
    ]);
  }
  if (map.length === 0) return null;

  const fallbackSelector = `[${THEME_ID_ATTRIBUTE}="${elementId}"]`;
  // Only when some key actually reads storage; a bare `system` seed never does.
  const readStorage =
    persistKey && stored.length > 0
      ? `try{var r=localStorage.getItem(${inlineJson(persistKey)});` +
        `if(r){var o=JSON.parse(r);` +
        `if(o&&typeof o==="object"&&typeof o.v==="number"&&o.v<=${STORAGE_VERSION}` +
        `&&o.settings&&typeof o.settings==="object")s=o.settings}}catch(t){}`
      : '';

  return (
    `!function(){try{` +
    `var d=document,e=d.currentScript,` +
    `p=(e&&e.parentElement)||d.querySelector(${inlineJson(fallbackSelector)});` +
    `if(!p)return;` +
    `var m=${inlineJson(map)},g=${inlineJson(GRAY_PAIRING)},s={};` +
    readStorage +
    `for(var i=0;i<m.length;i++){` +
    `var k=m[i][0],a=m[i][1],l=m[i][2],v=m[i][3];` +
    // A stored value wins only when legal. The React reader drops a bad field
    // the same way, so both land on the seed.
    `if(m[i][4]&&k in s&&l.indexOf(s[k])>=0)v=s[k];` +
    `if(l.indexOf(v)<0)continue;` +
    `if(k==="appearance"&&v==="system")` +
    `v=matchMedia(${inlineJson(SYSTEM_APPEARANCE_QUERY)}).matches?"dark":"light";` +
    // Key order puts `accentColor` first, so the accent is already patched.
    `else if(k==="grayColor"&&v==="auto")v=g[p.getAttribute("data-accent-color")];` +
    `if(v)p.setAttribute(a,v)}` +
    `}catch(t){}}()`
  );
}
