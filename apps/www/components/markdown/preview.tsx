import { Container, Flex } from "@raystack/apsara";

type PreviewProps = React.ComponentProps<typeof Container>;
export const Preview = ({ ...props }: PreviewProps) => (
  <Flex
    {...props}
    data-preview
    align="center"
    justify="center"
    style={{
      padding: "120px 60px",
      marginBottom: "40px",
      borderRadius: "16px",
      border: "1px dashed var(--border-base)",
      boxShadow: "var(--shadow-xs)",
      background: "url(/dot.svg)",
    }}
  />
);
