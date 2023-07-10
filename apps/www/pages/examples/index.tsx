import { Container } from "@odpf/apsara";
import { Shield } from "@raystack/shield-ts";

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
          border: "2px solid var(--border-base)",
          borderRadius: "var(--pd-8)",
          marginTop: "var(--mr-16)",
        }}
      >
        <Shield />
      </Container>
    </>
  );
}
