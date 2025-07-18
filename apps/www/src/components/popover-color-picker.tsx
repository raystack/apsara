import { Button, Flex, Popover } from '@raystack/apsara';
import { ColorPicker } from '@raystack/apsara';
import { useState } from 'react';

export default function PopoverColorPicker() {
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
}
