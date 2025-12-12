import figma from '@figma/code-connect';
import { Slider } from '../components/slider';

figma.connect(Slider, '<FIGMA_LINK>?node-id=254-549', {
  imports: ["import { Slider } from '@raystack/apsara'"],
  props: {
    variant: figma.enum('Variant', {
      Single: 'single',
      Range: 'range'
    }),
    handle: figma.nestedProps('Handle', {
      thumbSize: figma.enum('Size', {
        Small: 'small',
        Large: 'large'
      }),
      label: figma.boolean('Handle Label', {
        true: figma.textContent('Label'),
        false: undefined
      })
    })
  },
  example: ({ handle, ...props }) => (
    <Slider thumbSize={handle.thumbSize} label={handle.label} {...props} />
  )
});
