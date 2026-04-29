import {
  FloatingActionsGroup,
  FloatingActionsRoot,
  FloatingActionsSeparator
} from './floating-actions';

export type {
  FloatingActionsAlign,
  FloatingActionsGroupProps,
  FloatingActionsProps,
  FloatingActionsSeparatorProps,
  FloatingActionsSide,
  FloatingActionsVariant
} from './floating-actions';

export const FloatingActions = Object.assign(FloatingActionsRoot, {
  Group: FloatingActionsGroup,
  Separator: FloatingActionsSeparator
});
