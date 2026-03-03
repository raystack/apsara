'use client';

const mainAreaStyle = `{{ flex: 1, border: '2px dashed var(--rs-color-border-base-secondary)', margin: 'var(--rs-space-4)', boxSizing: 'border-box' }}`;

const sidebarLayout = (sidebar: string) =>
  `<Flex style={{ width: '100%', height: '100%', minHeight: 480 }}>
  ${sidebar.trim()}
  <Flex style=${mainAreaStyle} />
</Flex>`;

const sidebarLayoutRight = (sidebar: string) =>
  `<Flex style={{ width: '100%', height: '100%', minHeight: 480 }}>
  <Flex style=${mainAreaStyle} />
  ${sidebar.trim()}
</Flex>`;

export const preview = {
  type: 'code',
  previewClassName: 'previewSidebar',
  code: sidebarLayout(`
  <Sidebar defaultOpen>
    <Sidebar.Header>
      <Flex align="center" gap={3}>
        <IconButton size={4} aria-label="Logo">
          <BellIcon width={24} height={24} />
        </IconButton>
        <Text size={4} weight="medium" data-collapse-hidden>Apsara</Text>
      </Flex>
    </Sidebar.Header>
    <Sidebar.Main>
      <Sidebar.Group label="Main">
        <Sidebar.Item href="#" leadingIcon={<BellIcon width={16} height={16} />} active>
          Dashboard
        </Sidebar.Item>
        <Sidebar.Item href="#" leadingIcon={<FilterIcon width={16} height={16} />}>
          Analytics
        </Sidebar.Item>
        <Sidebar.Item href="#" leadingIcon={<OrganizationIcon width={16} height={16} />}>
          Settings
        </Sidebar.Item>
      </Sidebar.Group>
      <Sidebar.Group label="Resources">
        <Sidebar.Item href="#" leadingIcon={<FilterIcon width={16} height={16} />}>
          Reports
        </Sidebar.Item>
        <Sidebar.Item href="#" leadingIcon={<OrganizationIcon width={16} height={16} />}>
          Activities
        </Sidebar.Item>
      </Sidebar.Group>
      <Sidebar.Group label="Support">
        <Sidebar.Item href="#" leadingIcon={<OrganizationIcon width={16} height={16} />}>
          Help
        </Sidebar.Item>
      </Sidebar.Group>
    </Sidebar.Main>
    <Sidebar.Footer>
      <Sidebar.Item href="#" leadingIcon={<OrganizationIcon width={16} height={16} />}>
        Help & Support
      </Sidebar.Item>
    </Sidebar.Footer>
  </Sidebar>`)
};

export const positionDemo = {
  type: 'code',
  previewClassName: 'previewSidebar',
  tabs: [
    {
      name: 'Left',
      code: sidebarLayout(`
      <Sidebar open={true} position="left">
          <Sidebar.Header>
            <Flex align="center" gap={3}>
              <IconButton size={4} aria-label="Logo">
                <BellIcon width={24} height={24} />
              </IconButton>
              <Text size={4} weight="medium" data-collapse-hidden>Apsara</Text>
            </Flex>
          </Sidebar.Header>
          <Sidebar.Main>
            <Sidebar.Group label="Main">
              <Sidebar.Item href="#" leadingIcon={<BellIcon width={16} height={16} />} active>Dashboard</Sidebar.Item>
              <Sidebar.Item href="#" leadingIcon={<FilterIcon width={16} height={16} />}>Analytics</Sidebar.Item>
              <Sidebar.Item href="#" leadingIcon={<OrganizationIcon width={16} height={16} />}>Settings</Sidebar.Item>
            </Sidebar.Group>
            <Sidebar.Group label="Support">
              <Sidebar.Item href="#" leadingIcon={<OrganizationIcon width={16} height={16} />}>Help</Sidebar.Item>
            </Sidebar.Group>
          </Sidebar.Main>
        </Sidebar>`)
    },
    {
      name: 'Right',
      code: sidebarLayoutRight(`
      <Sidebar open={true} position="right">
          <Sidebar.Header>
            <Flex align="center" gap={3}>
              <IconButton size={4} aria-label="Logo">
                <BellIcon width={24} height={24} />
              </IconButton>
              <Text size={4} weight="medium" data-collapse-hidden>Apsara</Text>
            </Flex>
          </Sidebar.Header>
          <Sidebar.Main>
            <Sidebar.Group label="Main">
              <Sidebar.Item href="#" leadingIcon={<BellIcon width={16} height={16} />} active>Dashboard</Sidebar.Item>
              <Sidebar.Item href="#" leadingIcon={<FilterIcon width={16} height={16} />}>Analytics</Sidebar.Item>
              <Sidebar.Item href="#" leadingIcon={<OrganizationIcon width={16} height={16} />}>Settings</Sidebar.Item>
            </Sidebar.Group>
            <Sidebar.Group label="Support">
              <Sidebar.Item href="#" leadingIcon={<OrganizationIcon width={16} height={16} />}>Help</Sidebar.Item>
            </Sidebar.Group>
          </Sidebar.Main>
        </Sidebar>`)
    }
  ]
};

