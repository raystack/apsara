import { Box, Link, Text } from "@odpf/apsara";
import { MutableRefObject, useEffect, useState } from "react";
import styles from "./toc.module.css";

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
      style={{
        padding: "var(--pd-8)",
        marginTop: 16,
        display: headings.length === 0 ? "none" : "block",
      }}
    >
      <Text size={3} style={{ fontWeight: "bold", marginBottom: "12px" }}>
        On this page
      </Text>

      <ul style={{ listStyleType: "none", padding: 0, margin: 0 }}>
        {headings.map((heading) => {
          return (
            <Box key={heading.id} data-level={getLevel(heading.nodeName)}>
              <Link
                className={styles.link}
                href={`#${heading.id}`}
                onClick={(e) => scrollToSection(e, `#${heading.id}`)}
              >
                <Text
                  size={2}
                  style={{
                    color: "inherit",
                    lineHeight: "20px",
                  }}
                >
                  {heading.innerText}
                </Text>
              </Link>
            </Box>
          );
        })}
      </ul>
    </Box>
  );
}
