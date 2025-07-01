"use client";

import { Button, Flex, toast, ToastContainer } from "@raystack/apsara";
import PlaygroundLayout from "./playground-layout";

export function ToastExamples() {
  return (
    <PlaygroundLayout title="Toast">
      <ToastContainer />
      <Flex gap="large" wrap="wrap">
        <Button
          onClick={() =>
            toast.success("This is a toast", { position: "bottom-left" })
          }>
          Bottom Left Toast
        </Button>
        <Button
          onClick={() =>
            toast.success("This is a toast", { position: "bottom-center" })
          }>
          Bottom Center Toast
        </Button>
        <Button
          onClick={() =>
            toast.success("This is a toast", { position: "bottom-right" })
          }>
          Bottom Right Toast
        </Button>
      </Flex>
      <Flex gap="large" wrap="wrap">
        <Button
          onClick={() =>
            toast.success("This is a toast", { position: "top-left" })
          }>
          Top Left Toast
        </Button>
        <Button
          onClick={() =>
            toast.success("This is a toast", { position: "top-center" })
          }>
          Top Center Toast
        </Button>
        <Button
          onClick={() =>
            toast.success("This is a toast", { position: "top-right" })
          }>
          Top Right Toast
        </Button>
      </Flex>
      <Button
        variant="outline"
        onClick={() =>
          toast.success("Data loaded successfully.", {
            dismissible: true,
            action: (
              <Button size="small" onClick={() => console.log("Toast appears")}>
                Click Me
              </Button>
            ),
          })
        }>
        Action Toast
      </Button>
    </PlaygroundLayout>
  );
}
