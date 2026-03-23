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
        {...props}
      >
        <Flex
          direction='column'
          align='start'
          gap='medium'
          className={cx(styles.emptyStateContent, classNames?.container)}
        >
          <div className={cx(styles.iconContainer, classNames?.iconContainer)}>
            <div
              className={cx(styles.icon, styles.iconLarge, classNames?.icon)}
            >
              {icon}
            </div>
          </div>

          {heading && (
            <Text
              size={5}
              weight={500}
              className={cx(styles.headerText, classNames?.heading)}
            >
              {heading}
            </Text>
          )}

          {subHeading && (
            <Text
              size={4}
              weight={400}
              className={cx(styles.subHeaderText, classNames?.subHeading)}
            >
              {subHeading}
            </Text>
          )}

          <Flex gap='medium'>
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
      gap='medium'
      className={cx(styles.emptyState, classNames?.container)}
      {...props}
    >
      <div className={cx(styles.iconContainer, classNames?.iconContainer)}>
        <div className={cx(styles.icon, classNames?.icon)}>{icon}</div>
      </div>

      <Flex direction='column' gap='small' align='center'>
        {heading && (
          <Text
            size={5}
            weight={500}
            className={cx(styles.headerText, classNames?.heading)}
          >
            {heading}
          </Text>
        )}

        {subHeading && (
          <Text
            size={4}
            weight={400}
            className={cx(styles.subHeaderText, classNames?.subHeading)}
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
