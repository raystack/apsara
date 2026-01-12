'use client';

export const preview = {
  type: 'code',
  code: `<ColorPicker
defaultValue='#DA2929'
style={{
  width: '240px',
  height: '320px',
  padding: 12,
  background: 'white'
}}
>
<ColorPicker.Area />
<ColorPicker.Hue />
<ColorPicker.Alpha />
<Flex direction="row" gap={2}>
  <ColorPicker.Mode />
  <ColorPicker.Input />
</Flex>
</ColorPicker>`
};

export const basicDemo = {
  type: 'code',
  code: `
<ColorPicker defaultValue="#00bcd4" style={{
  width: '240px',
  height: '220px',
  padding: 12,
  background: 'white'
}}>
  <ColorPicker.Area/>
  <ColorPicker.Hue />
</ColorPicker>
`
};

export const popoverDemo = {
  type: 'code',
  previewCode: false,
  code: `<PopoverColorPicker />`,
  codePreview: [
    {
      label: 'index.tsx',
      code: `function PopoverColorPicker() {
  const [color, setColor] = useState('#DA2929');

  return (
    <Popover>
      <Popover.Trigger asChild>
        <Button
          style={{
            width: 60,
            height: 60,
            background: color
          }}
        />
      </Popover.Trigger>
      <Popover.Content>
        <ColorPicker
          value={color}
          onValueChange={setColor}
          style={{
            width: '100%',
            height: '320px'
          }}
        >
          <ColorPicker.Area />
          <ColorPicker.Hue />
          <ColorPicker.Alpha />
          <Flex direction='row' gap={2}>
            <ColorPicker.Mode />
            <ColorPicker.Input />
          </Flex>
        </ColorPicker>
      </Popover.Content>
    </Popover>
  );
}`
    }
  ]
};
