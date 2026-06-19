---
ID: RFC 003
Created: June 17, 2026
Status: Draft
RFC PR: TBD
---

# Guided Tour Component

This RFC proposes `Tour`, a component for building guided product walkthroughs: onboarding flows, feature coach marks, and step by step tutorials. It is built on Apsara's Base UI `Popover`, so it inherits our positioning engine, tokens, and composition style instead of pulling in an outside library. This describes the full intended component; a working prototype already validates the core (positioning, spotlight, controlled state, target waiting).

## Table of Contents

- [Guided Tour Component](#guided-tour-component)
  - [Table of Contents](#table-of-contents)
  - [Background](#background)
  - [Choosing an Approach: Library or Build Our Own](#choosing-an-approach-library-or-build-our-own)
    - [Adopt an Existing Library](#adopt-an-existing-library)
    - [Build Our Own on Base UI Popover](#build-our-own-on-base-ui-popover)
    - [Decision](#decision)
  - [Proposal](#proposal)
  - [Behavior and Features](#behavior-and-features)
    - [Parts and Context](#parts-and-context)
    - [State and Actions](#state-and-actions)
    - [Target Resolution](#target-resolution)
    - [Advancing Steps](#advancing-steps)
    - [Overlay and Spotlight](#overlay-and-spotlight)
    - [Positioning, Dismissal, and Z Index](#positioning-dismissal-and-z-index)
    - [Accessibility](#accessibility)
    - [Events](#events)
  - [Impact](#impact)
  - [Helpful Links](#helpful-links)

## Background

Guided tours are a common product need: onboarding a new user, introducing a feature, or walking through a multi step task all want the same UI, a sequence of small cards that point at real elements, dim or highlight their surroundings, and let the user move on, go back, or leave. Apsara has no tour primitive today, so the aim here is to solve it once, as a themeable and composable component.

## Choosing an Approach: Library or Build Our Own

The first decision is whether to wrap an existing tour library or build the primitive ourselves.

### Adopt an Existing Library

Wrapping a mature library (driver.js, Shepherd, React JoyRide and others) is the fastest path.

- **Pros:** works on day one, battle tested across many apps, and usually ships extras like beacons and keyboard handling.
- **Cons:** its own DOM and CSS that never match our tokens; a second positioning engine running next to Base UI's; another dependency to maintain; and little control over the behavior we need

### Build Our Own on Base UI Popover

A tour is really a popover that hops between anchors, plus a dimmed backdrop and a small step machine. Base UI's `Popover` already does the floating element logic, so the work left is the step machine, the spotlight, and the tour specific behavior.

- **Pros:** native tokens and components, one positioning engine, our usual composition idioms, full control of dismissal, focus, and no new dependency.
- **Cons:** we own the maintenance and it is more upfront work.

### Decision

Build our own. A tour sits on top of the whole app and has to feel like part of the product, which is exactly the design system's job. The recurring cost of overriding a library's styling and reconciling its positioning, focus, and stacking with ours outweighs the one time cost of building a focused component on a primitive we already maintain.

## Proposal

`Tour` is one compound component, built on Base UI `Popover` and exported from the package root. The parts:

```tsx
<Tour>             // root: holds steps + open/index state, resolves targets, emits events, owns actions
  <Tour.Overlay/>  // dimmed backdrop with a spotlight hole over the target
  <Tour.Popover>   // the card: static children, a render function, or the default layout
    <Tour.Title/> <Tour.Description/>   // fall back to step.title / step.content
    <Tour.Progress/>                    // "n of total", optional format()
    <Tour.Prev/> <Tour.Next/> <Tour.Skip/> <Tour.Close/>  // run your onClick, then the action
  </Tour.Popover>
</Tour>
// useTour() exposes the same state and actions anywhere inside <Tour>
```

A tour is data first: describe each step as an object and pass an array.

```ts
type TourTarget = string | Element | RefObject<Element | null> | (() => Element | null);

interface TourStep {
  id?: string;
  target?: TourTarget;          // what to anchor and spotlight; omit for a centered step
  title?: ReactNode;
  content?: ReactNode;

  side?: 'top' | 'right' | 'bottom' | 'left';  // default 'bottom'
  align?: 'start' | 'center' | 'end';          // default 'center'
  sideOffset?: number;

  spotlightTarget?: TourTarget; // spotlight something other than the anchor
  spotlightPadding?: number;
  spotlightRadius?: number;
  spotlightClicks?: boolean;    // let clicks reach the highlighted element
  disableOverlay?: boolean;     // override the tour-level overlay for this step

  scrollTarget?: TourTarget;    // scroll a different element into view
  disableScroll?: boolean;      // skip scrolling the target into view

  data?: unknown;               // anything; echoed back to the render function and events
}
```

The root carries the tour wide options:

```ts
interface TourRootProps {
  steps: TourStep[];

  open?: boolean;                  // controlled; or defaultOpen for uncontrolled
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean, details: { status?: TourEndStatus }) => void;
  stepIndex?: number;              // controlled; or defaultStepIndex
  defaultStepIndex?: number;
  onStepChange?: (index: number, step: TourStep) => void;

  onEvent?: (event: TourEvent) => void;
  actionsRef?: RefObject<TourActions | null>;

  targetTimeout?: number;          // wait for a missing target, default 5000ms
  targetNotFound?: 'skip' | 'stop'; // default 'skip'

  disableOverlay?: boolean;        // hide the dimmed overlay for the whole tour

  children?: ReactNode;            // defaults to <Tour.Overlay/> + <Tour.Popover/>
}
```

The simplest tour is one array and the default card:

```tsx
const steps: TourStep[] = [
  { target: '[data-test-id="search"]', title: 'Search', content: 'Find anything here.' },
  { target: filtersRef, title: 'Filter', content: 'Narrow results.', side: 'right' },
  { title: "You're all set!", content: 'Explore at your own pace.' }, // no target, centered
];

// Renders the overlay + the standard card (Title + Close, Description, Progress, Back, Next/Finish).
<Tour steps={steps} defaultOpen />
```

For tours that react to the app, control `open` and `stepIndex`, pass an `actionsRef`, and render your own card. The render function gets the active step plus `actions`:

```tsx
interface TourRenderProps {
  step: TourStep;
  index: number;
  totalSteps: number;
  isFirstStep: boolean;
  isLastStep: boolean;
  status: 'idle' | 'waiting' | 'running';
  actions: TourActions;        // start, next, prev, go, skip, stop
}

const actionsRef = useRef<TourActions>(null);

<Button onClick={() => actionsRef.current?.start()}>Take a tour</Button>

<Tour
  steps={steps}
  open={open}
  stepIndex={index}
  actionsRef={actionsRef}
  onOpenChange={(open, { status }) => { setOpen(open); if (!open) track('tour_end', status); }}
  onStepChange={setIndex}
  disableOverlay
>
  <Tour.Popover>
    {({ step, index, totalSteps, isLastStep, actions }) => (
      <Flex direction="column" gap={3}>
        <Text weight="medium">{step.title}</Text>
        <Text variant="secondary">{step.content}</Text>
        <Flex justify="between" align="center">
          <Text size="mini">{index + 1} of {totalSteps}</Text>
          <Button size="small" onClick={isLastStep ? actions.stop : actions.next}>
            {isLastStep ? 'Done' : 'Next'}
          </Button>
        </Flex>
      </Flex>
    )}
  </Tour.Popover>
</Tour>
```

## Behavior and Features

### Parts and Context

```tsx
export const Tour = Object.assign(TourRoot, {
  Overlay, Popover, Title, Description, Progress, Next, Prev, Skip, Close,
});
```

The root provides a context; each part reads `step`, `anchor`, `status`, and `actions` from it with `useTourContext` (and throws if used outside `<Tour>`). Because parts take their data from context rather than props, a consumer can reorder, drop, or replace any of them.

### State and Actions

`open` and `stepIndex` each run through Base UI's `useControlled`, so either can be controlled or uncontrolled independently. The index is clamped to the step range, and `actions` keeps a stable identity across renders, so it is safe in `actionsRef` and effect dependencies.

```ts
interface TourActions {
  start: (index?: number) => void;  // the only action that runs while closed
  next: () => void;                 // finishes the tour past the last step
  prev: () => void;
  go: (index: number) => void;
  skip: () => void;                 // ends with status 'skipped'
  stop: () => void;                 // ends with status 'closed'
}
```

### Target Resolution

```ts
target: '#search'                    // CSS selector
target: searchRef                    // React ref
target: () => editor.getNode('aoi')  // function returning an element
target: document.body                // an element
// omit target → a detached step, centered in the viewport
```

`useTourTarget` resolves immediately when the element is connected. Otherwise it watches `document.body` with a `MutationObserver` and resolves the moment the target appears, giving up after `targetTimeout` and applying `targetNotFound`. While it waits, `status` is `'waiting'`.

### Advancing Steps

The default card's Next button calls `actions.next()`. For a step that should advance when the user does something on the page (draw a shape, open a panel), render your own card with a render function, leave out Next, and call `actions.next()` or `actions.go()` from app code when the relevant state changes.

```tsx
// advance the draw step once the app reports a shape on the map
useEffect(() => {
  if (open && stepIndex === 2 && store.hasShape) actionsRef.current?.go(3);
}, [open, stepIndex, store.hasShape]);
```

### Overlay and Spotlight

The dimming is the box shadow of the spotlight element, not a separate scrim:

```css
.spotlight { box-shadow: 0 0 0 200vmax var(--rs-color-overlay-black-a5); }
```

The transparent `.spotlight` div sits over the target, so its shadow dims everything else and moving it animates the hole. Hit strips block clicks around the hole (the strip over the hole is dropped when `spotlightClicks` is set), and a `requestAnimationFrame` loop keeps the hole on the target through scroll, resize, and transforms.

### Positioning, Dismissal, and Z Index

`Tour.Popover` is a `Popover.Root` (`modal={false}`) wrapping `Portal`, `Positioner`, and `Popup`, and takes `side`, `align`, `sideOffset`, and `showArrow` defaults that a step's `side`/`align`/`sideOffset` override. It anchors to the target, or for a detached step to a virtual viewport center anchor. Only escape closes the tour; outside clicks and focus moves are ignored, so a step can keep focus on the element it highlights. The overlay and positioner sit one and two layers above `--rs-z-index-portal`, so a step can spotlight content inside a dialog.

### Accessibility

The card is a Base UI `Popover`, so `Tour.Title` and `Tour.Description` give it an accessible name and description and focus is handled by the popover. Escape ends the tour, and animations respect reduced motion.

### Events

```tsx
<Tour
  steps={steps}
  onEvent={(e) => {
    if (e.type === 'error:target-not-found') console.warn('missing target', e.index);
    if (e.type === 'tour:end') analytics.track('tour_end', { status: e.status });
  }}
/>
```

```ts
type TourEvent =
  | { type: 'tour:start';  index: number; step?: TourStep }
  | { type: 'step:active'; index: number; step: TourStep }
  | { type: 'error:target-not-found'; index: number; step: TourStep }
  | { type: 'tour:end';    index: number; status: 'finished' | 'skipped' | 'closed' };
```

The `tour:end` status says how it closed: `next()` past the last step is `finished`, `skip()` is `skipped`, and `stop()`, escape, or a missing target under the `stop` policy is `closed`. The same status reaches `onOpenChange`.

## Impact

- New exports: `Tour`, `useTour`, and the types `TourActions`, `TourEndStatus`, `TourEvent`, `TourRenderProps`, `TourStep`, `TourTarget`. Nothing else changes and nothing is deprecated.
- Consumers get onboarding and coach marks from a single `steps` array, with a clear path to more control through composed parts and the render function.
- It keeps bundle size, theming, and stacking under our control instead of an outside library's.
- A prototype validates the core (positioning, spotlight, controlled state, target waiting, an overlay free action gated tour driven through `actions.go()`); this RFC specifies the complete component.

## Helpful Links

- [Base UI, Popover](https://base-ui.com/react/components/popover). The primitive the tour is built on.
- [driver.js](https://driverjs.com/) and [Shepherd](https://shepherdjs.dev/). External tour libraries weighed under Choosing an Approach.
- [WAI-ARIA Authoring Practices, Dialog (Modal) Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/). Informs focus and labeling for the card.
- Internal: `packages/raystack/components/tour/ANALYSIS.md`, the prototype analysis backing this RFC.
- Internal: `apps/www/src/app/examples/tour/page.tsx`, the prototype example.
