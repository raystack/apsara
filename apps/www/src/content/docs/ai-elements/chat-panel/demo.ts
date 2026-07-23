'use client';

export const preview = {
  type: 'code',
  code: `function ChatPanelPreview() {
  const [mode, setMode] = React.useState('docked');

  return (
    <Flex style={{ width: '100%', height: 420, border: '0.5px solid var(--rs-color-border-base-primary)', borderRadius: 'var(--rs-radius-4)', overflow: 'hidden' }}>
      <Flex direction="column" gap={3} style={{ flex: 1, padding: 'var(--rs-space-5)' }}>
        <Text size="large" weight="medium">Main content</Text>
        <Text size="small" variant="secondary">
          The docked panel is a real flex sibling — it squeezes this content
          instead of covering it. Pop it out or minimize it from the header;
          floating and minimized modes are fixed to the browser viewport.
        </Text>
      </Flex>
      <ChatPanel mode={mode} onModeChange={setMode} side="right">
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
              <Chat.Item>
                <Message align="end">
                  <Message.Content>
                    <Message.Bubble>create a task in design system 2</Message.Bubble>
                  </Message.Content>
                </Message>
              </Chat.Item>
              <Chat.Item>
                <Message>
                  <Message.Content>
                    <Text size="small">Done — I created the task and assigned it to you.</Text>
                  </Message.Content>
                </Message>
              </Chat.Item>
              <Chat.JumpButton />
            </Chat.Messages>
            <div style={{ padding: 'var(--rs-space-3)' }}>
              <PromptInput onSubmit={(value, event) => event.currentTarget.reset()}>
                <PromptInput.Textarea placeholder="Reply…" />
                <PromptInput.Footer>
                  <PromptInput.Submit />
                </PromptInput.Footer>
              </PromptInput>
            </div>
          </Chat>
        </ChatPanel.Content>
        <ChatPanel.Trigger />
      </ChatPanel>
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
