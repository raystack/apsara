'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import React, {
  Children,
  cloneElement,
  forwardRef,
  HTMLAttributes,
  isValidElement,
  ReactElement,
  ReactNode
} from 'react';
import styles from './breadcrumb.module.css';
import { BreadcrumbItem } from './breadcrumb-item';
import { BreadcrumbEllipsis, BreadcrumbSeparator } from './breadcrumb-misc';

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

type BreadcrumbNodeType = 'item' | 'separator' | 'ellipsis';

interface BreadcrumbNode {
  type: BreadcrumbNodeType;
  element: ReactElement;
}

function isFragment(element: ReactElement): boolean {
  const type = element.type;
  return (
    type === React.Fragment ||
    (typeof type === 'symbol' &&
      (type as symbol).toString() === 'Symbol(react.fragment)')
  );
}

function flattenFragments(children: ReactNode): ReactNode[] {
  const result: ReactNode[] = [];
  Children.forEach(children, child => {
    if (isValidElement(child) && isFragment(child)) {
      const props = (child as ReactElement<{ children?: ReactNode }>).props;
      result.push(...flattenFragments(props.children));
    } else {
      result.push(child);
    }
  });
  return result;
}

function isBreadcrumbPart(
  type: unknown,
  part: unknown,
  displayName: string
): boolean {
  const t = type as { displayName?: string };
  // Prefer displayName so we match across module boundaries (e.g. in tests)
  if (t?.displayName === displayName) return true;
  return type === part;
}

function parseBreadcrumbChildren(children: ReactNode): BreadcrumbNode[] {
  const nodes: BreadcrumbNode[] = [];
  const flat = flattenFragments(Children.toArray(children));
  flat.forEach(child => {
    if (!isValidElement(child)) return;
    const type = child.type as { displayName?: string };
    if (isBreadcrumbPart(type, BreadcrumbItem, 'BreadcrumbItem')) {
      nodes.push({ type: 'item', element: child });
    } else if (
      isBreadcrumbPart(type, BreadcrumbSeparator, 'BreadcrumbSeparator')
    ) {
      nodes.push({ type: 'separator', element: child });
    } else if (
      isBreadcrumbPart(type, BreadcrumbEllipsis, 'BreadcrumbEllipsis')
    ) {
      nodes.push({ type: 'ellipsis', element: child });
    }
  });
  return nodes;
}

/**
 * Breadcrumb root: renders a nav with an ordered list of items and separators.
 * When `maxItems` is set and the number of items exceeds it, the trail is collapsed.
 * When collapsed: there is always at least 1 item at the start and 1 at the end (so never fewer than 2 visible items).
 * Values less than 2 for maxItems are treated as 2.
 */
export interface BreadcrumbProps
  extends VariantProps<typeof breadcrumbVariants>,
    HTMLAttributes<HTMLDivElement> {
  /**
   * Maximum number of breadcrumb items to show. When there are more items, the list is collapsed.
   * When collapsed: at least 1 item is always shown at the start and 1 at the end (minimum 2 visible items).
   * Values less than 2 (e.g. 0, 1, or negative) are treated as 2.
   */
  maxItems?: number;
  /**
   * Number of items to show before the ellipsis when collapsed. When not set, derived from maxItems
   * (e.g. maxItems=5 → 2 before, rest after).
   */
  itemsBeforeCollapse?: number;
}

export const BreadcrumbRoot = forwardRef<HTMLDivElement, BreadcrumbProps>(
  (
    {
      className,
      children,
      size = 'medium',
      maxItems,
      itemsBeforeCollapse,
      ...props
    },
    ref
  ) => {
    const shouldCollapse = maxItems != null && typeof maxItems === 'number';

    let content: ReactNode = children;

    if (shouldCollapse) {
      const nodes = parseBreadcrumbChildren(children);
      const items = nodes.filter(n => n.type === 'item').map(n => n.element);
      const max = Math.max(2, maxItems);

      if (items.length > max) {
        const sep = nodes.find(n => n.type === 'separator')?.element ?? (
          <BreadcrumbSeparator />
        );
        const defaultBefore = Math.max(1, Math.floor(max / 2));
        let before = Math.min(
          itemsBeforeCollapse ?? defaultBefore,
          items.length,
          max
        );
        if (items.length > before && before === max) before--;
        const after = Math.min(items.length - before, max - before);
        const beforeItems = items.slice(0, before);
        const afterItems = items.slice(before).slice(-after);

        const keyed = (el: ReactElement, k: string) =>
          isValidElement(el) && el.key != null
            ? el
            : cloneElement(el, { key: k });
        const out: ReactNode[] = [];
        beforeItems.forEach((item, i) => {
          out.push(keyed(item, `b-${i}`));
          if (i < beforeItems.length - 1)
            out.push(cloneElement(sep, { key: `s-${i}` }));
        });
        out.push(
          cloneElement(sep, { key: 's-mid' }),
          <BreadcrumbEllipsis key='ellipsis' />,
          cloneElement(sep, { key: 's-mid2' })
        );
        afterItems.forEach((item, i) => {
          if (i > 0) out.push(cloneElement(sep, { key: `s-a-${i}` }));
          out.push(keyed(item, `a-${i}`));
        });
        content = out;
      }
    }

    const { children: _propsChildren, ...restProps } = props as typeof props & {
      children?: ReactNode;
    };

    return (
      <nav
        className={breadcrumbVariants({ size, className })}
        ref={ref}
        aria-label='Breadcrumb'
        {...restProps}
      >
        <ol className={styles['breadcrumb-list']}>{content}</ol>
      </nav>
    );
  }
);

BreadcrumbRoot.displayName = 'BreadcrumbRoot';
