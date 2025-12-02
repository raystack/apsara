'use client';

export const preview = {
  type: 'code',
  code: `
  <Navbar>
    <Navbar.Start>
      <Text size="regular" weight="medium">Explore</Text>
    </Navbar.Start>
    <Navbar.End>
      <Search placeholder="Search an AOI" size="small" style={{ width: '200px' }} />
      <Button variant="outline" size="small" color="neutral" leadingIcon={<FilterIcon />}>
        Draw AOI
      </Button>
      <Button variant="outline" size="small" color="neutral" leadingIcon={<OrganizationIcon />}>
        Upload AOI
      </Button>
    </Navbar.End>
  </Navbar>`
};

export const stickyDemo = {
  type: 'code',
  tabs: [
    {
      name: 'Default',
      code: `
      <Navbar>
        <Navbar.Start>
          <Text size="regular" weight="medium">Navigation</Text>
        </Navbar.Start>
        <Navbar.End>
          <Button variant="ghost" size="small">Home</Button>
          <Button variant="ghost" size="small">About</Button>
          <Button variant="ghost" size="small">Contact</Button>
        </Navbar.End>
      </Navbar>`
    },
    {
      name: 'Sticky',
      code: `
      <Navbar sticky>
        <Navbar.Start>
          <Text size="regular" weight="medium">Navigation</Text>
        </Navbar.Start>
        <Navbar.End>
          <Button variant="ghost" size="small">Home</Button>
          <Button variant="ghost" size="small">About</Button>
          <Button variant="ghost" size="small">Contact</Button>
        </Navbar.End>
      </Navbar>`
    }
  ]
};

export const sectionsDemo = {
  type: 'code',
  tabs: [
    {
      name: 'Start Only',
      code: `
      <Navbar>
        <Navbar.Start>
          <Text size="regular" weight="medium">Brand Name</Text>
        </Navbar.Start>
      </Navbar>`
    },
    {
      name: 'End Only',
      code: `
      <Navbar>
        <Navbar.End>
          <Button variant="outline" size="small">Login</Button>
          <Button size="small">Sign Up</Button>
        </Navbar.End>
      </Navbar>`
    },
    {
      name: 'Both Sections',
      code: `
      <Navbar>
        <Navbar.Start>
          <Text size="regular" weight="medium">Explore</Text>
        </Navbar.Start>
        <Navbar.End>
          <Search placeholder="Search..." size="small" style={{ width: '200px' }} />
          <Button variant="outline" size="small">Action</Button>
        </Navbar.End>
      </Navbar>`
    }
  ]
};

export const accessibilityDemo = {
  type: 'code',
  tabs: [
    {
      name: 'Custom aria-label',
      code: `
      <Navbar aria-label="Primary site navigation">
        <Navbar.Start>
          <Text size="regular" weight="medium">Brand</Text>
        </Navbar.Start>
        <Navbar.End>
          <Button size="small">Menu</Button>
        </Navbar.End>
      </Navbar>`
    },
    {
      name: 'With aria-labelledby',
      code: `
      <>
        <Navbar aria-labelledby="nav-heading">
          <Navbar.Start>
            <Text size="regular" weight="medium">Brand</Text>
          </Navbar.Start>
          <Navbar.End>
            <Button size="small">Menu</Button>
          </Navbar.End>
        </Navbar>
      </>`
    },
    {
      name: 'Section Labels',
      code: `
      <Navbar>
        <Navbar.Start aria-label="Brand and navigation links">
          <Text size="regular" weight="medium">Brand</Text>
        </Navbar.Start>
        <Navbar.End aria-label="User actions and settings">
          <Button size="small">Settings</Button>
          <Button size="small">Profile</Button>
        </Navbar.End>
      </Navbar>`
    }
  ]
};
