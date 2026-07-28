'use client';

export const preview = {
  type: 'code',
  code: `function ChatPanelPreview() {
  const RESPONSES = [
    'Done — I created the task and assigned it to you.',
    'On it. I\\'ll ping you when the draft is ready to review.',
    'Good question — the design tokens live in packages/raystack/styles.',
    'That shipped in the last release; update and it should just work.',
    'I\\'ve noted it down. Anything else you\\'d like me to pick up?'
  ];

  const [mode, setMode] = React.useState('docked');
  const [status, setStatus] = React.useState('idle');
  const [messages, setMessages] = React.useState([
    { id: 1, role: 'user', text: 'create a task in design system 2' },
    { id: 2, role: 'assistant', text: RESPONSES[0] }
  ]);
  const nextIdRef = React.useRef(3);
  const timerRef = React.useRef(null);

  React.useEffect(() => () => clearTimeout(timerRef.current), []);

  const handleSubmit = (value, event) => {
    event.currentTarget.reset();
    setMessages(prev => [
      ...prev,
      { id: nextIdRef.current++, role: 'user', text: value }
    ]);
    setStatus('submitted');
    timerRef.current = setTimeout(() => {
      const reply = RESPONSES[Math.floor(Math.random() * RESPONSES.length)];
      setMessages(prev => [
        ...prev,
        { id: nextIdRef.current++, role: 'assistant', text: reply }
      ]);
      setStatus('idle');
    }, 900);
  };

  const handleStop = () => {
    clearTimeout(timerRef.current);
    setStatus('idle');
  };

  return (
    <Flex style={{ width: '100%', height: 420, border: '0.5px solid var(--rs-color-border-base-primary)', borderRadius: 'var(--rs-radius-4)', overflow: 'hidden' }}>
      <ChatPanel mode={mode} onModeChange={setMode} side="left">
        <ChatPanel.Header>
          <ChatPanel.Title>Create task in design system 2</ChatPanel.Title>
          <ChatPanel.Actions>
            <ChatPanel.MinimizeTrigger />
            <ChatPanel.ExpandTrigger />
          </ChatPanel.Actions>
        </ChatPanel.Header>
        <ChatPanel.Content>
          <Chat>
            <Chat.Messages>
              {messages.map(message => (
                <Chat.Item key={message.id}>
                  <Message align={message.role === 'user' ? 'end' : 'start'}>
                    <Message.Content>
                      {message.role === 'user' ? (
                        <Message.Bubble>{message.text}</Message.Bubble>
                      ) : (
                        <Message.Bubble variant="ghost">{message.text}</Message.Bubble>
                      )}
                    </Message.Content>
                  </Message>
                </Chat.Item>
              ))}
              {status === 'submitted' && (
                <Chat.Item>
                  <Message>
                    <Message.Content>
                      <Text size="small" variant="secondary">Thinking…</Text>
                    </Message.Content>
                  </Message>
                </Chat.Item>
              )}
              <Chat.JumpButton />
            </Chat.Messages>
            <Chat.Composer>
              <PromptInput status={status} onSubmit={handleSubmit} onStop={handleStop}>
                <PromptInput.Textarea placeholder="Reply…" />
                <PromptInput.Footer>
                  <PromptInput.Submit />
                </PromptInput.Footer>
              </PromptInput>
            </Chat.Composer>
          </Chat>
        </ChatPanel.Content>
        <ChatPanel.Trigger />
      </ChatPanel>
      <Flex direction="column" gap={3} style={{ flex: 1, padding: 'var(--rs-space-5)' }}>
        <Text size="large" weight="medium">Main content</Text>
        <Text size="small" variant="secondary">
          The docked panel is a real flex sibling — it squeezes this content
          instead of covering it. Pop it out or minimize it from the header;
          floating and minimized modes are fixed to the browser viewport.
          Send a message to get a (canned) reply.
        </Text>
      </Flex>
    </Flex>
  );
}`
};

