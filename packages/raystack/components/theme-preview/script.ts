/**
 * The pre-hydration inline script. Server-rendered HTML cannot know a
 * client-side value, so this patches the theme element's attributes before
 * first paint: it renders as the first child of that element and corrects its
 * own parent, whose opening tag has already been parsed. Only a namespace's
 * uncontrolled settings appear here, which usually means appearance alone.
 */

import {
  GRAY_PAIRING,
  SETTING_ATTRIBUTES,
  SETTING_VALUES,
  STORAGE_VERSION,
  SYSTEM_APPEARANCE_QUERY,
  type ThemeSettingKey
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
  persistKey: string;
  /**
   * The settings this namespace covers that are not controlled. Controlled
   * keys are excluded here rather than filtered at runtime, so stale storage
   * cannot shadow them.
   */
  keys: readonly ThemeSettingKey[];
  /** Fallback selector target, in case `document.currentScript` is absent. */
  elementId: string;
}

/** Builds the script source, or `null` when there is nothing for it to do. */
export function createThemeScript(params: ThemeScriptParams): string | null {
  const { persistKey, keys, elementId } = params;
  if (keys.length === 0) return null;

  // [settingKey, attribute, legalValues] — generated from the shared config so
  // the script and the React reader cannot drift apart.
  const map = keys.map(key => [
    key,
    SETTING_ATTRIBUTES[key],
    SETTING_VALUES[key]
  ]);

  const fallbackSelector = `[${THEME_ID_ATTRIBUTE}="${elementId}"]`;

  return (
    `!function(){try{` +
    `var d=document,e=d.currentScript,` +
    `p=(e&&e.parentElement)||d.querySelector(${inlineJson(fallbackSelector)});` +
    `if(!p)return;` +
    `var m=${inlineJson(map)},g=${inlineJson(GRAY_PAIRING)},s={};` +
    `try{var r=localStorage.getItem(${inlineJson(persistKey)});` +
    `if(r){var o=JSON.parse(r);` +
    `if(o&&typeof o==="object"&&typeof o.v==="number"&&o.v<=${STORAGE_VERSION}` +
    `&&o.settings&&typeof o.settings==="object")s=o.settings}}catch(t){}` +
    `for(var i=0;i<m.length;i++){` +
    `var k=m[i][0],a=m[i][1],v=s[k];` +
    // Skipping an out-of-union value leaves the server-rendered attribute, so
    // a bad stored value cannot block first paint.
    `if(m[i][2].indexOf(v)<0)continue;` +
    `if(k==="appearance"&&v==="system")` +
    `v=matchMedia(${inlineJson(SYSTEM_APPEARANCE_QUERY)}).matches?"dark":"light";` +
    // `accentColor` precedes `grayColor` in the shared key order, so the accent
    // attribute read here is already patched when both are stored.
    `else if(k==="grayColor"&&v==="auto")v=g[p.getAttribute("data-accent-color")];` +
    `if(v)p.setAttribute(a,v)}` +
    `}catch(t){}}()`
  );
}
