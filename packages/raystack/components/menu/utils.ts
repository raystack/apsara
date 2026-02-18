import { ReactNode } from 'react';

export const getMatch = (
  value?: string,
  children?: ReactNode,
  search?: string
) => {
  if (!search?.length) return true;
  const childrenValue = getChildrenValue(children)?.toLowerCase();

  return (
    value?.toLowerCase().includes(search.toLowerCase()) ||
    childrenValue?.includes(search.toLowerCase())
  );
};

export const getChildrenValue = (children?: ReactNode) => {
  if (typeof children === 'string') return children;
  if (typeof children === 'object' && children !== null) {
    return children.toString();
  }
  return null;
};

export const KEYCODES: Record<string, [string, number]> = {
  ARROW_RIGHT: ['ArrowRight', 39],
  ESCAPE: ['Escape', 27]
};

export const dispatchKeyboardEvent = (
  element: Element,
  key: (typeof KEYCODES)[keyof typeof KEYCODES]
) => {
  const [keyName, keyCode] = key;
  return element.dispatchEvent(
    new KeyboardEvent('keydown', {
      key: keyName,
      code: keyName,
      keyCode: keyCode,
      which: keyCode,
      bubbles: true
    })
  );
};

export const isElementSubMenuTrigger = (element: Element) => {
  return element.getAttribute('data-slot') === 'menu-subtrigger';
};

export const isElementSubMenuOpen = (element: Element) => {
  return element.hasAttribute('data-popup-open');
};
