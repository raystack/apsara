"use client";

import { getPropsString } from "@/lib/utils";

export const getCode = (props: any) => {
  return `<TextArea${getPropsString(props)}/>`;
};

export const playground = {
  type: "playground",
  controls: {
    label: {
      type: "text",
      initialValue: "Textarea",
    },
    isOptional: {
      type: "checkbox",
      defaultValue: false,
    },
    helperText: {
      type: "text",
      default: "Helper text",
    },
    error: {
      type: "checkbox",
      defaultValue: false,
    },
    width: {
      type: "text",
      defaultValue: "200px",
    },
  },
  getCode,
};

export const basicDemo = {
  type: "code",
  code: `
  <TextArea
  label="Basic TextArea"
  placeholder="Enter your text here"
/>`,
};

export const controlledDemo = {
  type: "code",
  code: `
  function ControlledExample() {
  const [value, setValue] = React.useState('');
  
  return (
    <TextArea
      label="Controlled TextArea"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      helperText={\`Current value: \${value.length} characters\`}
      placeholder="Type something..."
    />
  );
}`,
};

export const errorDemo = {
  type: "code",
  code: `
 <TextArea
  label="Error TextArea"
  error={true}
  helperText="This field has an error"
  placeholder="Enter your text here"
/>`,
};

export const widthDemo = {
  type: "code",
  code: `
<TextArea
  label="Custom Width"
  width="300px"
  placeholder="This textarea is 300px wide"
/>`,
};
