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

interface EmptyStateProps extends ComponentProps<typeof Flex> {
  icon: ReactNode;
  heading?: ReactNode;
  subHeading?: ReactNode;
  primaryAction?: ReactNode;
  secondaryAction?: ReactNode;
  classNames?: Partial<Record<classNameKeys, string>>;
  variant?: 'empty1' | 'empty2';
}

export function EmptyState({
  icon,
  heading,
  subHeading,
  primaryAction,
  secondaryAction,
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
          className={cx(styles.emptyStateContent, classNames?.container)}
          data-slot='empty-state-content'
        >
          <div
            className={cx(styles.iconContainer, classNames?.iconContainer)}
            data-slot='empty-state-icon-container'
          >
            <div
              className={cx(styles.icon, styles.iconLarge, classNames?.icon)}
              data-slot='empty-state-icon'
            >
              {icon}
            </div>
          </div>

          {heading && (
            <Text
              size='large'
              weight='medium'
              className={cx(styles.headerText, classNames?.heading)}
              data-slot='empty-state-heading'
            >
              {heading}
            </Text>
          )}

          {subHeading && (
            <Text
              size='regular'
              weight='regular'
              className={cx(styles.subHeaderText, classNames?.subHeading)}
              data-slot='empty-state-subheading'
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
      className={cx(styles.emptyState, classNames?.container)}
      data-slot='empty-state'
      {...props}
    >
      <div
        className={cx(styles.iconContainer, classNames?.iconContainer)}
        data-slot='empty-state-icon-container'
      >
        <div
          className={cx(styles.icon, classNames?.icon)}
          data-slot='empty-state-icon'
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
            className={cx(styles.headerText, classNames?.heading)}
            data-slot='empty-state-heading'
          >
            {heading}
          </Text>
        )}

        {subHeading && (
          <Text
            size='regular'
            weight='regular'
            className={cx(styles.subHeaderText, classNames?.subHeading)}
            data-slot='empty-state-subheading'
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
