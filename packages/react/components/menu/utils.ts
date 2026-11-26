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
