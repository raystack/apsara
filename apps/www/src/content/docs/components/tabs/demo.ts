'use client';

export const preview = {
  type: 'code',
  code: `
  <Flex direction="row" gap="large" style={{ width: "100%", fontSize: "12px", padding: "0 16px" }}>
    <Tabs defaultValue="tab-one">
      <Tabs.List>
        <Tabs.Tab value="tab-two">Hosting</Tabs.Tab>
        <Tabs.Tab value="tab-four">Billing</Tabs.Tab>
        <Tabs.Tab value="tab-five">SEO</Tabs.Tab>
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
    </Tabs>
  </Flex>`
};

export const basicDemo = {
  type: 'code',
  code: `
  <div style={{ width: "400px" }}>
  <Tabs defaultValue="tab1">
  <Tabs.List>
    <Tabs.Tab value="tab1">Account</Tabs.Tab>
    <Tabs.Tab value="tab2">Password</Tabs.Tab>
    <Tabs.Tab value="tab3">Settings</Tabs.Tab>
  </Tabs.List>
  <Tabs.Content value="tab1">Account settings</Tabs.Content>
  <Tabs.Content value="tab2">Password settings</Tabs.Content>
  <Tabs.Content value="tab3">Other settings</Tabs.Content>
</Tabs>
</div>`
};

export const iconsDemo = {
  type: 'code',
  code: `
  <div style={{ width: "400px" }}>
  <Tabs defaultValue="tab1">
    <Tabs.List>
      <Tabs.Tab value="tab1">Home</Tabs.Tab>
      <Tabs.Tab value="tab2" leadingIcon={<Info />}>Info</Tabs.Tab>
    </Tabs.List>
    <Tabs.Content value="tab1">Home content</Tabs.Content>
    <Tabs.Content value="tab2">Info content</Tabs.Content>
  </Tabs>
  </div>`
};

export const disabledDemo = {
  type: 'code',
  code: `
  <div style={{ width: "400px" }}>
  <Tabs defaultValue="tab1">
  <Tabs.List>
    <Tabs.Tab value="tab1">Active</Tabs.Tab>
    <Tabs.Tab value="tab2" disabled>Disabled</Tabs.Tab>
  </Tabs.List>
  <Tabs.Content value="tab1">Active tab content</Tabs.Content>
  <Tabs.Content value="tab2">Disabled tab content</Tabs.Content>
</Tabs>
</div>`
};

export const standaloneVariantDemo = {
  type: 'code',
  code: `
  <div style={{ width: "400px" }}>
  <Tabs defaultValue="tab1" variant="standalone">
  <Tabs.List>
    <Tabs.Tab value="tab1">Account</Tabs.Tab>
    <Tabs.Tab value="tab2" disabled>Password</Tabs.Tab>
    <Tabs.Tab value="tab3">Settings</Tabs.Tab>
  </Tabs.List>
  <Tabs.Content value="tab1">Account settings</Tabs.Content>
  <Tabs.Content value="tab2">Password settings</Tabs.Content>
  <Tabs.Content value="tab3">Other settings</Tabs.Content>
</Tabs>
</div>`
};

export const plainVariantDemo = {
  type: 'code',
  code: `
  <div style={{ width: "400px" }}>
  <Tabs defaultValue="tab1" variant="plain">
  <Tabs.List>
    <Tabs.Tab value="tab1">Account</Tabs.Tab>
    <Tabs.Tab value="tab2" disabled>Password</Tabs.Tab>
    <Tabs.Tab value="tab3">Settings</Tabs.Tab>
  </Tabs.List>
  <Tabs.Content value="tab1">Account settings</Tabs.Content>
  <Tabs.Content value="tab2">Password settings</Tabs.Content>
  <Tabs.Content value="tab3">Other settings</Tabs.Content>
</Tabs>
</div>`
};

