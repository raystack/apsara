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
} from "@raystack/apsara/v1";
import React, { useState } from "react";
import {
  BellIcon,
  FilterIcon,
  OrganizationIcon,
  SidebarIcon,
} from "@raystack/apsara/icons";
import styles from "@/styles/Select.module.css";

const Page = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [search1, setSearch1] = useState("");
  const [search2, setSearch2] = useState("");
  const [search3, setSearch3] = useState("");
  const [search4, setSearch4] = useState("");
  const [selectValue, setSelectValue] = useState("");
  const [selectValue1, setSelectValue1] = useState("");
  const [selectValue2, setSelectValue2] = useState("");
  const [inputValue, setInputValue] = useState("");

  // Sample options data with icons
  const selectOptions = [
    { value: "dashboard", label: "Dashboard", icon: <BellIcon /> },
    { value: "analytics", label: "Analytics", icon: <FilterIcon /> },
    { value: "settings", label: "Settings", icon: <OrganizationIcon /> },
    { value: "profile", label: "Profile", icon: <SidebarIcon /> },
  ];

  const filterOptions = [
    { value: "Option 1", label: "Option 1", icon: <BellIcon /> },
    { value: "Option 2", label: "Option 2", icon: <FilterIcon /> },
    { value: "Option 3", label: "Option 3", icon: <OrganizationIcon /> },
  ];

  const getSelectedIcon = (value: any) => {
    const option = selectOptions.find(opt => opt.value === value);
    return option ? option.icon : null;
  };
  const [textArea1, setTextArea1] = useState("");
  const [textArea2, setTextArea2] = useState("");

  return (
    <Flex
      justify="center"
      align="start"
      style={{ height: "100vh", paddingTop: 80 }}
      gap="large">
      <DropdownMenu autocomplete>
        <DropdownMenu.Trigger asChild>
          <Button color="neutral">Dropdown button</Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
          {/* <DropdownMenu.Group> */}
          <DropdownMenu.Item>Assign member...</DropdownMenu.Item>
          <DropdownMenu.Item>Subscribe...</DropdownMenu.Item>
          <DropdownMenu.Item>Rename...</DropdownMenu.Item>
          {/* </DropdownMenu.Group> */}
          <DropdownMenu.Separator />
          <DropdownMenu.Label>Actions</DropdownMenu.Label>
          <DropdownMenu.SubMenu autocomplete>
            <DropdownMenu.SubMenuTrigger>Export</DropdownMenu.SubMenuTrigger>
            <DropdownMenu.SubMenuContent>
              <DropdownMenu.Item>All (.zip)</DropdownMenu.Item>
              <DropdownMenu.SubMenu autocomplete>
                <DropdownMenu.SubMenuTrigger>CSV</DropdownMenu.SubMenuTrigger>
                <DropdownMenu.SubMenuContent>
                  <DropdownMenu.Item>All</DropdownMenu.Item>
                  <DropdownMenu.Item>3 Months</DropdownMenu.Item>
                  <DropdownMenu.Item>6 Months</DropdownMenu.Item>
                </DropdownMenu.SubMenuContent>
              </DropdownMenu.SubMenu>
              <DropdownMenu.SubMenu>
                <DropdownMenu.SubMenuTrigger>PDF</DropdownMenu.SubMenuTrigger>
                <DropdownMenu.SubMenuContent>
                  <DropdownMenu.Item>All</DropdownMenu.Item>
                  <DropdownMenu.Item>3 Months</DropdownMenu.Item>
                  <DropdownMenu.Item>6 Months</DropdownMenu.Item>
                </DropdownMenu.SubMenuContent>
              </DropdownMenu.SubMenu>
            </DropdownMenu.SubMenuContent>
          </DropdownMenu.SubMenu>
          <DropdownMenu.Item disabled>Copy</DropdownMenu.Item>
          <DropdownMenu.Item
            trailingIcon={
              <Text size="micro" variant="secondary">
                ⌘⇧D
              </Text>
            }>
            Delete...
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu>
      <DropdownMenu>
        <DropdownMenu.Trigger asChild>
          <Button color="neutral">Dropdown button</Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
          {/* <DropdownMenu.Group> */}
          <DropdownMenu.Item>Assign member...</DropdownMenu.Item>
          <DropdownMenu.Item>Subscribe...</DropdownMenu.Item>
          <DropdownMenu.Item>Rename...</DropdownMenu.Item>
          {/* </DropdownMenu.Group> */}
          <DropdownMenu.Separator />
          <DropdownMenu.Label>Actions</DropdownMenu.Label>
          <DropdownMenu.SubMenu autocomplete>
            <DropdownMenu.SubMenuTrigger>Export</DropdownMenu.SubMenuTrigger>
            <DropdownMenu.SubMenuContent>
              <DropdownMenu.Item>All (.zip)</DropdownMenu.Item>
              <DropdownMenu.SubMenu autocomplete>
                <DropdownMenu.SubMenuTrigger>CSV</DropdownMenu.SubMenuTrigger>
                <DropdownMenu.SubMenuContent>
                  <DropdownMenu.Item>All</DropdownMenu.Item>
                  <DropdownMenu.Item>3 Months</DropdownMenu.Item>
                  <DropdownMenu.Item>6 Months</DropdownMenu.Item>
                </DropdownMenu.SubMenuContent>
              </DropdownMenu.SubMenu>
              <DropdownMenu.SubMenu>
                <DropdownMenu.SubMenuTrigger>PDF</DropdownMenu.SubMenuTrigger>
                <DropdownMenu.SubMenuContent>
                  <DropdownMenu.Item>All</DropdownMenu.Item>
                  <DropdownMenu.Item>3 Months</DropdownMenu.Item>
                  <DropdownMenu.Item>6 Months</DropdownMenu.Item>
                </DropdownMenu.SubMenuContent>
              </DropdownMenu.SubMenu>
            </DropdownMenu.SubMenuContent>
          </DropdownMenu.SubMenu>
          <DropdownMenu.Item disabled>Copy</DropdownMenu.Item>
          <DropdownMenu.Item
            trailingIcon={
              <Text size="micro" variant="secondary">
                ⌘⇧D
              </Text>
            }>
            Delete...
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu>
    </Flex>
  );
};

export default Page;
