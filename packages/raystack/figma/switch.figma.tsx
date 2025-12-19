import figma from '@figma/code-connect';
import { Switch } from '../components/switch';

figma.connect(Switch, '<FIGMA_LINK>?node-id=1-349', {
  imports: ["import { Switch } from '@raystack/apsara'"],
  props: {
    disabled: figma.enum('State', {
      Disabled: true
    }),
    size: figma.enum('Size', {
      Small: 'small',
      Large: 'large'
    }),
    defaultChecked: figma.boolean('Selected')
  },
  example: props => <Switch {...props} />
});
