'use client';

import { Popover as PopoverPrimitive } from '@base-ui/react';
import { Cross1Icon } from '@radix-ui/react-icons';
import { cx } from 'class-variance-authority';
import type { ComponentProps, ReactNode } from 'react';
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
    <PopoverPrimitive.Title className={cx(styles.title, className)} {...props}>
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
    <Text size='mini' weight='medium' variant='secondary' {...props}>
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
      size={3}
      aria-label='Close tour'
      {...props}
      onClick={event => {
        onClick?.(event);
        if (!event.defaultPrevented) actions.stop();
      }}
    >
      {children ?? <Cross1Icon aria-hidden='true' />}
    </IconButton>
  );
}
TourClose.displayName = 'Tour.Close';

/**
 * The standard card: title + close, description, then progress and the
 * navigation buttons. Rendered by `Tour.Popover` when no children are given.
 */
export function TourDefaultLayout() {
  const { index } = useTourContext('Tour.Popover');
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
