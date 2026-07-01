'use client';

import {
  BarChartIcon,
  BellIcon,
  GearIcon,
  HomeIcon,
  PersonIcon,
  RocketIcon
} from '@radix-ui/react-icons';
import {
  Badge,
  Button,
  Callout,
  Dialog,
  Flex,
  IconButton,
  Input,
  Navbar,
  Search,
  Sidebar,
  Switch,
  Text,
  Tour,
  type TourActions,
  type TourEvent,
  type TourStep,
  useTour
} from '@raystack/apsara';
import { useEffect, useRef, useState } from 'react';

const card: React.CSSProperties = {
  padding: 'var(--rs-space-6)',
  border: '1px solid var(--rs-color-border-base-primary)',
  borderRadius: 'var(--rs-radius-4)',
  backgroundColor: 'var(--rs-color-background-base-primary)'
};

const labCard: React.CSSProperties = {
  ...card,
  padding: 'var(--rs-space-5)',
  height: '100%'
};

/* -------------------------------------------------------------------------- */
/* Shared helpers                                                             */
/* -------------------------------------------------------------------------- */

/**
 * A small live status row, driven by `useTour` — shows idle/waiting/running.
 * Rendered as a child of `<Tour>` so it can read the tour context.
 */
function StatusRow() {
  const { status } = useTour();
  return (
    <Flex gap={2} align='center'>
      <Text size='mini' variant='tertiary'>
        useTour status:
      </Text>
      <Badge variant={status === 'running' ? 'accent' : 'neutral'}>
        {status}
      </Badge>
    </Flex>
  );
}

/** Consistent shell for each isolated edge-case demo. */
function LabCard({
  title,
  children,
  note
}: {
  title: string;
  children: React.ReactNode;
  note: React.ReactNode;
}) {
  return (
    <Flex direction='column' gap={3} style={labCard}>
      <Text size='regular' weight='medium'>
        {title}
      </Text>
      <Text size='small' variant='secondary'>
        {note}
      </Text>
      <Flex direction='column' gap={3} style={{ marginTop: 'auto' }}>
        {children}
      </Flex>
    </Flex>
  );
}

/** Tracks the most recent lifecycle line for a demo-local mini event log. */
function useLastEvent() {
  const [last, setLast] = useState<string>('—');
  const onEvent = (e: TourEvent) => {
    const detail =
      e.type === 'tour:end' ? `status=${e.status}` : (e.step?.id ?? '');
    setLast(`${e.type} · #${e.index} ${detail}`.trim());
  };
  return { last, onEvent };
}

function EventLine({ last }: { last: string }) {
  return (
    <Text
      size='mini'
      variant='tertiary'
      style={{ fontFamily: 'var(--rs-font-mono)' }}
    >
      {last}
    </Text>
  );
}

/* -------------------------------------------------------------------------- */
/* Edge case: late-mounting target (MutationObserver wait → "waiting")        */
/* -------------------------------------------------------------------------- */

function LateMountDemo() {
  const actionsRef = useRef<TourActions>(null);
  const [mounted, setMounted] = useState(false);
  const [phase, setPhase] = useState<'idle' | 'waiting' | 'running'>('idle');

  const run = () => {
    setMounted(false);
    setPhase('waiting');
    actionsRef.current?.start();
    // The target only appears ~1.2s later — the tour waits for it.
    window.setTimeout(() => setMounted(true), 1200);
  };

  return (
    <LabCard
      title='Late-mounting target'
      note='The target mounts 1.2s after the tour starts. A MutationObserver resolves it the moment it appears; until then the tour is "waiting" and nothing is drawn.'
    >
      <Flex gap={2} align='center'>
        <Button size='small' onClick={run}>
          Run
        </Button>
        <Badge variant={phase === 'running' ? 'accent' : 'neutral'}>
          {phase}
        </Badge>
      </Flex>
      <div style={{ minHeight: 44 }}>
        {mounted && (
          <Flex id='lm-target' style={card} data-late>
            <Text size='small'>I mounted late.</Text>
          </Flex>
        )}
      </div>
      <Tour
        steps={[
          {
            id: 'late',
            target: '#lm-target',
            title: 'Waited for the target',
            content:
              'This element was not in the DOM when the tour started. The tour observed for it and resolved once it mounted.'
          }
        ]}
        actionsRef={actionsRef}
        onEvent={e => {
          if (e.type === 'step:active') setPhase('running');
          if (e.type === 'tour:end') setPhase('idle');
        }}
      />
    </LabCard>
  );
}

