import figma from '@figma/code-connect';
import { Spinner } from '../components/spinner';

figma.connect(Spinner, '<FIGMA_LINK>?node-id=3073-10985', {
  imports: ["import { Spinner } from '@raystack/apsara'"],
  props: {},
  example: props => <Spinner {...props} />
});
