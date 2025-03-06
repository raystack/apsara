import React, { useState } from "react";
import {
  BellIcon,
  BookmarkFilledIcon,
  DotsVerticalIcon,
  GitHubLogoIcon,
  GlobeIcon,
  HomeIcon,
  ImageIcon,
  InfoCircledIcon,
  LapTimerIcon,
  LinkedInLogoIcon,
  MaskOnIcon,
  TimerIcon,
} from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import { Flex, Image, Sidebar } from "@raystack/apsara/v1";
import { Assets } from "./assets";

import "@raystack/apsara/style.css";

export const Shield = () => {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <>
      <Flex style={{ height: "100vh" }}>
        <div style={{ position: 'relative' }}>
          <Sidebar
            open={sidebarOpen} 
            onOpenChange={setSidebarOpen} 
            position="left"
            profile={{
              icon: <DotsVerticalIcon />,
              label: "john.doe@apsara.com",
              href: "#"
            }}
          >
            <Sidebar.Header
              logo={<Image radius="small" src="/thenorthface-logo.svg" width={24} height={24} />} 
              title="THE NORTH FACE"
              onLogoClick={() => console.log("Logo clicked")}
            />
            <Sidebar.Main>
              <Sidebar.Group name="Navigation" className="">
                <Sidebar.Item href="#" icon={<GitHubLogoIcon />} active>Explore</Sidebar.Item>
                <Sidebar.Item href="#" icon={<ImageIcon />}>AOIs</Sidebar.Item>
                <Sidebar.Item href="#" icon={<BookmarkFilledIcon />}>Workflows</Sidebar.Item>
                <Sidebar.Item href="#" icon={<MaskOnIcon />}>Marketplace</Sidebar.Item>
                <Sidebar.Item href="#" icon={<LinkedInLogoIcon />}>Activity</Sidebar.Item>
              </Sidebar.Group>
            </Sidebar.Main>
            <Sidebar.Footer>
              <Sidebar.Group name="Help & Support">
                <Sidebar.Item href="#" icon={<GlobeIcon />}>Feedback</Sidebar.Item>
                <Sidebar.Item href="#" icon={<LapTimerIcon />}>Support</Sidebar.Item>
                <Sidebar.Item href="#" icon={<InfoCircledIcon />}>Documentation</Sidebar.Item>
              </Sidebar.Group>
            </Sidebar.Footer>
          </Sidebar>
          
          {/* <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{ 
              position: 'absolute',
              top: '16px',
              right: '-12px',
              height: '24px',
              cursor: 'pointer',
              background: 'var(--rs-color-background-base-primary)',
              border: '1px solid var(--rs-color-border-base-primary)',
              borderRadius: 'var(--rs-radius-2)',
              padding: '4px 8px',
              zIndex: 1
            }}
          >
             
          </button> */}
        </div>

        <Flex style={{ flex: 1, width: "100%", overflow: "auto" }}>
          <Assets />
        </Flex>
      </Flex>
    </>
  );
};
