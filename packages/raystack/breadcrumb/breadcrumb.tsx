import React, { forwardRef, PropsWithChildren } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";

import styles from "./breadcrumb.module.css";

interface BreadcrumbItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
}

const breadcrumb = cva(styles['breadcrumb'], {
  variants: {
    size: {
      small: styles["breadcrumb-small"],
      medium: styles["breadcrumb-medium"],
    },
  },
  defaultVariants: {
    size: "medium",
  },
});

type BreadcrumbProps = PropsWithChildren<Omit<VariantProps<typeof breadcrumb>, 'size'>> & {
  items: BreadcrumbItem[];
  maxVisibleItems?: number;
  separator?: React.ReactNode;
  onItemClick?: (item: BreadcrumbItem) => void;
  className?: string;
  size?: 'small' | 'medium';
};

export const Breadcrumb = forwardRef<HTMLDivElement, BreadcrumbProps>(
  ({ 
    className, 
    size = 'medium', 
    items, 
    maxVisibleItems, 
    separator = '/', 
    onItemClick,
    ...props 
  }, ref) => {
    const visibleItems = maxVisibleItems && items.length > maxVisibleItems
      ? [
          ...items.slice(0, 1),
          { label: 'ellipsis', href: '#' },
          ...items.slice(-Math.min(maxVisibleItems - 1, items.length - 1))
        ]
      : items;

    const renderItem = (item: BreadcrumbItem, index: number, isLast: boolean) => (
      <li key={index} className={styles['breadcrumb-item']}>
        {item.label === 'ellipsis' ? (
          <span className={styles['breadcrumb-ellipsis']}>
            <DotsHorizontalIcon />
          </span>
        ) : (
          <a 
            href={item.href}
            className={`${styles['breadcrumb-link']} ${isLast ? `${styles['breadcrumb-link-last']} ${styles['breadcrumb-link-active']}` : ''}`}
            onClick={(e) => {
              if (onItemClick && item.href !== '#') {
                e.preventDefault();
                onItemClick(item);
              }
            }}
          >
            {item.icon && <span className={styles['breadcrumb-icon']}>{item.icon}</span>}
            <span>{item.label}</span>
          </a>
        )}
        {!isLast && <span className={styles['breadcrumb-separator']}>{separator}</span>}
      </li>
    );

    return (
      <nav 
        className={breadcrumb({ size: size as 'small' | 'medium', className })}
        ref={ref}
        {...props}
      >
        <ol className={styles['breadcrumb-list']}>
          {visibleItems.map((item, index) => renderItem(item, index, index === visibleItems.length - 1))}
        </ol>
      </nav>
    );
  }
);

Breadcrumb.displayName = "Breadcrumb";
