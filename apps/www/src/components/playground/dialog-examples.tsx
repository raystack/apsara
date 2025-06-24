"use client";

import { Button, Dialog, Flex } from "@raystack/apsara";
import PlaygroundLayout from "./playground-layout";

export function DialogExamples() {
  return (
    <PlaygroundLayout title="Dialog">
      <Flex gap="medium">
        <Dialog>
          <Dialog.Trigger asChild>
            <Button> Dialog</Button>
          </Dialog.Trigger>
          <Dialog.Content
            width="400px"
            overlayBlur
            overlayClassName="custom-overlay"
            overlayStyle={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
            <Dialog.Title>Custom Styled Dialog</Dialog.Title>
            <Dialog.Description className="custom-description">
              This dialog has custom width and overlay styling.
            </Dialog.Description>
            <Dialog.Close />
          </Dialog.Content>
        </Dialog>
        <Dialog>
          <Dialog.Trigger asChild>
            <Button variant="outline">Open Dialog</Button>
          </Dialog.Trigger>
          <Dialog.Content width={600} close={false}>
            <Dialog.Title>No Close Button</Dialog.Title>
            <Dialog.Description>
              This dialog doesn't show the close button.
            </Dialog.Description>
          </Dialog.Content>
        </Dialog>
      </Flex>
    </PlaygroundLayout>
  );
}
