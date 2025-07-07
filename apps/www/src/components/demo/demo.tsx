'use client';

import * as Apsara from '@raystack/apsara';
import { Home, Info, Laugh, X } from 'lucide-react';
import NextLink from 'next/link';
import { Suspense } from 'react';
import DataTableDemo from '../datatable-demo';
import LinearDropdownDemo from '../linear-dropdown-demo';
import DemoPlayground from './demo-playground';
import DemoPreview from './demo-preview';
import { DemoProps } from './types';

export default function Demo(props: DemoProps) {
  const {
    data,
    scope = {
      ...Apsara,
      DataTableDemo,
      LinearDropdownDemo,
      Info,
      X,
      Home,
      Laugh,
      NextLink
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
