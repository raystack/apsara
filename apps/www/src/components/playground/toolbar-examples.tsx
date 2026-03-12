'use client';

import {
  FontBoldIcon,
  FontItalicIcon,
  TextAlignCenterIcon,
  TextAlignLeftIcon,
  TextAlignRightIcon,
  UnderlineIcon
} from '@radix-ui/react-icons';
import { Button, Flex, IconButton, Text, Toolbar } from '@raystack/apsara';
import PlaygroundLayout from './playground-layout';

export function ToolbarExamples() {
  return (
    <PlaygroundLayout title='Toolbar'>
      <Flex direction='column' gap='large'>
        <Text>Default:</Text>
        <Toolbar>
          <Toolbar.Button>Bold</Toolbar.Button>
          <Toolbar.Button>Italic</Toolbar.Button>
          <Toolbar.Separator />
          <Toolbar.Button>Left</Toolbar.Button>
          <Toolbar.Button>Center</Toolbar.Button>
          <Toolbar.Button>Right</Toolbar.Button>
        </Toolbar>

        <Text>Grouped with composition:</Text>
        <Toolbar>
          <Toolbar.Button
            render={<Button variant='text' color='neutral' size='small' />}
          >
            32px
          </Toolbar.Button>
          <Toolbar.Separator />
          <Toolbar.Group>
            <Toolbar.Button
              render={
                <IconButton variant='text' color='neutral' size='small' />
              }
            >
              <FontBoldIcon />
            </Toolbar.Button>
            <Toolbar.Button
              render={
                <IconButton variant='text' color='neutral' size='small' />
              }
            >
              <FontItalicIcon />
            </Toolbar.Button>
            <Toolbar.Button
              render={
                <IconButton variant='text' color='neutral' size='small' />
              }
            >
              <UnderlineIcon />
            </Toolbar.Button>
          </Toolbar.Group>
          <Toolbar.Separator />
          <Toolbar.Group>
            <Toolbar.Button
              render={
                <IconButton variant='text' color='neutral' size='small' />
              }
            >
              <TextAlignLeftIcon />
            </Toolbar.Button>
            <Toolbar.Button
              render={
                <IconButton variant='text' color='neutral' size='small' />
              }
            >
              <TextAlignCenterIcon />
            </Toolbar.Button>
            <Toolbar.Button
              render={
                <IconButton variant='text' color='neutral' size='small' />
              }
            >
              <TextAlignRightIcon />
            </Toolbar.Button>
          </Toolbar.Group>
        </Toolbar>

        <Text>Disabled:</Text>
        <Toolbar disabled>
          <Toolbar.Button>Bold</Toolbar.Button>
          <Toolbar.Button>Italic</Toolbar.Button>
          <Toolbar.Separator />
          <Toolbar.Button>Left</Toolbar.Button>
        </Toolbar>
      </Flex>
    </PlaygroundLayout>
  );
}
