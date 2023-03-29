import { Inter } from "next/font/google";
import Head from "next/head";
import { Box } from "~/components/box";
import { Button } from "~/components/button";
import { Container } from "~/components/container";
import { Flex } from "~/components/flex";
import { Grid } from "~/components/grid";
import { Heading } from "~/components/heading";
import { Paragraph } from "~/components/paragraph";
import { Section } from "~/components/section";
import { Sub } from "~/components/sub";
import { Sup } from "~/components/sup";
import { Text } from "~/components/text";
import { TextField } from "~/components/textfield";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
    return (
        <>
            <Head>
                <title>Apsara 2.0</title>
                <meta name="description" content="Generated by create next app" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Flex
                as="main"
                align="center"
                className={inter.className}
                css={{ padding: "$4", maxWidth: "1200px", margin: "auto" }}
            >
                <Box css={{ maxWidth: "800px", width: "100%" }}>
                    <Section size="3">
                        <Container size="2">
                            <Heading size="4" css={{ ta: "center", mb: "$3", color: "$gray2" }}>
                                Apsara 2.0
                            </Heading>
                            <Paragraph size="2" css={{ ta: "center", color: "$gray3" }}>
                                Apsara is an open-source, ready-to-use design system
                            </Paragraph>
                        </Container>
                    </Section>

                    <Section size="3">
                        <Container size="2">
                            <Heading id="section" css={{ mb: "$6", scrollMarginTop: "$7", color: "$gray2" }}>
                                Section
                            </Heading>
                        </Container>
                        <Flex css={{ gap: "$2", my: "$6", padding: "6rem", background: "#F2f2f2", borderRadius: "$4" }}>
                            <Section size="1" css={{ bc: "$slate4" }}>
                                <Text as="p" size="4" css={{ ta: "center" }}>
                                    Section 1
                                </Text>
                            </Section>
                            <Section size="2" css={{ bc: "$slate4", my: "$1" }}>
                                <Text as="p" size="4" css={{ ta: "center" }}>
                                    Section 2
                                </Text>
                            </Section>
                            <Section size="3" css={{ bc: "$slate4" }}>
                                <Text as="p" size="4" css={{ ta: "center" }}>
                                    Section 3
                                </Text>
                            </Section>
                        </Flex>
                    </Section>

                    <Section size="3">
                        <Container size="3">
                            <Heading id="container" css={{ mb: "$6", scrollMarginTop: "$7", color: "$gray2" }}>
                                Container
                            </Heading>
                        </Container>
                        <Flex css={{ gap: "$2", my: "$6", padding: "6rem", background: "#F2f2f2", borderRadius: "$4" }}>
                            <Container size="1">
                                <Box
                                    css={{
                                        p: "$5",
                                        border: "1px solid $slate6",
                                        borderRadius: "$3",
                                    }}
                                >
                                    <form>
                                        <TextField
                                            type="email"
                                            size="2"
                                            placeholder="Email"
                                            autoComplete="off"
                                            css={{ mb: "$3" }}
                                        />
                                        <TextField
                                            type="password"
                                            size="2"
                                            placeholder="Password"
                                            autoComplete="off"
                                            css={{ mb: "$3" }}
                                        />
                                        <Flex direction="row" css={{ ai: "center", jc: "space-between" }}>
                                            <Text size="2" css={{ color: "$slate11" }}>
                                                Forgot password
                                            </Text>
                                            <Button variant="primary">Log in</Button>
                                        </Flex>
                                    </form>
                                </Box>
                            </Container>
                            <Container size="2" css={{ my: "$9" }}>
                                <Paragraph>
                                    This is a really long paragraph of text, to demonstrate prose text, like for
                                    example, the kind you might read in a blog post. The reason we're using prose here
                                    is because the most common use case for this container size is longform text. So
                                    we're previewing some longform text here so we can make sure the container width
                                    provides an optimal line length for this font size.
                                </Paragraph>
                            </Container>
                            <Container size="3" css={{ my: "$9" }}>
                                <Grid
                                    css={{
                                        gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                                        gap: "$7",
                                    }}
                                >
                                    <Box>
                                        <Text as="p" size="4" css={{ lineHeight: "27px" }}>
                                            This is a much shorter paragraph of text, to demonstrate narrow text
                                            container. The reason we're using text here is because one common use case
                                            for this container size is a 3-up grid.
                                        </Text>
                                    </Box>
                                    <Box>
                                        <Text as="p" size="4" css={{ lineHeight: "27px" }}>
                                            This is a much shorter paragraph of text, to demonstrate narrow text
                                            container. The reason we're using text here is because one common use case
                                            for this container size is a 3-up grid.
                                        </Text>
                                    </Box>
                                </Grid>
                            </Container>
                            <Container size="4">
                                <Text as="p" size="3" css={{ ta: "center", bc: "$slate3", py: "$2" }}>
                                    No max width
                                </Text>
                            </Container>
                        </Flex>
                    </Section>
                    <Section size="3">
                        <Container size="3">
                            <Heading id="flex" css={{ mb: "$6", scrollMarginTop: "$7", color: "$gray2" }}>
                                Grid
                            </Heading>
                            <Flex
                                css={{
                                    gap: "$2",
                                    my: "$6",
                                    padding: "6rem",
                                    background: "#F2f2f2",
                                    borderRadius: "$4",
                                }}
                            >
                                <Grid columns="4" align="center" gapX="3" gapY="6">
                                    <Box css={{ height: "$9", bc: "$gray4" }}></Box>
                                    <Box css={{ height: "$7", bc: "$gray4" }}></Box>
                                    <Box css={{ height: "$7", bc: "$gray4" }}></Box>
                                    <Box css={{ height: "$7", bc: "$gray4" }}></Box>
                                    <Box css={{ height: "$7", bc: "$gray4" }}></Box>
                                    <Box css={{ height: "$7", bc: "$gray4" }}></Box>
                                    <Box css={{ height: "$7", bc: "$gray4" }}></Box>
                                </Grid>
                            </Flex>
                        </Container>
                    </Section>

                    <Section size="3">
                        <Container size="3">
                            <Heading id="text" css={{ mb: "$6", scrollMarginTop: "$7", color: "$gray2" }}>
                                Text
                            </Heading>
                            <Flex
                                css={{
                                    gap: "$2",
                                    my: "$6",
                                    padding: "6rem",
                                    background: "#F2f2f2",
                                    borderRadius: "$4",
                                }}
                            >
                                <Flex css={{ fd: "column", gap: "$4" }}>
                                    <Text size="9" as="h1" css={{ fontWeight: 500, lineHeight: "55px" }}>
                                        The quick brown fox
                                    </Text>
                                    <Text size="7" as="h3" css={{ fontWeight: 500, lineHeight: "30px" }}>
                                        The quick brown fox jumped
                                    </Text>
                                    <Text size="6" as="p" css={{ lineHeight: "30px" }}>
                                        The quick brown fox jumped over the lazy dog.
                                    </Text>
                                    <Text size="5" as="p" css={{ lineHeight: "29px" }}>
                                        The quick brown fox jumped over the lazy dog.
                                    </Text>
                                    <Text size="4" as="p" css={{ lineHeight: "29px" }}>
                                        The quick brown fox jumped over the lazy dog.
                                    </Text>
                                    <Text size="3" as="p" css={{ lineHeight: "25px" }}>
                                        The quick brown fox jumped over the lazy dog.
                                    </Text>
                                    <Text size="2" as="p" css={{ lineHeight: "20px" }}>
                                        The quick brown fox jumped over the lazy dog.
                                    </Text>
                                    <Text size="1" as="p" css={{ lineHeight: "20px" }}>
                                        The quick brown fox jumped over the lazy dog.
                                    </Text>
                                </Flex>
                            </Flex>
                        </Container>
                    </Section>

                    <Section size="3">
                        <Container size="2">
                            <Heading id="typography" css={{ mb: "$6", scrollMarginTop: "$7", color: "$gray" }}>
                                Typography
                            </Heading>
                            <Flex
                                css={{
                                    gap: "$2",
                                    my: "$6",
                                    padding: "6rem",
                                    background: "#F2f2f2",
                                    borderRadius: "$4",
                                }}
                            >
                                <Flex css={{ fd: "column", gap: "$4" }}>
                                    <Heading size="4" as="h1">
                                        This is a heading size 4
                                    </Heading>
                                    <Heading size="3" as="h1">
                                        This is a heading size 3
                                    </Heading>
                                    <Heading size="2" as="h1">
                                        This is a heading size 2
                                    </Heading>
                                    <Heading size="1" as="h1">
                                        This is a heading size 1
                                    </Heading>
                                    <Paragraph size="2">
                                        This is a Paragraph size 2. Design in the target medium. Prototype with real
                                        components. Handoff production code.
                                    </Paragraph>
                                    <Paragraph size="1">
                                        This is a Paragraph size 1. A really long paragraph of text, to demonstrate
                                        prose text, like for example, the kind you might read in a blog post. The reason
                                        we're using prose here is because the most common use case for this container
                                        size is longform text. So we're previewing some longform text here so we can
                                        make sure the container width provides an optimal line length for this font
                                        size.
                                    </Paragraph>
                                    <Paragraph>
                                        This is a Sup and Sub demo. The kind you might read in a blog post.<Sup>1</Sup>
                                        This is a really long paragraph of text, to demonstrate prose text.<Sub>1</Sub>
                                    </Paragraph>
                                </Flex>
                            </Flex>
                        </Container>
                    </Section>
                </Box>
            </Flex>
        </>
    );
}