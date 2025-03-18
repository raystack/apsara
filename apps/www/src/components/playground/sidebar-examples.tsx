"use client";

import { Flex, Sidebar } from "@raystack/apsara/v1";
import { Home, Info } from "lucide-react";
import PlaygroundLayout from "./playground-layout";

export function SidebarExamples() {
  return (
    <PlaygroundLayout title="Sidebar">
      <Flex gap="large" wrap="wrap">
        <Sidebar open={false}>
          <Sidebar.Header logo={<Home />} title="Company Name" />
          <Sidebar.Main>
            <Sidebar.Item href="#" icon={<Info />} active>
              Dashboard
            </Sidebar.Item>
            <Sidebar.Item href="#" icon={<Info />} disabled>
              Settings
            </Sidebar.Item>
          </Sidebar.Main>
        </Sidebar>
        <Sidebar open={true}>
          <Sidebar.Header logo={<Home />} title="Apasara" />
          <Sidebar.Main>
            <Sidebar.Group name="Main">
              <Sidebar.Item href="#" icon={<Info />} active>
                Dashboard
              </Sidebar.Item>
              <Sidebar.Item href="#" icon={<Info />} disabled>
                Settings
              </Sidebar.Item>
            </Sidebar.Group>
            <Sidebar.Group name="Support">
              <Sidebar.Item href="#" icon={<Info />}>
                Help
              </Sidebar.Item>
            </Sidebar.Group>
          </Sidebar.Main>
          <Sidebar.Footer>
            <Sidebar.Item href="#" icon={<Info />}>
              Help
            </Sidebar.Item>
          </Sidebar.Footer>
        </Sidebar>
      </Flex>
    </PlaygroundLayout>
  );
}
