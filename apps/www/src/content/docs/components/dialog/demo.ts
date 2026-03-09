'use client';

export const getCode = (props: { title?: string; description?: string }) => {
  const { title, description } = props;
  return `
    <Dialog>
      <Dialog.Trigger render={<Button />}>
        Basic Dialog
      </Dialog.Trigger>
      <Dialog.Content
        width={300}
        ariaLabel="Basic Dialog"
        ariaDescription="A simple dialog example"
      >
        <Dialog.Header>
          <Dialog.Title>${title}</Dialog.Title>
        </Dialog.Header>
        <Dialog.Body>
          <Dialog.Description>
          ${description}
          </Dialog.Description>
        </Dialog.Body>
        <Dialog.Footer>
        <Dialog.Close render={<Button variant="outline" color="neutral">Cancel</Button>} />
        <Button>OK</Button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>`;
};

export const playground = {
  type: 'playground',
  controls: {
    title: { type: 'text', initialValue: 'A simple dialog example' },
    description: {
      type: 'text',
      initialValue: 'This is a basic dialog with title and description.'
    }
  },
  getCode
};

export const controlledDemo = {
  type: 'code',
  code: `
  function ControlledDialog() {
    const [open, setOpen] = React.useState(false);

    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <Dialog.Trigger render={<Button />}>
          Controlled Dialog
        </Dialog.Trigger>
        <Dialog.Content width={600}>
          <Dialog.Body>
            <Dialog.Title>Controlled State</Dialog.Title>
            <Dialog.Description>
              This dialog's state is controlled externally.
            </Dialog.Description>
          </Dialog.Body>
        </Dialog.Content>
      </Dialog>
    );
  }`
};

export const customDemo = {
  type: 'code',
  code: `
  <Dialog>
    <Dialog.Trigger render={<Button />}>
      Styled Dialog
    </Dialog.Trigger>
    <Dialog.Content
      width="400px"
      overlay={{ blur: true, className: 'custom-overlay', style: { backgroundColor: 'rgba(0, 0, 0, 0.5)' } }}
    >
      <Dialog.Body>
        <Dialog.Title>Custom Styled Dialog</Dialog.Title>
        <Dialog.Description className="custom-description">
          This dialog has custom width and overlay styling.
        </Dialog.Description>
      </Dialog.Body>
    </Dialog.Content>
  </Dialog>`
};

export const onlyHeaderDemo = {
  type: 'code',
  code: `
  <Dialog>
    <Dialog.Trigger render={<Button />}>
      Only Header and Body
    </Dialog.Trigger>
    <Dialog.Content
      width="400px"
      overlay={{ blur: true, className: 'custom-overlay', style: { backgroundColor: 'rgba(0, 0, 0, 0.5)' } }}
    >
      <Dialog.Header>
        <Dialog.Title>Title</Dialog.Title>
      </Dialog.Header>
      <Dialog.Body>
        <Dialog.Description className="custom-description">
          This dialog has custom width and overlay styling.
        </Dialog.Description>
      </Dialog.Body>
    </Dialog.Content>
  </Dialog>`
};

export const onlyFooterDemo = {
  type: 'code',
  code: `
  <Dialog>
    <Dialog.Trigger render={<Button />}>
      Only Footer and Body
    </Dialog.Trigger>
    <Dialog.Content
      width="400px"
      overlay={{ blur: true, className: 'custom-overlay', style: { backgroundColor: 'rgba(0, 0, 0, 0.5)' } }}
    >
      <Dialog.Body>
        <Dialog.Title>Title</Dialog.Title>
        <Dialog.Description className="custom-description">
          This dialog has custom width and overlay styling.
        </Dialog.Description>
      </Dialog.Body>
      <Dialog.Footer>
        <Dialog.Close render={<Button color="neutral">Close</Button>} />
        <Button color="danger">Cancel</Button>
      </Dialog.Footer>
    </Dialog.Content>
  </Dialog>`
};

export const nestedDemo = {
  type: 'code',
  code: `
  function NestedDialogExample() {
    const [parentOpen, setParentOpen] = React.useState(false);
    const [nestedOpen, setNestedOpen] = React.useState(false);

    return (
      <>
        <Dialog open={parentOpen} onOpenChange={setParentOpen}>
          <Dialog.Trigger render={<Button />}>
            Open Parent Dialog
          </Dialog.Trigger>
          <Dialog.Content width={400}>
            <Dialog.Header>
              <Dialog.Title>Parent Dialog</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <Dialog.Description>
                This is the parent dialog. Click the button below to open a nested dialog.
              </Dialog.Description>
              <Dialog open={nestedOpen} onOpenChange={setNestedOpen}>
                <Dialog.Trigger render={<Button />}>
                  Open Nested Dialog
                </Dialog.Trigger>
                <Dialog.Content width={400}>
                  <Dialog.Header>
                    <Dialog.Title>Nested Dialog</Dialog.Title>
                  </Dialog.Header>
                  <Dialog.Body>
                    <Dialog.Description>
                      This is a nested dialog. Notice how the parent dialog scales down
                      and becomes slightly transparent when this dialog is open.
                    </Dialog.Description>
                  </Dialog.Body>
                  <Dialog.Footer>
                    <Dialog.Close render={<Button variant="outline" color="neutral">Close</Button>} />
                  </Dialog.Footer>
                </Dialog.Content>
              </Dialog>
            </Dialog.Body>
            <Dialog.Footer>
              <Dialog.Close render={<Button variant="outline" color="neutral">Close Parent</Button>} />
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog>
      </>
    );
  }`
};
