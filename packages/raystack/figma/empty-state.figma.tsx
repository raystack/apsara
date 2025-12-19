import figma from '@figma/code-connect';
import { EmptyState } from '../components/empty-state';

figma.connect(EmptyState, '<FIGMA_LINK>?node-id=6144-2601', {
  imports: ["import { EmptyState } from '@raystack/apsara'"],
  props: {
    variant: figma.enum('Variant', {
      Empty: 'empty1',
      Zero: 'empty2'
    }),
    heading: figma.boolean('Heading', {
      true: figma.enum('Variant', {
        Empty: figma.textContent('Looking for images in this area?'),
        Zero: figma.textContent('Organization')
      }),
      false: undefined
    }),
    subHeading: figma.boolean('Sub heading', {
      true: figma.enum('Variant', {
        Empty: figma.textContent('Draw your area of interest to find images'),
        Zero: figma.textContent(
          'An organization in Aurora is a shared workspace where teams manage projects, AOIs, and image orders. It streamlines collaboration, analysis, and decision-making across industries.'
        )
      }),
      false: undefined
    }),
    structure: figma.nestedProps('.state icon', {
      icon: figma.instance('Icon')
    }),
    primaryAction: figma.boolean('Primary Action', {
      true: figma.children('Button'),
      false: undefined
    }),
    secondaryAction: figma.boolean('Secondary Action', {
      true: figma.children('Button'),
      false: undefined
    })
  },
  example: ({ structure, ...props }) => (
    <EmptyState {...props} icon={structure.icon} />
  )
});
