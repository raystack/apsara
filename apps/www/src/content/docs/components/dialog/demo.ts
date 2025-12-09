'use client';

export const getCode = (props: any) => {
  const { title, description, ...rest } = props;
  return `
    <Dialog>
      <Dialog.Trigger asChild>
        <Button >Basic Dialog</Button>
      </Dialog.Trigger>
      <Dialog.Content
        width={300}
        ariaLabel="Basic Dialog"
        ariaDescription="A simple dialog example"
      >
        <Dialog.Header>
          <Dialog.Title>${title}</Dialog.Title>
          <Dialog.CloseButton />
        </Dialog.Header>
        <Dialog.Body>
          <Dialog.Description>
          ${description}
          </Dialog.Description>
        </Dialog.Body>
        <Dialog.Footer>
          <Button>OK</Button>
          <Dialog.Close asChild><Button color="neutral">Cancel</Button></Dialog.Close>
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
        <Dialog.Trigger asChild>
          <Button>Controlled Dialog</Button>
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
    <Dialog.Trigger asChild>
      <Button>Styled Dialog</Button>
    </Dialog.Trigger>
    <Dialog.Content
      width="400px"
      overlayBlur
      overlayClassName="custom-overlay"
      overlayStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
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
    <Dialog.Trigger asChild>
      <Button>Only Header and Body</Button>
    </Dialog.Trigger>
    <Dialog.Content
      width="400px"
      overlayBlur
      overlayClassName="custom-overlay"
      overlayStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
    >
      <Dialog.Header>
        <Dialog.Title>Title</Dialog.Title>
        <Dialog.CloseButton />
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
    <Dialog.Trigger asChild>
      <Button>Only Footer and Body</Button>
    </Dialog.Trigger>
    <Dialog.Content
      width="400px"
      overlayBlur
      overlayClassName="custom-overlay"
      overlayStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
    >
      <Dialog.Body>
        <Dialog.Title>Title</Dialog.Title>
        <Dialog.Description className="custom-description">
          This dialog has custom width and overlay styling.
        </Dialog.Description>
      </Dialog.Body>
      <Dialog.Footer>
        <Dialog.Close asChild><Button color="neutral">Close</Button></Dialog.Close>
        <Button color="danger">Cancel</Button>
      </Dialog.Footer>
    </Dialog.Content>
  </Dialog>`
};
