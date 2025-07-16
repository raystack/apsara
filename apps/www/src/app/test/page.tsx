'use client';

import { ColorPickerAlpha } from '@/components/color-picker/color-picker-alpha';
import { ColorPicker } from '@/components/color-picker/color-picker-base';
import { ColorPickerFormat } from '@/components/color-picker/color-picker-format';
import { ColorPickerHue } from '@/components/color-picker/color-picker-hue';
import { ColorPickerOutput } from '@/components/color-picker/color-picker-output';
import { ColorPickerSelection } from '@/components/color-picker/color-picker-selection';
import { Flex } from '@raystack/apsara';

type Props = {};

const Page = (props: Props) => {
  return (
    <Flex
      style={{ height: '100vh', width: '100%' }}
      align='center'
      justify='center'
    >
      <ColorPicker
        defaultValue='#ffffff'
        style={{
          width: '240px',
          height: '320px',
          padding: 20,
          background: 'white'
        }}
      >
        <ColorPickerSelection />
        <ColorPickerHue />
        <ColorPickerAlpha />
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ColorPickerOutput />
          <ColorPickerFormat />
        </div>
      </ColorPicker>
    </Flex>
  );
};

export default Page;
