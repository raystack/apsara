import { Box, Heading, Link, styled, Text } from "@odpf/apsara";
import { useEffect, useState } from "react";

const QuickNavUl = styled("ul", {
    listStyleType: "none",
    p: 0,
    m: 0,
});

const QuickNavLink = styled(Link, {
    color: "$slate11",
    display: "inline-flex",
    my: "$1",

    '[data-level="2"] ~ [data-level="3"] &': {
        marginLeft: "$5",
    },
});
const QuickNavText = styled(Text, {
    color: "inherit",
    lineHeight: "20px",
});

export function Toc() {
    const [headings, setHeadings] = useState<HTMLHeadingElement[]>([]);

    useEffect(() => {
        const headingElements: HTMLHeadingElement[] = Array.from(document.querySelectorAll("[data-heading]"));
        setHeadings(headingElements);
    }, []);

    // Function to determine the Heading Level based on `nodeName` (H2, H3, etc)
    const getLevel = (nodeName: string) => {
        return Number(nodeName.replace("H", ""));
    };

    return (
        <Box
            as="nav"
            css={{
                padding: "$5",
                py: 68,
                display: headings.length === 0 ? "none" : "block",
            }}
        >
            <Heading css={{ mb: "$3" }}>Quick nav</Heading>

            <QuickNavUl>
                {headings.map((heading) => {
                    return (
                        <Box as="li" key={heading.id} data-level={getLevel(heading.nodeName)}>
                            <QuickNavLink variant="subtle" href={`#${heading.id}`}>
                                <QuickNavText size="2">{heading.innerText}</QuickNavText>
                            </QuickNavLink>
                        </Box>
                    );
                })}
            </QuickNavUl>
        </Box>
    );
}
