import React from "react";
import { render } from "@testing-library/react";
import Button from "./Button";

describe("Button", () => {
    // beforeEach(() => {});
    const renderComponent = () => render(<Button>Hello</Button>);

    it("default button", () => {
        // eslint-disable-next-line no-empty-pattern
        const {} = renderComponent();
        expect(2).toEqual(2);
    });
});
