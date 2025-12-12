import figma from '@figma/code-connect';
import { Badge } from '../components/badge';

figma.connect(Badge, '<FIGMA_LINK>?node-id=3463-756', {
  imports: ["import { Badge } from '@raystack/apsara'"],
  props: {
    variant: figma.enum('Variant', {
      Accent: 'accent',
      Warning: 'warning',
      Danger: 'danger',
      Success: 'success',
      Neutral: 'neutral',
      Gradient: 'gradient'
    }),
    size: figma.enum('Size', {
      Micro: 'micro',
      Small: 'small',
      Regular: 'regular'
    }),
    icon: figma.boolean('Icon', {
      true: figma.children('Icon'),
      false: undefined
    }),
    children: figma.textContent('Badge')
  },
  example: ({ children, ...props }) => <Badge {...props}>{children}</Badge>
});
