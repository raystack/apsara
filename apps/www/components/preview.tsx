import { Container, Flex } from "@odpf/apsara";

type PreviewProps = React.ComponentProps<typeof Container>;
export const Preview = ({ css, ...props }: PreviewProps) => (
    <Flex
        {...props}
        data-preview
        align="center"
        justify="center"
        css={{
            pt: "120px",
            pb: "120px",
            mb: "$10",
            borderRadius: "$4",
            border: "1px dashed #d3d7df",
            boxShadow: "inset 0 0 0 1px $gray8",
            background: "url(/dot.svg)",
            ...css,
        }}
    />
);