export const stateDemo = {
  type: 'code',
  previewClassName: 'previewSidebar',
  tabs: [
    {
      name: 'Expanded',
      code: sidebarLayout(`<Sidebar open={true}>
          <Sidebar.Header>
            <Flex align="center" gap={3}>
              <IconButton size={4} aria-label="Logo">
                <BellIcon width={24} height={24} />
              </IconButton>
              <Text size={4} weight="medium" data-collapse-hidden>Apsara</Text>
            </Flex>
          </Sidebar.Header>
          <Sidebar.Main>
            <Sidebar.Group label="Main">
              <Sidebar.Item href="#" leadingIcon={<BellIcon width={16} height={16} />} active>Dashboard</Sidebar.Item>
              <Sidebar.Item href="#" leadingIcon={<FilterIcon width={16} height={16} />}>Analytics</Sidebar.Item>
              <Sidebar.Item href="#" leadingIcon={<OrganizationIcon width={16} height={16} />}>Settings</Sidebar.Item>
            </Sidebar.Group>
            <Sidebar.Group label="Support">
              <Sidebar.Item href="#" leadingIcon={<OrganizationIcon width={16} height={16} />}>Help</Sidebar.Item>
            </Sidebar.Group>
          </Sidebar.Main>
        </Sidebar>`)
    },
    {
      name: 'Collapsed',
      code: sidebarLayout(`<Sidebar open={false}>
          <Sidebar.Header>
            <Flex align="center" gap={3}>
              <IconButton size={4} aria-label="Logo">
                <BellIcon width={24} height={24} />
              </IconButton>
              <Text size={4} weight="medium" data-collapse-hidden>Apsara</Text>
            </Flex>
          </Sidebar.Header>
          <Sidebar.Main>
            <Sidebar.Group label="Main">
              <Sidebar.Item href="#" leadingIcon={<BellIcon width={16} height={16} />} active>Dashboard</Sidebar.Item>
              <Sidebar.Item href="#" leadingIcon={<FilterIcon width={16} height={16} />}>Analytics</Sidebar.Item>
              <Sidebar.Item href="#" leadingIcon={<OrganizationIcon width={16} height={16} />}>Settings</Sidebar.Item>
            </Sidebar.Group>
            <Sidebar.Group label="Support">
              <Sidebar.Item href="#" leadingIcon={<OrganizationIcon width={16} height={16} />}>Help</Sidebar.Item>
            </Sidebar.Group>
          </Sidebar.Main>
        </Sidebar>`)
    },
    {
      name: 'Uncontrolled',
      code: sidebarLayout(`<Sidebar>
          <Sidebar.Header>
            <Flex align="center" gap={3}>
              <IconButton size={4} aria-label="Logo">
                <BellIcon width={24} height={24} />
              </IconButton>
              <Text size={4} weight="medium" data-collapse-hidden>Apsara</Text>
            </Flex>
          </Sidebar.Header>
          <Sidebar.Main>
            <Sidebar.Group label="Main">
              <Sidebar.Item href="#" leadingIcon={<BellIcon width={16} height={16} />} active>Dashboard</Sidebar.Item>
              <Sidebar.Item href="#" leadingIcon={<FilterIcon width={16} height={16} />}>Analytics</Sidebar.Item>
              <Sidebar.Item href="#" leadingIcon={<OrganizationIcon width={16} height={16} />}>Settings</Sidebar.Item>
            </Sidebar.Group>
            <Sidebar.Group label="Support">
              <Sidebar.Item href="#" leadingIcon={<OrganizationIcon width={16} height={16} />}>Help</Sidebar.Item>
            </Sidebar.Group>
          </Sidebar.Main>
        </Sidebar>`)
    },
    {
      name: 'Uncontrolled (default open)',
      code: sidebarLayout(`<Sidebar defaultOpen>
          <Sidebar.Header>
            <Flex align="center" gap={3}>
              <IconButton size={4} aria-label="Logo">
                <BellIcon width={24} height={24} />
              </IconButton>
              <Text size={4} weight="medium" data-collapse-hidden>Apsara</Text>
            </Flex>
          </Sidebar.Header>
          <Sidebar.Main>
            <Sidebar.Group label="Main">
              <Sidebar.Item href="#" leadingIcon={<BellIcon width={16} height={16} />} active>Dashboard</Sidebar.Item>
              <Sidebar.Item href="#" leadingIcon={<FilterIcon width={16} height={16} />}>Analytics</Sidebar.Item>
              <Sidebar.Item href="#" leadingIcon={<OrganizationIcon width={16} height={16} />}>Settings</Sidebar.Item>
            </Sidebar.Group>
            <Sidebar.Group label="Support">
              <Sidebar.Item href="#" leadingIcon={<OrganizationIcon width={16} height={16} />}>Help</Sidebar.Item>
            </Sidebar.Group>
          </Sidebar.Main>
        </Sidebar>`)
    }
  ]
};

export const tooltipDemo = {
  type: 'code',
  previewClassName: 'previewSidebar',
  code: sidebarLayout(`<Sidebar
          defaultOpen
          tooltipMessage="Toggle navigation"
        >
          <Sidebar.Header>
            <Flex align="center" gap={3}>
              <IconButton size={4} aria-label="Logo">
                <BellIcon width={24} height={24} />
              </IconButton>
              <Text size={4} weight="medium" data-collapse-hidden>Apsara</Text>
            </Flex>
          </Sidebar.Header>
          <Sidebar.Main>
            <Sidebar.Group label="Main">
              <Sidebar.Item href="#" leadingIcon={<BellIcon width={16} height={16} />} active>Dashboard</Sidebar.Item>
              <Sidebar.Item href="#" leadingIcon={<FilterIcon width={16} height={16} />}>Analytics</Sidebar.Item>
              <Sidebar.Item href="#" leadingIcon={<OrganizationIcon width={16} height={16} />}>Settings</Sidebar.Item>
            </Sidebar.Group>
            <Sidebar.Group label="Support">
              <Sidebar.Item href="#" leadingIcon={<OrganizationIcon width={16} height={16} />}>Help</Sidebar.Item>
            </Sidebar.Group>
          </Sidebar.Main>
        </Sidebar>`)
};
