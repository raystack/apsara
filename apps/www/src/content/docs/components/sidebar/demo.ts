'use client';

const mainAreaStyle = `{{ flex: 1, border: '2px dashed var(--rs-color-border-base-secondary)', margin: 'var(--rs-space-4)', boxSizing: 'border-box' }}`;

const styleDemo = {
  padding: 0
};

const sidebarLayout = (sidebar: string) =>
  `<Flex style={{ width: '100%', height: 480 }}>
  ${sidebar.trim()}
  <Flex style=${mainAreaStyle} />
</Flex>`;

const sidebarLayoutRight = (sidebar: string) =>
  `<Flex style={{ width: '100%', height: 480 }}>
  <Flex style=${mainAreaStyle} />
  ${sidebar.trim()}
</Flex>`;

export const preview = {
  type: 'code',
  code: sidebarLayout(`
  <Sidebar defaultOpen>
    <Sidebar.Header>
      <Flex align="center" gap={3} style={{padding:"var(--rs-space-2)"}}>
        <IconButton size={4} aria-label="Logo">
          <Bell size={24} strokeWidth={1.5} />
        </IconButton>
        <Text size="regular" weight="medium" data-collapse-hidden>Apsara</Text>
      </Flex>
    </Sidebar.Header>
    <Sidebar.Main>
      <Sidebar.Item href="#" leadingIcon={<Building2 size={16} strokeWidth={1.5} />}>
        Overview
      </Sidebar.Item>
      <Sidebar.Item href="#" leadingIcon={<Building2 size={16} strokeWidth={1.5} />}>
        Preview
      </Sidebar.Item>
      <Sidebar.Group label="Main">
        <Sidebar.Item href="#" leadingIcon={<Bell size={16} strokeWidth={1.5} />} active>
          Dashboard
        </Sidebar.Item>
        <Sidebar.Item href="#" leadingIcon={<FilterIcon width={16} height={16} />}>
          Analytics
        </Sidebar.Item>
        <Sidebar.Item href="#" leadingIcon={<Building2 size={16} strokeWidth={1.5} />}>
          Settings
        </Sidebar.Item>
      </Sidebar.Group>
      <Sidebar.Group label="Resources">
        <Sidebar.Item href="#" leadingIcon={<FilterIcon width={16} height={16} />}>
          Reports
        </Sidebar.Item>
        <Sidebar.Item href="#" leadingIcon={<Building2 size={16} strokeWidth={1.5} />}>
          Activities
        </Sidebar.Item>
      </Sidebar.Group>
    </Sidebar.Main>
    <Sidebar.Footer>
      <Sidebar.Item href="#" leadingIcon={<Building2 size={16} strokeWidth={1.5} />}>
        Help & Support
      </Sidebar.Item>
    </Sidebar.Footer>
  </Sidebar>`),
  style: styleDemo
};

