import figma from '@figma/code-connect';
import { Search } from '../components/search';

figma.connect(Search, '<FIGMA_LINK>?node-id=209-1186', {
  imports: ["import { Search } from '@raystack/apsara'"],
  props: {
    placeholder: figma.enum('State', {
      Default: figma.textContent('Search...'),
      Active: figma.textContent('Search...'),
      Hover: figma.textContent('Search...')
    }),
    size: figma.enum('Size', {
      Small: 'small',
      Large: 'large'
    })
  },
  example: props => <Search {...props} />
});
