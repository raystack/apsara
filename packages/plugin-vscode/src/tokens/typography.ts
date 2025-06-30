/*
    Values for typography using default primitves
*/

import primitives from './primitives';

/* Default Style */
export const font = {
  title: primitives['font-inter'],
  body: primitives['font-inter']
} as const;

/* Font Weights */
export const fontWeight = {
  regular: '400',
  medium: '500'
} as const;

/* Font Sizes */
export const fontSize = {
  /* Body Font Sizes */
  micro: '10px',
  mini: '11px',
  small: '12px',
  regular: '14px',
  large: '16px',
  /* Title Font Sizes */
  t1: '20px',
  t2: '24px',
  t3: '28px',
  t4: '32px'
} as const;

export const lineHeight = {
  /* Body Line Heights */
  micro: '12px',
  mini: '16px',
  small: '16px',
  regular: '20px',
  large: '24px',
  /* Title Line Heights */
  t1: '24px',
  t2: '32px',
  t3: '36px',
  t4: '40px'
} as const;

export const letterSpacing = {
  /* Body Letter spacing */
  micro: '0.5px',
  mini: '0.5px',
  small: '0.4px',
  regular: '0.25px',
  large: '0.5px',
  /* Title Letter Spacing */
  t1: '0',
  t2: '0',
  t3: '0',
  t4: '0'
} as const;
