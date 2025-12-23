'use client';

import { getPropsString } from '@/lib/utils';

export const getCode = (props: any) => {
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
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book."
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
          Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
        </Text>
      </Container>`
    },
    {
      name: 'Center Aligned',
      code: `
      <Container size="small" align="center">
        <Text>
          Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
        </Text>
      </Container>`
    },
    {
      name: 'Right Aligned',
      code: `
      <Container size="small" align="right">
        <Text>
          Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
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
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
          </Text>
        </Container>`
    },
    {
      name: 'Small',
      code: `
      <Container size="small">
          <Text>
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
          </Text>
        </Container>`
    },
    {
      name: 'Medium',
      code: `
      <Container size="medium">
          <Text>
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
          </Text>
        </Container>`
    },
    {
      name: 'Large',
      code: `
      <Container size="large">
        <Text>
          Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
        </Text>
      </Container>`
    }
  ]
};
