'use client';

export const preview = {
  type: 'code',
  code: `<div style={{ paddingBlock: 'var(--rs-space-9)' }}>
  <FloatingActions variant="inline" aria-label="Selection actions">
    <Chip
      variant="outline"
      size="large"
      color="accent"
      leadingIcon={<CheckCircledIcon />}
      isDismissible
    >
      2 selected
    </Chip>
    <FloatingActions.Separator />
    <Button variant="outline" color="neutral" size="small">Move to</Button>
    <Button variant="outline" color="neutral" size="small">Actions</Button>
  </FloatingActions>
</div>`
};

export const variantsDemo = {
  type: 'code',
  tabs: [
    {
      name: 'Floating',
      code: `<div
  style={{
    position: 'relative',
    width: '100%',
    alignSelf: 'stretch',
    transform: 'translateZ(0)'
  }}
>
  <div style={{ height: '100%', overflowY: 'auto' }}>
    <div
      style={{
        height: 500,
        border: '2px dashed var(--rs-color-border-base-secondary)',
        margin: 'var(--rs-space-4)',
        boxSizing: 'border-box'
      }}
    />
  </div>
  <FloatingActions aria-label="Selection actions">
    <Chip
      variant="outline"
      size="large"
      color="accent"
      leadingIcon={<CheckCircledIcon />}
      isDismissible
    >
      2 selected
    </Chip>
    <FloatingActions.Separator />
    <Button variant="outline" color="neutral" size="small">Move to</Button>
    <Button variant="outline" color="neutral" size="small">Actions</Button>
  </FloatingActions>
</div>`
    },
    {
      name: 'Inline',
      code: `<div style={{ paddingBlock: 'var(--rs-space-9)' }}>
  <FloatingActions variant="inline" aria-label="Selection actions">
    <Chip
      variant="outline"
      size="large"
      color="accent"
      leadingIcon={<CheckCircledIcon />}
      isDismissible
    >
      2 selected
    </Chip>
    <FloatingActions.Separator />
    <Button variant="outline" color="neutral" size="small">Move to</Button>
    <Button variant="outline" color="neutral" size="small">Actions</Button>
  </FloatingActions>
</div>`
    }
  ]
};

export const bulkActionsDemo = {
  type: 'code',
  code: `<div style={{ paddingBlock: 'var(--rs-space-9)' }}>
  <FloatingActions variant="inline" aria-label="Bulk actions">
    <Chip
      variant="outline"
      size="large"
      color="accent"
      leadingIcon={<CheckCircledIcon />}
      isDismissible
    >
      5 selected
    </Chip>
    <FloatingActions.Separator />
    <Button variant="outline" color="neutral" size="small">Archive</Button>
    <Button variant="outline" color="neutral" size="small">Move to</Button>
    <Button variant="outline" color="danger" size="small">Delete</Button>
  </FloatingActions>
</div>`
};

export const iconOnlyDemo = {
  type: 'code',
  code: `<div style={{ paddingBlock: 'var(--rs-space-9)' }}>
  <FloatingActions
    variant="inline"
    aria-label="Row actions"
    style={{ gap: 'var(--rs-space-5)' }}
  >
    <IconButton aria-label="Edit" variant="text" color="neutral" size="small"><Pencil2Icon /></IconButton>
    <IconButton aria-label="Upload" variant="text" color="neutral" size="small"><UploadIcon /></IconButton>
    <FloatingActions.Separator />
    <IconButton aria-label="More info" variant="text" color="neutral" size="small"><InfoCircledIcon /></IconButton>
  </FloatingActions>
</div>`
};

export const scrollingDemo = {
  type: 'code',
  code: `
  function ScrollingDemo() {
    return (
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '320px',
          transform: 'translateZ(0)'
        }}
      >
        <div style={{ height: '100%', overflowY: 'auto' }}>
          <div
            style={{
              height: '800px',
              border: '2px dashed var(--rs-color-border-base-secondary)',
              margin: 'var(--rs-space-4)',
              boxSizing: 'border-box'
            }}
          />
        </div>
        <FloatingActions aria-label="Selection actions">
          <Chip
            variant="outline"
            size="large"
            color="accent"
            leadingIcon={<CheckCircledIcon />}
            isDismissible
          >
            2 selected
          </Chip>
          <FloatingActions.Separator />
          <Button variant="outline" color="neutral" size="small">Move to</Button>
          <Button variant="outline" color="neutral" size="small">Actions</Button>
        </FloatingActions>
      </div>
    );
  }`
};

const placementWrapper = (props: string) =>
  `<div
  style={{
    position: 'relative',
    width: '100%',
    alignSelf: 'stretch',
    minHeight: 240,
    transform: 'translateZ(0)'
  }}
>
  <div
    style={{
      position: 'absolute',
      inset: '0 var(--rs-space-4)',
      border: '2px dashed var(--rs-color-border-base-secondary)',
      boxSizing: 'border-box'
    }}
  />
  <FloatingActions ${props} aria-label="Selection actions">
    <Chip
      variant="outline"
      size="large"
      color="accent"
      leadingIcon={<CheckCircledIcon />}
      isDismissible
    >
      2 selected
    </Chip>
    <FloatingActions.Separator />
    <Button variant="outline" color="neutral" size="small">Move to</Button>
    <Button variant="outline" color="neutral" size="small">Actions</Button>
  </FloatingActions>
</div>`;

export const sideDemo = {
  type: 'code',
  tabs: [
    { name: 'Bottom', code: placementWrapper('side="bottom"') },
    { name: 'Top', code: placementWrapper('side="top"') }
  ]
};

export const alignDemo = {
  type: 'code',
  tabs: [
    { name: 'Start', code: placementWrapper('align="start"') },
    { name: 'Center', code: placementWrapper('align="center"') },
    { name: 'End', code: placementWrapper('align="end"') }
  ]
};

export const groupDemo = {
  type: 'code',
  code: `<div style={{ paddingBlock: 'var(--rs-space-9)' }}>
  <FloatingActions variant="inline" aria-label="Bulk actions">
    <Chip
      variant="outline"
      size="large"
      color="accent"
      leadingIcon={<CheckCircledIcon />}
      isDismissible
    >
      3 selected
    </Chip>
    <FloatingActions.Separator />
    <FloatingActions.Group>
      <Button variant="outline" color="neutral" size="small">Archive</Button>
      <Button variant="outline" color="neutral" size="small">Move to</Button>
    </FloatingActions.Group>
    <FloatingActions.Separator />
    <FloatingActions.Group disabled>
      <Button variant="outline" color="danger" size="small">Delete</Button>
    </FloatingActions.Group>
  </FloatingActions>
</div>`
};