export const variantsDemo = {
  type: 'code',
  tabs: [
    {
      name: 'Segmented (default)',
      code: `
      <div style={{ width: "400px" }}>
      <Tabs defaultValue="tab1">
      <Tabs.List>
        <Tabs.Tab value="tab1">Account</Tabs.Tab>
        <Tabs.Tab value="tab2" disabled>Password</Tabs.Tab>
        <Tabs.Tab value="tab3">Settings</Tabs.Tab>
      </Tabs.List>
      <Tabs.Content value="tab1">Account settings</Tabs.Content>
      <Tabs.Content value="tab2">Password settings</Tabs.Content>
      <Tabs.Content value="tab3">Other settings</Tabs.Content>
    </Tabs>
    </div>`
    },
    {
      name: 'Standalone',
      code: `
      <div style={{ width: "400px" }}>
      <Tabs defaultValue="tab1" variant="standalone">
      <Tabs.List>
        <Tabs.Tab value="tab1">Account</Tabs.Tab>
        <Tabs.Tab value="tab2" disabled>Password</Tabs.Tab>
        <Tabs.Tab value="tab3">Settings</Tabs.Tab>
      </Tabs.List>
      <Tabs.Content value="tab1">Account settings</Tabs.Content>
      <Tabs.Content value="tab2">Password settings</Tabs.Content>
      <Tabs.Content value="tab3">Other settings</Tabs.Content>
    </Tabs>
    </div>`
    },
    {
      name: 'Plain',
      code: `
      <div style={{ width: "400px" }}>
      <Tabs defaultValue="tab1" variant="plain">
      <Tabs.List>
        <Tabs.Tab value="tab1">Account</Tabs.Tab>
        <Tabs.Tab value="tab2" disabled>Password</Tabs.Tab>
        <Tabs.Tab value="tab3">Settings</Tabs.Tab>
      </Tabs.List>
      <Tabs.Content value="tab1">Account settings</Tabs.Content>
      <Tabs.Content value="tab2">Password settings</Tabs.Content>
      <Tabs.Content value="tab3">Other settings</Tabs.Content>
    </Tabs>
    </div>`
    }
  ]
};

export const sizesDemo = {
  type: 'code',
  tabs: [
    {
      name: 'Small',
      code: `
      <div style={{ width: "400px" }}>
      <Tabs defaultValue="tab1" size="small">
        <Tabs.List>
          <Tabs.Tab value="tab1">Account</Tabs.Tab>
          <Tabs.Tab value="tab2" disabled>Password</Tabs.Tab>
          <Tabs.Tab value="tab3">Settings</Tabs.Tab>
        </Tabs.List>
        <Tabs.Content value="tab1">Account settings</Tabs.Content>
        <Tabs.Content value="tab2">Password settings</Tabs.Content>
        <Tabs.Content value="tab3">Other settings</Tabs.Content>
      </Tabs>
    </div>`
    },
    {
      name: 'Medium',
      code: `
      <div style={{ width: "400px" }}>
      <Tabs defaultValue="tab1" size="medium">
        <Tabs.List>
          <Tabs.Tab value="tab1">Account</Tabs.Tab>
          <Tabs.Tab value="tab2" disabled>Password</Tabs.Tab>
          <Tabs.Tab value="tab3">Settings</Tabs.Tab>
        </Tabs.List>
        <Tabs.Content value="tab1">Account settings</Tabs.Content>
        <Tabs.Content value="tab2">Password settings</Tabs.Content>
        <Tabs.Content value="tab3">Other settings</Tabs.Content>
      </Tabs>
    </div>`
    },
    {
      name: 'Large',
      code: `
      <div style={{ width: "400px" }}>
      <Tabs defaultValue="tab1" size="large">
        <Tabs.List>
          <Tabs.Tab value="tab1">Account</Tabs.Tab>
          <Tabs.Tab value="tab2" disabled>Password</Tabs.Tab>
          <Tabs.Tab value="tab3">Settings</Tabs.Tab>
        </Tabs.List>
        <Tabs.Content value="tab1">Account settings</Tabs.Content>
        <Tabs.Content value="tab2">Password settings</Tabs.Content>
        <Tabs.Content value="tab3">Other settings</Tabs.Content>
      </Tabs>
    </div>`
    }
  ]
};
