'use client';

export const preview = {
  type: 'code',
  code: `
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '100%' }}>
    <Navbar>
      <Navbar.Start>
        <Text size="regular" weight="medium">Explore</Text>
      </Navbar.Start>
      <Navbar.End>
        <Search placeholder="Search an AOI" size="small" style={{ width: '200px' }} />
        <Button variant="outline" size="small" color="neutral" leadingIcon={<PlusIcon />}>
          Draw AOI
        </Button>
        <Button variant="outline" size="small" color="neutral" leadingIcon={<UploadIcon />}>
          Upload AOI
        </Button>
      </Navbar.End>
    </Navbar>
    <div style={{ margin: 'var(--rs-space-8)', width: 'calc(100% - 2 * var(--rs-space-8))', minHeight: 200, border: '2px dashed var(--rs-color-border-base-secondary)', boxSizing: 'border-box' }} />
  </div>`
};

export const stickyDemo = {
  type: 'code',
  tabs: [
    {
      name: 'Default',
      code: `
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '100%' }}>
        <Navbar>
          <Navbar.Start>
            <Text size="regular" weight="medium">Navigation</Text>
          </Navbar.Start>
          <Navbar.End>
            <Button variant="ghost" size="small">Home</Button>
            <Button variant="ghost" size="small">About</Button>
            <Button variant="ghost" size="small">Contact</Button>
          </Navbar.End>
        </Navbar>
        <div style={{ margin: 'var(--rs-space-8)', width: 'calc(100% - 2 * var(--rs-space-8))', minHeight: 200, border: '2px dashed var(--rs-color-border-base-secondary)', boxSizing: 'border-box' }} />
      </div>`
    },
    {
      name: 'Sticky',
      code: `
      <div className="navbar-sticky-demo-scroll" style={{ width: '100%', alignSelf: 'stretch', overflow: 'auto', height: 300 }}>
        <Navbar sticky>
          <Navbar.Start>
            <Text size="regular" weight="medium">Navigation</Text>
          </Navbar.Start>
          <Navbar.End>
            <Button variant="ghost" size="small">Home</Button>
            <Button variant="ghost" size="small">About</Button>
            <Button variant="ghost" size="small">Contact</Button>
          </Navbar.End>
        </Navbar>
        <div style={{ margin: 'var(--rs-space-8)', width: 'calc(100% - 2 * var(--rs-space-8))', minHeight: 400, border: '2px dashed var(--rs-color-border-base-secondary)', boxSizing: 'border-box' }} />
      </div>`
    }
  ]
};

export const shadowDemo = {
  type: 'code',
  tabs: [
    {
      name: 'With shadow (default)',
      code: `
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '100%' }}>
        <Navbar shadow>
          <Navbar.Start>
            <Text size="regular" weight="medium">Brand</Text>
          </Navbar.Start>
          <Navbar.End>
            <Button size="small">Action</Button>
          </Navbar.End>
        </Navbar>
        <div style={{ margin: 'var(--rs-space-8)', width: 'calc(100% - 2 * var(--rs-space-8))', minHeight: 200, border: '2px dashed var(--rs-color-border-base-secondary)', boxSizing: 'border-box' }} />
      </div>`
    },
    {
      name: 'Without shadow',
      code: `
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '100%' }}>
        <Navbar shadow={false}>
          <Navbar.Start>
            <Text size="regular" weight="medium">Brand</Text>
          </Navbar.Start>
          <Navbar.End>
            <Button size="small">Action</Button>
          </Navbar.End>
        </Navbar>
        <div style={{ margin: 'var(--rs-space-8)', width: 'calc(100% - 2 * var(--rs-space-8))', minHeight: 200, border: '2px dashed var(--rs-color-border-base-secondary)', boxSizing: 'border-box' }} />
      </div>`
    }
  ]
};

export const hideOnScrollDemo = {
  type: 'code',
  code: `
  <div className="navbar-sticky-demo-scroll" style={{ width: '100%', alignSelf: 'stretch', overflow: 'auto', height: 300 }}>
    <Navbar sticky hideOnScroll>
      <Navbar.Start>
        <Text size="regular" weight="medium">Navigation</Text>
      </Navbar.Start>
      <Navbar.End>
        <Button variant="ghost" size="small">Home</Button>
        <Button variant="ghost" size="small">About</Button>
        <Button variant="ghost" size="small">Contact</Button>
      </Navbar.End>
    </Navbar>
    <div style={{ margin: 'var(--rs-space-8)', width: 'calc(100% - 2 * var(--rs-space-8))', minHeight: 400, border: '2px dashed var(--rs-color-border-base-secondary)', boxSizing: 'border-box' }} />
  </div>`
};

