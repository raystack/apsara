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

export const KEYCODES: Record<string, [string, number]> = {
  ARROW_RIGHT: ['ArrowRight', 39],
  ESCAPE: ['Escape', 27]
};

export const dispatchKeyboardEvent = (
  element: Element | EventTarget,
  key: (typeof KEYCODES)[keyof typeof KEYCODES],
  bubbles: boolean = true
) => {
  const [keyName, keyCode] = key;
  return element.dispatchEvent(
    new KeyboardEvent('keydown', {
      key: keyName,
      code: keyName,
      keyCode: keyCode,
      which: keyCode,
      bubbles
    })
  );
};

export const isElementSubMenuTrigger = (element: Element) => {
  return element.getAttribute('data-slot') === 'menu-subtrigger';
};

export const isElementSubMenuOpen = (element: Element) => {
  return element.hasAttribute('data-popup-open');
};
