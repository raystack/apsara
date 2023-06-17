import { Box, Link, styled, Text } from "@raystack/apsara";
import { MutableRefObject, useEffect, useState } from "react";

const QuickNavUl = styled("ul", {
  listStyleType: "none",
  padding: 0,
  margin: 0,
});

const QuickNavLink = styled(Link, {
  color: "$fgBase",
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

export function Toc({
  title,
  containerElm,
}: {
  title: string;
  containerElm: MutableRefObject<null>;
}) {
  const [headings, setHeadings] = useState<HTMLHeadingElement[]>([]);

  useEffect(() => {
    const headingElements: HTMLHeadingElement[] = Array.from(
      document.querySelectorAll("[data-heading]")
    );
    setHeadings(headingElements);
  }, [title]);

  // Function to determine the Heading Level based on `nodeName` (H2, H3, etc)
  const getLevel = (nodeName: string) => {
    return Number(nodeName.replace("H", ""));
  };

  const scrollToSection = (event: any, target: string) => {
    event.preventDefault();

    const offset = 80; // Adjust the value as per your requirement
    const targetElement = document.querySelector(target) as HTMLLinkElement;
    const targetOffsetTop = targetElement.offsetTop - offset;

    // @ts-ignore
    containerElm.current?.scrollTo({
      top: targetOffsetTop,
      behavior: "smooth",
    });
  };

  return (
    <Box
      as="nav"
      css={{
        padding: "$5",
        my: 16,
        display: headings.length === 0 ? "none" : "block",
      }}
    >
      <Text size="3" css={{ fontWeight: "bold", marginBottom: "$3" }}>
        On this page
      </Text>

      <QuickNavUl>
        {headings.map((heading) => {
          return (
            <Box
              as="li"
              key={heading.id}
              data-level={getLevel(heading.nodeName)}
            >
              <QuickNavLink
                href={`#${heading.id}`}
                onClick={(e) => scrollToSection(e, `#${heading.id}`)}
              >
                <QuickNavText size="2">{heading.innerText}</QuickNavText>
              </QuickNavLink>
            </Box>
          );
        })}
      </QuickNavUl>
    </Box>
  );
}
