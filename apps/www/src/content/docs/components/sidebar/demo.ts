'use client';

export const preview = {
  type: 'code',
  code: `
  <Sidebar open={true}>
    <Sidebar.Header>
      <Sidebar.HeaderIcon>
        <Home />
      </Sidebar.HeaderIcon>
      <Sidebar.Title>Apasara</Sidebar.Title>
    </Sidebar.Header>
    <Sidebar.Main>
      <Sidebar.Group name="Main">
        <Sidebar.Item href="#" leadingIcon={<Info />} active>
          Dashboard
        </Sidebar.Item>
        <Sidebar.Item href="#" leadingIcon={<Info />} disabled>
          Settings
        </Sidebar.Item>
      </Sidebar.Group>
      <Sidebar.Group name="Support">
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
            <Sidebar.HeaderIcon>
              <Home />
            </Sidebar.HeaderIcon>
            <Sidebar.Title>Company Name</Sidebar.Title>
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
            <Sidebar.HeaderIcon>
              <Home />
            </Sidebar.HeaderIcon>
            <Sidebar.Title>Company Name</Sidebar.Title>
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
            <Sidebar.HeaderIcon>
              <Home />
            </Sidebar.HeaderIcon>
            <Sidebar.Title>Company Name</Sidebar.Title>
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
            <Sidebar.HeaderIcon>
              <Home />
            </Sidebar.HeaderIcon>
            <Sidebar.Title>Company Name</Sidebar.Title>
          </Sidebar.Header>
          <Sidebar.Main>
            <Sidebar.Item href="#" leadingIcon={<Info />} active>Dashboard</Sidebar.Item>
            <Sidebar.Item href="#" leadingIcon={<Info />} disabled>Settings</Sidebar.Item>
          </Sidebar.Main>
        </Sidebar>`
    }
  ]
};
