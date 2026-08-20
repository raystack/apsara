'use client';

import { Popover as PopoverPrimitive } from '@base-ui/react';
import { cx } from 'class-variance-authority';
import type { ComponentProps, ReactNode } from 'react';
import { XIcon } from '~/icons/generated';
import { Button } from '../button';
import { Flex } from '../flex';
import { IconButton } from '../icon-button';
import { Text } from '../text';
import styles from './tour.module.css';
import { useTourContext } from './tour-context';

export function TourTitle({
  className,
  children,
  ...props
}: PopoverPrimitive.Title.Props) {
  const { step } = useTourContext('Tour.Title');
  const content = children ?? step?.title;
  if (content == null) return null;
  return (
    <PopoverPrimitive.Title
      data-slot='tour-title'
      className={cx(styles.title, className)}
      {...props}
    >
      {content}
    </PopoverPrimitive.Title>
  );
}
TourTitle.displayName = 'Tour.Title';

export function TourDescription({
  className,
  children,
  ...props
}: PopoverPrimitive.Description.Props) {
  const { step } = useTourContext('Tour.Description');
  const content = children ?? step?.content;
  if (content == null) return null;
  return (
    <PopoverPrimitive.Description
      data-slot='tour-description'
      className={cx(styles.description, className)}
      {...props}
    >
      {content}
    </PopoverPrimitive.Description>
  );
}
TourDescription.displayName = 'Tour.Description';

export interface TourProgressProps extends ComponentProps<typeof Text> {
  /** Custom formatter, e.g. show "2/5" instead of "2 of 5". */
  format?: (index: number, total: number) => ReactNode;
}

export function TourProgress({ format, ...props }: TourProgressProps) {
  const { index, steps } = useTourContext('Tour.Progress');
  return (
    <Text
      data-slot='tour-progress'
      size='mini'
      weight='medium'
      variant='secondary'
      style={{ fontVariantNumeric: 'tabular-nums' }}
      {...props}
    >
      {format ? format(index, steps.length) : `${index + 1} of ${steps.length}`}
    </Text>
  );
}
TourProgress.displayName = 'Tour.Progress';

export function TourNext({
  children,
  onClick,
  ...props
}: ComponentProps<typeof Button>) {
  const { actions, index, steps } = useTourContext('Tour.Next');
  const isLastStep = index >= steps.length - 1;
  return (
    <Button
      data-slot='tour-next'
      size='small'
      {...props}
      onClick={event => {
        onClick?.(event);
        if (!event.defaultPrevented) actions.next();
      }}
    >
      {children ?? (isLastStep ? 'Finish' : 'Next')}
    </Button>
  );
}
TourNext.displayName = 'Tour.Next';

export function TourPrev({
  children,
  onClick,
  ...props
}: ComponentProps<typeof Button>) {
  const { actions } = useTourContext('Tour.Prev');
  return (
    <Button
      data-slot='tour-prev'
      size='small'
      variant='outline'
      color='neutral'
      {...props}
      onClick={event => {
        onClick?.(event);
        if (!event.defaultPrevented) actions.prev();
      }}
    >
      {children ?? 'Back'}
    </Button>
  );
}
TourPrev.displayName = 'Tour.Prev';

export function TourSkip({
  children,
  onClick,
  ...props
}: ComponentProps<typeof Button>) {
  const { actions } = useTourContext('Tour.Skip');
  return (
    <Button
      data-slot='tour-skip'
      size='small'
      variant='text'
      color='neutral'
      {...props}
      onClick={event => {
        onClick?.(event);
        if (!event.defaultPrevented) actions.skip();
      }}
    >
      {children ?? 'Skip'}
    </Button>
  );
}
TourSkip.displayName = 'Tour.Skip';

export function TourClose({
  onClick,
  children,
  ...props
}: ComponentProps<typeof IconButton>) {
  const { actions } = useTourContext('Tour.Close');
  return (
    <IconButton
      data-slot='tour-close'
      size={3}
      aria-label='Close tour'
      {...props}
      onClick={event => {
        onClick?.(event);
        if (!event.defaultPrevented) actions.stop();
      }}
    >
      {children ?? <XIcon aria-hidden='true' />}
    </IconButton>
  );
}
TourClose.displayName = 'Tour.Close';

export function TourDefaultLayout() {
  const { index } = useTourContext('Tour.Content');
  return (
    <>
      <Flex justify='between' align='start' gap={3}>
        <TourTitle />
        <TourClose />
      </Flex>
      <TourDescription />
      <Flex justify='between' align='center' gap={3} className={styles.footer}>
        <TourProgress />
        <Flex gap={3} align='center'>
          {index > 0 && <TourPrev />}
          <TourNext />
        </Flex>
      </Flex>
    </>
  );
}
TourDefaultLayout.displayName = 'Tour.DefaultLayout';
