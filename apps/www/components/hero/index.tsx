import { RocketIcon } from "@radix-ui/react-icons";
import { Badge, Button, Container, Flex, Link, Text } from "@raystack/ui";
import { useRouter } from "next/router";

export const Hero = () => {
  const router = useRouter();

  return (
    <Flex style={{ paddingTop: "calc(var(--pd-4) * 25)" }}>
      <Container size="large">
        <Flex direction="column" align="center" gap="medium">
          <Badge>
            <Link>
              <Flex>
                <RocketIcon
                  style={{
                    color: "var(--clr-fg-accent)",
                    margin: "0 var(--mr-4)",
                  }}
                />
                apsara v2 nightly is out, find out what&apos;s new 🎉
              </Flex>
            </Link>
          </Badge>
          <Container size="medium">
            <Flex
              align="center"
              justify="center"
              direction="column"
              style={{ textAlign: "center" }}
            >
              <Text
                style={{
                  fontSize: "60px",
                  lineHeight: "80px",
                  fontWeight: "bolder",
                  margin: "16px 0 32px",
                }}
              >
                The design system <br /> for next big thing
              </Text>
              <Text size={4}>
                Apsara is an elegant and beautiful re-usable React UI components
                build using Radix UI and Stitches CSS-in-JS. With Apsara, you
                can easily create clean and powerful personal sites, or quickly
                build modern web applications based on highly customizable
                design system.
              </Text>
            </Flex>
          </Container>
          <Button
            variant="primary"
            onClick={() =>
              router.push("/docs/primitives/overview/introduction")
            }
          >
            Getting started
          </Button>
        </Flex>
      </Container>
    </Flex>
  );
};
