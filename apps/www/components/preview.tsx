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
            p: "$4",
            mb: "$4",
            borderTopLeftRadius: "$4",
            borderTopRightRadius: "$4",
            boxShadow: "inset 0 0 0 1px $gray8",
            ...css,
        }}
    />
);