export const positionDemo = {
  type: 'code',
  tabs: [
    {
      name: 'Left',
      code: sidebarLayout(`
      <Sidebar open={true} position="left">
          <Sidebar.Header>
            <Flex align="center" gap={3} style={{padding:"var(--rs-space-2)"}}>
              <IconButton size={4} aria-label="Logo">
                <Bell size={24} strokeWidth={1.5} />
              </IconButton>
              <Text size="regular" weight="medium" data-collapse-hidden>Apsara</Text>
            </Flex>
          </Sidebar.Header>
          <Sidebar.Main>
            <Sidebar.Item href="#" leadingIcon={<Building2 size={16} strokeWidth={1.5} />}>Overview</Sidebar.Item>
            <Sidebar.Group label="Main">
              <Sidebar.Item href="#" leadingIcon={<Bell size={16} strokeWidth={1.5} />} active>Dashboard</Sidebar.Item>
              <Sidebar.Item href="#" leadingIcon={<FilterIcon width={16} height={16} />}>Analytics</Sidebar.Item>
              <Sidebar.Item href="#" leadingIcon={<Building2 size={16} strokeWidth={1.5} />}>Settings</Sidebar.Item>
            </Sidebar.Group>
            <Sidebar.Group label="Support">
              <Sidebar.Item href="#" leadingIcon={<Building2 size={16} strokeWidth={1.5} />}>Help</Sidebar.Item>
            </Sidebar.Group>
          </Sidebar.Main>
        </Sidebar>`)
    },
    {
      name: 'Right',
      code: sidebarLayoutRight(`
      <Sidebar open={true} position="right">
          <Sidebar.Header>
            <Flex align="center" gap={3} style={{padding:"var(--rs-space-2)"}}>
              <IconButton size={4} aria-label="Logo">
                <Bell size={24} strokeWidth={1.5} />
              </IconButton>
              <Text size="regular" weight="medium" data-collapse-hidden>Apsara</Text>
            </Flex>
          </Sidebar.Header>
          <Sidebar.Main>
            <Sidebar.Item href="#" leadingIcon={<Building2 size={16} strokeWidth={1.5} />}>Overview</Sidebar.Item>
            <Sidebar.Group label="Main">
              <Sidebar.Item href="#" leadingIcon={<Bell size={16} strokeWidth={1.5} />} active>Dashboard</Sidebar.Item>
              <Sidebar.Item href="#" leadingIcon={<FilterIcon width={16} height={16} />}>Analytics</Sidebar.Item>
              <Sidebar.Item href="#" leadingIcon={<Building2 size={16} strokeWidth={1.5} />}>Settings</Sidebar.Item>
            </Sidebar.Group>
            <Sidebar.Group label="Support">
              <Sidebar.Item href="#" leadingIcon={<Building2 size={16} strokeWidth={1.5} />}>Help</Sidebar.Item>
            </Sidebar.Group>
          </Sidebar.Main>
        </Sidebar>`)
    }
  ],
  style: styleDemo
};

export const variantDemo = {
  type: 'code',
  tabs: [
    {
      name: 'Plain',
      code: sidebarLayout(`
      <Sidebar open={true} variant="plain">
          <Sidebar.Header>
            <Flex align="center" gap={3} style={{padding:"var(--rs-space-2)"}}>
              <IconButton size={4} aria-label="Logo">
                <Bell size={24} strokeWidth={1.5} />
              </IconButton>
              <Text size="regular" weight="medium" data-collapse-hidden>Apsara</Text>
            </Flex>
          </Sidebar.Header>
          <Sidebar.Main>
            <Sidebar.Item href="#" leadingIcon={<Building2 size={16} strokeWidth={1.5} />}>Overview</Sidebar.Item>
            <Sidebar.Group label="Main">
              <Sidebar.Item href="#" leadingIcon={<Bell size={16} strokeWidth={1.5} />} active>Dashboard</Sidebar.Item>
              <Sidebar.Item href="#" leadingIcon={<FilterIcon width={16} height={16} />}>Analytics</Sidebar.Item>
            </Sidebar.Group>
          </Sidebar.Main>
        </Sidebar>`)
    },
    {
      name: 'Floating',
      code: sidebarLayout(`
      <Sidebar open={true} variant="floating">
          <Sidebar.Header>
            <Flex align="center" gap={3} style={{padding:"var(--rs-space-2)"}}>
              <IconButton size={4} aria-label="Logo">
                <Bell size={24} strokeWidth={1.5} />
              </IconButton>
              <Text size="regular" weight="medium" data-collapse-hidden>Apsara</Text>
            </Flex>
          </Sidebar.Header>
          <Sidebar.Main>
            <Sidebar.Item href="#" leadingIcon={<Building2 size={16} strokeWidth={1.5} />}>Overview</Sidebar.Item>
            <Sidebar.Group label="Main">
              <Sidebar.Item href="#" leadingIcon={<Bell size={16} strokeWidth={1.5} />} active>Dashboard</Sidebar.Item>
              <Sidebar.Item href="#" leadingIcon={<FilterIcon width={16} height={16} />}>Analytics</Sidebar.Item>
            </Sidebar.Group>
          </Sidebar.Main>
        </Sidebar>`)
    },
    {
      name: 'Inset',
      code: sidebarLayout(`
      <Sidebar open={true} variant="inset">
          <Sidebar.Header>
            <Flex align="center" gap={3} style={{padding:"var(--rs-space-2)"}}>
              <IconButton size={4} aria-label="Logo">
                <Bell size={24} strokeWidth={1.5} />
              </IconButton>
              <Text size="regular" weight="medium" data-collapse-hidden>Apsara</Text>
            </Flex>
          </Sidebar.Header>
          <Sidebar.Main>
            <Sidebar.Item href="#" leadingIcon={<Building2 size={16} strokeWidth={1.5} />}>Overview</Sidebar.Item>
            <Sidebar.Group label="Main">
              <Sidebar.Item href="#" leadingIcon={<Bell size={16} strokeWidth={1.5} />} active>Dashboard</Sidebar.Item>
              <Sidebar.Item href="#" leadingIcon={<FilterIcon width={16} height={16} />}>Analytics</Sidebar.Item>
            </Sidebar.Group>
          </Sidebar.Main>
        </Sidebar>`)
    }
  ],
  style: styleDemo
};

