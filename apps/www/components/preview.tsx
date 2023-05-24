import { Container } from "@odpf/apsara";

type PreviewProps = React.ComponentProps<typeof Container>;
export const Preview = ({ css, ...props }: PreviewProps) => (
    <Container
        {...props}
        data-preview
        css={{
            position: "relative",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
            pt: "100px",
            pb: "100px",
            borderTopLeftRadius: "$4",
            borderTopRightRadius: "$4",
            boxShadow: "inset 0 0 0 1px $gray8",
            background: "url(/dot.svg)",
            ...css,
        }}
    />
);