export const controlledDemo = {
  type: 'code',
  code: `function ControlledChatPanel() {
  const [mode, setMode] = React.useState('docked');

  return (
    <Flex direction="column" gap={4} style={{ width: '100%' }}>
      <Flex gap={3}>
        <Button size="small" variant="outline" color="neutral" onClick={() => setMode('docked')}>Dock</Button>
        <Button size="small" variant="outline" color="neutral" onClick={() => setMode('floating')}>Float</Button>
        <Button size="small" variant="outline" color="neutral" onClick={() => setMode('minimized')}>Minimize</Button>
      </Flex>
      <Text size="small" variant="secondary">mode: {mode}</Text>
      <Flex style={{ width: '100%', height: 360, border: '0.5px solid var(--rs-color-border-base-primary)', borderRadius: 'var(--rs-radius-4)', overflow: 'hidden' }}>
        <Flex style={{ flex: 1, padding: 'var(--rs-space-5)' }}>
          <Text size="small" variant="secondary">
            Floating and minimized modes leave this frame and pin to the
            browser viewport.
          </Text>
        </Flex>
        <ChatPanel mode={mode} onModeChange={setMode} side="right" defaultSize={{ width: 360, height: 440 }}>
          <ChatPanel.Header>
            <ChatPanel.Title>Assistant</ChatPanel.Title>
            <ChatPanel.Actions>
              <ChatPanel.MinimizeTrigger />
              <ChatPanel.ExpandTrigger />
            </ChatPanel.Actions>
          </ChatPanel.Header>
          <ChatPanel.Content>
            <Flex style={{ padding: 'var(--rs-space-5)' }}>
              <Text size="small" variant="secondary">
                Drag the header to move the floating window; resize from any
                edge or corner.
              </Text>
            </Flex>
          </ChatPanel.Content>
          <ChatPanel.Trigger />
        </ChatPanel>
      </Flex>
    </Flex>
  );
}`
};

export const boundedDragDemo = {
  type: 'code',
  code: `function BoundedDragChatPanel() {
  const boundaryRef = React.useRef(null);
  const [position, setPosition] = React.useState(null);
  const [open, setOpen] = React.useState(false);

  const handleToggle = () => {
    if (!open) {
      // Start the floating window inside the boundary frame.
      const rect = boundaryRef.current?.getBoundingClientRect();
      if (rect) setPosition({ x: rect.left + 24, y: rect.top + 24 });
    }
    setOpen(!open);
  };

  return (
    <Flex direction="column" gap={4} style={{ width: '100%' }}>
      <Flex>
        <Button size="small" variant="outline" color="neutral" onClick={handleToggle}>
          {open ? 'Close the floating window' : 'Open the floating window'}
        </Button>
      </Flex>
      <div
        ref={boundaryRef}
        style={{ width: '100%', height: 380, border: '1px dashed var(--rs-color-border-base-secondary)', borderRadius: 'var(--rs-radius-4)' }}
      >
        {open && (
          <ChatPanel
            defaultMode="floating"
            position={position}
            onPositionChange={setPosition}
            defaultSize={{ width: 320, height: 280 }}
            minSize={{ width: 260, height: 220 }}
            dragBoundary={boundaryRef}
          >
            <ChatPanel.Header>
              <ChatPanel.Title>Assistant</ChatPanel.Title>
            </ChatPanel.Header>
            <ChatPanel.Content>
              <Flex style={{ padding: 'var(--rs-space-5)' }}>
                <Text size="small" variant="secondary">
                  Drag the header — the window can't leave the dashed frame.
                </Text>
              </Flex>
            </ChatPanel.Content>
          </ChatPanel>
        )}
      </div>
    </Flex>
  );
}`
};

export const resizeDemo = {
  type: 'code',
  code: `function ResizeAxesChatPanel() {
  const [mode, setMode] = React.useState('docked');
  const [resize, setResize] = React.useState('both');

  return (
    <Flex direction="column" gap={4} style={{ width: '100%' }}>
      <Flex gap={3} align="center">
        <Text size="small" variant="secondary">resize:</Text>
        {['both', 'horizontal', 'vertical', 'none'].map(value => (
          <Button
            key={value}
            size="small"
            variant="outline"
            color={resize === value ? 'accent' : 'neutral'}
            onClick={() => setResize(value)}
          >
            {value}
          </Button>
        ))}
      </Flex>
      <Flex style={{ width: '100%', height: 380, border: '0.5px solid var(--rs-color-border-base-primary)', borderRadius: 'var(--rs-radius-4)', overflow: 'hidden' }}>
        <Flex style={{ flex: 1, padding: 'var(--rs-space-5)' }}>
          <Text size="small" variant="secondary">
            Pop the panel out with the header button — the floating window
            pins to the browser viewport and only renders handles for the
            allowed axes. By default it can only shrink below its initial
            size; this demo passes a larger maxSize so it can grow.
          </Text>
        </Flex>
        <ChatPanel
          mode={mode}
          onModeChange={setMode}
          resize={resize}
          defaultSize={{ width: 340, height: 300 }}
          maxSize={{ width: 560, height: 480 }}
        >
          <ChatPanel.Header>
            <ChatPanel.Title>Assistant</ChatPanel.Title>
            <ChatPanel.Actions>
              <ChatPanel.ExpandTrigger />
            </ChatPanel.Actions>
          </ChatPanel.Header>
          <ChatPanel.Content>
            <Flex style={{ padding: 'var(--rs-space-5)' }}>
              <Text size="small" variant="secondary">
                {mode === 'floating'
                  ? resize === 'none'
                    ? 'Resizing is disabled.'
                    : 'Grab an edge or corner to resize me.'
                  : 'Pop me out to resize me.'}
              </Text>
            </Flex>
          </ChatPanel.Content>
        </ChatPanel>
      </Flex>
    </Flex>
  );
}`
};

