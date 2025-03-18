import { Button, Flex } from "@raystack/apsara/v1";
import PlaygroundLayout from "./playground-layout";

export function ButtonExamples() {
  return (
    <PlaygroundLayout title="Button">
      <Flex gap="medium">
        <Button color="accent" size="small">
          Small
        </Button>
        <Button color="accent" size="normal">
          Large
        </Button>
      </Flex>
      <Flex gap="large">
        <Button color="accent" loading>
          Button
        </Button>
        <Button color="accent" disabled>
          Button
        </Button>
        <Button color="accent">Button</Button>
        <Button color="danger">Button</Button>
        <Button color="neutral">Button</Button>
        <Button color="success">Button</Button>
      </Flex>
      <Flex gap="large">
        <Button variant="outline" color="accent" loading>
          Button
        </Button>
        <Button variant="outline" color="accent" disabled>
          Button
        </Button>
        <Button variant="outline" color="accent">
          Button
        </Button>
        <Button variant="outline" color="danger">
          Button
        </Button>
        <Button variant="outline" color="neutral">
          Button
        </Button>
        <Button variant="outline" color="success">
          Button
        </Button>
      </Flex>
      <Flex gap="large">
        <Button variant="ghost" color="accent" loading>
          Button
        </Button>
        <Button variant="ghost" color="accent" disabled>
          Button
        </Button>
        <Button variant="ghost" color="accent">
          Button
        </Button>
        <Button variant="ghost" color="danger">
          Button
        </Button>
        <Button variant="ghost" color="neutral">
          Button
        </Button>
        <Button variant="ghost" color="success">
          Button
        </Button>
      </Flex>
      <Flex gap="large">
        <Button variant="text" color="accent" loading>
          Button
        </Button>
        <Button variant="text" color="accent" disabled>
          Button
        </Button>
        <Button variant="text" color="accent">
          Button
        </Button>
        <Button variant="text" color="danger">
          Button
        </Button>
        <Button variant="text" color="neutral">
          Button
        </Button>
        <Button variant="text" color="success">
          Button
        </Button>
      </Flex>
    </PlaygroundLayout>
  );
}
