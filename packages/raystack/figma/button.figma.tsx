import figma from '@figma/code-connect';
import { Button } from '../components/button';

figma.connect(Button, '<FIGMA_LINK>?node-id=1-84', {
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
    children: figma.string('Label Copy'),
    disabled: figma.enum('State', {
      Disabled: true
    }),
    leadingIcon: figma.boolean('Leading Visible', {
      true: figma.instance('Leading Icon'),
      false: undefined
    }),
    trailingIcon: figma.boolean('Trailing Visible', {
      true: figma.instance('Trailing Icon'),
      false: undefined
    }),
    loading: figma.enum('Label Copy', {
      'Loading...': true
    })
  },
  example: ({ children, ...props }) => <Button {...props}>{children}</Button>
});