export const stateDemo = {
  type: 'code',
  tabs: [
    {
      name: 'Expanded',
      code: sidebarLayout(`<Sidebar open={true}>
          <Sidebar.Header>
            <Flex align="center" gap={3} style={{padding:"var(--rs-space-2)"}}>
              <IconButton size={4} aria-label="Logo">
                <Bell size={24} strokeWidth={1.5} />
              </IconButton>
              <Text size="regular" weight="medium" data-collapse-hidden>Apsara</Text>
            </Flex>
          </Sidebar.Header>
          <Sidebar.Main>
            <Sidebar.Item href="#" leadingIcon={<Building2 size={16} strokeWidth={1.5} />}>Overview</Sidebar.Item>
            <Sidebar.Group label="Main">
              <Sidebar.Item href="#" leadingIcon={<Bell size={16} strokeWidth={1.5} />} active>Dashboard</Sidebar.Item>
              <Sidebar.Item href="#" leadingIcon={<FilterIcon width={16} height={16} />}>Analytics</Sidebar.Item>
              <Sidebar.Item href="#" leadingIcon={<Building2 size={16} strokeWidth={1.5} />}>Settings</Sidebar.Item>
            </Sidebar.Group>
            <Sidebar.Group label="Support">
              <Sidebar.Item href="#" leadingIcon={<Building2 size={16} strokeWidth={1.5} />}>Help</Sidebar.Item>
            </Sidebar.Group>
          </Sidebar.Main>
        </Sidebar>`)
    },
    {
      name: 'Collapsed',
      code: sidebarLayout(`<Sidebar open={false}>
          <Sidebar.Header>
            <Flex align="center" gap={3} style={{padding:"var(--rs-space-2)"}}>
              <IconButton size={4} aria-label="Logo">
                <Bell size={24} strokeWidth={1.5} />
              </IconButton>
              <Text size="regular" weight="medium" data-collapse-hidden>Apsara</Text>
            </Flex>
          </Sidebar.Header>
          <Sidebar.Main>
            <Sidebar.Item href="#" leadingIcon={<Building2 size={16} strokeWidth={1.5} />}>Overview</Sidebar.Item>
            <Sidebar.Group label="Main">
              <Sidebar.Item href="#" leadingIcon={<Bell size={16} strokeWidth={1.5} />} active>Dashboard</Sidebar.Item>
              <Sidebar.Item href="#" leadingIcon={<FilterIcon width={16} height={16} />}>Analytics</Sidebar.Item>
              <Sidebar.Item href="#" leadingIcon={<Building2 size={16} strokeWidth={1.5} />}>Settings</Sidebar.Item>
            </Sidebar.Group>
            <Sidebar.Group label="Support">
              <Sidebar.Item href="#" leadingIcon={<Building2 size={16} strokeWidth={1.5} />}>Help</Sidebar.Item>
            </Sidebar.Group>
          </Sidebar.Main>
        </Sidebar>`)
    },
    {
      name: 'Uncontrolled',
      code: sidebarLayout(`<Sidebar>
          <Sidebar.Header>
            <Flex align="center" gap={3} style={{padding:"var(--rs-space-2)"}}>
              <IconButton size={4} aria-label="Logo">
                <Bell size={24} strokeWidth={1.5} />
              </IconButton>
              <Text size="regular" weight="medium" data-collapse-hidden>Apsara</Text>
            </Flex>
          </Sidebar.Header>
          <Sidebar.Main>
            <Sidebar.Item href="#" leadingIcon={<Building2 size={16} strokeWidth={1.5} />}>Overview</Sidebar.Item>
            <Sidebar.Group label="Main">
              <Sidebar.Item href="#" leadingIcon={<Bell size={16} strokeWidth={1.5} />} active>Dashboard</Sidebar.Item>
              <Sidebar.Item href="#" leadingIcon={<FilterIcon width={16} height={16} />}>Analytics</Sidebar.Item>
              <Sidebar.Item href="#" leadingIcon={<Building2 size={16} strokeWidth={1.5} />}>Settings</Sidebar.Item>
            </Sidebar.Group>
            <Sidebar.Group label="Support">
              <Sidebar.Item href="#" leadingIcon={<Building2 size={16} strokeWidth={1.5} />}>Help</Sidebar.Item>
            </Sidebar.Group>
          </Sidebar.Main>
        </Sidebar>`)
    },
    {
      name: 'Uncontrolled (default open)',
      code: sidebarLayout(`<Sidebar defaultOpen>
          <Sidebar.Header>
            <Flex align="center" gap={3} style={{padding:"var(--rs-space-2)"}}>
              <IconButton size={4} aria-label="Logo">
                <Bell size={24} strokeWidth={1.5} />
              </IconButton>
              <Text size="regular" weight="medium" data-collapse-hidden>Apsara</Text>
            </Flex>
          </Sidebar.Header>
          <Sidebar.Main>
            <Sidebar.Item href="#" leadingIcon={<Building2 size={16} strokeWidth={1.5} />}>Overview</Sidebar.Item>
            <Sidebar.Group label="Main">
              <Sidebar.Item href="#" leadingIcon={<Bell size={16} strokeWidth={1.5} />} active>Dashboard</Sidebar.Item>
              <Sidebar.Item href="#" leadingIcon={<FilterIcon width={16} height={16} />}>Analytics</Sidebar.Item>
              <Sidebar.Item href="#" leadingIcon={<Building2 size={16} strokeWidth={1.5} />}>Settings</Sidebar.Item>
            </Sidebar.Group>
            <Sidebar.Group label="Support">
              <Sidebar.Item href="#" leadingIcon={<Building2 size={16} strokeWidth={1.5} />}>Help</Sidebar.Item>
            </Sidebar.Group>
          </Sidebar.Main>
        </Sidebar>`)
    }
  ],
  style: styleDemo
};

