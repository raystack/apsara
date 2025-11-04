import figma from '@figma/code-connect';
import { Button } from '../components/button';

figma.connect(Button, '<FIGMA_BUTTON>', {
  imports: ["import { Button } from '@raystack/apsara'"],
  props: {
    variant: figma.enum('Variant', {
      Solid: 'solid',
      Outline: 'outline',
      Ghost: 'ghost',
      Text: 'text'
    }),
    color: figma.enum('Color', {
      Accent: 'accent',
      Neutral: 'neutral',
      Danger: 'danger',
      Success: 'success'
    }),
    size: figma.enum('Size', {
      Small: 'small',
      Normal: 'normal'
    }),
    children: figma.string('Label Copy')
  },
  example: ({ children, ...props }) => <Button {...props}>{children}</Button>
});
