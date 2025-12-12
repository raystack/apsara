import figma from '@figma/code-connect';
import { Chip } from '../components/chip';

figma.connect(Chip, '<FIGMA_LINK>?node-id=3388-602', {
  imports: ["import { Chip } from '@raystack/apsara'"],
  props: {
    variant: figma.enum('Variant', {
      Filled: 'filled',
      Outline: 'outline'
    }),
    size: figma.enum('Size', {
      Small: 'small',
      Large: 'large'
    }),
    color: figma.enum('Style', {
      Neutral: 'neutral',
      Accent: 'accent'
    }),
    structure: figma.nestedProps('.chip_structure', {
      children: figma.boolean('Label', {
        true: figma.textContent('Label'),
        false: undefined
      }),
      isDismissible: figma.boolean('Dismiss'),
      leadingIcon: figma.boolean('Leading icon', {
        true: figma.children('Leading icon'),
        false: undefined
      }),
      trailingIcon: figma.boolean('Trailing icon', {
        true: figma.children('Trailing icon'),
        false: undefined
      })
    })
  },
  example: ({ structure, ...props }) => (
    <Chip
      {...props}
      leadingIcon={structure.leadingIcon}
      trailingIcon={structure.trailingIcon}
      isDismissible={structure.isDismissible}
    >
      {structure.children}
    </Chip>
  )
});
