'use client';

import { getPropsString } from '@/lib/utils';

const PLACEHOLDER = `<div style={{ width: 200, height: 120, borderRadius: "var(--rs-radius-2)", backgroundColor: "var(--rs-color-background-accent-primary)" }} />`;

export const getCode = (props: any) => {
  const { children, ...rest } = props;
  return `
  <PreviewCard>
    <PreviewCard.Trigger href="#">Hover to preview</PreviewCard.Trigger>
    <PreviewCard.Content${getPropsString(rest)}>
      <Flex direction="column" gap="small">
        ${PLACEHOLDER}
        <Text size="2">${children}</Text>
      </Flex>
    </PreviewCard.Content>
  </PreviewCard>`;
};

export const playground = {
  type: 'playground',
  controls: {
    align: {
      type: 'select',
      options: ['start', 'center', 'end'],
      defaultValue: 'center'
    },
    side: {
      type: 'select',
      options: ['top', 'right', 'bottom', 'left'],
      defaultValue: 'bottom'
    },
    sideOffset: { type: 'number', min: 0, defaultValue: 4 },
    showArrow: { type: 'checkbox', defaultValue: false },
    children: {
      type: 'text',
      initialValue: 'This is the preview card content.'
    }
  },
  getCode
};

export const arrowDemo = {
  type: 'code',
  code: `
  <PreviewCard>
    <PreviewCard.Trigger href="#">Hover to preview</PreviewCard.Trigger>
    <PreviewCard.Content showArrow>
      <Flex direction="column" gap="small">
        ${PLACEHOLDER}
        <Text size="2">Preview content with an arrow indicator</Text>
      </Flex>
    </PreviewCard.Content>
  </PreviewCard>`
};

export const contentTransitionsDemo = {
  type: 'code',
  code: `function ContentTransitionsExample() {
  const handle = PreviewCard.createHandle();
  const pages = {
    "page-a": {
      color: "var(--rs-color-background-accent-primary)",
      title: "Getting Started",
      description: "Learn the basics of the design system.",
    },
    "page-b": {
      color: "var(--rs-color-background-success-primary)",
      title: "Components",
      description: "Explore the full component library with interactive examples and detailed API documentation.",
    },
    "page-c": {
      color: "var(--rs-color-background-attention-primary)",
      title: "Theming",
      description: "Customize colors, typography, and spacing to match your brand. Includes dark mode support and CSS variable overrides.",
    },
  };

  return (
    <Flex gap="medium">
      <PreviewCard.Trigger handle={handle} payload="page-a" href="#">
        Page A
      </PreviewCard.Trigger>
      <PreviewCard.Trigger handle={handle} payload="page-b" href="#">
        Page B
      </PreviewCard.Trigger>
      <PreviewCard.Trigger handle={handle} payload="page-c" href="#">
        Page C
      </PreviewCard.Trigger>

      <PreviewCard handle={handle}>
        {({payload}) => {
          const page = pages[payload];
          if (!page) return null;
          return (
            <PreviewCard.Content style={{ maxWidth: 240 }}>
              <PreviewCard.Viewport>
                <Flex direction="column" gap="small">
                  <div style={{ width: "100%", height: 120, borderRadius: "var(--rs-radius-2)", backgroundColor: page.color, padding: "var(--rs-space-4)" }} />
                  <Text size="2" weight="medium">{page.title}</Text>
                  <Text size="1">{page.description}</Text>
                </Flex>
              </PreviewCard.Viewport>
            </PreviewCard.Content>
          );
        }}
      </PreviewCard>
    </Flex>
  );
}`
};

export const positionDemo = {
  type: 'code',
  tabs: [
    {
      name: 'Top',
      code: `
      <PreviewCard>
        <PreviewCard.Trigger href="#">Hover me</PreviewCard.Trigger>
        <PreviewCard.Content side="top">
          <Flex direction="column" gap="small">
            ${PLACEHOLDER}
            <Text size="2">Content appears above the trigger</Text>
          </Flex>
        </PreviewCard.Content>
      </PreviewCard>`
    },
    {
      name: 'Right',
      code: `
      <PreviewCard>
        <PreviewCard.Trigger href="#">Hover me</PreviewCard.Trigger>
        <PreviewCard.Content side="right">
          <Flex direction="column" gap="small">
            ${PLACEHOLDER}
            <Text size="2">Content appears to the right</Text>
          </Flex>
        </PreviewCard.Content>
      </PreviewCard>`
    },
    {
      name: 'Bottom',
      code: `
      <PreviewCard>
        <PreviewCard.Trigger href="#">Hover me</PreviewCard.Trigger>
        <PreviewCard.Content side="bottom">
          <Flex direction="column" gap="small">
            ${PLACEHOLDER}
            <Text size="2">Content appears below the trigger</Text>
          </Flex>
        </PreviewCard.Content>
      </PreviewCard>`
    },
    {
      name: 'Left',
      code: `
      <PreviewCard>
        <PreviewCard.Trigger href="#">Hover me</PreviewCard.Trigger>
        <PreviewCard.Content side="left">
          <Flex direction="column" gap="small">
            ${PLACEHOLDER}
            <Text size="2">Content appears to the left</Text>
          </Flex>
        </PreviewCard.Content>
      </PreviewCard>`
    }
  ]
};
