"use client";

export const preview = {
  type: "code",
  code: `
<Flex style={{ gap: '24px', flexWrap: 'wrap' }}>
    <SidePanel side="right">
      <SidePanel.Header title="Right Side Panel" icon={<Avatar fallback="A" />} description="This is a description." actions={[<Button>Action</Button>]} />
      <SidePanel.Section>
          <List.Root>
            <List.Header>User Information</List.Header>
            <List.Item align="center">
              <List.Label minWidth="88px">Status</List.Label>
              <List.Value>Active</List.Value>
            </List.Item>
            <List.Item align="center">
              <List.Label minWidth="88px">Type</List.Label>
              <List.Value>Premium Account</List.Value>
            </List.Item>
            <List.Item align="center">
              <List.Label minWidth="88px">Created</List.Label>
              <List.Value>April 24, 2024</List.Value>
            </List.Item>
          </List.Root>
      </SidePanel.Section>
      <SidePanel.Section>
          <List.Root>
            <List.Header>User Information</List.Header>
            <List.Item align="center">
              <List.Label minWidth="88px">Status</List.Label>
              <List.Value>Active</List.Value>
            </List.Item>
            <List.Item align="center">
              <List.Label minWidth="88px">Type</List.Label>
              <List.Value>Premium Account</List.Value>
            </List.Item>
            <List.Item align="center">
              <List.Label minWidth="88px">Created</List.Label>
              <List.Value>April 24, 2024</List.Value>
            </List.Item>
          </List.Root>
      </SidePanel.Section>
    </SidePanel>
  </Flex>`,
};
