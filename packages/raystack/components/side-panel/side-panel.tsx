import { cva, cx, VariantProps } from 'class-variance-authority';
import { ComponentProps, Fragment, ReactNode, useId } from 'react';
import { Flex } from '../flex';
import { Text } from '../text';
import styles from './side-panel.module.css';

const sidePanelRoot = cva(styles['side-panel'], {
  variants: {
    side: {
      left: styles['side-panel-left'],
      right: styles['side-panel-right']
    }
  },
  defaultVariants: {
    side: 'right'
  }
});

interface SidePanelProps
  extends ComponentProps<'aside'>,
    VariantProps<typeof sidePanelRoot> {}

const SidePanelRoot = ({
  side = 'right',
  className,
  ...props
}: SidePanelProps) => {
  return (
    <aside
      className={sidePanelRoot({ side, className })}
      data-slot='side-panel'
      {...props}
    />
  );
};

SidePanelRoot.displayName = 'SidePanel';

interface SidePanelHeaderProps extends ComponentProps<'div'> {
  title: string;
  icon?: ReactNode;
  actions?: Array<ReactNode>;
  description?: string;
  titleId?: string;
}

const SidePanelHeader = ({
  title,
  icon,
  actions = [],
  description,
  titleId,
  ...props
}: SidePanelHeaderProps) => {
  const generatedId = useId();
  const headingId = titleId ?? generatedId;
  return (
    <div
      className={styles['side-panel-header']}
      data-slot='side-panel-header'
      {...props}
    >
      <Flex
        gap={3}
        justify='between'
        align='center'
        data-slot='side-panel-header-content'
      >
        <Flex gap={3} data-slot='side-panel-title-group'>
          {icon}
          <Text
            id={headingId}
            render={<h2 />}
            size='large'
            weight='medium'
            data-slot='side-panel-title'
          >
            {title}
          </Text>
        </Flex>
        <Flex gap={3} data-slot='side-panel-actions'>
          {actions?.map((action, index) => (
            <Fragment key={index}>{action}</Fragment>
          ))}
        </Flex>
      </Flex>
      {description ? (
        <Text size='small' data-slot='side-panel-description'>
          {description}
        </Text>
      ) : null}
    </div>
  );
};

SidePanelHeader.displayName = 'SidePanel.Header';

interface SidePanelSectionProps extends ComponentProps<'div'> {}

const SidePanelSection = ({ className, ...props }: SidePanelSectionProps) => {
  return (
    <div
      className={cx(styles['side-panel-section'], className)}
      data-slot='side-panel-section'
      {...props}
    />
  );
};

SidePanelSection.displayName = 'SidePanel.Section';

export const SidePanel = Object.assign(SidePanelRoot, {
  Header: SidePanelHeader,
  Section: SidePanelSection
});
