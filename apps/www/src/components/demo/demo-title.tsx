'use client';

import { Dialog } from '@raystack/apsara';
import { useDemoContext } from './demo-context';

type Props = {
  className?: string;
};

export default function DemoTitle({ className }: Props) {
  const { title } = useDemoContext();
  return <Dialog.Title className={className}>{title}</Dialog.Title>;
}
