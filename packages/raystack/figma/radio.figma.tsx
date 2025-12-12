import figma from '@figma/code-connect';
import { Radio } from '../components/radio';

figma.connect(Radio, '<FIGMA_LINK>?node-id=2-148', {
  imports: ["import { Radio } from '@raystack/apsara'"],
  props: {
    disabled: figma.enum('State', {
      Disabled: true
    })
  },
  example: props => (
    <Radio>
      <Radio.Item value='value' {...props} />
    </Radio>
  )
});
