"use client";

import * as Apsara from "@raystack/apsara/v1";
import DemoPreview from "./demo-preview";
import { DemoProps } from "./types";
import DemoPlayground from "./demo-playground";
import { Suspense } from "react";
import { Info, X, Home, Laugh } from "lucide-react";

export default function Demo(props: DemoProps) {
  const { data, scope = { ...Apsara, Info, X, Home, Laugh } } = props;

  if (data.type === "code") {
    return <DemoPreview scope={scope} {...data} />;
  }

  return (
    <Suspense>
      <DemoPlayground scope={scope} {...data} />
    </Suspense>
  );
}
