import { FilterCardFooter } from './filter-card-footer';
import { FilterCardItem } from './filter-card-item';
import { FilterCardRoot } from './filter-card-root';
import { FilterCardSection } from './filter-card-section';

export const FilterCard = Object.assign(FilterCardRoot, {
  Section: FilterCardSection,
  Item: FilterCardItem,
  Footer: FilterCardFooter
});
