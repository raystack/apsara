import { Shield } from "@raystack/shield-ts";
import { Container } from "@raystack/ui";

export default function ShieldExample() {
  return (
    <>
      <Container
        size="large"
        style={{
          padding: 0,
          height: "calc(100vh - 120px)",
          margin: "30px auto",
          fontSize: "var(--fs-200)",
          border: "2px solid var(--clr-border-base)",
          borderRadius: "var(--pd-8)",
          marginTop: "var(--mr-16)",
        }}
      >
        <Shield />
      </Container>
    </>
  );
}
