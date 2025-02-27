import { Link2Icon } from "@radix-ui/react-icons";
import * as Apsara from "@raystack/apsara";
import * as ApsaraV1 from "@raystack/apsara/v1";
import * as React from "react";
import { LiveProvider } from "react-live";
import { Frontmatter } from "~/types/frontmatter";
import { Assets } from "../datatable/datatable";
import Icons from "../icons/icons";
import { Attributes } from "./attributes";
import LiveEditor from "./live-editor";
import Playground from "./playground";
import { Preview } from "./preview";

export const components = {
  ...Apsara, // Todo: remove this once we fully migrate to Apsara v1
  ...ApsaraV1,
  ...Icons,
  DataTable: Assets,
  Attributes: Attributes,
  Preview: Preview,
  LiveProvider: LiveProvider,
  LiveEditor: LiveEditor,
  Playground: Playground,
  pre: (props: any) => <Apsara.Text {...props} size="4" />,
  Description: ({ children, ...props }: any) => {
    // takes the text even if it's wrapped in `<p>`
    // https://github.com/wooorm/xdm/issues/47
    const childText =
      typeof children === "string" ? children : children.props.children;
    return (
      <Apsara.Text
        {...props}
        size={4}
        style={{ marginTop: "var(--mr-8)", marginBottom: "var(--mr-8)" }}
      >
        {childText}
      </Apsara.Text>
    );
  },
  h1: (props: any) => <Apsara.Headline {...props} />,
  h2: ({ children, id, ...props }: any) => {
    return (
      <LinkHeading
        id={id}
        css={{ marginTop: "var(--mr-32)", marginBottom: "var(--mr-8)" }}
      >
        <Apsara.Title
          size="large"
          {...props}
          id={id}
          style={{ scrollMarginTop: "36px" }}
          data-heading
        >
          {children}
        </Apsara.Title>
      </LinkHeading>
    );
  },
  h3: ({ children, id, ...props }: any) => (
    <LinkHeading
      id={id}
      css={{ marginTop: "var(--mr-16)", marginBottom: "4px" }}
    >
      <Apsara.Title
        size="medium"
        {...props}
        id={id}
        style={{ scrollMarginTop: "36px" }}
        data-heading
      >
        {children}
      </Apsara.Title>
    </LinkHeading>
  ),
  h4: (props: any) => <Apsara.Title size="small" {...props} />,
  a: ({ href = "", ...props }) => {
    if (href.startsWith("http")) {
      return (
        <Apsara.Link
          {...props}
          href={href}
          style={{ fontSize: "inherit" }}
          target="_blank"
          rel="noopener"
        />
      );
    }
    return (
      <Apsara.Link
        href={href}
        {...props}
        style={{ color: "inherit", fontSize: "inherit" }}
      />
    );
  },
  p: (props: any) => (
    <Apsara.Text
      size="4"
      {...props}
      style={{ lineHeight: 1.5, margin: "var(--mr-8) 0" }}
    />
  ),
  hr: (props: any) => (
    <Apsara.Separator
      size="2"
      {...props}
      style={{ margin: "0 30px", mx: "auto" }}
    />
  ),
  ul: (props: any) => (
    <ul
      {...props}
      style={{
        paddingLeft: "1.15em",
        marginBottom: "12px",
        listStyleType: "circle",
      }}
    />
  ),
  ol: (props: any) => <ol {...props} css={{ marginBottom: "12px" }} />,
  li: (props: any) => (
    <li>
      <Apsara.Text {...props} />
    </li>
  ),
  strong: (props: any) => (
    <Apsara.Text {...props} style={{ display: "inline", fontWeight: 500 }} />
  ),
  img: ({ ...props }) => (
    <Apsara.Box style={{ margin: "30px 0" }}>
      <Apsara.Image {...props} />
    </Apsara.Box>
  ),

  code: ({ className, line, ...props }: any) => {
    return (
      <code
        className={className}
        {...props}
        style={{ whiteSpace: "break-spaces" }}
      />
    );
  },
};

const LinkHeading = ({
  id,
  children,
  css,
}: {
  id: string;
  children: React.ReactNode;
  css?: any;
}) => (
  <Apsara.Box style={{ ...css }}>
    <Apsara.Link
      href={`#${id}`}
      data-id={id}
      style={{
        textDecoration: "none",
        color: "inherit",
        display: "inline-flex",
        alignItems: "center",
      }}
    >
      {children}
      <Apsara.Box style={{ marginLeft: "8px" }}>
        <Link2Icon aria-hidden />
      </Apsara.Box>
    </Apsara.Link>
  </Apsara.Box>
);

export const FrontmatterContext = React.createContext<Frontmatter>({} as any);

// Custom provider for next-mdx-remote
// https://github.com/hashicorp/next-mdx-remote#using-providers
export function MDXProvider(props: any) {
  const { frontmatter, children } = props;
  return (
    <FrontmatterContext.Provider value={frontmatter}>
      {children}
    </FrontmatterContext.Provider>
  );
}
