import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
    Avatar,
    Box,
    Code,
    Flex,
    Heading,
    Kbd,
    Link,
    Paragraph,
    Separator,
    Text,
} from "@odpf/apsara";
import { Link2Icon } from "@radix-ui/react-icons";
import * as React from "react";
import { Frontmatter } from "~/types/frontmatter";

export const components = {
    h1: (props: any) => (
        <Text
            {...props}
            as="h1"
            size="8"
            css={{ scrollMarginTop: "$9", fontWeight: 500, mb: "$2", lineHeight: "40px" }}
        />
    ),
    Description: ({ children, ...props }: any) => {
        // takes the text even if it's wrapped in `<p>`
        // https://github.com/wooorm/xdm/issues/47
        const childText = typeof children === "string" ? children : children.props.children;
        return (
            <Paragraph size="2" {...props} as="p" css={{ mt: "$2", mb: "$7" }}>
                {childText}
            </Paragraph>
        );
    },
    h2: ({ children, id, ...props }: any) => {
        return (
            <LinkHeading id={id} css={{ mt: "$7", mb: "$2" }}>
                <Heading size="2" {...props} id={id} as={"h2" as any} css={{ scrollMarginTop: "$9" }} data-heading>
                    {children}
                </Heading>
            </LinkHeading>
        );
    },
    h3: ({ children, id, ...props }: any) => (
        <LinkHeading id={id} css={{ mt: "$7", mb: "$1" }}>
            <Heading {...props} id={id} as={"h3" as any} css={{ scrollMarginTop: "$9" }} data-heading>
                {children}
            </Heading>
        </LinkHeading>
    ),
    h4: (props: any) => (
        <Text
            as="h4"
            {...props}
            size="4"
            css={{ scrollMarginTop: "$9", mb: "$3", lineHeight: "27px", fontWeight: 500 }}
        />
    ),
    p: (props: any) => <Paragraph {...props} css={{ mb: "$3" }} as="p" />,
    a: ({ href = "", ...props }) => {
        if (href.startsWith("http")) {
            return (
                <Link
                    {...props}
                    variant="blue"
                    href={href}
                    css={{ fontSize: "inherit" }}
                    target="_blank"
                    rel="noopener"
                />
            );
        }
        return <Link href={href} {...props} css={{ color: "inherit", fontSize: "inherit" }} />;
    },
    hr: (props: any) => <Separator size="2" {...props} css={{ my: "$6", mx: "auto" }} />,
    ul: (props: any) => (
        <Box {...props} css={{ color: "$hiContrast", pl: "1.15em", mb: "$3", listStyleType: "circle" }} as="ul" />
    ),
    ol: (props: any) => <Box {...props} css={{ color: "$hiContrast", mb: "$3" }} as="ol" />,
    li: (props: any) => (
        <li>
            <Paragraph {...props} />
        </li>
    ),
    strong: (props: any) => <Text {...props} css={{ display: "inline", fontSize: "inherit", fontWeight: 500 }} />,
    img: ({ ...props }) => (
        <Box css={{ my: "$6" }}>
            <Box as="img" {...props} css={{ maxWidth: "100%", verticalAlign: "middle", ...props.css }} />
        </Box>
    ),
    blockquote: (props: any) => (
        <Box
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
        const isInlineCode = !className;
        return isInlineCode ? (
            <Code className={className} {...props} css={{ whiteSpace: "break-spaces" }} />
        ) : (
            <code className={className} {...props} data-invert-line-highlight={line !== undefined} />
        );
    },
    Note: (props: any) => (
        <Box
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
    Alert: (props: any) => (
        <Box
            as="aside"
            css={{
                display: "block",
                my: "$6",
                py: "$2",
                px: "$5",
                borderRadius: "$3",
                bc: "$yellow2",
                boxShadow: "0 0 0 1px $colors$yellow5",
                "&, & p": {
                    fontSize: "$3",
                    color: "$yellow11",
                    lineHeight: "23px",
                },
                "& p": { margin: 0 },
            }}
            {...props}
        />
    ),

    Kbd: Kbd,
    Code: Code,
    Flex: Flex,
    Text: Text,
    Avatar: Avatar,
    Accordion: Accordion,
    AccordionItem: AccordionItem,
    AccordionTrigger: AccordionTrigger,
    AccordionContent: AccordionContent,
};

const LinkHeading = ({ id, children, css }: { id: string; children: React.ReactNode; css?: any }) => (
    <Box css={{ ...css }}>
        <Box
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
            <Box as="span" css={{ ml: "$2", color: "$slate10" }}>
                <Link2Icon aria-hidden />
            </Box>
        </Box>
    </Box>
);

export const FrontmatterContext = React.createContext<Frontmatter>({} as any);

// Custom provider for next-mdx-remote
// https://github.com/hashicorp/next-mdx-remote#using-providers
export function MDXProvider(props: any) {
    const { frontmatter, children } = props;
    return <FrontmatterContext.Provider value={frontmatter}>{children}</FrontmatterContext.Provider>;
}
