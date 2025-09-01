import { cx } from 'class-variance-authority';
import { Flex } from '../flex';
import { Text } from '../text';
import styles from './empty-state.module.css';

type classNameKeys =
  | 'container'
  | 'iconContainer'
  | 'icon'
  | 'heading'
  | 'subHeading';

interface EmptyStateProps {
  icon: React.ReactNode;
  heading?: React.ReactNode;
  subHeading?: React.ReactNode;
  primaryAction?: React.ReactNode;
  secondaryAction?: React.ReactNode;
  classNames?: Partial<Record<classNameKeys, string>>;
  variant?: 'empty1' | 'empty2';
}

export const EmptyState = ({
  icon,
  heading,
  subHeading,
  primaryAction,
  secondaryAction,
  classNames,
  variant = 'empty1'
}: EmptyStateProps) => {
  if (variant === 'empty2') {
    return (
      <Flex align='center' justify='center' className={styles.emptyStatePage}>
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
};
