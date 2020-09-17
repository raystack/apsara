import React from "react";
import { render } from "@testing-library/react";
import Button from "./Button";

describe("Button", () => {
  beforeEach(() => {});
  const renderComponent = () =>
    render(<Button onClick={() => {}}>Hello</Button>);

  it("default button", () => {
    const {} = renderComponent();
    expect(2).toEqual(2);
  });
});
