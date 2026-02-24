'use client';

import { getPropsString } from '@/lib/utils';

export const getCode = (props: any) => {
  const { children, ...rest } = props;
  return `<FilterCard>
  <FilterCard.Section${getPropsString(rest)}>${children}</FilterCard.Section>
</FilterCard>`;
};

export const playground = {
  type: 'playground',
  controls: {
    title: {
      type: 'text',
      initialValue: 'Display Properties'
    },
    children: {
      type: 'text',
      initialValue: 'Section content goes here'
    }
  },
  getCode
};

export const sectionsDemo = {
  type: 'code',
  code: `
  <FilterCard>
    <FilterCard.Section>
      <FilterCard.Item label="Ordering">
        <Select defaultValue="auto">
          <Select.Trigger size="small" variant="filter" style={{ width: "100%" }}>
            <Select.Value />
          </Select.Trigger>
          <Select.Content>
            <Select.Item value="auto">Auto</Select.Item>
            <Select.Item value="name">Name</Select.Item>
            <Select.Item value="date">Date</Select.Item>
          </Select.Content>
        </Select>
      </FilterCard.Item>
      <FilterCard.Item label="Grouping">
        <Select defaultValue="none">
          <Select.Trigger size="small" variant="filter" style={{ width: "100%" }}>
            <Select.Value />
          </Select.Trigger>
          <Select.Content>
            <Select.Item value="none">No grouping</Select.Item>
            <Select.Item value="status">Status</Select.Item>
            <Select.Item value="type">Type</Select.Item>
          </Select.Content>
        </Select>
      </FilterCard.Item>
    </FilterCard.Section>
    <FilterCard.Section title="Display Properties">
      <Text size={1}>Name, Creator, Project</Text>
    </FilterCard.Section>
    <FilterCard.Footer>
      <Button variant="ghost" size="small">Reset to default</Button>
    </FilterCard.Footer>
  </FilterCard>`
};

export const withoutTitleDemo = {
  type: 'code',
  code: `
  <FilterCard>
    <FilterCard.Section>
      <Text size={1}>Section without a title</Text>
    </FilterCard.Section>
  </FilterCard>`
};
