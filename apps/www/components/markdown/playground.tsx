import { Tabs } from "@raystack/ui";
import dynamic from "next/dynamic";
import React, { useState } from "react";

const DynamicLive = dynamic(() => import("../live"), {
  ssr: false,
  loading: () => (
    <div
      style={{
        padding: "32px 16px",
        fontSize: "12px",
        borderRadius: "6px",
        border: "1px solid #ededed",
      }}
    >
      loading...
    </div>
  ),
});

export type Tab = {
  name: string;
  code: string;
};

export type PlaygroundProps = {
  title?: React.ReactNode | string;
  desc?: React.ReactNode | string;
  code: string;
  tabs: Tab[];
  scope: {
    [key: string]: any;
  };
};

const defaultProps = {
  code: "",
  tabs: [] as Tab[],
  scope: {},
};

const Playground: React.FC<PlaygroundProps> = React.memo(
  ({ code, tabs, scope }: PlaygroundProps & typeof defaultProps) => {
    const [visible, setVisible] = useState(false);

    if (code) {
      return (
        <div
          style={{
            borderRadius: "8px",
            border: "1px solid var(--clr-border-base)",
          }}
        >
          <DynamicLive
            code={code}
            scope={scope}
            visible={visible}
            setVisible={setVisible}
          />
        </div>
      );
    }
    return (
      <div
        style={{
          borderRadius: "8px",
          border: "1px solid var(--clr-border-base)",
        }}
      >
        <Tabs defaultValue={tabs[0]?.name}>
          <Tabs.List
            style={{
              background: "transparent",
              padding: "16px",
              gap: "12px",
              borderBottom: "1px solid var(--clr-border-base)",
            }}
          >
            {tabs.map((tab) => (
              <Tabs.Trigger value={tab.name} key={tab.name}>
                {tab.name}
              </Tabs.Trigger>
            ))}
          </Tabs.List>
          {tabs.map((tab) => (
            <Tabs.Content value={tab.name} key={tab.name}>
              <DynamicLive
                code={tab.code}
                scope={scope}
                visible={visible}
                setVisible={setVisible}
              />
            </Tabs.Content>
          ))}
        </Tabs>
      </div>
    );
  }
);

Playground.defaultProps = defaultProps;
Playground.displayName = "Playground";
export default Playground;
