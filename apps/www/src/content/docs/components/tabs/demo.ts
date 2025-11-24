'use client';

export const preview = {
  type: 'code',
  code: `
  <Flex direction="row" gap="large" style={{ width: "100%", fontSize: "12px" }}>
    <Tabs.Root defaultValue="tab-one">
      <Tabs.List>
        <Tabs.Trigger value="tab-one" icon={<Info />}>Hoisting</Tabs.Trigger>
        <Tabs.Trigger value="tab-two">Hosting</Tabs.Trigger>
        <Tabs.Trigger value="tab-three" icon={<Info />}>Editor</Tabs.Trigger>
        <Tabs.Trigger value="tab-four">Billing</Tabs.Trigger>
        <Tabs.Trigger value="tab-five">SEO</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="tab-one">
        <Text>General settings content</Text>
      </Tabs.Content>
      <Tabs.Content value="tab-two">
        <Text>Hosting configuration content</Text>
      </Tabs.Content>
      <Tabs.Content value="tab-three">
        <Text>Editor preferences content</Text>
      </Tabs.Content>
      <Tabs.Content value="tab-four">
        <Text>Billing information content</Text>
      </Tabs.Content>
      <Tabs.Content value="tab-five">
        <Text>SEO settings content</Text>
      </Tabs.Content>
    </Tabs.Root>
  </Flex>`
};

export const basicDemo = {
  type: 'code',
  code: `
  <div style={{ width: "400px" }}>
  <Tabs.Root defaultValue="tab1">
  <Tabs.List>
    <Tabs.Trigger value="tab1">Account</Tabs.Trigger>
    <Tabs.Trigger value="tab2">Password</Tabs.Trigger>
    <Tabs.Trigger value="tab3">Settings</Tabs.Trigger>
  </Tabs.List>
  <Tabs.Content value="tab1">Account settings</Tabs.Content>
  <Tabs.Content value="tab2">Password settings</Tabs.Content>
  <Tabs.Content value="tab3">Other settings</Tabs.Content>
</Tabs.Root>
</div>`
};

export const iconsDemo = {
  type: 'code',
  code: `
  <div style={{ width: "400px" }}>
  <Tabs.Root defaultValue="tab1">
    <Tabs.List>
      <Tabs.Trigger value="tab1">Home</Tabs.Trigger>
      <Tabs.Trigger value="tab2" icon={<Info />} />
    </Tabs.List>
    <Tabs.Content value="tab1">Home</Tabs.Content>
    <Tabs.Content value="tab2">Info</Tabs.Content>
  </Tabs.Root>
  </div>`
};

export const disabledDemo = {
  type: 'code',
  code: `
  <div style={{ width: "400px" }}>
  <Tabs.Root defaultValue="tab1">
  <Tabs.List>
    <Tabs.Trigger value="tab1">Active</Tabs.Trigger>
    <Tabs.Trigger value="tab2" disabled>Disabled</Tabs.Trigger>
  </Tabs.List>
  <Tabs.Content value="tab1">Active tab content</Tabs.Content>
  <Tabs.Content value="tab2">Disabled tab content</Tabs.Content>
</Tabs.Root>
</div>`
};
