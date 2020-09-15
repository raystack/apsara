import React from "react";

import { Button } from "../src/button";
export default {
  title: "Button",
  component: Button,
};

export const Text = () => (
  <Button onClick={() => "clicked"}>Hello Button</Button>
);
