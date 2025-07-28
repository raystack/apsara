'use client';

import { getPropsString } from '@/lib/utils';

export const getCode = (props: any) => {
  return `<AnnouncementBar${getPropsString(props)}/>`;
};

export const playground = {
  type: 'playground',
  controls: {
    variant: {
      type: 'select',
      options: ['normal', 'error', 'gradient'],
      defaultValue: 'normal'
    },
    text: { type: 'text', initialValue: 'We have introduced a new feature' },
    leadingIcon: { type: 'icon', defaultValue: '' },
    actionLabel: { type: 'text', initialValue: 'Read More' },
    actionIcon: { type: 'icon', defaultValue: '' }
  },
  getCode
};