/* -------------------------------------------------------------------------- */
/* Edge case: target never appears → skip vs stop                             */
/* -------------------------------------------------------------------------- */

function MissingTargetDemo() {
  const actionsRef = useRef<TourActions>(null);
  const [policy, setPolicy] = useState<'skip' | 'stop'>('skip');
  const { last, onEvent } = useLastEvent();

  return (
    <LabCard
      title='Missing target → skip / stop'
      note='The first step targets an element that never exists. After a 1.2s timeout the tour applies the targetNotFound policy — skipping to the next step or stopping.'
    >
      <Flex gap={3} align='center'>
        <Switch
          checked={policy === 'stop'}
          onCheckedChange={c => setPolicy(c ? 'stop' : 'skip')}
        />
        <Text size='small'>
          policy: <code>{policy}</code>
        </Text>
      </Flex>
      <Flex gap={2} align='center'>
        <Button size='small' onClick={() => actionsRef.current?.start()}>
          Run
        </Button>
        <EventLine last={last} />
      </Flex>
      <div id='mt-real' style={card}>
        <Text size='small'>Fallback target.</Text>
      </div>
      <Tour
        key={policy}
        steps={[
          { id: 'ghost', target: '#mt-does-not-exist', title: 'Ghost step' },
          {
            id: 'recovered',
            target: '#mt-real',
            title: 'Recovered',
            content: 'The ghost step timed out and the tour skipped to me.'
          }
        ]}
        actionsRef={actionsRef}
        targetTimeout={1200}
        targetNotFound={policy}
        onEvent={onEvent}
      />
    </LabCard>
  );
}

/* -------------------------------------------------------------------------- */
/* Edge case: a resolved target unmounts mid-step (tour recovers)             */
/* -------------------------------------------------------------------------- */

function UnmountMidStepDemo() {
  const actionsRef = useRef<TourActions>(null);
  const [present, setPresent] = useState(true);
  const { last, onEvent } = useLastEvent();

  const start = () => {
    setPresent(true);
    actionsRef.current?.start();
    // Simulate the target disappearing mid-step — as if a dialog holding it
    // closed, or a route unmounted it — while the tour points at it.
    window.setTimeout(() => setPresent(false), 1600);
  };

  return (
    <LabCard
      title='Target unmounts mid-step'
      note='The tour opens on the card, which then vanishes ~1.6s later while its step is active. The tour drops the broken hole, waits, then advances — never a stranded overlay.'
    >
      <Flex gap={2} align='center'>
        <Button size='small' onClick={start}>
          Start
        </Button>
        <EventLine last={last} />
      </Flex>
      <div style={{ minHeight: 44 }}>
        {present && (
          <div id='um-target' style={card}>
            <Text size='small'>I vanish mid-tour…</Text>
          </div>
        )}
      </div>
      <div id='um-fallback' style={card}>
        <Text size='small'>Stable fallback.</Text>
      </div>
      <Tour
        steps={[
          {
            id: 'removable',
            target: '#um-target',
            title: 'On the vanishing card',
            content: 'Watch — this card is about to disappear.'
          },
          {
            id: 'after',
            target: '#um-fallback',
            title: 'Recovered cleanly',
            content: 'The target vanished, so the tour advanced here.'
          }
        ]}
        actionsRef={actionsRef}
        targetTimeout={1200}
        onEvent={onEvent}
      />
    </LabCard>
  );
}

/* -------------------------------------------------------------------------- */
/* Edge case (headline): close tour, close dialog, resume onto missing target */
/* -------------------------------------------------------------------------- */

