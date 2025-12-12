import figma from '@figma/code-connect';
import { Tooltip } from '../components/tooltip';

figma.connect(Tooltip, '<FIGMA_LINK>?node-id=3598-25261', {
  imports: ["import { Tooltip } from '@raystack/apsara'"],
  props: {
    message: figma.textContent('Tooltip text')
  },
  example: props => <Tooltip {...props}>TOOLTIP_TRIGGER</Tooltip>
});
