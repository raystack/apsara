import figma from '@figma/code-connect';
import { Callout } from '../components/callout';

figma.connect(Callout, '<FIGMA_LINK>?node-id=661-1063', {
  imports: ["import { Callout } from '@raystack/apsara'"],
  props: {
    type: figma.enum('Type', {
      Accent: 'accent',
      Success: 'success',
      Alert: 'alert',
      Gradient: 'gradient',
      Attentio: 'attention',
      Normal: 'normal',
      Grey: 'grey'
    }),
    outline: figma.boolean('Outline'),
    highContrast: figma.boolean('High Contrast'),
    structure: figma.nestedProps('.callout_structure', {
      children: figma.textContent(
        'A short message to attract user’s attention'
      ),
      dismissible: figma.boolean('Dismiss'),
      action: figma.boolean('Action', {
        true: figma.children('Button'),
        false: undefined
      })
    })
  },
  example: ({ structure, ...props }) => (
    <Callout
      {...props}
      action={structure.action}
      dismissible={structure.dismissible}
    >
      {structure.children}
    </Callout>
  )
});
