"use client";

import { getPropsString } from "@/lib/utils";

export const getCode = (props: any) => {
  const { onRemove, ...rest } = props;
  const onRemoveProp = onRemove ? `onRemove={() => alert("Removed")}` : "";

  if (props.columnType === "select")
    return `
    <FilterChip${getPropsString(rest)}
      options={[
        { label: "Active", value: "active" },
        { label: "Inactive", value: "inactive" }
      ]}
        ${onRemoveProp}
    />`;
  return `<FilterChip${getPropsString(rest)}${onRemoveProp}/>`;
};

export const playground = {
  type: "playground",
  controls: {
    columnType: {
      type: "select",
      options: ["select", "date", "string", "number"],
      defaultValue: "string",
    },
    variant: {
      type: "select",
      options: ["default", "text"],
      defaultValue: "default",
    },
    label: {
      type: "text",
      initialValue: "Status",
    },
    leadingIcon: { type: "icon" },
    onRemove: {
      type: "checkbox",
      defaultValue: false,
    },
  },
  getCode,
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
      name: "String",
      code: `
<FilterChip
  label="Search"
  leadingIcon={<Info />}
  columnType="string"
/>`,
    },
    {
      name: "Number",
      code: `
<FilterChip
  label="Search"
  leadingIcon={<Info />}
  columnType="number"
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
