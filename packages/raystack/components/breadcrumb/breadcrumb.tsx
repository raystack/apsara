import { ChevronDownIcon, DotsHorizontalIcon } from '@radix-ui/react-icons';
import { type VariantProps, cva, cx } from 'class-variance-authority';
import {
  MouseEvent,
  ReactElement,
  cloneElement,
  forwardRef,
  useMemo
} from 'react';
import { DropdownMenu } from '../dropdown-menu';
import styles from './breadcrumb.module.css';

interface BreadcrumbItemBase {
  label: string;
  href?: string;
}
interface BreadcrumbItem extends BreadcrumbItemBase {
  icon?: React.ReactNode;
  dropdownItems?: BreadcrumbItemBase[];
  as?: ReactElement;
}

interface BreadcrumbItemProps extends BreadcrumbItem {
  isActive: boolean;
  onItemClick?: (item: BreadcrumbItem) => void;
}

const BreadcrumbItem = ({
  as = <a />,
  onItemClick,
  ...props
}: BreadcrumbItemProps) => {
  const { label, href, icon, dropdownItems, isActive } = props;

  if (label === 'ellipsis') {
    return (
      <span className={styles['breadcrumb-ellipsis']}>
        <DotsHorizontalIcon />
      </span>
    );
  }
  if (dropdownItems) {
    return (
      <DropdownMenu>
        <DropdownMenu.Trigger className={styles['breadcrumb-dropdown-trigger']}>
          {icon && <span className={styles['breadcrumb-icon']}>{icon}</span>}
          <span>{label}</span>
          <ChevronDownIcon className={styles['breadcrumb-dropdown-icon']} />
        </DropdownMenu.Trigger>
        <DropdownMenu.Content className={styles['breadcrumb-dropdown-content']}>
          {dropdownItems.map((dropdownItem, dropdownIndex) => (
            <DropdownMenu.Item
              key={dropdownIndex}
              className={styles['breadcrumb-dropdown-item']}
              onSelect={() => onItemClick?.(dropdownItem)}
            >
              {dropdownItem.label}
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu>
    );
  }
  return cloneElement(
    as,
    {
      className: cx(
        styles['breadcrumb-link'],
        isActive && styles['breadcrumb-link-active']
      ),
      onClick: (e: MouseEvent) => {
        if (onItemClick && href !== '#') {
          e.preventDefault();
          onItemClick(props);
        }
      },
      href,
      ...as.props
    },
    <>
      {icon && <span className={styles['breadcrumb-icon']}>{icon}</span>}
      <span>{label}</span>
    </>
  );
};

const breadcrumbVariants = cva(styles['breadcrumb'], {
  variants: {
    size: {
      small: styles['breadcrumb-small'],
      medium: styles['breadcrumb-medium']
    }
  },
  defaultVariants: {
    size: 'medium'
  }
});

type BreadcrumbProps = VariantProps<typeof breadcrumbVariants> & {
  items: BreadcrumbItem[];
  maxVisibleItems?: number;
  separator?: React.ReactNode;
  onItemClick?: (item: BreadcrumbItem) => void;
  className?: string;
  size?: 'small' | 'medium';
};

export const Breadcrumb = forwardRef<HTMLDivElement, BreadcrumbProps>(
  (
    {
      className,
      size = 'medium',
      items,
      maxVisibleItems,
      separator = '/',
      onItemClick,
      ...props
    },
    ref
  ) => {
    const visibleItems = useMemo(() => {
      if (maxVisibleItems && items.length > maxVisibleItems) {
        return [
          ...items.slice(0, 1),
          { label: 'ellipsis', href: '#' },
          ...items.slice(-Math.min(maxVisibleItems - 1, items.length - 1))
        ];
      }
      return items;
    }, [maxVisibleItems, items]);

    return (
      <nav
        className={breadcrumbVariants({ size, className })}
        ref={ref}
        {...props}
      >
        <ol className={styles['breadcrumb-list']}>
          {visibleItems.map((item, index) => {
            const isLast = index === visibleItems.length - 1;
            return (
              <li className={styles['breadcrumb-item']} key={index}>
                <BreadcrumbItem
                  {...item}
                  isActive={isLast}
                  onItemClick={onItemClick}
                />
                {!isLast && (
                  <span className={styles['breadcrumb-separator']}>
                    {separator}
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    );
  }
);

Breadcrumb.displayName = 'Breadcrumb';
