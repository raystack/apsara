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
  Text,
  Tour,
  type TourActions,
  type TourEvent,
  type TourStep
} from '@raystack/apsara';
import { useEffect, useRef, useState } from 'react';

const card: React.CSSProperties = {
  padding: 'var(--rs-space-6)',
  border: '1px solid var(--rs-color-border-base-primary)',
  borderRadius: 'var(--rs-radius-4)',
  backgroundColor: 'var(--rs-color-background-base-primary)'
};

/** Per-step flags read by the custom popover layout below. */
type StepData = {
  /** When set, the step has no Next button — this hint shows instead. */
  requiresAction?: string;
  hidePrev?: boolean;
};

const Page = () => {
  const [tourOpen, setTourOpen] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [events, setEvents] = useState<string[]>([]);
  const [notifications, setNotifications] = useState(3);
  const [showLateCard, setShowLateCard] = useState(false);
  // Track progress so the hero can offer "Resume" after a mid-tour stop.
  const [lastIndex, setLastIndex] = useState(0);
  const [resumable, setResumable] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const actionsRef = useRef<TourActions>(null);

  // The "Reports" card mounts 1.5s after the tour starts, to demo the
  // MutationObserver wait (status becomes `waiting` until it appears).
  useEffect(() => {
    if (!tourOpen) return;
    const timer = setTimeout(() => setShowLateCard(true), 1500);
    return () => clearTimeout(timer);
  }, [tourOpen]);

  const steps: TourStep[] = [
    {
      id: 'welcome',
      // No target: renders as a centered, detached step.
      title: 'Welcome to Raystack',
      content:
        'This tour is built entirely on Apsara primitives — Base UI popover, design tokens, and a spotlight backdrop. Use Next or press Escape to leave at any time.'
    },
    {
      id: 'sidebar',
      target: '[data-tour="sidebar-nav"]',
      title: 'Navigate your workspace',
      content:
        'Everything lives in the sidebar. Dashboards, analytics and settings are one click away.',
      side: 'right',
      align: 'start'
    },
    {
      id: 'search',
      target: () => searchRef.current,
      title: 'Search anything',
      content:
        'This step targets a React ref instead of a selector, and spotlightClicks lets you type into the field while the tour is running — try it.',
      side: 'bottom',
      spotlightClicks: true
    },
    {
      id: 'notifications',
      target: '[data-tour="notifications"]',
      title: 'Stay in the loop',
      content:
        'The bell shows unread alerts. The spotlight here uses a larger padding and a pill radius.',
      side: 'left',
      spotlightPadding: 8,
      spotlightRadius: 999
    },
    {
      id: 'invite-open',
      target: '[data-tour="invite"]',
      title: 'Invite your team',
      content:
        'Some steps require doing instead of reading. This one has no Next button — click the highlighted button to open the invite dialog and continue.',
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
        'This field mounted with the dialog, after the tour had already started. The tour dims the dialog itself and ignores light dismissal, so the dialog stays open while you type.',
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
        'This card did not exist when the tour started. The tour waited for it to appear in the DOM before showing this step.',
      side: 'top',
      data: { hidePrev: true } satisfies StepData
    },
    {
      id: 'scrolled-card',
      target: '[data-tour="billing"]',
      title: 'Scrolled into view',
      content:
        'This card was below the fold — the tour scrolled it into view before anchoring.',
      side: 'top'
    },
    {
      id: 'no-overlay',
      target: '[data-tour="event-log"]',
      title: 'Overlay is optional',
      content:
        'This step sets disableOverlay — no dimming, no spotlight, and the whole page stays interactive. Pass it on the Tour itself to disable the overlay for every step.',
      side: 'right',
      disableOverlay: true
    },
    {
      id: 'done',
      title: 'You are all set',
      content:
        'That is the whole tour. Restart it from the button in the header, or jump to any step with the controls below the event log.',
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
    // Offer "Resume" only when the tour was left mid-way (Escape or Stop),
    // not when it ran to the end (finished) or was skipped.
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
          justify='start'
          gap={4}
          style={{
            padding: 'var(--rs-space-9) var(--rs-space-9) var(--rs-space-7)',
            textAlign: 'center'
          }}
        >
          <Text size='large' weight='medium'>
            Take the guided tour
          </Text>
          <Text
            align='start'
            size='small'
            variant='secondary'
            style={{ maxWidth: 440 }}
          >
            Ten steps across the sidebar, search, a dialog, plus late-mounting
            and scrolled targets. Press Escape any time to leave.
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
            Click “Start tour”. Step 5 only advances when you click the invite
            button, step 6 targets a field inside the dialog it opens, and the
            later steps cover late-mounting and scrolled targets.
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
                  // Advance the tour when the user performs the asked action.
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
              tour has to scroll to it.
            </Text>
            <Input placeholder='Promo code' />
          </Flex>
        </Flex>
      </Flex>

      {/* Non-modal so the tour popover (outside the dialog) stays clickable;
          while the tour runs, light dismissal is ignored — the tour decides
          when the dialog closes. */}
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
        onOpenChange={nextOpen => {
          setTourOpen(nextOpen);
          // Ending the tour mid-dialog shouldn't strand the dialog open.
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
};

export default Page;
