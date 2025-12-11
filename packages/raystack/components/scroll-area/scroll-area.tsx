import { ScrollAreaCorner } from './scroll-area-corner';
import { ScrollAreaRoot } from './scroll-area-root';
import { ScrollAreaScrollbar } from './scroll-area-scrollbar';
import { ScrollAreaViewport } from './scroll-area-viewport';

export const ScrollArea = Object.assign(ScrollAreaRoot, {
  Viewport: ScrollAreaViewport,
  Scrollbar: ScrollAreaScrollbar,
  Corner: ScrollAreaCorner
});
