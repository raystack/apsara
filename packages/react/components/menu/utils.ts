import React, { ReactNode } from 'react';

export const getMatch = (
  value?: string,
  children?: ReactNode,
  search?: string
) => {
  if (!search?.length) return true;
  const childrenValue = getChildrenValue(children)?.toLowerCase();

  return !!(
    value?.toLowerCase().includes(search.toLowerCase()) ||
    childrenValue?.includes(search.toLowerCase())
  );
};

export const getChildrenValue = (children?: ReactNode) => {
  let value = '';
  if (!children) return value;

  React.Children.forEach(children, child => {
    if (typeof child === 'string' || typeof child === 'number') {
      value += child + ' ';
    } else if (React.isValidElement<{ children?: ReactNode }>(child)) {
      value += getChildrenValue(child.props.children) + ' ';
    }
  });
  return value.trim();
};

/**
 * Separates the elements of the given component type from the other children.
 * Looks inside fragments, which keep their other children.
 */
export const splitChildren = (
  children: ReactNode,
  type: unknown
): [matched: ReactNode[], rest: ReactNode[]] => {
  const matched: ReactNode[] = [];
  const rest: ReactNode[] = [];

  React.Children.toArray(children).forEach(child => {
    if (!React.isValidElement<{ children?: ReactNode }>(child)) {
      rest.push(child);
    } else if (child.type === type) {
      matched.push(child);
    } else if (child.type === React.Fragment) {
      const [innerMatched, innerRest] = splitChildren(
        child.props.children,
        type
      );
      matched.push(...innerMatched);
      rest.push(React.cloneElement(child, undefined, ...innerRest));
    } else {
      rest.push(child);
    }
  });

  return [matched, rest];
};
