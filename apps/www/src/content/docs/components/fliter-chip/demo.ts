"use client";

export const preview = {
  type: "code",
  code: `
  <Flex direction="column" gap="large" align="center">
    <FilterChip
      label="Status"
      leadingIcon={<Info />}
      columnType="select"
      options={[
        { label: "Active", value: "active" },
        { label: "Inactive", value: "inactive" }
      ]}
    />
    <FilterChip
      label="Date"
      leadingIcon={<Info />}
      columnType="date"
    />
    <FilterChip
      label="Search"
      leadingIcon={<Info />}
      columnType="text"
    />
  </Flex>`,
};

export const inputDemo = {
  type: "code",
  tabs: [
    {
      name: "Select",
      code: `
<FilterChip
  label="Status"
  leadingIcon={<Info />}
  columnType="select"
  options={[
    { label: "Active", value: "active" },
    { label: "Inactive", value: "inactive" }
  ]}
/>`,
    },
    {
      name: "Date",
      code: `
<FilterChip
  label="Created"
  leadingIcon={<Info />}
  columnType="date"
/>`,
    },
    {
      name: "Text",
      code: `
<FilterChip
  label="Search"
  leadingIcon={<Info />}
  columnType="text"
/>`,
    },
  ],
};

export const iconDemo = {
  type: "code",
  code: `
  <FilterChip
  label="Status"
  leadingIcon={<Info />}
  columnType="select"
  options={[
    { label: "Active", value: "active" },
    { label: "Inactive", value: "inactive" }
  ]}
/>`,
};
export const actionDemo = {
  type: "code",
  code: `
  <FilterChip
  label="Status"
  leadingIcon={<Info />}
  columnType="select"
  options={[
    { label: "Active", value: "active" },
    { label: "Inactive", value: "inactive" }
  ]}
  onRemove={() => alert('Removed')}
/>`,
};
