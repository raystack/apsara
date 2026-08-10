'use client';

import type { ComponentPropsType } from '@/components/demo/types';
import { getPropsString } from '@/lib/utils';

export const getCode = (props: ComponentPropsType) => {
  const { children, ...rest } = props;

  return `<Container${getPropsString(rest)}><Text>${children}</Text></Container>`;
};

export const playground = {
  type: 'playground',
  controls: {
    size: {
      type: 'select',
      options: ['small', 'medium', 'large', 'none'],
      defaultValue: 'none'
    },
    align: {
      type: 'select',
      options: ['left', 'center', 'right'],
      defaultValue: 'center'
    },
    children: {
      type: 'text',
      initialValue:
        'Workspace settings control how members join, what they can access, and how billing works. Changes apply to everyone in your organization as soon as you save them.'
    }
  },
  getCode
};

export const alignDemo = {
  type: 'code',
  tabs: [
    {
      name: 'Left Aligned',
      code: `
      <Container size="small" align="left">
        <Text>
          Workspace settings control how members join, what they can access, and how billing works. Changes apply to everyone in your organization as soon as you save them.
        </Text>
      </Container>`
    },
    {
      name: 'Center Aligned',
      code: `
      <Container size="small" align="center">
        <Text>
          Workspace settings control how members join, what they can access, and how billing works. Changes apply to everyone in your organization as soon as you save them.
        </Text>
      </Container>`
    },
    {
      name: 'Right Aligned',
      code: `
      <Container size="small" align="right">
        <Text>
          Workspace settings control how members join, what they can access, and how billing works. Changes apply to everyone in your organization as soon as you save them.
        </Text>
      </Container>`
    }
  ]
};
export const sizeDemo = {
  type: 'code',
  tabs: [
    {
      name: 'None',
      code: `
        <Container size="none">
          <Text>
            Workspace settings control how members join, what they can access, and how billing works. Changes apply to everyone in your organization as soon as you save them.
          </Text>
        </Container>`
    },
    {
      name: 'Small',
      code: `
      <Container size="small">
          <Text>
            Workspace settings control how members join, what they can access, and how billing works. Changes apply to everyone in your organization as soon as you save them.
          </Text>
        </Container>`
    },
    {
      name: 'Medium',
      code: `
      <Container size="medium">
          <Text>
            Workspace settings control how members join, what they can access, and how billing works. Changes apply to everyone in your organization as soon as you save them.
          </Text>
        </Container>`
    },
    {
      name: 'Large',
      code: `
      <Container size="large">
        <Text>
          Workspace settings control how members join, what they can access, and how billing works. Changes apply to everyone in your organization as soon as you save them.
        </Text>
      </Container>`
    }
  ]
};
