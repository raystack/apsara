'use client';

export const preview = {
  type: 'code',
  code: `<Flex direction="column" gap={5} style={{ width: 440 }}>
  <Message>
    <Message.Avatar>
      <Avatar size={3} radius="full" fallback="A" color="indigo" />
    </Message.Avatar>
    <Message.Header>Assistant</Message.Header>
    <Message.Content>
      <Message.Bubble variant="outline">Here's the summary you asked for.</Message.Bubble>
    </Message.Content>
    <Message.Footer>1:52 AM</Message.Footer>
  </Message>
  <Message align="end">
    <Message.Content>
      <Message.Bubble>Thanks — looks great!</Message.Bubble>
    </Message.Content>
  </Message>
</Flex>`
};

export const anatomyDemo = {
  type: 'code',
  code: `<Flex direction="column" gap={5} style={{ width: 440 }}>
  <Message>
    <Message.Avatar>
      <Avatar size={3} radius="full" fallback="A" color="indigo" />
    </Message.Avatar>
    <Message.Header>Assistant</Message.Header>
    <Message.Content>
      <Message.Bubble variant="outline">Hover me for actions.</Message.Bubble>
    </Message.Content>
    <Message.Footer>1:52 AM</Message.Footer>
    <Message.Actions>
      <IconButton size={1} aria-label="Copy message">⧉</IconButton>
    </Message.Actions>
  </Message>
  <Message align="end">
    <Message.Content>
      <Message.Bubble>Me too — actions on my side.</Message.Bubble>
    </Message.Content>
    <Message.Actions>
      <IconButton size={1} aria-label="Edit message">✎</IconButton>
    </Message.Actions>
  </Message>
</Flex>`
};

export const groupDemo = {
  type: 'code',
  code: `<Flex direction="column" gap={5} style={{ width: 440 }}>
  <Message.Group>
    <Message>
      <Message.Header>Ana</Message.Header>
      <Message.Content>
        <Message.Bubble variant="outline">Pushed the fix.</Message.Bubble>
      </Message.Content>
    </Message>
    <Message>
      <Message.Content>
        <Message.Bubble variant="outline">CI is green again.</Message.Bubble>
      </Message.Content>
    </Message>
    <Message>
      <Message.Avatar>
        <Avatar size={3} radius="full" fallback="A" color="indigo" />
      </Message.Avatar>
      <Message.Content>
        <Message.Bubble variant="outline">Deploying now.</Message.Bubble>
      </Message.Content>
      <Message.Footer>1:54 AM</Message.Footer>
    </Message>
  </Message.Group>
  <Message.Group>
    <Message align="end">
      <Message.Content>
        <Message.Bubble>Nice, thank you!</Message.Bubble>
      </Message.Content>
    </Message>
    <Message align="end">
      <Message.Content>
        <Message.Bubble>I'll verify on staging.</Message.Bubble>
      </Message.Content>
      <Message.Footer>1:55 AM</Message.Footer>
    </Message>
  </Message.Group>
</Flex>`
};

export const bubbleVariantsDemo = {
  type: 'code',
  tabs: [
    {
      name: 'Solid',
      code: `<Flex direction="column" gap={3} align="start">
  <Message.Bubble>The default: solid neutral.</Message.Bubble>
  <Message.Bubble color="accent">High-emphasis accent bubble.</Message.Bubble>
  <Message.Bubble color="danger">Something went wrong.</Message.Bubble>
</Flex>`
    },
    {
      name: 'Outline',
      code: `<Flex direction="column" gap={3} align="start">
  <Message.Bubble variant="outline">Bordered bubble on the base background.</Message.Bubble>
  <Message.Bubble variant="outline" color="accent">Accent outline bubble.</Message.Bubble>
  <Message.Bubble variant="outline" color="danger">Danger outline bubble.</Message.Bubble>
</Flex>`
    },
    {
      name: 'Ghost',
      code: `<Flex direction="column" gap={3} align="start">
  <Message.Bubble variant="ghost">No surface at all — plain body copy.</Message.Bubble>
  <Message.Bubble variant="ghost" color="accent">Accent ghost bubble.</Message.Bubble>
  <Message.Bubble variant="ghost" color="danger">Danger ghost bubble.</Message.Bubble>
</Flex>`
    }
  ]
};

export const ghostDemo = {
  type: 'code',
  code: `<Flex direction="column" gap={5} style={{ width: 440 }}>
  <Message align="end">
    <Message.Content>
      <Message.Bubble>Summarise the release notes for me.</Message.Bubble>
    </Message.Content>
  </Message>
  <Message>
    <Message.Avatar>
      <Avatar size={3} radius="full" fallback="A" color="indigo" />
    </Message.Avatar>
    <Message.Header>Assistant</Message.Header>
    <Message.Content>
      <Message.Bubble variant="ghost">
        Three things shipped: the timeline renderer, the AI element set, and a
        rewrite of the token docs. The ghost bubble spans the whole row, so
        long replies read as page content rather than as a chat bubble.
      </Message.Bubble>
    </Message.Content>
    <Message.Footer>1:52 AM</Message.Footer>
    <Message.Actions>
      <IconButton size={1} aria-label="Copy message">⧉</IconButton>
    </Message.Actions>
  </Message>
</Flex>`
};
