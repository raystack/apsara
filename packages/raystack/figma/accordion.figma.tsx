import figma from '@figma/code-connect';
import { Accordion } from '../components/accordion';

figma.connect(Accordion, '<FIGMA_LINK>?node-id=8089-1150', {
  imports: ["import { Accordion } from '@raystack/apsara'"],
  props: {
    trigger: figma.enum('State', {
      Collapsed: figma.textContent('defaultValue')
    })
  },
  example: ({ trigger = 'TRIGGER' }) => (
    <Accordion>
      <Accordion.Item value='value'>
        <Accordion.Trigger>{trigger}</Accordion.Trigger>
        <Accordion.Content>Content</Accordion.Content>
      </Accordion.Item>
    </Accordion>
  )
});
