export const primitivesRoutes = [
  {
    label: "Overview",
    pages: [
      { title: "Introduction", slug: "docs/primitives/overview/introduction" },
      {
        title: "Getting started",
        slug: "docs/primitives/overview/getting-started",
      },
    ],
  },
  {
    label: "Components",
    pages: [
      {
        title: "Annoucement Bar",
        slug: "docs/primitives/components/announcementbar",
        newBadge: true,
      },
      {
        title: "Avatar",
        slug: "docs/primitives/components/avatar",
        newBadge: true,
      },
      {
        title: "Badge",
        slug: "docs/primitives/components/badge",
        newBadge: true,
      },
      {
        title: "Breadcrumb",
        slug: "docs/primitives/components/breadcrumb",
        newBadge: true,
      },
      {
        title: "Button",
        slug: "docs/primitives/components/button",
        newBadge: true,
      },
      { title: "Callout", slug: "docs/primitives/components/callout", newBadge: true },
      { title: "Calendar", slug: "docs/primitives/components/calendar", newBadge: true },
      { title: "Command", slug: "docs/primitives/components/command", newBadge: true },
      {
        title: "Checkbox",
        slug: "docs/primitives/components/checkbox",
        newBadge: true,
      },
      {
        title: "Chip",
        slug: "docs/primitives/components/chip",
        newBadge: true,
      },
      {
        title: "Container",
        slug: "docs/primitives/components/container",
        newBadge: true,
      },
      { title: "Datatable", slug: "docs/primitives/components/datatable" },
      { title: "Dialog", slug: "docs/primitives/components/dialog", newBadge: true },
      {
        title: "Dropdown Menu",
        slug: "docs/primitives/components/dropdownmenu",
        newBadge: true,
      },
      {
        title: "Empty State",
        slug: "docs/primitives/components/emptystate",
        newBadge: true,
      },
      { title: "ErrorState", slug: "docs/primitives/components/errorstate" },
      {
        title: "Flex",
        slug: "docs/primitives/components/flex",
        newBadge: true,
      },
      {
        title: "Filter Chip",
        slug: "docs/primitives/components/filter-chip",
        newBadge: true,
      },
      {
        title: "Headline",
        slug: "docs/primitives/components/headline",
        newBadge: true,
      },
      {
        title: "IconButton",
        slug: "docs/primitives/components/iconButton",
        newBadge: true,
      },
      {
        title: "Image",
        slug: "docs/primitives/components/image",
        newBadge: true,
      },
      {
        title: "Indicator",
        slug: "docs/primitives/components/indicator",
        newBadge: true,
      },
      {
        title: "Input Field",
        slug: "docs/primitives/components/inputField",
        newBadge: true,
      },
      {
        title: "Label",
        slug: "docs/primitives/components/label",
        newBadge: true,
      },
      {
        title: "Link",
        slug: "docs/primitives/components/link",
        newBadge: true,
      },
      {
        title: "List",
        slug: "docs/primitives/components/list",
        newBadge: true,
      },
      {
        title: "Popover",
        slug: "docs/primitives/components/popover",
        newBadge: true,
      },
      {
        title: "Radio",
        slug: "docs/primitives/components/radio",
        newBadge: true,
      },
      { title: "Select", slug: "docs/primitives/components/select", newBadge: true },
      {
        title: "Search",
        slug: "docs/primitives/components/search",
        newBadge: true,
      },
      {
        title: "Separator",
        slug: "docs/primitives/components/separator",
        newBadge: true,
      },
      { title: "Sheet", slug: "docs/primitives/components/sheet" },
      {
        title: "Spinner",
        slug: "docs/primitives/components/spinner",
        newBadge: true,
      },
      {
        title: "Switch",
        slug: "docs/primitives/components/switch",
        newBadge: true,
      },
      {
        title: "Slider",
        slug: "docs/primitives/components/slider",
        newBadge: true,
      },
      {
        title: "Side panel",
        slug: "docs/primitives/components/sidepanel",
        newBadge: true,
      },
      {
        title: "Tabs",
        slug: "docs/primitives/components/tabs",
        newBadge: true,
      },
      {
        title: "Table",
        slug: "docs/primitives/components/table",
        newBadge: true,
      },
      {
        title: "Text",
        slug: "docs/primitives/components/text",
        newBadge: true,
      },
      { title: "Text Field", slug: "docs/primitives/components/textfield" },
      {
        title: "Tooltip",
        slug: "docs/primitives/components/tooltip",
        newBadge: true,
      },
      {
        title: "Text Area",
        slug: "docs/primitives/components/textArea",
        newBadge: true,
      },
      {
        title: "Toast",
        slug: "docs/primitives/components/toast",
        newBadge: true,
      },
    ],
  },
];

export type PageProps = {
  title: string;
  slug: string;
  deprecated?: boolean;
  preview?: boolean;
  newBadge?: boolean;
};

export type RouteProps = {
  label: string;
  pages: PageProps[];
};

export const allPrimitivesRoutes = primitivesRoutes.reduce(
  (acc: any, curr: RouteProps) => {
    return [...acc, ...curr.pages];
  },
  []
);
