'use client';

import {
  FontBoldIcon,
  FontItalicIcon,
  TextAlignCenterIcon,
  TextAlignLeftIcon,
  TextAlignRightIcon,
  UnderlineIcon
} from '@radix-ui/react-icons';
import { Flex, Text, Toggle } from '@raystack/apsara';
import PlaygroundLayout from './playground-layout';

export function ToggleExamples() {
  return (
    <PlaygroundLayout title='Toggle'>
      <Flex direction='column' gap={9}>
        <Text size='small' weight='medium'>
          Standalone
        </Text>
        <Flex gap={5} align='center'>
          <Toggle aria-label='Bold'>
            <FontBoldIcon />
          </Toggle>
          <Toggle aria-label='Bold' defaultPressed>
            <FontBoldIcon />
          </Toggle>
          <Toggle aria-label='Bold' disabled>
            <FontBoldIcon />
          </Toggle>
        </Flex>

        <Text size='small' weight='medium'>
          Sizes
        </Text>
        <Flex gap={5} align='center'>
          <Toggle size={1} aria-label='Bold'>
            <FontBoldIcon />
          </Toggle>
          <Toggle size={2} aria-label='Bold'>
            <FontBoldIcon />
          </Toggle>
          <Toggle size={3} aria-label='Bold'>
            <FontBoldIcon />
          </Toggle>
          <Toggle size={4} aria-label='Bold'>
            <FontBoldIcon />
          </Toggle>
        </Flex>

        <Text size='small' weight='medium'>
          Toggle.Group (single selection)
        </Text>
        <Toggle.Group defaultValue={['center']} aria-label='Text alignment'>
          <Toggle value='left' aria-label='Align left'>
            <TextAlignLeftIcon />
          </Toggle>
          <Toggle value='center' aria-label='Align center'>
            <TextAlignCenterIcon />
          </Toggle>
          <Toggle value='right' aria-label='Align right'>
            <TextAlignRightIcon />
          </Toggle>
        </Toggle.Group>

        <Text size='small' weight='medium'>
          Toggle.Group (multiple selection)
        </Text>
        <Toggle.Group multiple aria-label='Text formatting'>
          <Toggle value='bold' aria-label='Bold'>
            <FontBoldIcon />
          </Toggle>
          <Toggle value='italic' aria-label='Italic'>
            <FontItalicIcon />
          </Toggle>
          <Toggle value='underline' aria-label='Underline'>
            <UnderlineIcon />
          </Toggle>
        </Toggle.Group>

        <Text size='small' weight='medium'>
          Disabled Group
        </Text>
        <Toggle.Group disabled aria-label='Disabled alignment'>
          <Toggle value='left' aria-label='Align left'>
            <TextAlignLeftIcon />
          </Toggle>
          <Toggle value='center' aria-label='Align center'>
            <TextAlignCenterIcon />
          </Toggle>
        </Toggle.Group>
      </Flex>
    </PlaygroundLayout>
  );
}