export const collapsedAppearanceDemo = {
  type: 'code',
  tabs: [
    {
      name: 'Icon (default)',
      code: sidebarLayout(`<Sidebar defaultOpen={false} collapsible="icon">
          <Sidebar.Header>
            <Flex align="center" gap={3} style={{padding:"var(--rs-space-2)"}}>
              <IconButton size={4} aria-label="Logo">
                <Bell size={24} strokeWidth={1.5} />
              </IconButton>
              <Text size="regular" weight="medium" data-collapse-hidden>Apsara</Text>
            </Flex>
          </Sidebar.Header>
          <Sidebar.Main>
            <Sidebar.Item href="#" leadingIcon={<Building2 size={16} strokeWidth={1.5} />}>Overview</Sidebar.Item>
            <Sidebar.Group label="Main">
              <Sidebar.Item href="#" leadingIcon={<Bell size={16} strokeWidth={1.5} />} active>Dashboard</Sidebar.Item>
              <Sidebar.Item href="#" leadingIcon={<FilterIcon width={16} height={16} />}>Analytics</Sidebar.Item>
            </Sidebar.Group>
          </Sidebar.Main>
        </Sidebar>`)
    },
    {
      name: 'Hidden',
      code: sidebarLayout(`<Sidebar defaultOpen={false} collapsible="hidden">
          <Sidebar.Trigger
            style={{ position: "absolute", top: "var(--rs-space-4)", insetInlineStart: "var(--rs-space-2)" }}
          />
          <Sidebar.Header>
            <Flex align="center" gap={3} style={{padding:"var(--rs-space-2)"}}>
              <IconButton size={4} aria-label="Logo">
                <Bell size={24} strokeWidth={1.5} />
              </IconButton>
              <Text size="regular" weight="medium" data-collapse-hidden>Apsara</Text>
            </Flex>
          </Sidebar.Header>
          <Sidebar.Main>
            <Sidebar.Item href="#" leadingIcon={<Building2 size={16} strokeWidth={1.5} />}>Overview</Sidebar.Item>
            <Sidebar.Group label="Main">
              <Sidebar.Item href="#" leadingIcon={<Bell size={16} strokeWidth={1.5} />} active>Dashboard</Sidebar.Item>
              <Sidebar.Item href="#" leadingIcon={<FilterIcon width={16} height={16} />}>Analytics</Sidebar.Item>
            </Sidebar.Group>
          </Sidebar.Main>
        </Sidebar>`)
    }
  ],
  style: styleDemo
};

