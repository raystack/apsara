import { mergeProps } from '@base-ui/react';
import { cx } from 'class-variance-authority';
import { ComponentProps, ReactNode } from 'react';
import { Flex } from '../flex';
import { Text } from '../text';
import styles from './empty-state.module.css';

type classNameKeys =
  | 'container'
  | 'iconContainer'
  | 'icon'
  | 'heading'
  | 'subHeading';

export interface EmptyStateProps extends ComponentProps<typeof Flex> {
  icon: ReactNode;
  heading?: ReactNode;
  subHeading?: ReactNode;
  primaryAction?: ReactNode;
  secondaryAction?: ReactNode;
  /** Props for the inner parts. */
  slotProps?: {
    container?: ComponentProps<'div'>;
    iconContainer?: ComponentProps<'div'>;
    icon?: ComponentProps<'div'>;
    heading?: ComponentProps<'span'>;
    subHeading?: ComponentProps<'span'>;
  };
  /** @deprecated Use `slotProps` instead. */
  classNames?: Partial<Record<classNameKeys, string>>;
  variant?: 'empty1' | 'empty2';
}

export function EmptyState({
  icon,
  heading,
  subHeading,
  primaryAction,
  secondaryAction,
  slotProps,
  classNames,
  variant = 'empty1',
  ...props
}: EmptyStateProps) {
  if (variant === 'empty2') {
    return (
      <Flex
        align='center'
        justify='center'
        className={styles.emptyStatePage}
        data-slot='empty-state'
        {...props}
      >
        <Flex
          direction='column'
          align='start'
          gap={5}
          data-slot='empty-state-content'
          {...mergeProps<'div'>(
            {
              className: cx(styles.emptyStateContent, classNames?.container)
            },
            slotProps?.container
          )}
        >
          <div
            data-slot='empty-state-icon-container'
            {...mergeProps<'div'>(
              {
                className: cx(styles.iconContainer, classNames?.iconContainer)
              },
              slotProps?.iconContainer
            )}
          >
            <div
              data-slot='empty-state-icon'
              {...mergeProps<'div'>(
                {
                  className: cx(styles.icon, styles.iconLarge, classNames?.icon)
                },
                slotProps?.icon
              )}
            >
              {icon}
            </div>
          </div>

          {heading && (
            <Text
              size='large'
              weight='medium'
              data-slot='empty-state-heading'
              {...mergeProps<'span'>(
                { className: cx(styles.headerText, classNames?.heading) },
                slotProps?.heading
              )}
            >
              {heading}
            </Text>
          )}

          {subHeading && (
            <Text
              size='regular'
              weight='regular'
              data-slot='empty-state-subheading'
              {...mergeProps<'span'>(
                { className: cx(styles.subHeaderText, classNames?.subHeading) },
                slotProps?.subHeading
              )}
            >
              {subHeading}
            </Text>
          )}

          <Flex gap={5} data-slot='empty-state-actions'>
            {primaryAction}
            {secondaryAction}
          </Flex>
        </Flex>
      </Flex>
    );
  }

  return (
    <Flex
      direction='column'
      align='center'
      gap={5}
      data-slot='empty-state'
      {...mergeProps<'div'>(
        { className: cx(styles.emptyState, classNames?.container) },
        slotProps?.container,
        props
      )}
    >
      <div
        data-slot='empty-state-icon-container'
        {...mergeProps<'div'>(
          { className: cx(styles.iconContainer, classNames?.iconContainer) },
          slotProps?.iconContainer
        )}
      >
        <div
          data-slot='empty-state-icon'
          {...mergeProps<'div'>(
            { className: cx(styles.icon, classNames?.icon) },
            slotProps?.icon
          )}
        >
          {icon}
        </div>
      </div>

      <Flex
        direction='column'
        gap={3}
        align='center'
        data-slot='empty-state-content'
      >
        {heading && (
          <Text
            size='large'
            weight='medium'
            data-slot='empty-state-heading'
            {...mergeProps<'span'>(
              { className: cx(styles.headerText, classNames?.heading) },
              slotProps?.heading
            )}
          >
            {heading}
          </Text>
        )}

        {subHeading && (
          <Text
            size='regular'
            weight='regular'
            data-slot='empty-state-subheading'
            {...mergeProps<'span'>(
              { className: cx(styles.subHeaderText, classNames?.subHeading) },
              slotProps?.subHeading
            )}
          >
            {subHeading}
          </Text>
        )}
      </Flex>

      {primaryAction}

      {secondaryAction}
    </Flex>
  );
}

EmptyState.displayName = 'EmptyState';
