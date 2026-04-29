'use client';

import {
  BorderSolidIcon,
  CheckCircledIcon,
  ColorWheelIcon,
  Component1Icon,
  FileIcon,
  FontBoldIcon,
  FontFamilyIcon,
  FontItalicIcon,
  InfoCircledIcon,
  LayersIcon,
  OpenInNewWindowIcon,
  Pencil2Icon,
  PlusIcon,
  ShadowIcon,
  Share2Icon,
  SpaceBetweenHorizontallyIcon,
  TextAlignCenterIcon,
  TextAlignLeftIcon,
  TextAlignRightIcon,
  TransformIcon,
  UnderlineIcon,
  UploadIcon
} from '@radix-ui/react-icons';
import * as Apsara from '@raystack/apsara';
import {
  BellIcon,
  FilterIcon,
  OrganizationIcon,
  ShoppingBagFilledIcon,
  SidebarIcon
} from '@raystack/apsara/icons';
import dayjs from 'dayjs';
import { Home, Info, Laugh, X } from 'lucide-react';
import NextLink from 'next/link';
import { Suspense } from 'react';
import { DataTableDemo, DataTableVirtualizedDemo } from '../datatable-demo';
import DataTableSelectionDemo from '../datatable-selection-demo';
import ChipInputDemo from '../inputfield-chip-demo';
import LinearMenuDemo from '../linear-dropdown-demo';
import PopoverColorPicker from '../popover-color-picker';
import DemoPlayground from './demo-playground';
import DemoPreview from './demo-preview';
import { DemoProps } from './types';

export default function Demo(props: DemoProps) {
  const {
    data,
    scope = {
      ...Apsara,
      BellIcon,
      FilterIcon,
      ShoppingBagFilledIcon,
      OrganizationIcon,
      SidebarIcon,
      DataTableDemo,
      DataTableVirtualizedDemo,
      ChipInputDemo,
      DataTableSelectionDemo,
      LinearMenuDemo,
      PopoverColorPicker,
      Info,
      X,
      Home,
      Laugh,
      NextLink,
      PlusIcon,
      TransformIcon,
      CheckCircledIcon,
      Pencil2Icon,
      InfoCircledIcon,
      UploadIcon,
      FontBoldIcon,
      FontItalicIcon,
      UnderlineIcon,
      TextAlignLeftIcon,
      TextAlignCenterIcon,
      TextAlignRightIcon,
      Component1Icon,
      FileIcon,
      FontFamilyIcon,
      LayersIcon,
      OpenInNewWindowIcon,
      Share2Icon,
      BorderSolidIcon,
      ColorWheelIcon,
      ShadowIcon,
      SpaceBetweenHorizontallyIcon,
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
