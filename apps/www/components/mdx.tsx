import * as Apsara from "@odpf/apsara";
import { Link2Icon } from "@radix-ui/react-icons";
import * as React from "react";
import { LiveProvider } from "react-live";
import { Frontmatter } from "~/types/frontmatter";
import { Attributes } from "./attributes";
import Icons from "./icons";
import LiveEditor from "./live-editor";
import Playground from "./playground";
import { Preview } from "./preview";
import { Searchbar } from "./searchbar";

export const components = {
    ...Apsara,
    ...Icons,
    Attributes: Attributes,
    Preview: Preview,
    Searchbar: Searchbar,
    LiveProvider: LiveProvider,
    LiveEditor: LiveEditor,
    Playground: Playground,
    pre: (props: any) => <Apsara.Text {...props} as="pre" size="4" />,
    h1: (props: any) => <Apsara.Heading {...props} as="h1" size="3" />,
    Description: ({ children, ...props }: any) => {
        // takes the text even if it's wrapped in `<p>`
        // https://github.com/wooorm/xdm/issues/47
        const childText = typeof children === "string" ? children : children.props.children;
        return (
            <Apsara.Paragraph size="1" {...props} as="p" css={{ mt: "$2", mb: "$10" }}>
                {childText}
            </Apsara.Paragraph>
        );
    },
    h2: ({ children, id, ...props }: any) => {
        return (
            <LinkHeading id={id} css={{ mt: "$7", mb: "$2" }}>
                <Apsara.Heading
                    size="1"
                    {...props}
                    id={id}
                    as={"h2" as any}
                    css={{ scrollMarginTop: "$9", fontSize: "$7" }}
                    data-heading
                >
                    {children}
                </Apsara.Heading>
            </LinkHeading>
        );
    },
    h3: ({ children, id, ...props }: any) => (
        <LinkHeading id={id} css={{ mt: "$7", mb: "$1" }}>
            <Apsara.Heading {...props} id={id} as={"h3" as any} css={{ scrollMarginTop: "$9", fontSize: "$6" }} data-heading>
                {children}
            </Apsara.Heading>
        </LinkHeading>
    ),
    h4: (props: any) => (
        <Apsara.Text
            as="h4"
            {...props}
            size="4"
            css={{ scrollMarginTop: "$9", mb: "$3", lineHeight: "27px", fontWeight: 500, fontSize: "$5" }}
        />
    ),
    p: (props: any) => <Apsara.Paragraph {...props} css={{ mb: "$3" }} as="p" />,
    a: ({ href = "", ...props }) => {
        if (href.startsWith("http")) {
            return (
                <Apsara.Link
                    {...props}
                    variant="blue"
                    href={href}
                    css={{ fontSize: "inherit" }}
                    target="_blank"
                    rel="noopener"
                />
            );
        }
        return <Apsara.Link href={href} {...props} css={{ color: "inherit", fontSize: "inherit" }} />;
    },
    hr: (props: any) => <Apsara.Separator size="2" {...props} css={{ my: "$6", mx: "auto" }} />,
    ul: (props: any) => (
        <Apsara.Box
            {...props}
            css={{ color: "$hiContrast", pl: "1.15em", mb: "$3", listStyleType: "circle" }}
            as="ul"
        />
    ),
    ol: (props: any) => <Apsara.Box {...props} css={{ color: "$hiContrast", mb: "$3" }} as="ol" />,
    li: (props: any) => (
        <li>
            <Apsara.Paragraph {...props} />
        </li>
    ),
    strong: (props: any) => (
        <Apsara.Text {...props} css={{ display: "inline", fontSize: "inherit", fontWeight: 500 }} />
    ),
    img: ({ ...props }) => (
        <Apsara.Box css={{ my: "$6" }}>
            <Apsara.Box as="img" {...props} css={{ maxWidth: "100%", verticalAlign: "middle", ...props.css }} />
        </Apsara.Box>
    ),
    blockquote: (props: any) => (
        <Apsara.Box
            css={{
                mt: "$6",
                mb: "$5",
                pl: "$4",
                borderLeft: `1px solid $gray4`,
                color: "orange",
                "& p": {
                    fontSize: "$3",
                    color: "$gray11",
                    lineHeight: "25px",
                },
            }}
            {...props}
        />
    ),

    code: ({ className, line, ...props }: any) => {
        // if it's a codeblock (``` block in markdown), it'll have a className from prism
        return <code className={className} {...props} style={{ whiteSpace: "break-spaces" }} />;
    },
    Note: (props: any) => (
        <Apsara.Box
            as="aside"
            css={{
                mt: "$5",
                mb: "$5",
                borderRadius: "$3",
                "&, & p": {
                    fontSize: "$3",
                    color: "$slate11",
                    lineHeight: "23px",
                    margin: 0,
                },
            }}
            {...props}
        />
    ),
};

const LinkHeading = ({ id, children, css }: { id: string; children: React.ReactNode; css?: any }) => (
    <Apsara.Box css={{ ...css }}>
        <Apsara.Box
            as="a"
            href={`#${id}`}
            // data-id={id}
            css={{
                textDecoration: "none",
                color: "inherit",
                display: "inline-flex",
                alignItems: "center",

                svg: {
                    opacity: 0,
                },
                "&:hover svg": {
                    opacity: 1,
                },
            }}
        >
            {children}
            <Apsara.Box as="span" css={{ ml: "$2", color: "$slate10" }}>
                <Link2Icon aria-hidden />
            </Apsara.Box>
        </Apsara.Box>
    </Apsara.Box>
);

export const FrontmatterContext = React.createContext<Frontmatter>({} as any);

// Custom provider for next-mdx-remote
// https://github.com/hashicorp/next-mdx-remote#using-providers
export function MDXProvider(props: any) {
    const { frontmatter, children } = props;
    return <FrontmatterContext.Provider value={frontmatter}>{children}</FrontmatterContext.Provider>;
}
