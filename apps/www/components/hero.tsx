import { Box, Flex, Heading, Link, Section, Text } from "@odpf/apsara";

export const Hero = () => {
    return (
        <Flex css={{ minHeight: "calc(100vh - 10rem)", marginTop: "10rem" }}>
            <Box
                css={{
                    paddingLeft: "1rem",
                    paddingRight: "1rem",
                    marginLeft: "auto",
                    marginRight: "auto",
                    maxWidth: "72rem",
                }}
            >
                <Section
                    css={{
                        position: "relative",
                        paddingBottom: "2.5rem",
                        paddingTop: "5rem",
                    }}
                >
                    <Flex
                        css={{
                            display: "flex",
                            paddingLeft: "0.5rem",
                            paddingRight: "0.5rem",
                            textAlign: "center",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: "1rem",
                        }}
                    >
                        <Heading
                            
                            css={{
                                fontSize: "4.2rem",
                                lineHeight: "6rem",
                                fontWeight: "700",
                                letterSpacing: "2px"
                            }}
                        >
                            Apsara 2.0
                        </Heading>
                        <Box css={{ maxWidth: 900, marginBottom: "$5" }}>
                            <Text size="5" css={{color: "$gray11"}}>
                                Apsara is an elegant and beautiful re-usable React UI components build using Radix UI
                                and Stitches CSS-in-JS. With Apsara, you can easily create clean and powerful personal
                                sites, or quickly build modern web applications based on highly customizable design
                                system.
                            </Text>
                        </Box>
                        <Link href="/docs/primitives/overview/introduction">Getting started</Link>
                    </Flex>
                </Section>
            </Box>
        </Flex>
    );
};
