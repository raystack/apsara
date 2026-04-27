'use client';

export const preview = {
  type: 'code',
  code: `<FloatingActions variant="inline" aria-label="Selection actions">
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
  code: `<FloatingActions variant="inline" aria-label="Bulk actions">
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
</FloatingActions>`
};

export const iconOnlyDemo = {
  type: 'code',
  code: `<FloatingActions variant="inline" aria-label="Row actions">
  <IconButton aria-label="Edit" variant="text" color="neutral" size="small"><Pencil2Icon /></IconButton>
  <IconButton aria-label="Upload" variant="text" color="neutral" size="small"><UploadIcon /></IconButton>
  <FloatingActions.Separator />
  <IconButton aria-label="More info" variant="text" color="neutral" size="small"><InfoCircledIcon /></IconButton>
</FloatingActions>`
};
