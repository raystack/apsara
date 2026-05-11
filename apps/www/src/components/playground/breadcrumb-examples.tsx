'use client';

import { Breadcrumb, Flex } from '@raystack/apsara';
import PlaygroundLayout from './playground-layout';

export function BreadcrumbExamples() {
  return (
    <PlaygroundLayout title='Breadcrumb'>
      <Flex gap={5} direction='column'>
        <Breadcrumb size='small'>
          <Breadcrumb.Item href='/'>Home</Breadcrumb.Item>
          <Breadcrumb.Separator />
          <Breadcrumb.Item
            dropdownItems={[
              {
                children: 'Clothes',
                onClick: () => {
                  console.log('Clothes');
                }
              },
              {
                children: 'Electronics',
                onClick: () => {
                  console.log('Electronics');
                }
              }
            ]}
          >
            Products
          </Breadcrumb.Item>
          <Breadcrumb.Separator />
          <Breadcrumb.Item href='/products/shoes' render={<a />} current>
            Shoes
          </Breadcrumb.Item>
        </Breadcrumb>
      </Flex>
    </PlaygroundLayout>
  );
}
