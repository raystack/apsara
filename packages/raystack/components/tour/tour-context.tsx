'use client';

import { createContext, useContext } from 'react';
import type {
  TourActions,
  TourStatus,
  TourStep,
  TourTransition
} from './types';

export interface TourContextValue {
  steps: TourStep[];
  index: number;
  step: TourStep | null;
  open: boolean;
  status: TourStatus;
  anchor: Element | null;
  spotlightElement: Element | null;
  popoverOpen: boolean;
  disableOverlay: boolean;
  transition: TourTransition;
  revealed: boolean;
  actions: TourActions;
}

export const TourContext = createContext<TourContextValue | null>(null);

export function useTourContext(part: string): TourContextValue {
  const context = useContext(TourContext);
  if (!context) {
    throw new Error(`${part} must be used within <Tour>`);
  }
  return context;
}

export interface UseTourReturn {
  open: boolean;
  status: TourStatus;
  index: number;
  totalSteps: number;
  isFirstStep: boolean;
  isLastStep: boolean;
  /** Active step, or null while the tour is closed. */
  step: TourStep | null;
  actions: TourActions;
}

/**
 * Access the active tour from anywhere inside `<Tour>`, e.g. to build fully
 * custom popover content or to drive the tour from the spotlighted UI.
 */
export function useTour(): UseTourReturn {
  const { steps, index, step, status, actions, open } =
    useTourContext('useTour');
  return {
    open,
    status,
    actions,
    step,
    index,
    totalSteps: steps.length,
    isFirstStep: index <= 0,
    isLastStep: index >= steps.length - 1
  };
}
