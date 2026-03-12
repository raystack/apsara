'use client';

export const getCode = (props: { title?: string; description?: string }) => {
  const { title, description } = props;
  return `
    <AlertDialog>
      <AlertDialog.Trigger render={<Button color="danger" />}>
        Discard draft
      </AlertDialog.Trigger>
      <AlertDialog.Content width={400} showCloseButton={false}>
        <AlertDialog.Body>
          <AlertDialog.Title>${title}</AlertDialog.Title>
          <AlertDialog.Description>
          ${description}
          </AlertDialog.Description>
        </AlertDialog.Body>
        <AlertDialog.Footer>
          <AlertDialog.Close render={<Button variant="outline" color="neutral">Cancel</Button>} />
          <AlertDialog.Close render={<Button color="danger">Discard</Button>} />
        </AlertDialog.Footer>
      </AlertDialog.Content>
    </AlertDialog>`;
};

export const playground = {
  type: 'playground',
  controls: {
    title: { type: 'text', initialValue: 'Discard draft?' },
    description: {
      type: 'text',
      initialValue: "You can't undo this action."
    }
  },
  getCode
};

export const controlledDemo = {
  type: 'code',
  code: `
  function ControlledAlertDialog() {
    const [open, setOpen] = React.useState(false);

    return (
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialog.Trigger render={<Button color="danger" />}>
          Delete Account
        </AlertDialog.Trigger>
        <AlertDialog.Content width={450} showCloseButton={false}>
          <AlertDialog.Header>
            <AlertDialog.Title>Delete Account</AlertDialog.Title>
          </AlertDialog.Header>
          <AlertDialog.Body>
            <AlertDialog.Description>
              Are you sure you want to delete your account? All of your data
              will be permanently removed. This action cannot be undone.
            </AlertDialog.Description>
          </AlertDialog.Body>
          <AlertDialog.Footer>
            <AlertDialog.Close render={<Button variant="outline" color="neutral">Cancel</Button>} />
            <Button color="danger" onClick={() => setOpen(false)}>Yes, delete account</Button>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog>
    );
  }`
};

export const menuDemo = {
  type: 'code',
  code: `
  function MenuWithAlertDialog() {
    const [dialogOpen, setDialogOpen] = React.useState(false);

    return (
      <React.Fragment>
        <Menu>
          <Menu.Trigger render={<Button variant="outline" />}>
            Actions
          </Menu.Trigger>
          <Menu.Content>
            <Menu.Item>Edit</Menu.Item>
            <Menu.Item>Duplicate</Menu.Item>
            <Menu.Separator />
            <Menu.Item onClick={() => setDialogOpen(true)}>
              Delete
            </Menu.Item>
          </Menu.Content>
        </Menu>

        <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <AlertDialog.Content width={400} showCloseButton={false}>
            <AlertDialog.Body>
              <AlertDialog.Title>Delete item?</AlertDialog.Title>
              <AlertDialog.Description>
                This will permanently delete the item. You can't undo this action.
              </AlertDialog.Description>
            </AlertDialog.Body>
            <AlertDialog.Footer>
              <AlertDialog.Close render={<Button variant="outline" color="neutral">Cancel</Button>} />
              <Button color="danger" onClick={() => setDialogOpen(false)}>Delete</Button>
            </AlertDialog.Footer>
          </AlertDialog.Content>
        </AlertDialog>
      </React.Fragment>
    );
  }`
};

export const discardDemo = {
  type: 'code',
  code: `
  <AlertDialog>
    <AlertDialog.Trigger render={<Button variant="outline" />}>
      Discard Changes
    </AlertDialog.Trigger>
    <AlertDialog.Content width={400} showCloseButton={false}>
      <AlertDialog.Header>
        <AlertDialog.Title>Unsaved Changes</AlertDialog.Title>
      </AlertDialog.Header>
      <AlertDialog.Body>
        <AlertDialog.Description>
          You have unsaved changes. Do you want to discard them or continue editing?
        </AlertDialog.Description>
      </AlertDialog.Body>
      <AlertDialog.Footer>
        <AlertDialog.Close render={<Button variant="outline" color="neutral">Continue Editing</Button>} />
        <AlertDialog.Close render={<Button color="danger">Discard</Button>} />
      </AlertDialog.Footer>
    </AlertDialog.Content>
  </AlertDialog>`
};

export const nestedDemo = {
  type: 'code',
  code: `
  function NestedAlertDialogExample() {
    return (
      <AlertDialog>
        <AlertDialog.Trigger render={<Button color="danger" />}>
          Delete Workspace
        </AlertDialog.Trigger>
        <AlertDialog.Content width={450}>
          <AlertDialog.Header>
            <AlertDialog.Title>Delete Workspace</AlertDialog.Title>
          </AlertDialog.Header>
          <AlertDialog.Body>
            <AlertDialog.Description>
              This will delete the workspace and all its projects. Are you sure?
            </AlertDialog.Description>
            <AlertDialog>
              <AlertDialog.Trigger render={<Button color="danger" size="small" />}>
                Confirm Delete
              </AlertDialog.Trigger>
              <AlertDialog.Content width={400} showCloseButton={false}>
                <AlertDialog.Body>
                  <AlertDialog.Title>Final Confirmation</AlertDialog.Title>
                  <AlertDialog.Description>
                    This is your last chance. This action is permanent and cannot be reversed.
                  </AlertDialog.Description>
                </AlertDialog.Body>
                <AlertDialog.Footer>
                  <AlertDialog.Close render={<Button variant="outline" color="neutral">Go Back</Button>} />
                  <AlertDialog.Close render={<Button color="danger">Delete Everything</Button>} />
                </AlertDialog.Footer>
              </AlertDialog.Content>
            </AlertDialog>
          </AlertDialog.Body>
          <AlertDialog.Footer>
            <AlertDialog.Close render={<Button variant="outline" color="neutral">Cancel</Button>} />
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog>
    );
  }`
};
