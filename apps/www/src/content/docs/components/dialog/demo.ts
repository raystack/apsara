"use client";

export const getCode = (props: any) => {
  const { title, description, ...rest } = props;
  return `
    <Dialog>
      <Dialog.Trigger asChild>
        <Button >Basic Dialog</Button>
      </Dialog.Trigger>
      <Dialog.Content 
        width={200}
        ariaLabel="Basic Dialog"
        ariaDescription="A simple dialog example"
      >
        <Dialog.Title>${title}</Dialog.Title>
        <Dialog.Description>
         ${description}
        </Dialog.Description>
        <Flex gap="small" justify="end">
          <Dialog.Close />
        </Flex>
      </Dialog.Content>
    </Dialog>`;
};

export const playground = {
  type: "playground",
  controls: {
    title: { type: "text", initialValue: "A simple dialog example" },
    description: {
      type: "text",
      initialValue: "This is a basic dialog with title and description.",
    },
  },
  getCode,
};

export const controlledDemo = {
  type: "code",
  code: `
  function ControlledDialog() {
    const [open, setOpen] = React.useState(false);
    
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <Dialog.Trigger asChild>
          <Button>Controlled Dialog</Button>
        </Dialog.Trigger>
        <Dialog.Content width={600}>
          <Dialog.Title>Controlled State</Dialog.Title>
          <Dialog.Description>
            This dialog's state is controlled externally.
          </Dialog.Description>
          <Dialog.Close />
        </Dialog.Content>
      </Dialog>
    );
  }`,
};
export const customDemo = {
  type: "code",
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
      <Dialog.Title>Custom Styled Dialog</Dialog.Title>
      <Dialog.Description className="custom-description">
        This dialog has custom width and overlay styling.
      </Dialog.Description>
      <Dialog.Close />
    </Dialog.Content>
  </Dialog>`,
};

export const closeDemo = {
  type: "code",
  code: `
  <Dialog>
    <Dialog.Trigger asChild>
      <Button>Open Dialog</Button>
    </Dialog.Trigger>
    <Dialog.Content width={600} close={false}>
      <Dialog.Title>No Close Button</Dialog.Title>
      <Dialog.Description>
        This dialog doesn't show the close button.
      </Dialog.Description>
    </Dialog.Content>
  </Dialog>`,
};
