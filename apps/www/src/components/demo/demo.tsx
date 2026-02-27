'use client';

import {
  InfoCircledIcon,
  Pencil2Icon,
  PlusIcon,
  TransformIcon,
  UploadIcon
} from '@radix-ui/react-icons';
import * as Apsara from '@raystack/apsara';
import dayjs from 'dayjs';
import { Home, Info, Laugh, X } from 'lucide-react';
import NextLink from 'next/link';
import { Suspense } from 'react';
import DataTableDemo from '../datatable-demo';
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
      DataTableDemo,
      LinearMenuDemo,
      PopoverColorPicker,
      Info,
      X,
      Home,
      Laugh,
      NextLink,
      PlusIcon,
      TransformIcon,
      Pencil2Icon,
      InfoCircledIcon,
      UploadIcon,
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
