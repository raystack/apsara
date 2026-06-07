// url=<FIGMA_LINK>?node-id=1-24
// source=https://github.com/raystack/apsara/blob/main/packages/raystack/components/avatar/avatar.tsx
// component=Avatar

import figma from 'figma';

const radius = figma.selectedInstance.getEnum('Radius', {
  Small: 'small',
  Full: 'full'
});
const size = figma.selectedInstance.getEnum('Size', {
  '1': 1,
  '2': 2,
  '3': 3,
  '4': 4,
  '5': 5,
  '6': 6,
  '7': 7,
  '8': 8,
  '9': 9,
  '10': 10,
  '11': 11,
  '12': 12,
  '13': 13
});
const fallback = figma.selectedInstance.getString('Initials');
const src = figma.selectedInstance.getBoolean('Image', {
  true: 'https://example.com/avatar.png',
  false: undefined
});

export default {
  id: 'Avatar',
  imports: ["import { Avatar } from '@raystack/apsara'"],
  example: figma.code`<Avatar${figma.helpers.react.renderProp(
    'radius',
    radius
  )}${figma.helpers.react.renderProp(
    'size',
    size
  )}${figma.helpers.react.renderProp(
    'src',
    src
  )}${figma.helpers.react.renderProp('fallback', fallback)}/>`,
  metadata: { nestable: true }
};
