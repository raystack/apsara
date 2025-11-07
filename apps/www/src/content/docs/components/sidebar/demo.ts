'use client';

export const preview = {
  type: 'code',
  code: `
  <Sidebar defaultOpen>
    <Sidebar.Header>
      <Flex align="center" gap={3}>
        <IconButton size={4} aria-label="Logo">
          <Home />
        </IconButton>
        <Text size={4} weight="medium" data-collapse-hidden>Apsara</Text>
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
                <Home width={24} height={24}/>
              </IconButton>
              <Text size={4} weight="medium" data-collapse-hidden>Apsara</Text>
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
                <Home width={24} height={24}/>
              </IconButton>
              <Text size={4} weight="medium" data-collapse-hidden>Apsara</Text>
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
                <Home width={24} height={24}/>
              </IconButton>
              <Text size={4} weight="medium" data-collapse-hidden>Apsara</Text>
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
                <Home width={24} height={24}/>
              </IconButton>
              <Text size={4} weight="medium" data-collapse-hidden>Apsara</Text>
            </Flex>
          </Sidebar.Header>
          <Sidebar.Main>
            <Sidebar.Item href="#" leadingIcon={<Info />} active>Dashboard</Sidebar.Item>
            <Sidebar.Item href="#" leadingIcon={<Info />} disabled>Settings</Sidebar.Item>
          </Sidebar.Main>
        </Sidebar>`
    },
    {
      name: 'Uncontrolled',
      code: `<Sidebar>
          <Sidebar.Header>
            <Flex align="center" gap={3}>
              <IconButton size={4} aria-label="Logo">
                <Home width={24} height={24}/>
              </IconButton>
              <Text size={4} weight="medium" data-collapse-hidden>Apsara</Text>
            </Flex>
          </Sidebar.Header>
          <Sidebar.Main>
            <Sidebar.Item href="#" leadingIcon={<Info />} active>Dashboard</Sidebar.Item>
            <Sidebar.Item href="#" leadingIcon={<Info />} disabled>Settings</Sidebar.Item>
          </Sidebar.Main>
        </Sidebar>`
    },
    {
      name: 'Uncontrolled (default open)',
      code: `<Sidebar defaultOpen>
          <Sidebar.Header>
            <Flex align="center" gap={3}>
              <IconButton size={4} aria-label="Logo">
                <Home width={24} height={24}/>
              </IconButton>
              <Text size={4} weight="medium" data-collapse-hidden>Apsara</Text>
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
