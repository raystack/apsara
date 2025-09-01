import accent from './accent';
import appearance from './appearance';
import gray from './gray';
import style from './style';

export default {
  ...appearance,
  ...accent,
  ...gray,
  ...style
} as const;
