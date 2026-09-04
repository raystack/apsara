'use client';

import * as Apsara from '@raystack/apsara';
import dayjs from 'dayjs';
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bell,
  Bold,
  Building2,
  Component,
  Contrast,
  ExternalLink,
  Frame,
  Home,
  Info,
  Italic,
  Laugh,
  Layers,
  LayoutList,
  Minus,
  Palette,
  Pencil,
  Rows3,
  Share2,
  ShoppingBag,
  StretchHorizontal,
  Type,
  Underline,
  Upload,
  X
} from 'lucide-react';
import NextLink from 'next/link';
import { Suspense } from 'react';
import ChipInputDemo from '../chip-input-demo';
import {
  DataViewCustomDemo,
  DataViewEmptyZeroDemo,
  DataViewGroupingDemo,
  DataViewListDemo,
  DataViewLoadingDemo,
  DataViewMultiViewDemo,
  DataViewPerViewFieldsDemo,
  DataViewSearchDemo,
  DataViewSelectionDemo,
  DataViewTableDemo,
  DataViewTimelineDemo,
  DataViewTimelineGroupingDemo,
  DataViewTimelinePointDemo,
  DataViewTimelineSortValueLaneDemo,
  DataViewVirtualizedDemo,
  DataViewVirtualizedGroupingDemo
} from '../dataview-demo';
import LinearMenuDemo from '../linear-menu-demo';
import PopoverColorPicker from '../popover-color-picker';
import TourDemo from '../tour-demo';
import DemoPlayground from './demo-playground';
import DemoPreview from './demo-preview';
import { DemoProps } from './types';

export default function Demo(props: DemoProps) {
  const {
    data,
    // `...Apsara` carries the 32 icons Apsara publishes, so none of those needs
    // its own entry — and nothing below may repeat one of their keys, because a
    // later key shadows the spread. A demo that needs any other glyph names a
    // lucide component from the block above and sizes it at the call site,
    // which is exactly what an application does.
    scope = {
      ...Apsara,
      DataViewTableDemo,
      DataViewListDemo,
      DataViewMultiViewDemo,
      DataViewEmptyZeroDemo,
      DataViewCustomDemo,
      DataViewVirtualizedDemo,
      DataViewGroupingDemo,
      DataViewVirtualizedGroupingDemo,
      DataViewLoadingDemo,
      DataViewPerViewFieldsDemo,
      DataViewSearchDemo,
      DataViewSelectionDemo,
      DataViewTimelineDemo,
      DataViewTimelineSortValueLaneDemo,
      DataViewTimelineGroupingDemo,
      DataViewTimelinePointDemo,
      ChipInputDemo,
      LinearMenuDemo,
      PopoverColorPicker,
      TourDemo,
      NextLink,
      AlignCenter,
      AlignLeft,
      AlignRight,
      Bell,
      Bold,
      Building2,
      Component,
      Contrast,
      ExternalLink,
      Frame,
      Home,
      Info,
      Italic,
      Laugh,
      LayoutList,
      Layers,
      Minus,
      Palette,
      Pencil,
      Rows3,
      Share2,
      ShoppingBag,
      StretchHorizontal,
      Type,
      Underline,
      Upload,
      X,
      dayjs
    }
  } = props;

  if (data.type === 'code') {
    return <DemoPreview scope={scope} {...data} />;
  }

  return (
    <Suspense>
      <DemoPlayground scope={scope} {...data} />
    </Suspense>
  );
}