export const peekOnHoverDemo = {
  type: 'code',
  tabs: [
    {
      name: 'Icon (default)',
      code: sidebarLayout(`<Sidebar defaultOpen={false} collapsible="icon" peekOnHover>
          <Sidebar.Header>
            <Flex align="center" gap={3} style={{padding:"var(--rs-space-2)"}}>
              <IconButton size={4} aria-label="Logo">
                <Bell size={24} strokeWidth={1.5} />
              </IconButton>
              <Text size="regular" weight="medium" data-collapse-hidden>Apsara</Text>
            </Flex>
          </Sidebar.Header>
          <Sidebar.Main>
            <Sidebar.Item href="#" leadingIcon={<Building2 size={16} strokeWidth={1.5} />}>Overview</Sidebar.Item>
            <Sidebar.Group label="Main">
              <Sidebar.Item href="#" leadingIcon={<Bell size={16} strokeWidth={1.5} />} active>Dashboard</Sidebar.Item>
              <Sidebar.Item href="#" leadingIcon={<FilterIcon width={16} height={16} />}>Analytics</Sidebar.Item>
              <Sidebar.Item href="#" leadingIcon={<Building2 size={16} strokeWidth={1.5} />}>Settings</Sidebar.Item>
            </Sidebar.Group>
          </Sidebar.Main>
        </Sidebar>`)
    },
    {
      name: 'Hidden',
      code: sidebarLayout(`<Sidebar defaultOpen={false} collapsible="hidden" peekOnHover>
          <Sidebar.Trigger
            style={{ position: "absolute", top: "var(--rs-space-4)", insetInlineStart: "var(--rs-space-2)" }}
          />
          <Sidebar.Header>
            <Flex align="center" gap={3} style={{padding:"var(--rs-space-2)"}}>
              <IconButton size={4} aria-label="Logo">
                <Bell size={24} strokeWidth={1.5} />
              </IconButton>
              <Text size="regular" weight="medium" data-collapse-hidden>Apsara</Text>
            </Flex>
          </Sidebar.Header>
          <Sidebar.Main>
            <Sidebar.Item href="#" leadingIcon={<Building2 size={16} strokeWidth={1.5} />}>Overview</Sidebar.Item>
            <Sidebar.Group label="Main">
              <Sidebar.Item href="#" leadingIcon={<Bell size={16} strokeWidth={1.5} />} active>Dashboard</Sidebar.Item>
              <Sidebar.Item href="#" leadingIcon={<FilterIcon width={16} height={16} />}>Analytics</Sidebar.Item>
              <Sidebar.Item href="#" leadingIcon={<Building2 size={16} strokeWidth={1.5} />}>Settings</Sidebar.Item>
            </Sidebar.Group>
          </Sidebar.Main>
        </Sidebar>`)
    }
  ],
  style: styleDemo
};

