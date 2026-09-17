/**
 * Pre-hydration script. Rendered as the theme element's first child, it patches
 * its own parent from storage before first paint.
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
  /** Uncontrolled keys the namespace covers; controlled keys are excluded. */
  keys: readonly ThemeSettingKey[];
  /** Fallback selector target, in case `document.currentScript` is absent. */
  elementId: string;
}

/** Builds the script source, or `null` when there is nothing for it to do. */
export function createThemeScript(params: ThemeScriptParams): string | null {
  const { persistKey, keys, elementId } = params;
  if (keys.length === 0) return null;

  // From the shared config, so the script and the React reader cannot drift.
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
    // An out-of-union value leaves the server-rendered attribute alone.
    `if(m[i][2].indexOf(v)<0)continue;` +
    `if(k==="appearance"&&v==="system")` +
    `v=matchMedia(${inlineJson(SYSTEM_APPEARANCE_QUERY)}).matches?"dark":"light";` +
    // Key order puts `accentColor` first, so the accent is already patched.
    `else if(k==="grayColor"&&v==="auto")v=g[p.getAttribute("data-accent-color")];` +
    `if(v)p.setAttribute(a,v)}` +
    `}catch(t){}}()`
  );
}
