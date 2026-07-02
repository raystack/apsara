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
  /** Resolved anchor element for the active step; null for detached steps or while waiting. */
  anchor: Element | null;
  /** Resolved element to spotlight; usually the anchor. */
  spotlightElement: Element | null;
  /** Whether the popover should be visible (tour open and target resolved). */
  popoverOpen: boolean;
  /** Tour-level default for hiding the dimmed overlay. */
  disableOverlay: boolean;
  /** How the spotlight and popover travel between steps. */
  transition: TourTransition;
  /**
   * Whether the active step's target is settled and in view. Drives the
   * fade-in of the spotlight (in every mode) and of the popover (in `fade`
   * mode) so they appear only once the target has stopped moving, e.g. after
   * scrolling into view. Computed the same way regardless of transition; in
   * `move` mode the popover ignores it and glides, but the spotlight still
   * respects it.
   */
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