export const tooltipDemo = {
  type: 'code',
  code: sidebarLayout(`<Sidebar
          defaultOpen
          collapseTooltip="Toggle navigation"
        >
          <Sidebar.Header>
            <Flex align="center" gap={3} style={{padding:"var(--rs-space-2)"}}>
              <IconButton size={4} aria-label="Logo">
                <Bell size={24} strokeWidth={1.5} />
              </IconButton>
              <Text size="regular" weight="medium" data-collapse-hidden>Apsara</Text>
            </Flex>
          </Sidebar.Header>
          <Sidebar.Main>
            <Sidebar.Item href="#" leadingIcon={<Building2 size={16} strokeWidth={1.5} />}>Overview</Sidebar.Item>
            <Sidebar.Group label="Main">
              <Sidebar.Item href="#" leadingIcon={<Bell size={16} strokeWidth={1.5} />} active>Dashboard</Sidebar.Item>
              <Sidebar.Item href="#" leadingIcon={<FilterIcon width={16} height={16} />}>Analytics</Sidebar.Item>
              <Sidebar.Item href="#" leadingIcon={<Building2 size={16} strokeWidth={1.5} />}>Settings</Sidebar.Item>
            </Sidebar.Group>
            <Sidebar.Group label="Support">
              <Sidebar.Item href="#" leadingIcon={<Building2 size={16} strokeWidth={1.5} />}>Help</Sidebar.Item>
            </Sidebar.Group>
          </Sidebar.Main>
        </Sidebar>`),
  style: styleDemo
};

export const collapsibleDemo = {
  type: 'code',
  code: sidebarLayout(`<Sidebar defaultOpen collapsible="none">
          <Sidebar.Header>
            <Flex align="center" gap={3} style={{padding:"var(--rs-space-2)"}}>
              <IconButton size={4} aria-label="Logo">
                <Bell size={24} strokeWidth={1.5} />
              </IconButton>
              <Text size="regular" weight="medium" data-collapse-hidden>Apsara</Text>
            </Flex>
          </Sidebar.Header>
          <Sidebar.Main>
            <Sidebar.Item href="#" leadingIcon={<Building2 size={16} strokeWidth={1.5} />}>Overview</Sidebar.Item>
            <Sidebar.Group label="Main">
              <Sidebar.Item href="#" leadingIcon={<Bell size={16} strokeWidth={1.5} />} active>Dashboard</Sidebar.Item>
              <Sidebar.Item href="#" leadingIcon={<FilterIcon width={16} height={16} />}>Analytics</Sidebar.Item>
            </Sidebar.Group>
          </Sidebar.Main>
        </Sidebar>`),
  style: styleDemo
};

export const hideTooltipDemo = {
  type: 'code',
  code: sidebarLayout(`<Sidebar defaultOpen={false} hideItemTooltips>
          <Sidebar.Header>
            <Flex align="center" gap={3} style={{padding:"var(--rs-space-2)"}}>
              <IconButton size={4} aria-label="Logo">
                <Bell size={24} strokeWidth={1.5} />
              </IconButton>
              <Text size="regular" weight="medium" data-collapse-hidden>Apsara</Text>
            </Flex>
          </Sidebar.Header>
          <Sidebar.Main>
            <Sidebar.Item href="#" leadingIcon={<Bell size={16} strokeWidth={1.5} />}>Overview</Sidebar.Item>
            <Sidebar.Group label="Main">
              <Sidebar.Item href="#" leadingIcon={<Bell size={16} strokeWidth={1.5} />} active>Dashboard</Sidebar.Item>
              <Sidebar.Item href="#" leadingIcon={<FilterIcon width={16} height={16} />}>Settings</Sidebar.Item>
            </Sidebar.Group>
            <Sidebar.Item href="#" leadingIcon={<Building2 size={16} strokeWidth={1.5} />}>
              Help
            </Sidebar.Item>
          </Sidebar.Main>
        </Sidebar>`),
  style: styleDemo
};

