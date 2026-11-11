import type { BaseUIGenericEventDetails } from '@base-ui/react/types';

/**
 * The second argument of a change callback on a component that owns its state.
 * It has the `reason` and `event` of Base UI's `eventDetails`, plus the
 * component's own fields.
 */
export type ChangeDetails<
  Reason extends string = string,
  Custom extends object = {}
> = BaseUIGenericEventDetails<Reason, Custom>;

/**
 * Creates a `ChangeDetails`. Without an event, `event` is a new `Event`, as in
 * Base UI.
 */
export function createChangeDetails<
  Reason extends string,
  Custom extends object = {}
>(
  reason: Reason,
  event?: Event,
  custom?: Custom
): ChangeDetails<Reason, Custom> {
  return {
    reason,
    event: event ?? new Event('apsara'),
    ...custom
  } as ChangeDetails<Reason, Custom>;
}
