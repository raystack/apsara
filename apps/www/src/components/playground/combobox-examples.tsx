'use client';

import { Combobox, Flex } from '@raystack/apsara';
import PlaygroundLayout from './playground-layout';

export function ComboboxExamples() {
  return (
    <PlaygroundLayout title='Combobox'>
      <Flex gap='large' wrap='wrap'>
        <Combobox>
          <Combobox.Input placeholder='Select a fruit' width={240} />
          <Combobox.Content>
            <Combobox.Item value='apple'>Apple</Combobox.Item>
            <Combobox.Item value='banana'>Banana</Combobox.Item>
            <Combobox.Item value='blueberry'>Blueberry</Combobox.Item>
            <Combobox.Item value='grapes'>Grapes</Combobox.Item>
            <Combobox.Item value='pineapple'>Pineapple</Combobox.Item>
          </Combobox.Content>
        </Combobox>
        <Combobox multiple>
          <Combobox.Input placeholder='Select fruits' width={300} />
          <Combobox.Content>
            <Combobox.Item value='apple'>Apple</Combobox.Item>
            <Combobox.Item value='banana'>Banana</Combobox.Item>
            <Combobox.Item value='blueberry'>Blueberry</Combobox.Item>
            <Combobox.Item value='grapes'>Grapes</Combobox.Item>
            <Combobox.Item value='pineapple'>Pineapple</Combobox.Item>
          </Combobox.Content>
        </Combobox>
        <Combobox>
          <Combobox.Input placeholder='Grouped items' width={240} />
          <Combobox.Content>
            <Combobox.Group>
              <Combobox.Label>Fruits</Combobox.Label>
              <Combobox.Item value='apple'>Apple</Combobox.Item>
              <Combobox.Item value='banana'>Banana</Combobox.Item>
            </Combobox.Group>
            <Combobox.Separator />
            <Combobox.Group>
              <Combobox.Label>Vegetables</Combobox.Label>
              <Combobox.Item value='carrot'>Carrot</Combobox.Item>
              <Combobox.Item value='broccoli'>Broccoli</Combobox.Item>
            </Combobox.Group>
          </Combobox.Content>
        </Combobox>
      </Flex>
    </PlaygroundLayout>
  );
}
