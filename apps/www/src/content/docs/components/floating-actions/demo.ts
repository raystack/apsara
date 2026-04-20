'use client';

export const preview = {
  type: 'code',
  code: `<FloatingActions>
  <Chip
    variant="outline"
    size="large"
    color="accent"
    leadingIcon={<TransformIcon />}
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
  code: `<FloatingActions>
  <Chip
    variant="outline"
    size="large"
    color="accent"
    leadingIcon={<TransformIcon />}
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
  code: `<FloatingActions>
  <IconButton variant="text" color="neutral" size="small"><Pencil2Icon /></IconButton>
  <IconButton variant="text" color="neutral" size="small"><UploadIcon /></IconButton>
  <FloatingActions.Separator />
  <IconButton variant="text" color="neutral" size="small"><InfoCircledIcon /></IconButton>
</FloatingActions>`
};
