'use client';

import { Breadcrumb, Flex } from '@raystack/apsara';
import PlaygroundLayout from './playground-layout';

export function BreadcrumbExamples() {
  return (
    <PlaygroundLayout title='Breadcrumb'>
      <Flex gap='medium' direction='column'>
        <Breadcrumb size='small'>
          <Breadcrumb.Item href='/'>Home</Breadcrumb.Item>
          <Breadcrumb.Separator />
          <Breadcrumb.Item
            dropdownItems={[
              {
                label: 'Clothes',
                onClick: () => {
                  console.log('Clothes');
                }
              },
              {
                label: 'Electronics',
                onClick: () => {
                  console.log('Electronics');
                }
              }
            ]}
          >
            Products
          </Breadcrumb.Item>
          <Breadcrumb.Separator />
          <Breadcrumb.Item href='/products/shoes' as={<a />} current>
            Shoes
          </Breadcrumb.Item>
        </Breadcrumb>
      </Flex>
    </PlaygroundLayout>
  );
}
