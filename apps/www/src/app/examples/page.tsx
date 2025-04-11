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
    { value: "Option 3", label: "Option 3", icon: <OrganizationIcon /> }
  ];

  const getSelectedIcon = (value: any) => {
    const option = selectOptions.find(opt => opt.value === value);
    return option ? option.icon : null;
  };
  const [textArea1, setTextArea1] = useState("");
  const [textArea2, setTextArea2] = useState("");

  return (
    <Flex
      style={{
        height: "calc(100vh - 60px)",
        backgroundColor: "var(--rs-color-background-base-primary)",
      }}
    >
      <Sidebar
        open={sidebarOpen}
        onOpenChange={setSidebarOpen}
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            setSidebarOpen(!sidebarOpen);
          }
        }}
      >
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
        }}
      >
        <IconButton
          size={4}
          aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          style={{ marginBottom: "16px" }}
        >
          <SidebarIcon />
        </IconButton>

        <Text size="large" weight="medium" style={{ marginBottom: "24px" }}>
          Main
        </Text>

        <Flex direction="column" gap={4} style={{ maxWidth: "150px" }}>
          <Search
            placeholder="Default large search"
            showClearButton
            value={search1}
            label="Search"
            helperText="This is a helper text"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSearch1(e.target.value)
            }
            onClear={() => setSearch1("")}
          />
          
          <RangePicker />

          <DatePicker />

          <RangePicker />

          <Text size="large" weight="medium" style={{ marginTop: "32px", marginBottom: "16px" }}>
            Spinner Examples
          </Text>

          <Flex direction="column" gap={4}>
            <Flex gap={4} align="center">
              <Spinner size={3} color="default" />
              <Spinner size={3} color="inverted" />
              <Spinner size={3} color="accent" />
              <Spinner size={3} color="danger" />
              <Spinner size={3} color="success" />
              <Spinner size={3} color="attention" />
            </Flex>
          </Flex>

          <Text size="large" weight="medium" style={{ marginTop: "32px", marginBottom: "16px" }}>
            Button Loading States Examples
          </Text>

          <Flex direction="column" gap={6}>
            {/* Solid Variant */}
            <Flex direction="column" gap={3}>
              <Text weight="medium">Solid Variant (Inverted Spinner)</Text>
              <Flex gap={4} align="center">
                <Button variant="solid" color="accent" loading>
                  Loading
                </Button>
                <Button variant="solid" color="danger" loading>
                  Loading
                </Button>
                <Button variant="solid" color="success" loading>
                  Loading
                </Button>
              </Flex>
            </Flex>

            {/* Outline Variant */}
            <Flex direction="column" gap={3}>
              <Text weight="medium">Outline Variant (Matching Color Spinner)</Text>
              <Flex gap={4} align="center">
                <Button variant="outline" color="accent" loading>
                  Loading
                </Button>
                <Button variant="outline" color="danger" loading>
                  Loading
                </Button>
                <Button variant="outline" color="success" loading>
                  Loading
                </Button>
              </Flex>
            </Flex>

            {/* Ghost Variant */}
            <Flex direction="column" gap={3}>
              <Text weight="medium">Ghost Variant (Matching Color Spinner for colored)</Text>
              <Flex gap={4} align="center">
                <Button variant="ghost" color="accent" loading>
                  Loading
                </Button>
                <Button variant="ghost" color="danger" loading>
                  Loading
                </Button>
                <Button variant="ghost" color="success" loading>
                  Loading
                </Button>
              </Flex>
            </Flex>

            {/* Text Variant */}
            <Flex direction="column" gap={3}>
              <Text weight="medium">Text Variant (Matching Color Spinner for colored)</Text>
              <Flex gap={4} align="center">
                <Button variant="text" color="accent" loading>
                  Loading
                </Button>
                <Button variant="text" color="danger" loading>
                  Loading
                </Button>
                <Button variant="text" color="success" loading>
                  Loading
                </Button>
              </Flex>
            </Flex>

            {/* Size Variants */}
            <Flex direction="column" gap={3}>
              <Text weight="medium">Size Variants</Text>
              <Flex gap={4} align="center">
                <Button variant="solid" color="accent" size="small" loading>
                  Small
                </Button>
                <Button variant="solid" color="accent" size="normal" loading>
                  Normal
                </Button>
                <Button variant="outline" color="accent" size="small" loading>
                  Small
                </Button>
                <Button variant="outline" color="accent" size="normal" loading>
                  Normal
                </Button>
              </Flex>
            </Flex>

            {/* Loading with and without text */}
            <Flex direction="column" gap={3}>
              <Text weight="medium">Loading With/Without Text</Text>
              <Flex gap={4} align="center">
                <Button variant="solid" color="accent" loading>
                  Loading
                </Button>
                <Button variant="solid" color="accent" loading loaderText="Processing...">
                  Button
                </Button>
                <Button variant="outline" color="accent" loading>
                  Loading
                </Button>
                <Button variant="outline" color="accent" loading loaderText="Processing...">
                  Button
                </Button>
              </Flex>
            </Flex>

            {/* Disabled Loading State */}
            <Flex direction="column" gap={3}>
              <Text weight="medium">Disabled Loading State</Text>
              <Flex gap={4} align="center">
                <Button variant="solid" color="accent" loading disabled>
                  Loading
                </Button>
                <Button variant="outline" color="accent" loading disabled>
                  Loading
                </Button>
                <Button variant="ghost" color="accent" loading disabled>
                  Loading
                </Button>
                <Button variant="text" color="accent" loading disabled>
                  Loading
                </Button>
              </Flex>
            </Flex>
          </Flex>

          <Search
            placeholder="Default small search"
            size="small"
            showClearButton
            value={search2}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSearch2(e.target.value)
            }
            onClear={() => setSearch2("")}
          />

          <Search
            placeholder="Borderless large search"
            variant="borderless"
            showClearButton
            value={search3}
            label="Search"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSearch3(e.target.value)
            }
            onClear={() => setSearch3("")}
          />

          <Search
            placeholder="Borderless small search"
            variant="borderless"
            size="small"
            showClearButton
            value={search4}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSearch4(e.target.value)
            }
            onClear={() => setSearch4("")}
          />

        </Flex>

        {/* Select component examples */}
        <Text size="large" weight="medium" style={{ marginTop: "32px", marginBottom: "16px" }}>
          Select Examples
        </Text>

        <Flex direction="column" gap={4} style={{ maxWidth: "150px" }}>
          {/* Normal size select with icons */}
          <Flex direction="column" gap={2}>
            <Select value={selectValue} onValueChange={setSelectValue} disabled>
              <Select.Trigger size="small" variant="outline">
                <Select.Value 
                  placeholder="Choose an options"
                  leadingIcon={filterOptions.find(opt => opt.value === selectValue)?.icon}
                >
                  {selectValue}
                </Select.Value>
              </Select.Trigger>
              <Select.Content>
                {filterOptions.map((option) => (
                  <Select.Item 
                    key={option.value} 
                    value={option.value} 
                    leadingIcon={option.icon}
                  >
                    {option.label}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select>

            <Select value={selectValue} onValueChange={setSelectValue}>
              <Select.Trigger size="small" variant="outline">
                <Select.Value 
                  placeholder="Choose an options option option"
                  leadingIcon={filterOptions.find(opt => opt.value === selectValue)?.icon}
                >
                  {selectValue}
                </Select.Value>
              </Select.Trigger>
              <Select.Content>
                {filterOptions.map((option) => (
                  <Select.Item 
                    key={option.value} 
                    value={option.value} 
                    leadingIcon={option.icon}
                  >
                    {option.label}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select>
          </Flex>
        </Flex>

        <Flex direction="column" gap={4} style={{ maxWidth: "150px" }}>
          {/* Normal size select with icons */}
          <Flex direction="column" gap={2}>
            <Select value={selectValue} onValueChange={setSelectValue} disabled>
              <Select.Trigger size="small" variant="outline">
                <Select.Value 
                  placeholder="Choose an options"
                  leadingIcon={filterOptions.find(opt => opt.value === selectValue)?.icon}
                >
                  {selectValue}
                </Select.Value>
              </Select.Trigger>
              <Select.Content>
                {filterOptions.map((option) => (
                  <Select.Item 
                    key={option.value} 
                    value={option.value} 
                    leadingIcon={option.icon}
                  >
                    {option.label}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select>
            <Text size="small">Normal size:</Text>
            <Select value={selectValue1} onValueChange={setSelectValue1}>
              <Select.Trigger>
                <Select.Value 
                  placeholder="Choose an options"
                  leadingIcon={selectOptions.find(opt => opt.value === selectValue1)?.icon}
                >
                  {selectValue1}
                </Select.Value>
              </Select.Trigger>
              <Select.Content>
                {selectOptions.map((option) => (
                  <Select.Item 
                    key={option.value} 
                    value={option.value} 
                    leadingIcon={option.icon}
                  >
                    {option.label}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select>
          </Flex>

          {/* Small size select with icons */}
          <Flex direction="column" gap={2}>
            <Text size="small">Small size:</Text>
            <Select value={selectValue2} onValueChange={setSelectValue2}>
              <Select.Trigger size="small">
                <Select.Value 
                  placeholder="Choose an options"
                  leadingIcon={selectOptions.find(opt => opt.value === selectValue2)?.icon}
                >
                  {selectValue2}
                </Select.Value>
              </Select.Trigger>
              <Select.Content>
                {selectOptions.map((option) => (
                  <Select.Item 
                    key={option.value} 
                    value={option.value} 
                    leadingIcon={option.icon}
                  >
                    {option.label}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select>
          </Flex>
        </Flex>

        <Text size="large" weight="medium" style={{ marginTop: "32px", marginBottom: "16px" }}>
          Form Component Examples
        </Text>

        <Flex direction="column" gap={4} style={{ maxWidth: "300px" }}>
          {/* Select Examples */}
          <Flex direction="column" gap={2}>
            <Text size="small">Disabled Select:</Text>
            <Select value={selectValue} onValueChange={setSelectValue} disabled>
              <Select.Trigger size="small" variant="outline">
                <Select.Value 
                  placeholder="Choose an option"
                  leadingIcon={filterOptions.find(opt => opt.value === selectValue)?.icon}
                >
                  {selectValue}
                </Select.Value>
              </Select.Trigger>
              <Select.Content>
                {filterOptions.map((option) => (
                  <Select.Item 
                    key={option.value} 
                    value={option.value} 
                    leadingIcon={option.icon}
                  >
                    {option.label}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select>
          </Flex>

          <Flex direction="column" gap={2}>
            <Text size="small">Normal size:</Text>
            <Select value={selectValue1} onValueChange={setSelectValue1}>
              <Select.Trigger>
                <Select.Value 
                  placeholder="Choose an option"
                  leadingIcon={selectOptions.find(opt => opt.value === selectValue1)?.icon}
                >
                  {selectValue1}
                </Select.Value>
              </Select.Trigger>
              <Select.Content>
                {selectOptions.map((option) => (
                  <Select.Item 
                    key={option.value} 
                    value={option.value} 
                    leadingIcon={option.icon}
                  >
                    {option.label}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select>
          </Flex>
        </Flex>

        <Flex justify="center" style={{ marginTop: 40 }}>
          <Button type="submit">Submit button</Button>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default Page;
