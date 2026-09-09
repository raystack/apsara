'use client';

import type { ComponentPropsType } from '@/components/demo/types';
import { getPropsString } from '@/lib/utils';

export const getCode = (props: ComponentPropsType) => {
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
  getCode,
  style: {
    padding: 0
  }
};

export const variantsDemo = {
  type: 'code',
  code: `
  <Flex direction="column" gap={5} style={{ width: '100%' }}>
    <AnnouncementBar
      variant="normal"
      text="We have introduced a new feature"
      actionLabel="Read More"
    />
    <AnnouncementBar
      variant="error"
      text="Your trial has expired"
      actionLabel="Upgrade"
    />
    <AnnouncementBar
      variant="gradient"
      text="Apsara v1 is now available"
      actionLabel="See what's new"
    />
  </Flex>`
};

export const actionDemo = {
  type: 'code',
  code: `
<AnnouncementBar
  leadingIcon={<Info />}
  text="Scheduled maintenance on Sunday, 02:00–04:00 UTC."
  actionLabel="Read the notice"
  actionIcon={<ExternalLink size={12} />}
/>`
};
