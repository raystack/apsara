"use client";

import * as Apsara from "@raystack/apsara/v1";
import DemoPreview from "./demo-preview";
import { DemoProps } from "./types";
import DemoPlayground from "./demo-playground";

export default function Demo(props: DemoProps) {
  const { data, scope = Apsara } = props;

  if (data.type === "code") {
    return <DemoPreview scope={scope} {...data} />;
  }

  return <DemoPlayground scope={scope} {...data} />;
}
