"use client";

import * as Apsara from "@raystack/apsara";
import DemoPreview from "./demo-preview";
import { DemoProps } from "./types";
import DemoPlayground from "./demo-playground";
import { Suspense } from "react";
import { Info, X, Home, Laugh } from "lucide-react";
import DataTableDemo from "../datatable-demo";
import LinearDropdownDemo from "../linear-dropdown-demo";

export default function Demo(props: DemoProps) {
  const {
    data,
    scope = {
      ...Apsara,
      DataTableDemo,
      LinearDropdownDemo,
      Info,
      X,
      Home,
      Laugh,
    },
  } = props;

  if (data.type === "code") {
    return <DemoPreview scope={scope} {...data} />;
  }

  return (
    <Suspense>
      <DemoPlayground scope={scope} {...data} />
    </Suspense>
  );
}
