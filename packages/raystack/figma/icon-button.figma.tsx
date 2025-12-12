import figma from '@figma/code-connect';
import { IconButton } from '../components/icon-button';

figma.connect(IconButton, '<FIGMA_LINK>?node-id=627-576', {
  imports: ["import { IconButton } from '@raystack/apsara'"],
  props: {
    size: figma.enum('Size', {
      '1': 1,
      '2': 2,
      '3': 3,
      '4': 4
    }),
    disabled: figma.enum('State', {
      Disabled: true
    }),
    children: figma.instance('Icon')
  },
  example: ({ children, ...props }) => (
    <IconButton {...props}>{children}</IconButton>
  )
});
