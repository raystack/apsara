'use client';

export const preview = {
  type: 'code',
  code: `
  function ToastPreview() {
    return (
      <Toast.Provider>
        <Flex gap="medium" wrap="wrap">
          <Button onClick={() => toastManager.add({ title: "This is a toast", type: "success" })}>
            Trigger toast
          </Button>
        </Flex>
      </Toast.Provider>
    )
  }`
};

export const basicDemo = {
  type: 'code',
  code: `
  <Button onClick={() => toastManager.add({ title: "Hello from Apsara!" })}>
    Show toast
  </Button>`
};

export const typesDemo = {
  type: 'code',
  tabs: [
    {
      name: 'Success',
      code: `
  <Button onClick={() => toastManager.add({ title: "Saved successfully", type: "success" })}>
    Success
  </Button>`
    },
    {
      name: 'Error',
      code: `
  <Button onClick={() => toastManager.add({ title: "Something went wrong", type: "error" })}>
    Error
  </Button>`
    },
    {
      name: 'Warning',
      code: `
  <Button onClick={() => toastManager.add({ title: "Heads up!", type: "warning" })}>
    Warning
  </Button>`
    },
    {
      name: 'Info',
      code: `
  <Button onClick={() => toastManager.add({ title: "FYI: System update available", type: "info" })}>
    Info
  </Button>`
    },
    {
      name: 'Loading',
      code: `
  <Button onClick={() => toastManager.add({ title: "Processing...", type: "loading", timeout: 0 })}>
    Loading
  </Button>`
    }
  ]
};

export const descriptionDemo = {
  type: 'code',
  code: `
  <Flex gap="medium" wrap="wrap">
    <Button onClick={() => toastManager.add({
      title: "File uploaded",
      description: "Your document has been uploaded successfully.",
      type: "success"
    })}>
      With description
    </Button>
    <Button onClick={() => toastManager.add({
      title: "Connection lost",
      description: "Please check your internet connection and try again.",
      type: "error"
    })}>
      Error with description
    </Button>
  </Flex>`
};

export const actionDemo = {
  type: 'code',
  code: `
  <Button onClick={() => toastManager.add({
    title: "Item deleted",
    description: "1 item was moved to trash.",
    actionProps: {
      children: "Undo",
      onClick: () => toastManager.add({ title: "Item restored", type: "success" })
    }
  })}>
    Action toast
  </Button>`
};

export const promiseDemo = {
  type: 'code',
  tabs: [
    {
      name: 'Basic',
      code: `
  <Button onClick={() => {
    const promise = new Promise((resolve) => setTimeout(resolve, 2000));
    toastManager.promise(promise, {
      loading: "Loading data...",
      success: "Data loaded successfully!",
      error: "Failed to load data."
    });
  }}>
    Promise toast
  </Button>`
    },
    {
      name: 'With options',
      code: `
  <Button onClick={() => {
    const promise = new Promise((resolve) => setTimeout(resolve, 2000));
    toastManager.promise(promise, {
      loading: { title: "Saving", description: "Please wait..." },
      success: { title: "Saved", description: "Document saved.", type: "success" },
      error: { title: "Failed", description: "Could not save document.", type: "error" }
    });
  }}>
    Promise with options
  </Button>`
    }
  ]
};

export const positionDemo = {
  type: 'code',
  tabs: [
    {
      name: 'Bottom Right',
      code: `
  <Button onClick={() => toastManager.add({ title: "Bottom right toast" })}>
    Bottom Right
  </Button>`
    },
    {
      name: 'Top Center',
      code: `
  <Button onClick={() => toastManager.add({ title: "Top center toast" })}>
    Top Center
  </Button>`
    },
    {
      name: 'Top Right',
      code: `
  <Button onClick={() => toastManager.add({ title: "Top right toast" })}>
    Top Right
  </Button>`
    },
    {
      name: 'Bottom Left',
      code: `
  <Button onClick={() => toastManager.add({ title: "Bottom left toast" })}>
    Bottom Left
  </Button>`
    }
  ]
};

export const updateDemo = {
  type: 'code',
  code: `
  function UpdateToast() {
    const idRef = React.useRef(null);
    return (
      <Flex gap="medium" wrap="wrap">
        <Button onClick={() => {
          idRef.current = toastManager.add({ title: "Processing...", type: "loading", timeout: 0 });
        }}>
          Start processing
        </Button>
        <Button variant="outline" onClick={() => {
          if (idRef.current) {
            toastManager.update(idRef.current, { title: "Done!", type: "success", timeout: 3000 });
            idRef.current = null;
          }
        }}>
          Mark as done
        </Button>
        <Button variant="outline" onClick={() => {
          if (idRef.current) {
            toastManager.close(idRef.current);
            idRef.current = null;
          }
        }}>
          Dismiss
        </Button>
      </Flex>
    )
  }`
};