export const sectionsDemo = {
  type: 'code',
  tabs: [
    {
      name: 'Start',
      code: `
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '100%' }}>
        <Navbar>
          <Navbar.Start>
            <Text size="regular" weight="medium">Brand Name</Text>
          </Navbar.Start>
        </Navbar>
        <div style={{ margin: 'var(--rs-space-8)', width: 'calc(100% - 2 * var(--rs-space-8))', minHeight: 200, border: '2px dashed var(--rs-color-border-base-secondary)', boxSizing: 'border-box' }} />
      </div>`
    },
    {
      name: 'Center',
      code: `
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '100%' }}>
        <Navbar>
          <Navbar.Center>
            <Text size="regular" weight="medium">Centered Title</Text>
          </Navbar.Center>
        </Navbar>
        <div style={{ margin: 'var(--rs-space-8)', width: 'calc(100% - 2 * var(--rs-space-8))', minHeight: 200, border: '2px dashed var(--rs-color-border-base-secondary)', boxSizing: 'border-box' }} />
      </div>`
    },
    {
      name: 'End',
      code: `
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '100%' }}>
        <Navbar>
          <Navbar.End>
            <Button variant="outline" size="small">Login</Button>
            <Button size="small">Sign Up</Button>
          </Navbar.End>
        </Navbar>
        <div style={{ margin: 'var(--rs-space-8)', width: 'calc(100% - 2 * var(--rs-space-8))', minHeight: 200, border: '2px dashed var(--rs-color-border-base-secondary)', boxSizing: 'border-box' }} />
      </div>`
    },
    {
      name: 'Start, Center and End',
      code: `
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '100%' }}>
        <Navbar>
          <Navbar.Start>
            <Text size="regular" weight="medium">Explore</Text>
          </Navbar.Start>
          <Navbar.Center>
            <Text size="regular" weight="medium">Brand</Text>
          </Navbar.Center>
          <Navbar.End>
            <Button variant="outline" size="small">Action</Button>
          </Navbar.End>
        </Navbar>
        <div style={{ margin: 'var(--rs-space-8)', width: 'calc(100% - 2 * var(--rs-space-8))', minHeight: 200, border: '2px dashed var(--rs-color-border-base-secondary)', boxSizing: 'border-box' }} />
      </div>`
    }
  ]
};

export const accessibilityDemo = {
  type: 'code',
  tabs: [
    {
      name: 'Custom aria-label',
      code: `
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '100%' }}>
        <Navbar aria-label="Primary navigation">
          <Navbar.Start>
            <Text size="regular" weight="medium">Brand</Text>
          </Navbar.Start>
          <Navbar.End>
            <Button size="small">Menu</Button>
          </Navbar.End>
        </Navbar>
        <div style={{ margin: 'var(--rs-space-8)', width: 'calc(100% - 2 * var(--rs-space-8))', minHeight: 200, border: '2px dashed var(--rs-color-border-base-secondary)', boxSizing: 'border-box' }} />
      </div>`
    },
    {
      name: 'With aria-labelledby',
      code: `
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '100%' }}>
        <Navbar aria-labelledby="nav-heading">
          <Navbar.Start>
            <Text size="regular" weight="medium">Brand</Text>
          </Navbar.Start>
          <Navbar.End>
            <Button size="small">Menu</Button>
          </Navbar.End>
        </Navbar>
        <div style={{ margin: 'var(--rs-space-8)', width: 'calc(100% - 2 * var(--rs-space-8))', minHeight: 200, border: '2px dashed var(--rs-color-border-base-secondary)', boxSizing: 'border-box' }} />
      </div>`
    },
    {
      name: 'Section Labels',
      code: `
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '100%' }}>
        <Navbar>
          <Navbar.Start aria-label="Brand and navigation links">
            <Text size="regular" weight="medium">Brand</Text>
          </Navbar.Start>
          <Navbar.End aria-label="User actions and settings">
            <Button size="small">Settings</Button>
            <Button size="small">Profile</Button>
          </Navbar.End>
        </Navbar>
        <div style={{ margin: 'var(--rs-space-8)', width: 'calc(100% - 2 * var(--rs-space-8))', minHeight: 200, border: '2px dashed var(--rs-color-border-base-secondary)', boxSizing: 'border-box' }} />
      </div>`
    }
  ]
};
