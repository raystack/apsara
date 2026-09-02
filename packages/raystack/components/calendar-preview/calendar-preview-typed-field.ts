'use client';

import type { ChangeEvent, KeyboardEvent } from 'react';
import type { CalendarGranularity } from './calendar-preview-context';
import {
  getYear,
  parseAcrossGranularities,
  parseForGranularity
} from './date-adapter';

/**
 * What `.Input` and `.RangeInput` share.
 *
 * The two had grown a parse pipeline and a keyboard contract each, written
 * twice and then maintained apart. That divergence is where the range writers
 * stopped agreeing: one grew an ordering guard and the other did not, and the
 * bounds each committed drifted from the bounds the other would accept. Kept in
 * one place, a fix to either reaches both.
 */

export interface TypedParse {
  date: Date;
  granularity: CalendarGranularity;
}

export interface TypedParseContext {
  granularity: CalendarGranularity;
  granularities: CalendarGranularity[];
  format: string;
  timeZone?: string;
  /** The visible month, which supplies the year that bare text omits. */
  month: Date;
}

/**
 * Reads what the user typed, at the granularity on offer.
 *
 * The active granularity wins. Only when it cannot read the text do we scan the
 * granularities on offer, so typing `Q4` in a day field switches to Quarter
 * rather than failing — and a day-only picker still rejects it.
 */
export function parseTypedText(
  text: string,
  { granularity, granularities, format, timeZone, month }: TypedParseContext
): TypedParse | null {
  const visibleYear = getYear(month, timeZone);
  const parsed = parseForGranularity(
    text,
    granularity,
    format,
    timeZone,
    visibleYear
  );
  if (parsed) return { date: parsed, granularity };

  const across = parseAcrossGranularities(
    text,
    granularities,
    format,
    timeZone,
    visibleYear
  );
  if (!across) return null;
  return {
    date: across.date,
    granularity: across.granularity as CalendarGranularity
  };
}

export interface TypedFieldHandlers {
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onBlur: () => void;
  onKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
}

export interface TypedFieldOptions {
  /** Current draft text, or `null` when the field shows its committed value. */
  draft: string | null;
  setDraft: (text: string | null) => void;
  /** Returns whether the text was accepted. */
  commit: (text: string) => boolean;
  insideTrigger: boolean;
  setOpen: (open: boolean) => void;
  /** Runs after a commit from Enter, with the result. Used to advance focus. */
  onEnterCommitted?: (accepted: boolean) => void;
}

/**
 * The typing contract: commit on Enter and on blur, open on ArrowDown, revert
 * on Escape.
 *
 * The draft survives a rejected commit. Clearing it regardless — which both
 * fields did while this logic lived in two places — snapped the field back to
 * the old value and left the consumer holding an error about text no longer on
 * screen: type `32 Apr 2024` over `17 Apr 2024`, and the field read
 * `17 Apr 2024` beside `{valid: false, reason: 'unparseable'}`. Escape still
 * reverts, so the way out of bad text is the gesture that always meant that.
 */
export function typedFieldHandlers({
  draft,
  setDraft,
  commit,
  insideTrigger,
  setOpen,
  onEnterCommitted
}: TypedFieldOptions): TypedFieldHandlers {
  return {
    onChange: event => setDraft(event.target.value),

    onBlur: () => {
      if (draft === null) return;
      if (commit(draft)) setDraft(null);
    },

    onKeyDown: event => {
      if (event.key === 'Enter') {
        /*
         * Nothing to commit, so Enter is not ours: it belongs to the form.
         * `preventDefault()` used to run above this guard, which blocked
         * implicit submit for the life of an untouched field.
         *
         * The hand-off still runs — a field showing its committed value is
         * trivially accepted, and tabbing into a filled Start and pressing
         * Enter is the commonest keyboard flow through a range.
         */
        if (draft === null) {
          onEnterCommitted?.(true);
          return;
        }
        event.preventDefault();
        const accepted = commit(draft);
        if (accepted) setDraft(null);
        onEnterCommitted?.(accepted);
      }
      /*
       * The trigger around these fields carries no tab stop, so ArrowDown is how
       * a keyboard reaches the calendar — the combobox convention, and an
       * explicit gesture rather than the focus race the RFC retired.
       */
      if (event.key === 'ArrowDown' && insideTrigger) {
        event.preventDefault();
        setOpen(true);
      }
      /*
       * Two-stage, as a combobox is: the first Escape reverts the text, a second
       * dismisses the popover. Letting one press do both meant correcting a typo
       * cost you the calendar. React's `stopPropagation` reaches the native
       * event, which is what Base UI's document-level dismiss listener is on.
       */
      if (event.key === 'Escape' && draft !== null) {
        event.stopPropagation();
        setDraft(null);
      }
    }
  };
}
