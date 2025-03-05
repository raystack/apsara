"use client";

import { useState } from "react";
import {
  useSearchParams,
  useRouter,
  ReadonlyURLSearchParams,
} from "next/navigation";
import { LiveProvider } from "react-live";
import styles from "./styles.module.css";
import DemoControls from "./demo-controls";
import Preview from "../preview";
import Editor from "../editor";
import {
  ComponentPropsType,
  ControlsType,
  DemoPlaygroundProps,
  PropChangeHandlerType,
} from "./types";

const getInitialProps = (
  controls: ControlsType,
  searchParams: ReadonlyURLSearchParams,
) => {
  const initialProps: ComponentPropsType = {};

  Object.keys(controls).forEach(key => {
    const { type, initialValue, defaultValue } = controls[key];
    const value = searchParams.get(key) ?? initialValue ?? defaultValue;

    initialProps[key] = type === "checkbox" ? value === "true" : value;
  });
  return initialProps;
};

export default function DemoPlayground({
  scope,
  controls,
  getCode,
}: DemoPlaygroundProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [componentProps, setComponentProps] = useState(() =>
    getInitialProps(controls, searchParams),
  );

  const updatedProps = Object.fromEntries(
    Object.entries(componentProps).filter(
      ([key, value]) => value !== controls[key]?.defaultValue,
    ),
  );
  const code = getCode(updatedProps, componentProps).trim();

  const handlePropChange: PropChangeHandlerType = (prop, value) => {
    const updatedComponentProps = { ...componentProps, [prop]: value };
    const params = new URLSearchParams();

    setComponentProps({ ...componentProps, [prop]: value });

    Object.entries(updatedComponentProps).forEach(([key, val]) => {
      const { defaultValue, initialValue, type } = controls[key];

      if (val !== defaultValue && val !== initialValue) {
        params.set(key, String(val));
      }
    });
    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <LiveProvider code={code} scope={scope} disabled>
      <div className={styles.container}>
        <div className={styles.preview}>
          <Preview />
          <DemoControls
            controls={controls}
            componentProps={componentProps}
            onPropChange={handlePropChange}
          />
        </div>
        <Editor />
      </div>
    </LiveProvider>
  );
}
