import { Container, Flex } from "@raystack/ui";

type PreviewProps = React.ComponentProps<typeof Container>;
export const Preview = ({ ...props }: PreviewProps) => (
  <Flex
    {...props}
    data-preview
    align="center"
    justify="center"
    style={{
      minHeight: "280px",
      padding: "120px 60px",
      marginBottom: "40px",
      borderRadius: "16px",
      border: "1px dashed var(--clr-border-base)",
      boxShadow: "var(--shadow-xs)",
      background: "url(/dot.svg)",
    }}
  />
);
