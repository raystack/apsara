import figma from '@figma/code-connect';
import { Checkbox } from '../components/checkbox';

figma.connect(Checkbox, '<FIGMA_LINK>?node-id=1-372', {
  imports: ["import { Checkbox } from '@raystack/apsara'"],
  props: {
    disabled: figma.enum('State', {
      Disabled: true
    }),
    checked: figma.enum('Variant', {
      Default: false,
      Selected: true,
      Indeterminate: 'indeterminate'
    })
  },
  example: props => <Checkbox {...props} />
});
