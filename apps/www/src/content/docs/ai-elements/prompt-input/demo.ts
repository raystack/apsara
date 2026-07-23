'use client';

export const preview = {
  type: 'code',
  code: `function PromptInputPreview() {
  const [status, setStatus] = React.useState('idle');
  const timerRef = React.useRef(null);

  React.useEffect(() => () => clearTimeout(timerRef.current), []);

  return (
    <div style={{ width: 420 }}>
      <PromptInput
        status={status}
        onSubmit={(value, event) => {
          event.currentTarget.reset();
          setStatus('streaming');
          timerRef.current = setTimeout(() => setStatus('idle'), 2500);
        }}
        onStop={() => {
          clearTimeout(timerRef.current);
          setStatus('idle');
        }}
      >
        <PromptInput.Textarea placeholder="Ask anything…" />
        <PromptInput.Footer>
          <PromptInput.Button>Skills</PromptInput.Button>
          <PromptInput.Button aria-label="Attach file">📎</PromptInput.Button>
          <PromptInput.Submit />
        </PromptInput.Footer>
      </PromptInput>
    </div>
  );
}`
};

export const attachmentsDemo = {
  type: 'code',
  code: `<div style={{ width: 420 }}>
  <PromptInput onSubmit={value => console.log(value)}>
    <PromptInput.Header>
      <Chat.Attachment title="design-spec.pdf" description="1.2 MB" onRemove={() => {}} />
      <Chat.Attachment title="screenshot.png" state="uploading" description="Uploading…" />
    </PromptInput.Header>
    <PromptInput.Textarea placeholder="Reply…" />
    <PromptInput.Footer>
      <PromptInput.Submit />
    </PromptInput.Footer>
  </PromptInput>
</div>`
};

export const controlledDemo = {
  type: 'code',
  code: `function ControlledPromptInput() {
  const [value, setValue] = React.useState('');

  return (
    <Flex direction="column" gap={4} style={{ width: 420 }}>
      <PromptInput
        value={value}
        onValueChange={setValue}
        onSubmit={() => setValue('')}
      >
        <PromptInput.Textarea placeholder="Write a message…" />
        <PromptInput.Footer>
          <PromptInput.Submit />
        </PromptInput.Footer>
      </PromptInput>
      <Text size="small" variant="secondary">{value.length} characters</Text>
    </Flex>
  );
}`
};

export const disabledDemo = {
  type: 'code',
  code: `<div style={{ width: 420 }}>
  <PromptInput disabled>
    <PromptInput.Textarea placeholder="Read-only conversation" />
    <PromptInput.Footer>
      <PromptInput.Button>Skills</PromptInput.Button>
      <PromptInput.Submit />
    </PromptInput.Footer>
  </PromptInput>
</div>`
};
