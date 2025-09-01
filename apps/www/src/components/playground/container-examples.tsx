"use client";

import { Container, Flex, Text } from "@raystack/apsara";
import PlaygroundLayout from "./playground-layout";

export function ContainerExamples() {
  return (
    <PlaygroundLayout title="Container">
      <Flex gap="large" wrap="wrap">
        <Container size="small" align="left">
          <Text>
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book.
          </Text>
        </Container>
        <Container size="medium" align="left">
          <Text>
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book.
          </Text>
        </Container>
        <Container size="large" align="left">
          <Text>
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book.
          </Text>
        </Container>
      </Flex>
    </PlaygroundLayout>
  );
}
