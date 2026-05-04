'use client';

import { getPropsString } from '@/lib/utils';

export const getCode = (props: any) => {
  return `<Input${getPropsString(props)} placeholder="Enter text" />`;
};

export const playground = {
  type: 'playground',
  controls: {
    disabled: { type: 'checkbox', initialValue: false, defaultValue: false },
    leadingIcon: { type: 'icon', initialValue: '' },
    trailingIcon: { type: 'icon', initialValue: '' },
    prefix: { type: 'text', initialValue: '' },
    suffix: { type: 'text', initialValue: '' },
    width: { type: 'text', initialValue: '560px' },
    size: {
      type: 'select',
      options: ['small', 'large'],
      initialValue: 'large'
    }
  },
  getCode
};

export const basicDemo = {
  type: 'code',
  code: `<Input placeholder="Enter text" width="560px" />`
};

export const withFieldDemo = {
  type: 'code',
  code: `<Flex direction="column" gap="medium" style={{ width: 560 }}>
  <Field label="Email" required description="We won't share your email">
    <Input type="email" placeholder="Enter email" />
  </Field>
  <Field label="Name" error="This field is required">
    <Input placeholder="Enter name" />
  </Field>
  <Field label="Phone" required={false}>
    <Input type="tel" placeholder="Enter phone" />
  </Field>
</Flex>`
};

export const prefixDemo = {
  type: 'code',
  code: `<Input
  placeholder="0.00"
  prefix="$"
  suffix="USD"
  width="560px"
/>`
};

export const iconDemo = {
  type: 'code',
  code: `<Input
  placeholder="Enter text"
  leadingIcon={<Home size={16}/>}
  trailingIcon={<Info size={16}/>}
  width="560px"
/>`
};

export const disabledDemo = {
  type: 'code',
  code: `<Input
  placeholder="Enter text"
  disabled
  width="560px"
/>`
};

export const disabledChipsDemo = {
  type: 'code',
  code: `<Input
  placeholder="Type and press Enter..."
  disabled
  width="560px"
  chips={[
    { label: "Tag1", onRemove: () => console.log("Remove Tag1") },
    { label: "Tag2", onRemove: () => console.log("Remove Tag2") }
  ]}
/>`
};

export const widthDemo = {
  type: 'code',
  code: `<Input
  placeholder="Enter text"
  width="300px"
/>`
};

export const sizeDemo = {
  type: 'code',
  code: `<Flex direction="column" gap="medium">
  <Input
    placeholder="32px height (default)"
  />
  <Input
    placeholder="24px height"
    size="small"
  />
</Flex>`
};

export const sizeChipDemo = {
  type: 'code',
  code: `<Flex direction="column" gap="medium">
  <Input
    placeholder="Type and press Enter..."
    chips={[
      { label: "A", onRemove: () => console.log("Remove A") },
      { label: "B", onRemove: () => console.log("Remove B") }
    ]}
  />
  <Input
    placeholder="Type and press Enter..."
    size="small"
    chips={[
      { label: "A", onRemove: () => console.log("Remove A") },
      { label: "B", onRemove: () => console.log("Remove B") }
    ]}
  />
</Flex>`
};

export const interactiveChipDemo = {
  type: 'code',
  style: {
    padding: 0
  },
  previewCode: false,
  code: `<ChipInputDemo />`,
  codePreview: [
    {
      label: 'index.tsx',
      code: `
    const [chips, setChips] = React.useState([
      { label: "Tag1" },
      { label: "Tag2" },
      { label: "Tag3" },
      { label: "Tag4" },
      { label: "Tag5" },

    ]);
    const [input, setInput] = React.useState("");

      <Input
        placeholder="Type and press Enter..."
        width="560px"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && input.trim()) {
            setChips([...chips, { label: input.trim() }]);
            setInput("");
          }
        }}
        chips={chips.map((c, i) => ({
          label: c.label,
          onRemove: () => setChips(chips.filter((_, j) => j !== i))
        }))}
        maxChipsVisible={4}
      />`
    }
  ]
};
