import React, { forwardRef, PropsWithChildren } from "react";
import { cva, type VariantProps } from "class-variance-authority";

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
      large: styles["breadcrumb-large"],
    },
  },
});

type BreadcrumbProps = PropsWithChildren<VariantProps<typeof breadcrumb>> & {
  items: BreadcrumbItem[];
  maxVisibleItems?: number;
  separator?: React.ReactNode;
  onItemClick?: (item: BreadcrumbItem) => void;
  className?: string;
};

export const Breadcrumb = forwardRef<HTMLDivElement, BreadcrumbProps>(
  ({ 
    className, 
    size = 'small', 
    items, 
    maxVisibleItems, 
    separator = '/', 
    onItemClick,
    ...props 
  }, ref) => {
    const visibleItems = maxVisibleItems ? 
      [
        ...items.slice(0, 1),
        ...items.slice(-Math.min(maxVisibleItems - 1, items.length - 1))
      ] : items;

    const renderItem = (item: BreadcrumbItem, index: number, isLast: boolean) => (
      <li key={index} className={styles['breadcrumb-item']}>
        <a 
          href={item.href}
          className={`${styles['breadcrumb-link']} ${isLast ? styles['breadcrumb-link-active'] : ''}`}
          onClick={(e) => {
            if (onItemClick) {
              e.preventDefault();
              onItemClick(item);
            }
          }}
        >
          {item.icon && <span className={styles['breadcrumb-icon']}>{item.icon}</span>}
          <span>{item.label}</span>
        </a>
        {!isLast && <span className={styles['breadcrumb-separator']}>{separator}</span>}
      </li>
    );

    const renderItems = () => {
      return visibleItems.map((item, index) => {
        const isLast = index === visibleItems.length - 1;
        if (maxVisibleItems && index === 1 && items.length > maxVisibleItems) {
          return (
            <React.Fragment key="ellipsis">
              <li className={styles['breadcrumb-ellipsis']}>...</li>
              {renderItem(item, index, isLast)}
            </React.Fragment>
          );
        }
        return renderItem(item, index, isLast);
      });
    };

    return (
      <nav 
        className={breadcrumb({ size, className })}
        ref={ref}
        {...props}
      >
        <ol className={styles['breadcrumb-list']}>
          {renderItems()}
        </ol>
      </nav>
    );
  }
);

Breadcrumb.displayName = "Breadcrumb";
