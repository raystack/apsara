import color from './color';
import * as effects from './effects';
import radius from './radius';
import space from './space';
import * as typography from './typography';

/*
TODO: Use generated tokens exposed from  separate package.
*/
const tokens = {
  color,
  shadow: effects.shadow,
  blur: effects.blur,
  radius,
  space,
  font: typography.font,
  'font-weight': typography.fontWeight,
  'font-size': typography.fontSize,
  'line-height': typography.lineHeight,
  'letter-spacing': typography.letterSpacing
} as const;

export default tokens;
