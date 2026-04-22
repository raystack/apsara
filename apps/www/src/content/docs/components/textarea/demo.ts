'use client';

import { getPropsString } from '@/lib/utils';

export const getCode = (props: any) => {
  return `<TextArea${getPropsString(props)} placeholder="Enter text" />`;
};

export const playground = {
  type: 'playground',
  controls: {
    disabled: {
      type: 'checkbox',
      defaultValue: false
    },
    size: {
      type: 'select',
      options: ['large', 'small'],
      defaultValue: 'large'
    },
    variant: {
      type: 'select',
      options: ['default', 'borderless'],
      defaultValue: 'default'
    },
    rows: {
      type: 'number',
      defaultValue: 3,
      min: 1
    },
    width: {
      type: 'text',
      defaultValue: '400px'
    }
  },
  getCode
};

export const basicDemo = {
  type: 'code',
  code: `<TextArea placeholder="Enter your text here" />`
};

export const withFieldDemo = {
  type: 'code',
  code: `<Flex direction="column" gap="medium" style={{ width: 400 }}>
  <Field label="Bio" required={false} description="Tell us about yourself">
    <TextArea placeholder="Write something..." />
  </Field>
  <Field label="Comments" required error="This field is required">
    <TextArea placeholder="Enter comments" />
  </Field>
</Flex>`
};

export const controlledDemo = {
  type: 'code',
  code: `function ControlledExample() {
  const [value, setValue] = React.useState('');

  return (
    <Field label="Controlled TextArea" description={\`\${value.length} characters\`}>
      <TextArea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Type something..."
      />
    </Field>
  );
}`
};

export const sizeDemo = {
  type: 'code',
  code: `<Flex direction="column" gap="medium" style={{ width: 400 }}>
  <TextArea placeholder="Large size (default)" />
  <TextArea placeholder="Small size" size="small" />
</Flex>`
};

export const variantDemo = {
  type: 'code',
  code: `<Flex direction="column" gap="medium" style={{ width: 400 }}>
  <TextArea placeholder="Default variant" />
  <TextArea placeholder="Borderless variant" variant="borderless" />
</Flex>`
};

export const rowsDemo = {
  type: 'code',
  code: `<Flex direction="column" gap="medium" style={{ width: 400 }}>
  <TextArea placeholder="Default (3 rows)" />
  <TextArea placeholder="6 rows" rows={6} />
</Flex>`
};

export const widthDemo = {
  type: 'code',
  code: `<TextArea
  width="300px"
  placeholder="This textarea is 300px wide"
/>`
};
