'use client';

export const preview = {
  type: 'code',
  code: `
  <Flex align="center" justify="center">
    <List>
      <List.Header>User Information</List.Header>
      <List.Item align="center">
        <List.Label style={{ minWidth: "88px" }}>Status</List.Label>
        <List.Value>Active</List.Value>
      </List.Item>
      <List.Item align="center">
        <List.Label style={{ minWidth: "88px" }}>Type</List.Label>
        <List.Value>Premium Account</List.Value>
      </List.Item>
      <List.Item align="center">
        <List.Label style={{ minWidth: "88px" }}>Created</List.Label>
        <List.Value>April 24, 2024</List.Value>
      </List.Item>
    </List>
  </Flex>`
};

export const basicDemo = {
  type: 'code',
  code: `
  <List>
  <List.Header>User Information</List.Header>
  <List.Item align="center">
    <List.Label style={{ minWidth: "88px" }}>Status</List.Label>
    <List.Value>Active</List.Value>
  </List.Item>
</List>;
  `
};

export const alignDemo = {
  type: 'code',
  code: `
<List>
  <List.Header>Deployment</List.Header>
  <List.Item align="center">
    <List.Label style={{ minWidth: "96px" }}>Status</List.Label>
    <List.Value>Succeeded</List.Value>
  </List.Item>
  <List.Item align="start">
    <List.Label style={{ minWidth: "96px" }}>Notes</List.Label>
    <List.Value>
      Rolled out to three regions. Two nodes were drained and replaced during the rollout.
    </List.Value>
  </List.Item>
</List>`
};