export const collapsibleGroupDemo = {
  type: 'code',
  code: sidebarLayout(`<Sidebar defaultOpen>
          <Sidebar.Header>
            <Flex align="center" gap={3} style={{padding:"var(--rs-space-2)"}}>
              <IconButton size={4} aria-label="Logo">
                <Bell size={24} strokeWidth={1.5} />
              </IconButton>
              <Text size="regular" weight="medium" data-collapse-hidden>Apsara</Text>
            </Flex>
          </Sidebar.Header>
          <Sidebar.Main>
            <Sidebar.Item href="#" leadingIcon={<Building2 size={16} strokeWidth={1.5} />}>
              Overview
            </Sidebar.Item>
            <Sidebar.Group label="Resources" collapsible>
              <Sidebar.Item href="#" leadingIcon={<FilterIcon width={16} height={16} />}>
                Reports
              </Sidebar.Item>
              <Sidebar.Item href="#" leadingIcon={<Building2 size={16} strokeWidth={1.5} />}>
                Activities
              </Sidebar.Item>
            </Sidebar.Group>
            <Sidebar.Group label="Account" trailingIcon={<Building2 size={16} strokeWidth={1.5} />}>
              <Sidebar.Item href="#" leadingIcon={<Building2 size={16} strokeWidth={1.5} />}>
                Settings
              </Sidebar.Item>
            </Sidebar.Group>
          </Sidebar.Main>
        </Sidebar>`),
  style: styleDemo
};

export const controlledGroupDemo = {
  type: 'code',
  style: styleDemo,
  code: `
        function ControlledSidebarGroup() {
          const [resourcesOpen, setResourcesOpen] = React.useState(true);

          return (
            ${sidebarLayout(`<Sidebar defaultOpen>
              <Sidebar.Header>
                <Flex align="center" gap={3} style={{padding:"var(--rs-space-2)"}}>
                  <IconButton size={4} aria-label="Logo">
                    <Bell size={24} strokeWidth={1.5} />
                  </IconButton>
                  <Text size="regular" weight="medium" data-collapse-hidden>Apsara</Text>
                </Flex>
              </Sidebar.Header>
              <Sidebar.Main>
                <Sidebar.Item href="#" leadingIcon={<Building2 size={16} strokeWidth={1.5} />}>
                  Overview
                </Sidebar.Item>
                <Sidebar.Group
                  label="Resources"
                  collapsible
                  open={resourcesOpen}
                  onOpenChange={setResourcesOpen}
                >
                  <Sidebar.Item href="#" leadingIcon={<FilterIcon width={16} height={16} />}>
                    Reports
                  </Sidebar.Item>
                  <Sidebar.Item href="#" leadingIcon={<Building2 size={16} strokeWidth={1.5} />}>
                    Activities
                  </Sidebar.Item>
                </Sidebar.Group>
              </Sidebar.Main>
              <Sidebar.Footer>
                <Sidebar.Item
                  render={
                    <button
                      type="button"
                      onClick={() => setResourcesOpen(open => !open)}
                    />
                  }
                  leadingIcon={<Bell size={16} strokeWidth={1.5} />}
                >
                  {resourcesOpen ? 'Collapse Resources' : 'Expand Resources'}
                </Sidebar.Item>
              </Sidebar.Footer>
            </Sidebar>`)}
          );
        }`
};

