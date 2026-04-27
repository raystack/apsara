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

export const floatingDemo = {
  type: 'code',
  code: `<FloatingActions side="bottom" align="center" aria-label="Selection actions">
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
</FloatingActions>`
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
  <FloatingActions variant="inline" aria-label="Row actions">
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
    const rows = Array.from({ length: 20 }, (_, i) => i + 1);
    return (
      <div
        style={{
          position: 'relative',
          height: '320px',
          overflowY: 'auto',
          transform: 'translateZ(0)',
          border: '1px solid var(--rs-color-border-base-primary)',
          borderRadius: 'var(--rs-radius-2)',
          padding: 'var(--rs-space-5)'
        }}
      >
        <Flex direction="column" gap="small">
          {rows.map(row => (
            <div
              key={row}
              style={{
                padding: 'var(--rs-space-4)',
                background: 'var(--rs-color-background-base-secondary)',
                borderRadius: 'var(--rs-radius-1)'
              }}
            >
              Row {row}
            </div>
          ))}
        </Flex>
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
