import figma from '@figma/code-connect';
import { Indicator } from '../components/indicator';

figma.connect(Indicator, '<FIGMA_LINK>?node-id=3472-3108', {
  imports: ["import { Indicator } from '@raystack/apsara'"],
  props: {
    variant: figma.enum('Variant', {
      Accent: 'accent',
      Warning: 'warning',
      Danger: 'danger',
      Success: 'success',
      Neutral: 'neutral'
    }),
    label: figma.boolean('Label', {
      true: figma.textContent('3'),
      false: undefined
    })
  },
  example: props => <Indicator {...props} />
});
