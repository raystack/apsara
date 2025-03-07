"use client";

export const preview = {
  type: "code",
  code: `
  <Sidebar open={true}>
    <Sidebar.Header logo={<Home />} title="Apasara" />
    <Sidebar.Main>
      <Sidebar.Group name="Main">
        <Sidebar.Item href="#" icon={<Info />} active>
          Dashboard
        </Sidebar.Item>
        <Sidebar.Item href="#" icon={<Info />} disabled>
          Settings
        </Sidebar.Item>
      </Sidebar.Group>
      <Sidebar.Group name="Support">
        <Sidebar.Item href="#" icon={<Info />}>
          Help
        </Sidebar.Item>
      </Sidebar.Group>
    </Sidebar.Main>
    <Sidebar.Footer>
      <Sidebar.Item href="#" icon={<Info />}>
        Help
      </Sidebar.Item>
    </Sidebar.Footer>
  </Sidebar>`,
};

export const positionDemo = {
  type: "code",
  tabs: [
    {
      name: "Left",
      code: `
      <Sidebar open={true} position="left">
          <Sidebar.Header logo={<Home />} title="Company Name" />
          <Sidebar.Main>
            <Sidebar.Item href="#" icon={<Info />} active>Dashboard</Sidebar.Item>
            <Sidebar.Item href="#" icon={<Info />} disabled>Settings</Sidebar.Item>
          </Sidebar.Main>
        </Sidebar>`,
    },
    {
      name: "Right",
      code: `
      <Sidebar open={true} position="right">
          <Sidebar.Header logo={<Home />} title="Company Name" />
          <Sidebar.Main>
            <Sidebar.Item href="#" icon={<Info />} active>Dashboard</Sidebar.Item>
            <Sidebar.Item href="#" icon={<Info />} disabled>Settings</Sidebar.Item>
          </Sidebar.Main>
        </Sidebar>`,
    },
  ],
};

export const stateDemo = {
  type: "code",
  tabs: [
    {
      name: "Expanded",
      code: `<Sidebar open={true}>
          <Sidebar.Header logo={<Home />} title="Company Name" />
          <Sidebar.Main>
            <Sidebar.Item href="#" icon={<Info />} active>Dashboard</Sidebar.Item>
            <Sidebar.Item href="#" icon={<Info />} disabled>Settings</Sidebar.Item>
          </Sidebar.Main>
        </Sidebar>`,
    },
    {
      name: "Collapsed",
      code: `<Sidebar open={false}>
          <Sidebar.Header logo={<Home />} title="Company Name" />
          <Sidebar.Main>
            <Sidebar.Item href="#" icon={<Info />} active>Dashboard</Sidebar.Item>
            <Sidebar.Item href="#" icon={<Info />} disabled>Settings</Sidebar.Item>
          </Sidebar.Main>
        </Sidebar>`,
    },
  ],
};
