import { cva, cx, VariantProps } from 'class-variance-authority';
import { ComponentProps, Fragment, ReactNode } from 'react';
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
  return <aside className={sidePanelRoot({ side, className })} {...props} />;
};

SidePanelRoot.displayName = 'SidePanel';

interface SidePanelHeaderProps extends ComponentProps<'div'> {
  title: string;
  icon?: ReactNode;
  actions?: Array<ReactNode>;
  description?: string;
}

const SidePanelHeader = ({
  title,
  icon,
  actions = [],
  description,
  ...props
}: SidePanelHeaderProps) => {
  return (
    <div className={styles['side-panel-header']} {...props}>
      <Flex gap={3} justify='between' align='center'>
        <Flex gap={3}>
          {icon}
          <Text size={5} weight={500}>
            {title}
          </Text>
        </Flex>
        <Flex gap={3}>
          {actions?.map((action, index) => (
            <Fragment key={index}>{action}</Fragment>
          ))}
        </Flex>
      </Flex>
      {description ? <Text size={2}>{description}</Text> : null}
    </div>
  );
};

SidePanelHeader.displayName = 'SidePanel.Header';

interface SidePanelSectionProps extends ComponentProps<'div'> {}

const SidePanelSection = ({ className, ...props }: SidePanelSectionProps) => {
  return (
    <div className={cx(styles['side-panel-section'], className)} {...props} />
  );
};

SidePanelSection.displayName = 'SidePanel.Section';

export const SidePanel = Object.assign(SidePanelRoot, {
  Header: SidePanelHeader,
  Section: SidePanelSection
});
