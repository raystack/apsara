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
import ThemePanelDemo from '../theme-panel-demo';
import TourDemo from '../tour-demo';
import DemoPlayground from './demo-playground';
import DemoPreview from './demo-preview';
import { DemoProps } from './types';

export default function Demo(props: DemoProps) {
  const {
    data,
    // Nothing below may repeat an Apsara icon key: a later key shadows the spread.
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
      ThemePanelDemo,
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
