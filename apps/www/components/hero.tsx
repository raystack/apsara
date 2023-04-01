import { Box, Container, Link, Paragraph, Section, Text } from "@odpf/apsara";

export const Hero = () => {
    return (
        <Box css={{ position: "relative" }}>
            <Box
                css={{
                    position: "absolute",
                    inset: 0,
                    bc: "$slate1",
                    height: "100vh",
                    overflow: "hidden",
                    zIndex: -1,
                }}
            />
            <Section
                css={{
                    paddingTop: "$4",
                    // Starting at 850px viewport height, grow the padding top from $5 until it's $9.
                    "@media (min-width: 900px) and (min-height: 850px)": {
                        paddingTop: "min($9, calc($5 + 0.35 * (100vh - 850px)))",
                    },
                }}
            >
                <Container size="3">
                    <Box css={{ mb: "$6" }}>
                        <Text
                            as="h1"
                            size={{ "@initial": 8, "@bp1": 9 }}
                            css={{
                                color: "transparent",
                                WebkitBackgroundClip: "text",
                                backgroundImage: "radial-gradient(circle, $hiContrast, $colors$indigo12)",
                                // Use padding rather than margin, or otherwise some descenders
                                // may be clipped with WebkitBackgroundClip: 'text'
                                pb: "$4",
                                // Same issue, letters may be clipped horizontally
                                px: "$2",
                                mx: "-$2",
                                fontWeight: 500,
                                fontSize: "min(max($8, 11.2vw), $9)",
                                letterSpacing: "max(min(-0.055em, -0.66vw), -0.07em)",
                                "@media (min-width: 900px) and (min-height: 850px)": {
                                    fontSize: "80px",
                                    lineHeight: "0.85",
                                },
                            }}
                        >
                            Apsara 2.0
                        </Text>
                        <Box css={{ maxWidth: 500, mb: "$5" }}>
                            <Paragraph size="2" as="p">
                                Apsara is an open-source, ready-to-use design system
                            </Paragraph>
                        </Box>
                        <Link href="/docs/primitives/overview/introduction">Install Primitives</Link>
                    </Box>
                </Container>
            </Section>
        </Box>
    );
};
