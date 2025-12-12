import figma from '@figma/code-connect';
import { AnnouncementBar } from '../components/announcement-bar';

figma.connect(AnnouncementBar, '<FIGMA_LINK>?node-id=613-990', {
  imports: ["import { AnnouncementBar } from '@raystack/apsara'"],
  props: {
    variant: figma.enum('Variant', {
      Normal: 'normal',
      Error: 'error',
      Gradient: 'gradient'
    }),
    text: figma.string('Message'),
    leadingIcon: figma.boolean('Leading icon', {
      true: figma.instance('Icon'),
      false: undefined
    })
  },
  example: props => <AnnouncementBar {...props} />
});
