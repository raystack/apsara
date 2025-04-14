"use client";
import {
  Button,
  Flex,
  Sidebar,
  Text,
  IconButton,
  Search,
  Select,
  TextArea,
  RangePicker,
  Callout,
  DatePicker,
  Spinner,
  DropdownMenu,
  Dialog,
  Avatar,
  AvatarGroup,
  Tooltip,
  InputField,
  Popover,
  Indicator,
  Sheet,
} from "@raystack/apsara/v1";
import React, { useState } from "react";
import {
  BellIcon,
  FilterIcon,
  OrganizationIcon,
  SidebarIcon,
} from "@raystack/apsara/icons";

function getRandomSize(min = 200, max = 700) {
  const width = Math.floor(Math.random() * (max - min + 1)) + min;
  const height = Math.floor(Math.random() * (max - min + 1)) + min;
  return { width, height };
}

const Content = () => (
  <Flex
    direction="column"
    gap="medium"
    style={{
      width: getRandomSize().width,
      padding: 8,
    }}>
    <Button>Test</Button>
    <Text>This is the dialog content. </Text>
    <Text size="small">Team Members:</Text>
    <AvatarGroup>
      <Avatar size={5} color="indigo" fallback="JD" />
      <Avatar size={5} color="mint" fallback="AS" />
      <Avatar size={5} color="sky" fallback="RK" />
      <Avatar size={5} color="purple" fallback="+2" />
    </AvatarGroup>

    <Flex direction="column" gap={2}>
      <Text size="small">Quick Actions:</Text>
      <Tooltip message="Click to send a message to all team members" side="top">
        <Button variant="solid" color="accent">
          Show hover tooltip
        </Button>
      </Tooltip>
    </Flex>

    <Text size="small">Team Role:</Text>
    <Select>
      <Select.Trigger>
        <Select.Value placeholder="Select a role" />
      </Select.Trigger>
      <Select.Content>
        <Select.Item value="admin">Administrator</Select.Item>
        <Select.Item value="editor">Editor</Select.Item>
        <Select.Item value="viewer">Viewer</Select.Item>
        <Select.Item value="member">Member</Select.Item>
      </Select.Content>
    </Select>

    <Flex gap="medium" wrap="wrap">
      <Popover>
        <Popover.Trigger asChild>
          <Button>Popover</Button>
        </Popover.Trigger>
        <Popover.Content
          style={{ width: "fit-content", maxHeight: 300, overflow: "scroll" }}>
          <Content />
        </Popover.Content>
      </Popover>

      <Dialog>
        <Dialog.Trigger asChild>
          <Button>Basic Dialog</Button>
        </Dialog.Trigger>
        <Dialog.Content
          width="max-content"
          ariaLabel="Basic Dialog"
          ariaDescription="A simple dialog example">
          <Dialog.Header>
            <Dialog.Title>A simple dialog example</Dialog.Title>
            <Dialog.CloseButton />
          </Dialog.Header>
          <Dialog.Body>
            <Content />
          </Dialog.Body>
          <Dialog.Footer>
            <Button>OK</Button>
            <Dialog.Close asChild>
              <Button color="neutral">Cancel</Button>
            </Dialog.Close>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog>
      <DropdownMenu>
        <DropdownMenu.Trigger asChild>
          <Button variant="outline">Open Menu</Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Label>Team Actions</DropdownMenu.Label>
          <Tooltip message="Add a new member to your team" side="right">
            <DropdownMenu.Item>Add Member</DropdownMenu.Item>
          </Tooltip>
          <DropdownMenu.Item>Edit Team</DropdownMenu.Item>
          <DropdownMenu.Separator />
          <DropdownMenu.Group>
            <DropdownMenu.Label>Settings</DropdownMenu.Label>
            <DropdownMenu.Item>Permissions</DropdownMenu.Item>
            <DropdownMenu.Item>Notifications</DropdownMenu.Item>
          </DropdownMenu.Group>
          <DropdownMenu.Separator />
          <DropdownMenu.Item color="danger">Delete Team</DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu>
    </Flex>
    <Flex gap="medium" wrap="wrap">
      <Sheet>
        <Sheet.Trigger asChild>
          <Button>Sheet</Button>
        </Sheet.Trigger>
        <Sheet.Content close style={{ width: "fit-content" }}>
          <Sheet.Title>Sheet</Sheet.Title>
          <Content />
        </Sheet.Content>
      </Sheet>
    </Flex>

    <TextArea label="Example Text Area" placeholder="Type something..." />
  </Flex>
);
const Page = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <Flex
      style={{
        height: "calc(100vh - 60px)",
        backgroundColor: "var(--rs-color-background-base-primary)",
      }}>
      <Sidebar
        open={sidebarOpen}
        onOpenChange={setSidebarOpen}
        onClick={e => {
          if (e.target === e.currentTarget) {
            setSidebarOpen(!sidebarOpen);
          }
        }}>
        <Sidebar.Header
          logo={<BellIcon width={24} height={24} />}
          title="Raystack"
          onLogoClick={() => console.log("Logo clicked")}
        />

        <Sidebar.Main>
          <Sidebar.Item href="#" icon={<BellIcon />} active>
            Dashboard
          </Sidebar.Item>

          <Sidebar.Item href="#" icon={<BellIcon />}>
            Analytics
          </Sidebar.Item>

          <Sidebar.Group name="Resources">
            <Sidebar.Item href="#" icon={<FilterIcon />}>
              Reports
            </Sidebar.Item>

            <Sidebar.Item href="#" icon={<FilterIcon />}>
              Activities
            </Sidebar.Item>
          </Sidebar.Group>

          <Sidebar.Group name="Account">
            <Sidebar.Item href="#" icon={<FilterIcon />}>
              Settings
            </Sidebar.Item>

            <Sidebar.Item href="#" icon={<BellIcon />}>
              Notifications
            </Sidebar.Item>
          </Sidebar.Group>
        </Sidebar.Main>

        <Sidebar.Footer>
          <Sidebar.Item href="#" icon={<OrganizationIcon />}>
            Help & Support
          </Sidebar.Item>

          <Sidebar.Item href="#" icon={<SidebarIcon />}>
            Preferences
          </Sidebar.Item>
        </Sidebar.Footer>
      </Sidebar>

      <Flex
        direction="column"
        style={{
          padding: "32px",
          flex: 1,
          overflow: "auto",
        }}>
        <Content />
      </Flex>
    </Flex>
  );
};

export default Page;
