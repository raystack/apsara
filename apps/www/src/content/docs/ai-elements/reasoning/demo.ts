'use client';

export const preview = {
  type: 'code',
  code: `<div style={{ width: 420 }}>
  <Reasoning duration={10} defaultOpen>
    <Reasoning.Trigger />
    <Reasoning.Content>
      <Reasoning.Step label="Gathering project context">
        <Text size="small" variant="secondary">Looked at recent issues in Design System 2.</Text>
      </Reasoning.Step>
      <Reasoning.Step label="Creating the task" />
    </Reasoning.Content>
  </Reasoning>
</div>`
};

export const streamingDemo = {
  type: 'code',
  code: `function StreamingReasoning() {
  const [streaming, setStreaming] = React.useState(false);
  const timerRef = React.useRef(null);

  React.useEffect(() => () => clearTimeout(timerRef.current), []);

  return (
    <Flex direction="column" gap={4} style={{ width: 420 }}>
      <Button
        size="small"
        variant="outline"
        color="neutral"
        onClick={() => {
          setStreaming(true);
          timerRef.current = setTimeout(() => setStreaming(false), 3000);
        }}
      >
        Simulate thinking
      </Button>
      <Reasoning streaming={streaming} duration={3}>
        <Reasoning.Trigger />
        <Reasoning.Content>
          <Reasoning.Step label="Gathering ticket updates">
            <Text size="small" variant="secondary">
              I'm pulling the active issues assigned to you…
            </Text>
          </Reasoning.Step>
          <Reasoning.Step label="Summarising the changes" />
        </Reasoning.Content>
      </Reasoning>
    </Flex>
  );
}`
};

export const customTriggerDemo = {
  type: 'code',
  code: `<div style={{ width: 420 }}>
  <Reasoning duration={7}>
    <Reasoning.Trigger>Show the plan</Reasoning.Trigger>
    <Reasoning.Content>
      <Reasoning.Step label="Outline the migration" />
      <Reasoning.Step label="Estimate the blast radius" />
    </Reasoning.Content>
  </Reasoning>
</div>`
};
