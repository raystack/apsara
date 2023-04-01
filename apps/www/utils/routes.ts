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
        pages: [{ title: "Avatar", slug: "docs/primitives/components/avatar" }],
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
