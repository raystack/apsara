import { Container } from "@raystack/apsara";
import { Shield } from "../../examples/shield-ts";

export default function ShieldExample() {
  return (
    <>
      <Container
        size="none"
        style={{
          padding: 0,
          height: "calc(100vh - 75px)",
          fontSize: "var(--fs-200)",
        }}
      >
        <Shield />
      </Container>
    </>
  );
}
