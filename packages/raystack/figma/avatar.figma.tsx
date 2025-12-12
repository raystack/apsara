import figma from '@figma/code-connect';
import { Avatar } from '../components/avatar';

figma.connect(Avatar, '<FIGMA_LINK>?node-id=1-24', {
  imports: ["import { Avatar } from '@raystack/apsara'"],
  props: {
    radius: figma.enum('Radius', {
      Small: 'small',
      Full: 'full'
    }),
    size: figma.enum('Size', {
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
    }),
    fallback: figma.string('Initials')
  },
  example: props => <Avatar {...props} />
});