function ResumeMissingDemo() {
  const actionsRef = useRef<TourActions>(null);
  const [open, setOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { last, onEvent } = useLastEvent();

  return (
    <LabCard
      title='Resume after the target is gone'
      note='Tour a field inside a dialog, close everything, then resume. The dialog stays closed so the field is gone — the tour waits and draws nothing (no orphaned dim), then ends cleanly.'
    >
      <Flex gap={2} align='center' wrap='wrap'>
        <Button
          size='small'
          onClick={() => {
            setDialogOpen(true);
            setOpen(true);
          }}
        >
          Open &amp; tour field
        </Button>
        <Button
          size='small'
          variant='outline'
          color='neutral'
          onClick={() => actionsRef.current?.start(0)}
        >
          Resume (field gone)
        </Button>
        <EventLine last={last} />
      </Flex>

      <Dialog
        open={dialogOpen}
        modal={false}
        onOpenChange={next => {
          if (!next && open) return; // tour owns dismissal while running
          setDialogOpen(next);
        }}
      >
        <Dialog.Content style={{ width: 360 }} showCloseButton={!open}>
          <Dialog.Header>
            <Dialog.Title>Invite a teammate</Dialog.Title>
          </Dialog.Header>
          <Dialog.Body>
            <Input
              id='rm-field'
              placeholder='teammate@example.com'
              aria-label='Email address'
            />
          </Dialog.Body>
        </Dialog.Content>
      </Dialog>

      <Tour
        steps={[
          {
            id: 'field',
            target: '#rm-field',
            title: 'Field inside a dialog',
            content:
              'Now press Escape (or close), then click “Resume” — the dialog stays closed, so this field no longer exists.',
            spotlightClicks: true
          }
        ]}
        open={open}
        actionsRef={actionsRef}
        targetTimeout={1500}
        onEvent={onEvent}
        onOpenChange={next => {
          setOpen(next);
          if (!next) setDialogOpen(false); // closing the tour closes the dialog
        }}
      />
    </LabCard>
  );
}

/* -------------------------------------------------------------------------- */
/* Edge case: spotlight follows scroll (and scrolls the target into view)     */
/* -------------------------------------------------------------------------- */

function ScrollTrackingDemo() {
  const actionsRef = useRef<TourActions>(null);

  return (
    <LabCard
      title='Scroll a nested container into view'
      note='The target sits below the fold of a scroll box. The tour scrolls the nested container to bring it into view, then the spotlight tracks its exact rect.'
    >
      <Button size='small' onClick={() => actionsRef.current?.start()}>
        Tour the item below the fold
      </Button>
      <div
        style={{
          height: 140,
          overflow: 'auto',
          border: '1px solid var(--rs-color-border-base-primary)',
          borderRadius: 'var(--rs-radius-3)',
          padding: 'var(--rs-space-3)'
        }}
      >
        <Flex direction='column' gap={2}>
          {Array.from({ length: 8 }, (_, i) => (
            <Text key={i} size='small' variant='secondary'>
              Row {i + 1}
            </Text>
          ))}
          <div id='st-target' style={{ ...card, padding: 'var(--rs-space-3)' }}>
            <Text size='small'>Target row (below the fold)</Text>
          </div>
          {Array.from({ length: 6 }, (_, i) => (
            <Text key={i} size='small' variant='secondary'>
              Row {i + 9}
            </Text>
          ))}
        </Flex>
      </div>
      <Tour
        steps={[
          {
            id: 'scrolled',
            target: '#st-target',
            title: 'Scrolled into view',
            content:
              'The tour scrolled this nested container to bring the row into view before anchoring.',
            side: 'top'
          }
        ]}
        actionsRef={actionsRef}
      />
    </LabCard>
  );
}

/* -------------------------------------------------------------------------- */
/* Edge case: spotlight a child of the anchor (spotlightTarget)               */
/* -------------------------------------------------------------------------- */

function SpotlightChildDemo() {
  const actionsRef = useRef<TourActions>(null);

  return (
    <LabCard
      title='Spotlight a child element'
      note='The popover anchors to the whole panel, but spotlightTarget highlights only its header — useful when the anchor is large.'
    >
      <Button size='small' onClick={() => actionsRef.current?.start()}>
        Run
      </Button>
      <div id='sc-panel' style={{ ...card, padding: 0, overflow: 'hidden' }}>
        <div
          id='sc-header'
          style={{
            padding: 'var(--rs-space-3) var(--rs-space-4)',
            borderBottom: '1px solid var(--rs-color-border-base-primary)',
            backgroundColor: 'var(--rs-color-background-base-primary-hover)'
          }}
        >
          <Text size='small' weight='medium'>
            Panel header
          </Text>
        </div>
        <div style={{ padding: 'var(--rs-space-4)' }}>
          <Text size='small' variant='secondary'>
            Panel body content that is not spotlighted.
          </Text>
        </div>
      </div>
      <Tour
        steps={[
          {
            id: 'child',
            target: '#sc-panel',
            spotlightTarget: '#sc-header',
            title: 'Spotlight a child',
            content: 'Anchored to the panel, spotlight on just the header.',
            side: 'bottom'
          }
        ]}
        actionsRef={actionsRef}
      />
    </LabCard>
  );
}

/* -------------------------------------------------------------------------- */
/* Edge case: action-gated step (advance from app state, no Next button)      */
/* -------------------------------------------------------------------------- */

function ActionGatedDemo() {
  const actionsRef = useRef<TourActions>(null);
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [checked, setChecked] = useState(false);

  // Advance when the user performs the required action (toggles the switch).
  useEffect(() => {
    if (open && index === 0 && checked) actionsRef.current?.next();
  }, [open, index, checked]);

  return (
    <LabCard
      title='Action-gated step + useTour'
      note='This step has no Next button — the tour advances only when you toggle the switch. The live status pill is powered by the useTour hook.'
    >
      <Button
        size='small'
        onClick={() => {
          setChecked(false);
          actionsRef.current?.start(0);
        }}
      >
        Start
      </Button>
      <Flex gap={3} align='center'>
        <Switch id='ag-switch' checked={checked} onCheckedChange={setChecked} />
        <Text size='small'>Toggle to continue</Text>
      </Flex>
      <div id='ag-done' style={card}>
        <Text size='small'>Finish line.</Text>
      </div>
      <Tour
        steps={[
          {
            id: 'gate',
            target: '#ag-switch',
            title: 'Do the thing',
            content: 'No Next here — flip the switch to advance.',
            side: 'right',
            spotlightClicks: true
          },
          {
            id: 'gate-done',
            target: '#ag-done',
            title: 'You advanced by doing',
            content: 'App code called actions.next() when the switch flipped.'
          }
        ]}
        open={open}
        stepIndex={index}
        actionsRef={actionsRef}
        onOpenChange={setOpen}
        onStepChange={setIndex}
      >
        <Tour.Overlay />
        <StatusRow />
        <Tour.Popover>
          {({ step, index, isLastStep, actions }) => {
            const gated = index === 0;
            return (
              <>
                <Flex justify='between' align='start' gap={3}>
                  <Tour.Title />
                  <Tour.Close />
                </Flex>
                <Tour.Description />
                <Flex justify='between' align='center' gap={3}>
                  <Tour.Progress />
                  {gated ? (
                    <Text size='mini' weight='medium' variant='accent'>
                      Waiting for you…
                    </Text>
                  ) : (
                    <Button
                      size='small'
                      onClick={isLastStep ? actions.stop : actions.next}
                    >
                      {isLastStep ? 'Done' : 'Next'}
                    </Button>
                  )}
                </Flex>
              </>
            );
          }}
        </Tour.Popover>
      </Tour>
    </LabCard>
  );
}

/* -------------------------------------------------------------------------- */
/* The main product tour                                                      */
/* -------------------------------------------------------------------------- */

type StepData = { requiresAction?: string; hidePrev?: boolean };

function ProductTour() {
  const [tourOpen, setTourOpen] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [events, setEvents] = useState<string[]>([]);
  const [notifications, setNotifications] = useState(3);
  const [showLateCard, setShowLateCard] = useState(false);
  const [lastIndex, setLastIndex] = useState(0);
  const [resumable, setResumable] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const actionsRef = useRef<TourActions>(null);

  // The "Reports" card mounts 1.5s after the tour starts, to demo the wait.
  useEffect(() => {
    if (!tourOpen) return;
    const timer = setTimeout(() => setShowLateCard(true), 1500);
    return () => clearTimeout(timer);
  }, [tourOpen]);

  const steps: TourStep[] = [
    {
      id: 'welcome',
      title: 'Welcome to Raystack',
      content:
        'A tour built entirely on Apsara primitives — Base UI popover, design tokens, and a spotlight backdrop. This first step has no target, so it is centered.'
    },
    {
      id: 'sidebar',
      target: '[data-tour="sidebar-nav"]',
      title: 'Navigate your workspace',
      content: 'Anchored to the sidebar with side="right", align="start".',
      side: 'right',
      align: 'start'
    },
    {
      id: 'search',
      target: () => searchRef.current,
      title: 'Search anything',
      content:
        'This step targets a React ref, and spotlightClicks lets you type in the field while the tour runs.',
      side: 'bottom',
      spotlightClicks: true
    },
    {
      id: 'notifications',
      target: '[data-tour="notifications"]',
      title: 'Stay in the loop',
      content: 'Larger spotlightPadding and a pill spotlightRadius here.',
      side: 'left',
      spotlightPadding: 8,
      spotlightRadius: 999
    },
    {
      id: 'invite-open',
      target: '[data-tour="invite"]',
      title: 'Some steps require doing',
      content:
        'This step has no Next button — click the highlighted button to open the invite dialog and continue.',
      side: 'top',
      spotlightClicks: true,
      data: {
        requiresAction: 'Click the button to continue'
      } satisfies StepData
    },
    {
      id: 'invite-email',
      target: '[data-tour="invite-email"]',
      title: 'Steps can live inside dialogs',
      content:
        'This field mounted with the dialog, after the tour started. The tour dims the dialog itself and ignores light dismissal, so it stays open while you type.',
      side: 'bottom',
      spotlightClicks: true,
      data: { hidePrev: true } satisfies StepData
    },
    {
      id: 'invite-send',
      target: '[data-tour="invite-send"]',
      title: 'Send it',
      content: 'Click “Send invite” to close the dialog and wrap up this part.',
      side: 'top',
      spotlightClicks: true,
      data: {
        requiresAction: 'Click Send invite to continue',
        hidePrev: true
      } satisfies StepData
    },
    {
      id: 'late-card',
      target: '[data-tour="reports"]',
      title: 'Targets can mount late',
      content:
        'This card did not exist when the tour started. The tour waited for it before showing this step.',
      side: 'top',
      data: { hidePrev: true } satisfies StepData
    },
    {
      id: 'scrolled-card',
      target: '[data-tour="billing"]',
      title: 'Scrolled into view',
      content: 'This card was below the fold — the tour scrolled to it.',
      side: 'top'
    },
    {
      id: 'no-overlay',
      target: '[data-tour="event-log"]',
      title: 'Overlay is optional',
      content:
        'This step sets disableOverlay — no dimming, no spotlight, the page stays fully interactive.',
      side: 'right',
      disableOverlay: true
    },
    {
      id: 'done',
      title: 'You are all set',
      content:
        'That is the whole tour. Restart from the header, or explore the edge-case lab below.',
      data: { hidePrev: true } satisfies StepData
    }
  ];

  const logEvent = (event: TourEvent) => {
    const detail =
      event.type === 'tour:end'
        ? `status=${event.status}`
        : (event.step?.id ?? '');
    setEvents(prev =>
      [`${event.type} · #${event.index} ${detail}`.trim(), ...prev].slice(0, 8)
    );
    if (event.type === 'tour:end') {
      setResumable(event.status === 'closed' && event.index > 0);
    }
  };

  return (
    <Flex
      style={{
        height: '100vh',
        backgroundColor: 'var(--rs-color-background-base-secondary)'
      }}
    >
      <Sidebar defaultOpen variant='plain'>
        <Sidebar.Header>
          <Flex align='center' gap={3}>
            <IconButton size={4} aria-label='Logo'>
              <RocketIcon width={20} height={20} />
            </IconButton>
            <Text size='regular' weight='medium'>
              Raystack
            </Text>
          </Flex>
        </Sidebar.Header>
        <Sidebar.Main data-tour='sidebar-nav'>
          <Sidebar.Item href='#' active leadingIcon={<HomeIcon />}>
            Dashboard
          </Sidebar.Item>
          <Sidebar.Item href='#' leadingIcon={<BarChartIcon />}>
            Analytics
          </Sidebar.Item>
          <Sidebar.Item href='#' leadingIcon={<PersonIcon />}>
            Members
          </Sidebar.Item>
          <Sidebar.Item href='#' leadingIcon={<GearIcon />}>
            Settings
          </Sidebar.Item>
        </Sidebar.Main>
      </Sidebar>

      <Flex direction='column' style={{ flex: 1, overflow: 'auto' }}>
        <Navbar sticky>
          <Navbar.Start>
            <Text size='regular' weight='medium'>
              Guided tour example
            </Text>
          </Navbar.Start>
          <Navbar.End>
            <div ref={searchRef}>
              <Search size='small' placeholder='Search workspace…' />
            </div>
            <span data-tour='notifications'>
              <IconButton
                size={4}
                aria-label='Notifications'
                onClick={() => setNotifications(0)}
              >
                <BellIcon />
              </IconButton>
            </span>
            {notifications > 0 && (
              <Badge variant='accent'>{notifications}</Badge>
            )}
          </Navbar.End>
        </Navbar>

        <Flex
          direction='column'
          align='start'
          gap={4}
          style={{
            padding: 'var(--rs-space-9) var(--rs-space-9) var(--rs-space-7)'
          }}
        >
          <Text size='large' weight='medium'>
            Take the guided tour
          </Text>
          <Text
            align='start'
            size='small'
            variant='secondary'
            style={{ maxWidth: 460 }}
          >
            Eleven steps across the sidebar, search, a dialog, plus
            late-mounting and scrolled targets. Press Escape any time to leave.
            Isolated edge-case demos are further down the page.
          </Text>
          <Button
            onClick={() => actionsRef.current?.start(resumable ? lastIndex : 0)}
          >
            {resumable ? `Resume tour (step ${lastIndex + 1})` : 'Start tour'}
          </Button>
        </Flex>

        <Flex
          direction='column'
          gap={7}
          style={{
            padding: '0 var(--rs-space-9) var(--rs-space-9)',
            maxWidth: 760
          }}
        >
          <Callout type='accent' icon={<RocketIcon />}>
            Step 5 only advances when you click the invite button, step 6
            targets a field inside the dialog it opens, and later steps cover
            late-mounting and scrolled targets.
          </Callout>

          <Flex direction='column' gap={3} style={card} data-tour='event-log'>
            <Text size='regular' weight='medium'>
              Event log
            </Text>
            <Text size='small' variant='secondary'>
              Every tour lifecycle event lands in <code>onEvent</code>:
            </Text>
            <Flex
              direction='column'
              gap={1}
              style={{
                fontFamily: 'var(--rs-font-mono)',
                fontSize: 'var(--rs-font-size-mini)',
                minHeight: 120
              }}
            >
              {events.length === 0 ? (
                <Text size='mini' variant='tertiary'>
                  No events yet.
                </Text>
              ) : (
                events.map((entry, i) => (
                  <Text key={`${entry}-${i}`} size='mini' variant='secondary'>
                    {entry}
                  </Text>
                ))
              )}
            </Flex>
          </Flex>

          <Flex direction='column' gap={3} style={card}>
            <Text size='regular' weight='medium'>
              Team
            </Text>
            <Text size='small' variant='secondary'>
              The tour asks you to open this dialog yourself, then steps into
              it.
            </Text>
            <Flex>
              <Button
                data-tour='invite'
                variant='outline'
                color='neutral'
                onClick={() => {
                  setInviteOpen(true);
                  actionsRef.current?.next();
                }}
              >
                Invite member
              </Button>
            </Flex>
          </Flex>

          {showLateCard && (
            <Flex direction='column' gap={2} style={card} data-tour='reports'>
              <Text size='regular' weight='medium'>
                Reports
              </Text>
              <Text size='small' variant='secondary'>
                This card mounted 1.5 seconds after the tour started.
              </Text>
            </Flex>
          )}

          <Flex direction='column' gap={3} style={card}>
            <Text size='regular' weight='medium'>
              Workspace activity
            </Text>
            {Array.from({ length: 14 }, (_, i) => (
              <Text key={i} size='small' variant='secondary'>
                Deploy #{214 - i} finished — all checks passed.
              </Text>
            ))}
          </Flex>

          <Flex
            direction='column'
            gap={2}
            style={{ ...card, marginBottom: 'var(--rs-space-9)' }}
            data-tour='billing'
          >
            <Text size='regular' weight='medium'>
              Billing
            </Text>
            <Text size='small' variant='secondary'>
              Your plan renews on the 1st. This card lives below the fold so the
              tour scrolls to it.
            </Text>
            <Input placeholder='Promo code' />
          </Flex>

          <EdgeCaseLab />
        </Flex>
      </Flex>

      {/* Non-modal so the tour popover stays clickable; while the tour runs
          light dismissal is ignored — the tour decides when the dialog closes. */}
      <Dialog
        open={inviteOpen}
        modal={false}
        onOpenChange={next => {
          if (!next && tourOpen) return;
          setInviteOpen(next);
        }}
      >
        <Dialog.Content style={{ width: 420 }} showCloseButton={!tourOpen}>
          <Dialog.Header>
            <Dialog.Title>Invite a teammate</Dialog.Title>
          </Dialog.Header>
          <Dialog.Body>
            <Flex direction='column' gap={3}>
              <Text size='small' variant='secondary'>
                They will get an email with a link to join this workspace.
              </Text>
              <Input
                data-tour='invite-email'
                placeholder='teammate@example.com'
                aria-label='Email address'
              />
            </Flex>
          </Dialog.Body>
          <Dialog.Footer>
            <Button
              variant='ghost'
              disabled={tourOpen}
              onClick={() => setInviteOpen(false)}
            >
              Cancel
            </Button>
            <Button
              data-tour='invite-send'
              onClick={() => {
                setInviteOpen(false);
                actionsRef.current?.next();
              }}
            >
              Send invite
            </Button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog>

      <Tour
        steps={steps}
        open={tourOpen}
        // How long to wait for a missing target before skipping (default 5000).
        // Lowered here so resuming onto a since-closed dialog skips promptly.
        targetTimeout={2000}
        onOpenChange={nextOpen => {
          setTourOpen(nextOpen);
          if (!nextOpen) setInviteOpen(false);
        }}
        onStepChange={index => setLastIndex(index)}
        onEvent={logEvent}
        actionsRef={actionsRef}
      >
        <Tour.Overlay />
        <Tour.Popover>
          {({ step, index }) => {
            const data = (step.data ?? {}) as StepData;
            return (
              <>
                <Flex justify='between' align='start' gap={3}>
                  <Tour.Title />
                  <Tour.Close />
                </Flex>
                <Tour.Description />
                <Flex justify='between' align='center' gap={3}>
                  <Tour.Progress />
                  {data.requiresAction ? (
                    <Text size='mini' weight='medium' variant='accent'>
                      {data.requiresAction}
                    </Text>
                  ) : (
                    <Flex gap={3} align='center'>
                      {index > 0 && !data.hidePrev && <Tour.Prev />}
                      <Tour.Next />
                    </Flex>
                  )}
                </Flex>
              </>
            );
          }}
        </Tour.Popover>
      </Tour>
    </Flex>
  );
}

/* -------------------------------------------------------------------------- */
/* Edge-case lab                                                              */
/* -------------------------------------------------------------------------- */

function EdgeCaseLab() {
  return (
    <Flex
      direction='column'
      gap={4}
      style={{ marginBottom: 'var(--rs-space-9)' }}
    >
      <Flex direction='column' gap={1}>
        <Text size='large' weight='medium'>
          Edge-case lab
        </Text>
        <Text size='small' variant='secondary'>
          Each card is a self-contained tour that isolates one tricky lifecycle
          scenario. Trigger them independently.
        </Text>
      </Flex>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 'var(--rs-space-5)'
        }}
      >
        <LateMountDemo />
        <MissingTargetDemo />
        <UnmountMidStepDemo />
        <ResumeMissingDemo />
        <ScrollTrackingDemo />
        <SpotlightChildDemo />
        <ActionGatedDemo />
      </div>
    </Flex>
  );
}

export default function Page() {
  return <ProductTour />;
}
