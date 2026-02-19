'use client';

import { getPropsString } from '@/lib/utils';

export const getCode = (props: Record<string, unknown>) => {
  return `<Accordion${getPropsString(props)}>
        <Accordion.Item value="item-1">
          <Accordion.Trigger>Is it accessible?</Accordion.Trigger>
          <Accordion.Content>
            Yes. It adheres to the WAI-ARIA design pattern.
          </Accordion.Content>
        </Accordion.Item>
        <Accordion.Item value="item-2">
          <Accordion.Trigger>Is it styled?</Accordion.Trigger>
          <Accordion.Content>
            Yes. It comes with default styles that matches the other components.
          </Accordion.Content>
        </Accordion.Item>
        <Accordion.Item value="item-3">
          <Accordion.Trigger>Is it animated?</Accordion.Trigger>
          <Accordion.Content>
            Yes. It's animated by default, but you can disable it if you prefer.
          </Accordion.Content>
        </Accordion.Item>
      </Accordion>`;
};

export const playground = {
  type: 'playground',
  controls: {
    multiple: {
      type: 'checkbox',
      defaultValue: false
    }
  },
  getCode
};

export const typeDemo = {
  type: 'code',
  tabs: [
    {
      name: 'Single',
      code: `
<Accordion multiple={false}>
  <Accordion.Item value="item-1">
    <Accordion.Trigger>What is Apsara?</Accordion.Trigger>
    <Accordion.Content>
      Apsara is a modern design system and component library built with React and TypeScript.
    </Accordion.Content>
  </Accordion.Item>
  <Accordion.Item value="item-2">
    <Accordion.Trigger>How do I get started?</Accordion.Trigger>
    <Accordion.Content>
      You can install Apsara using your preferred package manager and start building your application.
    </Accordion.Content>
  </Accordion.Item>
  <Accordion.Item value="item-3">
    <Accordion.Trigger>Is it customizable?</Accordion.Trigger>
    <Accordion.Content>
      Yes, Apsara provides extensive customization options through CSS variables and component props.
    </Accordion.Content>
  </Accordion.Item>
</Accordion>`
    },
    {
      name: 'Multiple',
      code: `
<Accordion multiple>
  <Accordion.Item value="item-1">
    <Accordion.Trigger>What is Apsara?</Accordion.Trigger>
    <Accordion.Content>
      Apsara is a modern design system and component library built with React and TypeScript.
    </Accordion.Content>
  </Accordion.Item>
  <Accordion.Item value="item-2">
    <Accordion.Trigger>How do I get started?</Accordion.Trigger>
    <Accordion.Content>
      You can install Apsara using your preferred package manager and start building your application.
    </Accordion.Content>
  </Accordion.Item>
  <Accordion.Item value="item-3">
    <Accordion.Trigger>Is it customizable?</Accordion.Trigger>
    <Accordion.Content>
      Yes, Apsara provides extensive customization options through CSS variables and component props.
    </Accordion.Content>
  </Accordion.Item>
</Accordion>`
    }
  ]
};
export const controlledDemo = {
  type: 'code',
  code: `
  function ControlledAccordion() {
  const [value, setValue] = React.useState('item-1');

  return (
    <Accordion value={value} onValueChange={setValue}>
      <Accordion.Item value="item-1">
        <Accordion.Trigger>Item 1</Accordion.Trigger>
        <Accordion.Content>Content for item 1</Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="item-2">
        <Accordion.Trigger>Item 2</Accordion.Trigger>
        <Accordion.Content>Content for item 2</Accordion.Content>
      </Accordion.Item>
    </Accordion>
  );
}`
};

export const disabledDemo = {
  type: 'code',
  code: `
<Accordion>
  <Accordion.Item value="item-1">
    <Accordion.Trigger>Enabled Item</Accordion.Trigger>
    <Accordion.Content>This item is enabled and can be toggled.</Accordion.Content>
  </Accordion.Item>
  <Accordion.Item value="item-2" disabled>
    <Accordion.Trigger>Disabled Item</Accordion.Trigger>
    <Accordion.Content>This item is disabled and cannot be toggled.</Accordion.Content>
  </Accordion.Item>
  <Accordion.Item value="item-3">
    <Accordion.Trigger>Another Enabled Item</Accordion.Trigger>
    <Accordion.Content>This item is also enabled.</Accordion.Content>
  </Accordion.Item>
</Accordion>`
};

export const customContentDemo = {
  type: 'code',
  code: `
<Accordion>
  <Accordion.Item value="item-1">
    <Accordion.Trigger>Product Features</Accordion.Trigger>
    <Accordion.Content>
      <div style={{ padding: '16px' }}>
        <h4>Key Features</h4>
        <ul>
          <li>Responsive design</li>
          <li>Accessible components</li>
          <li>TypeScript support</li>
          <li>Customizable themes</li>
        </ul>
      </div>
    </Accordion.Content>
  </Accordion.Item>
  <Accordion.Item value="item-2">
    <Accordion.Trigger>Documentation</Accordion.Trigger>
    <Accordion.Content>
      <div style={{ padding: '16px' }}>
        <p>Comprehensive documentation with examples and API references.</p>
        <a href="/docs">View Documentation</a>
      </div>
    </Accordion.Content>
  </Accordion.Item>
</Accordion>`
};