export const groupIconDemo = {
  type: 'code',
  code: sidebarLayout(`<Sidebar defaultOpen>
          <Sidebar.Header>
            <Flex align="center" gap={3} style={{padding:"var(--rs-space-2)"}}>
              <IconButton size={4} aria-label="Logo">
                <Bell size={24} strokeWidth={1.5} />
              </IconButton>
              <Text size="regular" weight="medium" data-collapse-hidden>Apsara</Text>
            </Flex>
          </Sidebar.Header>
          <Sidebar.Main>
            <Sidebar.Group label="Workspace" leadingIcon={<Building2 size={16} strokeWidth={1.5} />}>
              <Sidebar.Item href="#" leadingIcon={<Bell size={16} strokeWidth={1.5} />} active>
                Dashboard
              </Sidebar.Item>
              <Sidebar.Item href="#" leadingIcon={<FilterIcon width={16} height={16} />}>
                Analytics
              </Sidebar.Item>
            </Sidebar.Group>
            <Sidebar.Group label="Resources" leadingIcon={<FilterIcon width={16} height={16} />}>
              <Sidebar.Item href="#" leadingIcon={<Building2 size={16} strokeWidth={1.5} />}>
                Reports
              </Sidebar.Item>
              <Sidebar.Item href="#" leadingIcon={<Bell size={16} strokeWidth={1.5} />}>
                Activities
              </Sidebar.Item>
            </Sidebar.Group>
          </Sidebar.Main>
        </Sidebar>`),
  style: styleDemo
};

export const triggerDemo = {
  type: 'code',
  code: sidebarLayout(`<Sidebar defaultOpen>
          <Sidebar.Header>
            <Flex align="center" justify="between" style={{padding:"var(--rs-space-2)", width: '100%'}}>
              <Flex align="center" gap={3}>
                <IconButton size={4} aria-label="Logo">
                  <Bell size={24} strokeWidth={1.5} />
                </IconButton>
                <Text size="regular" weight="medium" data-collapse-hidden>Apsara</Text>
              </Flex>
              <Sidebar.Trigger />
            </Flex>
          </Sidebar.Header>
          <Sidebar.Main>
            <Sidebar.Item href="#" leadingIcon={<Building2 size={16} strokeWidth={1.5} />}>Overview</Sidebar.Item>
            <Sidebar.Group label="Main">
              <Sidebar.Item href="#" leadingIcon={<Bell size={16} strokeWidth={1.5} />} active>Dashboard</Sidebar.Item>
              <Sidebar.Item href="#" leadingIcon={<FilterIcon width={16} height={16} />}>Analytics</Sidebar.Item>
            </Sidebar.Group>
          </Sidebar.Main>
        </Sidebar>`),
  style: styleDemo
};

export const moreDemo = {
  type: 'code',
  code: sidebarLayout(`<Sidebar defaultOpen>
          <Sidebar.Header>
            <Flex align="center" gap={3} style={{padding:"var(--rs-space-2)"}}>
              <IconButton size={4} aria-label="Logo">
                <Bell size={24} strokeWidth={1.5} />
              </IconButton>
              <Text size="regular" weight="medium" data-collapse-hidden>Apsara</Text>
            </Flex>
          </Sidebar.Header>
          <Sidebar.Main>
            <Sidebar.Item href="#" leadingIcon={<Bell size={16} strokeWidth={1.5} />} active>
              Dashboard
            </Sidebar.Item>
            <Sidebar.Item href="#" leadingIcon={<FilterIcon width={16} height={16} />}>
              Analytics
            </Sidebar.Item>
            <Sidebar.Group label="Resources">
              <Sidebar.Item href="#" leadingIcon={<Building2 size={16} strokeWidth={1.5} />}>
                Reports
              </Sidebar.Item>
              <Sidebar.More label="More">
                <Sidebar.Item href="#" leadingIcon={<Bell size={16} strokeWidth={1.5} />}>
                  Activities
                </Sidebar.Item>
                <Sidebar.Item href="#" leadingIcon={<Building2 size={16} strokeWidth={1.5} />} disabled>
                  Notifications
                </Sidebar.Item>
              </Sidebar.More>
            </Sidebar.Group>
          </Sidebar.Main>
          <Sidebar.Footer>
            <Sidebar.More label="More">
              <Sidebar.Item href="#" leadingIcon={<Building2 size={16} strokeWidth={1.5} />}>
                Preferences
              </Sidebar.Item>
              <Sidebar.Item href="#" leadingIcon={<FilterIcon width={16} height={16} />}>
                Documentation
              </Sidebar.Item>
            </Sidebar.More>
          </Sidebar.Footer>
        </Sidebar>`),
  style: styleDemo
};
