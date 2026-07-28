'use client';

export const preview = {
  type: 'code',
  code: `<Flex direction="column" style={{ width: 440, height: 420, border: '0.5px solid var(--rs-color-border-base-primary)', borderRadius: 'var(--rs-radius-4)' }}>
  <Chat>
    <Chat.Messages>
      <Chat.Separator>Today 1:52 AM</Chat.Separator>
      <Chat.Item messageId="m1">
        <Message align="end">
          <Message.Content>
            <Message.Bubble>create a task in design system 2</Message.Bubble>
          </Message.Content>
        </Message>
      </Chat.Item>
      <Chat.Item messageId="m2">
        <Message>
          <Message.Content>
            <Reasoning duration={10}>
              <Reasoning.Trigger />
              <Reasoning.Content>
                <Reasoning.Step label="Gathering project context">
                  <Text size="small" variant="secondary">Looked at recent issues in Design System 2.</Text>
                </Reasoning.Step>
                <Reasoning.Step label="Creating the task" />
              </Reasoning.Content>
            </Reasoning>
            <Message.Bubble variant="ghost">I created the task in Design System 2 and assigned it to you.</Message.Bubble>
          </Message.Content>
        </Message>
      </Chat.Item>
      <Chat.JumpButton />
    </Chat.Messages>
    <Chat.Composer>
      <PromptInput onSubmit={value => console.log(value)}>
        <PromptInput.Textarea placeholder="Reply…" />
        <PromptInput.Footer>
          <PromptInput.Submit />
        </PromptInput.Footer>
      </PromptInput>
    </Chat.Composer>
  </Chat>
</Flex>`
};

export const attachmentDemo = {
  type: 'code',
  code: `<Flex direction="column" gap={3} align="start">
  <Chat.Attachment title="design-spec.pdf" description="1.2 MB" onRemove={() => {}} />
  <Chat.Attachment title="screenshot.png" description="Uploading…" state="uploading" />
  <Chat.Attachment title="notes.txt" description="Upload failed" state="error" onRemove={() => {}} />
</Flex>`
};

export const streamingDemo = {
  type: 'code',
  code: `function StreamingChat() {
  const [messages, setMessages] = React.useState([
    { id: 'm1', align: 'end', text: 'What changed this week?' },
    { id: 'm2', align: 'start', text: 'Three issues moved to done.' }
  ]);
  const timersRef = React.useRef([]);

  React.useEffect(() => () => timersRef.current.forEach(clearTimeout), []);

  const send = value => {
    const id = 'u' + Date.now();
    setMessages(current => [
      ...current,
      { id, align: 'end', text: value, anchor: true },
      { id: id + '-reply', align: 'start', text: '' }
    ]);
    // Simulate a token stream into the reply.
    const words = 'Sure — streaming replies keep the anchored question in view while text arrives below it, and the ↓ Latest pill appears once the live edge scrolls out of view.'.split(' ');
    words.forEach((word, index) => {
      timersRef.current.push(
        setTimeout(() => {
          setMessages(current =>
            current.map(message =>
              message.id === id + '-reply'
                ? { ...message, text: message.text + ' ' + word }
                : message
            )
          );
        }, 120 * (index + 1))
      );
    });
  };

  return (
    <Flex direction="column" style={{ width: 440, height: 360, border: '0.5px solid var(--rs-color-border-base-primary)', borderRadius: 'var(--rs-radius-4)' }}>
      <Chat>
        <Chat.Messages>
          {messages.map(message => (
            <Chat.Item
              key={message.id}
              messageId={message.id}
              scrollAnchor={message.anchor}
            >
              <Message align={message.align}>
                <Message.Content>
                  {message.align === 'end' ? (
                    <Message.Bubble>{message.text}</Message.Bubble>
                  ) : (
                    <Message.Bubble variant="ghost">{message.text}</Message.Bubble>
                  )}
                </Message.Content>
              </Message>
            </Chat.Item>
          ))}
          <Chat.JumpButton />
        </Chat.Messages>
        <Chat.Composer>
          <PromptInput
            onSubmit={(value, event) => {
              event.currentTarget.reset();
              send(value);
            }}
          >
            <PromptInput.Textarea placeholder="Ask something…" />
            <PromptInput.Footer>
              <PromptInput.Submit />
            </PromptInput.Footer>
          </PromptInput>
        </Chat.Composer>
      </Chat>
    </Flex>
  );
}`
};
