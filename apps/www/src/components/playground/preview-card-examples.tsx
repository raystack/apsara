'use client';

import { Flex, PreviewCard, Text } from '@raystack/apsara';
import PlaygroundLayout from './playground-layout';

const placeholderStyle = {
  width: 200,
  height: 120,
  borderRadius: 'var(--rs-radius-2)',
  backgroundColor: 'var(--rs-color-background-base-secondary)'
};

export function PreviewCardExamples() {
  return (
    <PlaygroundLayout title='PreviewCard'>
      <Flex gap={5} wrap='wrap'>
        <PreviewCard>
          <PreviewCard.Trigger href='#'>
            Hover to preview (bottom)
          </PreviewCard.Trigger>
          <PreviewCard.Content side='bottom'>
            <Flex direction='column' gap={3}>
              <div style={placeholderStyle} />
              <Text size='small'>Content appears below the trigger</Text>
            </Flex>
          </PreviewCard.Content>
        </PreviewCard>
        <PreviewCard>
          <PreviewCard.Trigger href='#'>
            Hover to preview (top)
          </PreviewCard.Trigger>
          <PreviewCard.Content side='top'>
            <Flex direction='column' gap={3}>
              <div style={placeholderStyle} />
              <Text size='small'>Content appears above the trigger</Text>
            </Flex>
          </PreviewCard.Content>
        </PreviewCard>
        <PreviewCard>
          <PreviewCard.Trigger href='#'>Hover with arrow</PreviewCard.Trigger>
          <PreviewCard.Content showArrow>
            <Flex direction='column' gap={3}>
              <div style={placeholderStyle} />
              <Text size='small'>Preview content with an arrow indicator</Text>
            </Flex>
          </PreviewCard.Content>
        </PreviewCard>
      </Flex>
    </PlaygroundLayout>
  );
}
