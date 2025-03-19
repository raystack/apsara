"use client";

import { Link, Flex } from "@raystack/apsara/v1";
import PlaygroundLayout from "./playground-layout";

export function LinkExamples() {
  return (
    <PlaygroundLayout title="Link">
      <Flex gap="large" direction="column">
        <Flex gap="medium" align="center" wrap="wrap">
          <Link href="#" variant="primary">
            Primary Link
          </Link>
          <Link href="#" variant="secondary">
            Secondary Link
          </Link>
          <Link href="#" variant="tertiary">
            Tertiary Link
          </Link>
          <Link href="#" variant="accent">
            Accent Link
          </Link>
          <Link href="#" variant="attention">
            Attention Link
          </Link>
          <Link href="#" variant="danger">
            Danger Link
          </Link>
          <Link href="#" variant="success">
            Success Link
          </Link>
        </Flex>
        <Flex gap="medium" align="end" wrap="wrap">
          <Link href="#" size={1}>
            Size 1
          </Link>
          <Link href="#" size={2}>
            Size 2
          </Link>
          <Link href="#" size={3}>
            Size 3
          </Link>
          <Link href="#" size={4}>
            Size 4
          </Link>
          <Link href="#" size={5}>
            Size 5
          </Link>
          <Link href="#" size={6}>
            Size 6
          </Link>
          <Link href="#" size={7}>
            Size 7
          </Link>
          <Link href="#" size={8}>
            Size 8
          </Link>
          <Link href="#" size={9}>
            Size 9
          </Link>
          <Link href="#" size={10}>
            Size 10
          </Link>
        </Flex>
        <Flex gap="medium" align="end" wrap="wrap">
          <Link href="#" weight="normal">
            Normal Weight
          </Link>
          <Link href="#" weight="bold">
            Bold Weight
          </Link>
          <Link href="#" weight={500}>
            Weight 500
          </Link>
        </Flex>
        <Flex gap="medium" align="end" wrap="wrap">
          <Link href="#" variant="primary" underline>
            Underlined Link
          </Link>
          <Link href="https://example.com" external>
            External Link
          </Link>
          <Link href="/file.pdf" download>
            Download File
          </Link>
        </Flex>
      </Flex>
    </PlaygroundLayout>
  );
}