export const draggableBubbleDemo = {
  type: 'code',
  code: `function DraggableBubbleChatPanel() {
  const [mode, setMode] = React.useState('docked');

  return (
    <Flex direction="column" gap={4} style={{ width: '100%' }}>
      <Text size="small" variant="secondary">
        The minimized bubble accepts draggable — a short click still
        restores the panel, and the dropped spot is kept the next time you
        minimize.
      </Text>
      <Flex style={{ width: '100%', height: 280, border: '0.5px solid var(--rs-color-border-base-primary)', borderRadius: 'var(--rs-radius-4)', overflow: 'hidden' }}>
        <Flex style={{ flex: 1, padding: 'var(--rs-space-5)' }}>
          <Text size="small" variant="secondary">
            Minimize the panel from its header, then drag the bubble that
            appears at the bottom-right of the browser window. Click it to
            restore the panel here.
          </Text>
        </Flex>
        <ChatPanel mode={mode} onModeChange={setMode} side="right">
          <ChatPanel.Header>
            <ChatPanel.Title>Assistant</ChatPanel.Title>
            <ChatPanel.Actions>
              <ChatPanel.MinimizeTrigger />
            </ChatPanel.Actions>
          </ChatPanel.Header>
          <ChatPanel.Content>
            <Flex style={{ padding: 'var(--rs-space-5)' }}>
              <Text size="small">Minimize me again from the header.</Text>
            </Flex>
          </ChatPanel.Content>
          <ChatPanel.Trigger draggable />
        </ChatPanel>
      </Flex>
    </Flex>
  );
}`
};

export const unreadBadgeDemo = {
  type: 'code',
  code: `function MinimizedWithBadge() {
  const [mode, setMode] = React.useState('minimized');

  // The transform makes the frame the containing block for the panel's
  // fixed positioning, so this demo's trigger pins to the frame corner
  // instead of stacking on the page's other panels.
  return (
    <Flex direction="column" gap={4} style={{ width: '100%' }}>
      <Text size="small" variant="secondary">
        The minimized trigger is a slot — compose Indicator or Badge for
        unread counts. Look at the bottom-right of this frame.
      </Text>
      <Flex style={{ width: '100%', height: 280, border: '0.5px solid var(--rs-color-border-base-primary)', borderRadius: 'var(--rs-radius-4)', overflow: 'hidden', transform: 'translateZ(0)' }}>
        <Flex style={{ flex: 1, padding: 'var(--rs-space-5)' }}>
          <Text size="small" variant="secondary">
            Click the bubble to restore the panel; minimize it again from the
            header.
          </Text>
        </Flex>
        <ChatPanel mode={mode} onModeChange={setMode} side="right">
          <ChatPanel.Header>
            <ChatPanel.Title>Assistant</ChatPanel.Title>
            <ChatPanel.Actions>
              <ChatPanel.MinimizeTrigger />
            </ChatPanel.Actions>
          </ChatPanel.Header>
          <ChatPanel.Content>
            <Flex style={{ padding: 'var(--rs-space-5)' }}>
              <Text size="small">Minimize me again from the header.</Text>
            </Flex>
          </ChatPanel.Content>
          <ChatPanel.Trigger aria-label="Open chat, 3 unread messages">
            <Indicator label="3">💬</Indicator>
          </ChatPanel.Trigger>
        </ChatPanel>
      </Flex>
    </Flex>
  );
}`
};
