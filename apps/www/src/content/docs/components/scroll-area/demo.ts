'use client';

export const preview = {
  type: 'code',
  code: `
<ScrollArea style={{ height: '200px', width: '100%' }}>
  <ScrollArea.Viewport>
    <Flex direction="column" gap={2}>
      {Array.from({ length: 20 }, (_, i) => (
        <Text key={i} size="small">
          Item {i + 1}
        </Text>
      ))}
    </Flex>
  </ScrollArea.Viewport>
  <ScrollArea.Scrollbar orientation="vertical" />
</ScrollArea>`
};

export const verticalDemo = {
  type: 'code',
  code: `
<ScrollArea style={{ height: '200px', width: '300px' }}>
  <ScrollArea.Viewport>
    <Flex direction="column" gap={2}>
      {Array.from({ length: 30 }, (_, i) => (
        <Text key={i} size="small">
          Item {i + 1}
        </Text>
      ))}
    </Flex>
  </ScrollArea.Viewport>
  <ScrollArea.Scrollbar orientation="vertical" />
</ScrollArea>`
};

export const horizontalDemo = {
  type: 'code',
  code: `
<ScrollArea style={{ height: '150px', width: '300px' }}>
  <ScrollArea.Viewport>
    <Flex direction="row" gap={4} style={{ width: '600px' }}>
      {Array.from({ length: 10 }, (_, i) => (
        <Flex key={i} direction="column" gap={2} style={{ minWidth: '150px' }}>
          <Text weight="medium" size="small">
            Column {i + 1}
          </Text>
          <Text size="small" variant="secondary">
            Content here
          </Text>
        </Flex>
      ))}
    </Flex>
  </ScrollArea.Viewport>
  <ScrollArea.Scrollbar orientation="horizontal" />
</ScrollArea>`
};

export const bothScrollbarsDemo = {
  type: 'code',
  code: `
<ScrollArea style={{ height: '200px', width: '300px' }}>
  <ScrollArea.Viewport>
    <Flex direction="row" gap={4} style={{ width: '800px' }}>
      {Array.from({ length: 15 }, (_, i) => (
        <Flex key={i} direction="column" gap={2} style={{ minWidth: '180px' }}>
          <Text weight="medium" size="small">
            Column {i + 1}
          </Text>
          {Array.from({ length: 20 }, (_, j) => (
            <Text key={j} size="small" variant="secondary">
              Row {j + 1}
            </Text>
          ))}
        </Flex>
      ))}
    </Flex>
  </ScrollArea.Viewport>
  <ScrollArea.Scrollbar orientation="vertical" />
  <ScrollArea.Scrollbar orientation="horizontal" />
</ScrollArea>`
};

export const typeDemo = {
  type: 'code',
  tabs: [
    {
      name: 'Auto (default)',
      code: `
<ScrollArea style={{ height: '200px', width: '300px' }} type="auto">
  <ScrollArea.Viewport>
    <Flex direction="column" gap={2}>
      {Array.from({ length: 20 }, (_, i) => (
        <Text key={i} size="small">
          Item {i + 1}
        </Text>
      ))}
    </Flex>
  </ScrollArea.Viewport>
  <ScrollArea.Scrollbar orientation="vertical" />
</ScrollArea>`
    },
    {
      name: 'Always',
      code: `
<ScrollArea style={{ height: '200px', width: '300px' }} type="always">
  <ScrollArea.Viewport>
    <Flex direction="column" gap={2}>
      {Array.from({ length: 20 }, (_, i) => (
        <Text key={i} size="small">
          Item {i + 1}
        </Text>
      ))}
    </Flex>
  </ScrollArea.Viewport>
  <ScrollArea.Scrollbar orientation="vertical" />
</ScrollArea>`
    },
    {
      name: 'Hover',
      code: `
<ScrollArea style={{ height: '200px', width: '300px' }} type="hover">
  <ScrollArea.Viewport>
    <Flex direction="column" gap={2}>
      {Array.from({ length: 20 }, (_, i) => (
        <Text key={i} size="small">
          Item {i + 1}
        </Text>
      ))}
    </Flex>
  </ScrollArea.Viewport>
  <ScrollArea.Scrollbar orientation="vertical" />
</ScrollArea>`
    },
    {
      name: 'Scroll',
      code: `
<ScrollArea style={{ height: '200px', width: '300px' }} type="scroll">
  <ScrollArea.Viewport>
    <Flex direction="column" gap={2}>
      {Array.from({ length: 20 }, (_, i) => (
        <Text key={i} size="small">
          Item {i + 1}
        </Text>
      ))}
    </Flex>
  </ScrollArea.Viewport>
  <ScrollArea.Scrollbar orientation="vertical" />
</ScrollArea>`
    }
  ]
};
