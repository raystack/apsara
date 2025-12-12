import figma from '@figma/code-connect';
import { Separator } from '~/components/separator';

figma.connect(Separator, '<FIGMA_LINK>?node-id=5814-33367', {
  imports: ["import { Separator } from '@raystack/apsara'"],
  props: {},
  example: props => <Separator {...props} />
});
