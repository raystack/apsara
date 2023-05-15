export const primitivesRoutes = [
    {
        label: "Overview",
        pages: [
            { title: "Introduction", slug: "docs/primitives/overview/introduction" },
            { title: "Getting started", slug: "docs/primitives/overview/getting-started" },
        ],
    },
    {
        label: "Components",
        pages: [
            { title: "Accordion", slug: "docs/primitives/components/accordion" },
            { title: "Alert", slug: "docs/primitives/components/alert" },
            { title: "Alert Dialog", slug: "docs/primitives/components/alertdialog" },
            { title: "Avatar", slug: "docs/primitives/components/avatar" },
            { title: "Badge", slug: "docs/primitives/components/badge" },
            { title: "Button", slug: "docs/primitives/components/button" },
            { title: "Card", slug: "docs/primitives/components/card" },
            { title: "Checkbox", slug: "docs/primitives/components/checkbox" },
            { title: "Code", slug: "docs/primitives/components/code" },
            { title: "Command", slug: "docs/primitives/components/command" },
            { title: "Container", slug: "docs/primitives/components/container" },
            { title: "Context Menu", slug: "docs/primitives/components/contextmenu" },
            { title: "Control Group", slug: "docs/primitives/components/controlgroup" },
            { title: "Dialog", slug: "docs/primitives/components/dialog" },
            { title: "Dropdown Menu", slug: "docs/primitives/components/dropdownmenu" },
            { title: "Empty State", slug: "docs/primitives/components/emptystate" },
            { title: "Heading", slug: "docs/primitives/components/heading" },
            { title: "Image", slug: "docs/primitives/components/image" },
            { title: "Kbd", slug: "docs/primitives/components/kbd" },
            { title: "Label", slug: "docs/primitives/components/label" },
            { title: "Link", slug: "docs/primitives/components/link" },
            { title: "Menu", slug: "docs/primitives/components/menu" },
            { title: "Paragraph", slug: "docs/primitives/components/paragraph" },
            { title: "Popover", slug: "docs/primitives/components/popover" },
            { title: "Progress bar", slug: "docs/primitives/components/progressbar" },
            { title: "Radio", slug: "docs/primitives/components/radio" },
            { title: "Search Field", slug: "docs/primitives/components/searchfield" },
            { title: "Section", slug: "docs/primitives/components/section" },
            { title: "Select", slug: "docs/primitives/components/select" },
            { title: "Seprator", slug: "docs/primitives/components/separator" },
            { title: "Sheet", slug: "docs/primitives/components/sheet" },
            { title: "Sidebar", slug: "docs/primitives/components/sidebar" },
            { title: "Skeleton", slug: "docs/primitives/components/skeleton" },
            { title: "Slider", slug: "docs/primitives/components/slider" },
            { title: "Switch", slug: "docs/primitives/components/switch" },
            { title: "Table", slug: "docs/primitives/components/table" },
            { title: "Tabs", slug: "docs/primitives/components/tabs" },
            { title: "Text", slug: "docs/primitives/components/text" },
            { title: "Textarea", slug: "docs/primitives/components/textarea" },
            { title: "Text Field", slug: "docs/primitives/components/textfield" },
            { title: "Toggle", slug: "docs/primitives/components/toggle" },
            { title: "Tooltip", slug: "docs/primitives/components/tooltip" },
        ],
    },
];

export type PageProps = {
    title: string;
    slug: string;
    deprecated?: boolean;
    preview?: boolean;
};

export type RouteProps = {
    label: string;
    pages: PageProps[];
};

export const allPrimitivesRoutes = primitivesRoutes.reduce((acc: any, curr: RouteProps) => {
    return [...acc, ...curr.pages];
}, []);
