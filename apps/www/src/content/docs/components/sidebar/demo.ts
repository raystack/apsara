'use client';

export const preview = {
  type: 'code',
  code: `
  <Sidebar open={true}>
    <Sidebar.Header>
      <Flex align="center" gap={3}>
        <IconButton size={4} aria-label="Logo">
          <Home />
        </IconButton>
        <Text size={4} weight="medium">Apsara</Text>
      </Flex>
    </Sidebar.Header>
    <Sidebar.Main>
      <Sidebar.Group label="Main" leadingIcon={<Info />}>
        <Sidebar.Item href="#" leadingIcon={<Info />} active>
          Dashboard
        </Sidebar.Item>
        <Sidebar.Item href="#" leadingIcon={<Info />} disabled>
          Settings
        </Sidebar.Item>
      </Sidebar.Group>
      <Sidebar.Group label="Support">
        <Sidebar.Item href="#" leadingIcon={<Info />}>
          Help
        </Sidebar.Item>
      </Sidebar.Group>
    </Sidebar.Main>
    <Sidebar.Footer>
      <Sidebar.Item href="#" leadingIcon={<Info />}>
        Help
      </Sidebar.Item>
    </Sidebar.Footer>
  </Sidebar>`
};

export const positionDemo = {
  type: 'code',
  tabs: [
    {
      name: 'Left',
      code: `
      <Sidebar open={true} position="left">
          <Sidebar.Header>
            <Flex align="center" gap={3}>
              <IconButton size={4} aria-label="Logo">
                <Home />
              </IconButton>
              <Text size={4} weight="medium">Company Name</Text>
            </Flex>
          </Sidebar.Header>
          <Sidebar.Main>
            <Sidebar.Item href="#" leadingIcon={<Info />} active>Dashboard</Sidebar.Item>
            <Sidebar.Item href="#" leadingIcon={<Info />} disabled>Settings</Sidebar.Item>
          </Sidebar.Main>
        </Sidebar>`
    },
    {
      name: 'Right',
      code: `
      <Sidebar open={true} position="right">
          <Sidebar.Header>
            <Flex align="center" gap={3}>
              <IconButton size={4} aria-label="Logo">
                <Home />
              </IconButton>
              <Text size={4} weight="medium">Company Name</Text>
            </Flex>
          </Sidebar.Header>
          <Sidebar.Main>
            <Sidebar.Item href="#" leadingIcon={<Info />} active>Dashboard</Sidebar.Item>
            <Sidebar.Item href="#" leadingIcon={<Info />} disabled>Settings</Sidebar.Item>
          </Sidebar.Main>
        </Sidebar>`
    }
  ]
};

export const stateDemo = {
  type: 'code',
  tabs: [
    {
      name: 'Expanded',
      code: `<Sidebar open={true}>
          <Sidebar.Header>
            <Flex align="center" gap={3}>
              <IconButton size={4} aria-label="Logo">
                <Home />
              </IconButton>
              <Text size={4} weight="medium">Company Name</Text>
            </Flex>
          </Sidebar.Header>
          <Sidebar.Main>
            <Sidebar.Item href="#" leadingIcon={<Info />} active>Dashboard</Sidebar.Item>
            <Sidebar.Item href="#" leadingIcon={<Info />} disabled>Settings</Sidebar.Item>
          </Sidebar.Main>
        </Sidebar>`
    },
    {
      name: 'Collapsed',
      code: `<Sidebar open={false}>
          <Sidebar.Header>
            <Flex align="center" gap={3}>
              <IconButton size={4} aria-label="Logo">
                <Home />
              </IconButton>
              <Text size={4} weight="medium">Company Name</Text>
            </Flex>
          </Sidebar.Header>
          <Sidebar.Main>
            <Sidebar.Item href="#" leadingIcon={<Info />} active>Dashboard</Sidebar.Item>
            <Sidebar.Item href="#" leadingIcon={<Info />} disabled>Settings</Sidebar.Item>
          </Sidebar.Main>
        </Sidebar>`
    }
  ]
};
