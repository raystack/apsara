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
  EmptyState,
} from "@raystack/apsara/v1";
import React, { useState } from "react";
import {
  BellIcon,
  FilterIcon,
  OrganizationIcon,
  SidebarIcon,
} from "@raystack/apsara/icons";
import dayjs from "dayjs";

const Page = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [nestedDialogOpen, setNestedDialogOpen] = useState(false);
  const [dialogSheetOpen, setDialogSheetOpen] = useState(false);
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
    { value: "reports", label: "Reports", icon: <FilterIcon /> },
    { value: "activities", label: "Activities", icon: <OrganizationIcon /> },
    { value: "help", label: "Help", icon: <FilterIcon /> },
    { value: "preferences", label: "Preferences", icon: <SidebarIcon /> },
    { value: "notifications", label: "Notifications", icon: <BellIcon /> },
    { value: "logout", label: "Logout", icon: <SidebarIcon /> },
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
    <>
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
          <IconButton
            size={4}
            aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{ marginBottom: "16px" }}>
            <SidebarIcon />
          </IconButton>

          <Text size="large" weight="medium" style={{ marginBottom: "24px" }}>
            Main
          </Text>

          <Flex direction="column" gap={4} style={{ maxWidth: "550px" }}>
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
            <DatePicker
              side="bottom"
              dateFormat="D MMM YYYY"
              value={dayjs().add(16, "year").toDate()}
              onSelect={(value: Date) => console.log(value)}
              calendarProps={{
                captionLayout: "dropdown",
                startMonth: dayjs().add(3, "month").toDate(),
                endMonth: dayjs().add(4, "year").toDate(),
                disabled: {
                  before: dayjs().add(3, "month").toDate(),
                  after: dayjs().add(3, "year").toDate(),
                },
                mode: "single",
                required: true,
                selected: new Date(),
              }}
              textFieldProps={{
                state: "valid",
                size: "medium",
              }}
            />

            <RangePicker
              side="bottom"
              dateFormat="D MMM YYYY"
              value={{
                from: dayjs("2027-11-15").toDate(),
                to: dayjs("2027-12-10").toDate(),
              }}
              onSelect={range => console.log(range)}
              calendarProps={{
                captionLayout: "dropdown",
                mode: "range",
                required: true,
                selected: {
                  from: dayjs("2027-11-15").toDate(),
                  to: dayjs("2027-12-10").toDate(),
                },
                numberOfMonths: 2,
                fromYear: 2024,
                toYear: 2027,
                startMonth: dayjs("2024-01-01").toDate(),
                endMonth: dayjs("2027-12-01").toDate(),
                defaultMonth: dayjs("2027-11-01").toDate(),
              }}
              inputFieldsProps={{
                startDate: {
                  size: "small",
                },
                endDate: {
                  size: "small",
                },
              }}
            />

            <RangePicker
              footer={
                <Callout width="100%" type="success">
                  Some important message in the footer
                </Callout>
              }
            />

            <DatePicker
              calendarProps={{
                captionLayout: "dropdown",
                mode: "single",
                required: true,
                selected: new Date(),
              }}
            />

            <DatePicker
              timeZone="UTC"
              dateFormat="DD MMM YYYY"
              onSelect={date => {
                console.log(date);
              }}>
              <InputField defaultValue="test" size="small" readOnly />
            </DatePicker>

            <InputField defaultValue="test" size="small" readOnly />

            <Text
              size="large"
              weight="medium"
              style={{ marginTop: "32px", marginBottom: "16px" }}>
              Spinner Examples
            </Text>

            <Flex direction="column" gap={4}>
              <Flex gap={4} align="center">
                <Spinner size={3} color="default" />
                <Spinner size={3} color="neutral" />
                <Spinner size={3} color="accent" />
                <Spinner size={3} color="danger" />
                <Spinner size={3} color="success" />
                <Spinner size={3} color="attention" />
              </Flex>
            </Flex>

            <Text
              size="large"
              weight="medium"
              style={{ marginTop: "32px", marginBottom: "16px" }}>
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
                <Text weight="medium">
                  Outline Variant (Matching Color Spinner)
                </Text>
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
                <Text weight="medium">
                  Ghost Variant (Matching Color Spinner for colored)
                </Text>
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
                <Text weight="medium">
                  Text Variant (Matching Color Spinner for colored)
                </Text>
                <Flex gap={4} align="center">
                  <Button variant="text" color="accent" loading>
                    Loading
                  </Button>
                  <Button variant="text" color="neutral" loading>
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
                  <Button
                    variant="outline"
                    color="accent"
                    size="normal"
                    loading>
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
                  <Button
                    variant="solid"
                    color="accent"
                    loading
                    loaderText="Processing...">
                    Button
                  </Button>
                  <Button variant="outline" color="accent" loading>
                    Loading
                  </Button>
                  <Button
                    variant="outline"
                    color="accent"
                    loading
                    loaderText="Processing...">
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
          <Text
            size="large"
            weight="medium"
            style={{ marginTop: "32px", marginBottom: "16px" }}>
            Select Examples
          </Text>

          <EmptyState
            icon={<FilterIcon />}
            heading="KYC required for image orders"
            subHeading="Please contact your organization owner to complete the KYC process for the image orders. You can also contact support@raystack.io for assistance."
            primaryAction={
              <Button variant="outline" color="neutral">
                Add Data
              </Button>
            }
            variant="empty1"
          />

          <TextArea />

          <Flex direction="column" gap={4} style={{ maxWidth: "550px" }}>
            {/* Normal size select with icons */}
            <Flex direction="column" gap={2}>
              <Select
                value={selectValue}
                onValueChange={setSelectValue}
                disabled>
                <Select.Trigger size="small" variant="outline">
                  <Select.Value placeholder="Choose an options" />
                </Select.Trigger>
                <Select.Content>
                  {filterOptions.map(option => (
                    <Select.Item
                      key={option.value}
                      value={option.value}
                      leadingIcon={option.icon}>
                      {option.label}
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select>

              <Select value={selectValue} onValueChange={setSelectValue}>
                <Select.Trigger size="small" variant="text">
                  <Select.Value placeholder="Choose an options option option" />
                </Select.Trigger>
                <Select.Content>
                  {filterOptions.map(option => (
                    <Select.Item
                      key={option.value}
                      value={option.value}
                      leadingIcon={option.icon}>
                      {option.label}
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select>
            </Flex>
          </Flex>

          <Flex direction="column" gap={4} style={{ maxWidth: "550px" }}>
            {/* Normal size select with icons */}
            <Flex direction="column" gap={2}>
              <Select
                value={selectValue}
                onValueChange={setSelectValue}
                disabled>
                <Select.Trigger size="small" variant="outline">
                  <Select.Value placeholder="Choose an options" />
                </Select.Trigger>
                <Select.Content>
                  {filterOptions.map(option => (
                    <Select.Item
                      key={option.value}
                      value={option.value}
                      leadingIcon={option.icon}>
                      {option.label}
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select>
              <Text size="small">Normal size:</Text>
              <Select value={selectValue1} onValueChange={setSelectValue1}>
                <Select.Trigger>
                  <Select.Value placeholder="Choose an options" />
                </Select.Trigger>
                <Select.Content>
                  {selectOptions.map(option => (
                    <Select.Item
                      key={option.value}
                      value={option.value}
                      leadingIcon={option.icon}>
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
                  <Select.Value placeholder="Choose an options" />
                </Select.Trigger>
                <Select.Content>
                  {selectOptions.map(option => (
                    <Select.Item
                      key={option.value}
                      value={option.value}
                      leadingIcon={option.icon}>
                      {option.label}
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select>
            </Flex>
          </Flex>

          <Text
            size="large"
            weight="medium"
            style={{ marginTop: "32px", marginBottom: "16px" }}>
            Dialog Examples
          </Text>

          <Flex direction="column" gap={4}>
            <Button onClick={() => setDialogOpen(true)}>Open Dialog</Button>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <Dialog.Content width="500px">
                <Dialog.Header>
                  <Dialog.Title>Dialog Title</Dialog.Title>
                  <Dialog.CloseButton />
                </Dialog.Header>
                <Dialog.Body>
                  <Text>This is the dialog content. </Text>
                  <Flex
                    direction="column"
                    gap={4}
                    style={{ marginTop: "16px" }}>
                    <Text size="small">Team Members:</Text>
                    <AvatarGroup>
                      <Avatar size={5} color="indigo" fallback="JD" />
                      <Avatar size={5} color="mint" fallback="AS" />
                      <Avatar size={5} color="sky" fallback="RK" />
                      <Avatar size={5} color="purple" fallback="+2" />
                    </AvatarGroup>

                    <Flex direction="column" gap={2}>
                      <Text size="small">Quick Actions:</Text>
                      <Tooltip
                        message="Click to send a message to all team members"
                        side="top">
                        <Button variant="solid" color="accent">
                          Show hover tooltip
                        </Button>
                      </Tooltip>
                    </Flex>
                  </Flex>

                  <Flex
                    direction="column"
                    gap={4}
                    style={{ marginTop: "32px" }}>
                    <Flex direction="column" gap={2}>
                      <Text size="small">Team Role:</Text>
                      <Select
                        value={selectValue}
                        onValueChange={setSelectValue}>
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
                    </Flex>

                    <Flex direction="column" gap={2}>
                      <Popover>
                        <Popover.Trigger>
                          <Button variant="ghost" size="small">
                            <FilterIcon />
                            <Text size="small">Filter Help</Text>
                          </Button>
                        </Popover.Trigger>
                        <Popover.Content>
                          <Flex
                            direction="column"
                            gap={2}
                            style={{ padding: "8px" }}>
                            <Text size="small" weight="medium">
                              Filter Team Members
                            </Text>
                            <Text size="small">
                              You can filter team members by:
                            </Text>
                            <ul style={{ margin: 0, paddingLeft: "16px" }}>
                              <li>
                                <Text size="small">Name</Text>
                              </li>
                              <li>
                                <Text size="small">Role</Text>
                              </li>
                              <li>
                                <Text size="small">Department</Text>
                              </li>
                            </ul>
                          </Flex>
                        </Popover.Content>
                      </Popover>
                      <InputField
                        label="Filter Team Members"
                        placeholder="Type to filter..."
                        leadingIcon={<FilterIcon />}
                        width="100%"
                      />
                    </Flex>

                    <Flex direction="column" gap={2}>
                      <Text size="small">Actions:</Text>
                      <Flex gap={2}>
                        <Indicator variant="success" label="5">
                          <Button variant="outline">Active Members</Button>
                        </Indicator>
                        <Button
                          variant="outline"
                          onClick={() => setNestedDialogOpen(true)}>
                          Open Nested Dialog
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setDialogSheetOpen(true)}>
                          Open Sheet
                        </Button>
                        <DropdownMenu>
                          <DropdownMenu.Trigger asChild>
                            <Button variant="outline">Open Menu</Button>
                          </DropdownMenu.Trigger>
                          <DropdownMenu.Content>
                            <DropdownMenu.Label>
                              Team Actions
                            </DropdownMenu.Label>
                            <Tooltip
                              message="Add a new member to your team"
                              side="right">
                              <DropdownMenu.Item>Add Member</DropdownMenu.Item>
                            </Tooltip>
                            <DropdownMenu.Item>Edit Team</DropdownMenu.Item>
                            <DropdownMenu.Separator />
                            <DropdownMenu.Group>
                              <DropdownMenu.Label>Settings</DropdownMenu.Label>
                              <DropdownMenu.Item>Permissions</DropdownMenu.Item>
                              <DropdownMenu.Item>
                                Notifications
                              </DropdownMenu.Item>
                            </DropdownMenu.Group>
                            <DropdownMenu.Separator />
                            <DropdownMenu.Item color="danger">
                              Delete Team
                            </DropdownMenu.Item>
                          </DropdownMenu.Content>
                        </DropdownMenu>
                      </Flex>
                    </Flex>
                  </Flex>

                  <TextArea
                    label="Example Text Area"
                    placeholder="Type something..."
                    value={inputValue}
                    onChange={e => setInputValue(e.target.value)}
                  />
                </Dialog.Body>
                <Dialog.Footer>
                  <Button variant="ghost" onClick={() => setDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => setDialogOpen(false)}>Save</Button>
                </Dialog.Footer>
              </Dialog.Content>
            </Dialog>

            <Sheet open={dialogSheetOpen} onOpenChange={setDialogSheetOpen}>
              <Sheet.Content side="right" close>
                <Sheet.Title>Sheet Title</Sheet.Title>
                <Text>This is the sheet content. </Text>
                <Flex direction="column" gap={4} style={{ marginTop: "16px" }}>
                  <Text size="small">Team Members:</Text>
                  <AvatarGroup>
                    <Avatar size={5} color="indigo" fallback="JD" />
                    <Avatar size={5} color="mint" fallback="AS" />
                    <Avatar size={5} color="sky" fallback="RK" />
                    <Avatar size={5} color="purple" fallback="+2" />
                  </AvatarGroup>

                  <Flex direction="column" gap={2}>
                    <Text size="small">Quick Actions:</Text>
                    <Tooltip
                      message="Click to send a message to all team members"
                      side="top">
                      <Button variant="solid" color="accent">
                        Show hover tooltip
                      </Button>
                    </Tooltip>
                  </Flex>
                </Flex>

                <Flex direction="column" gap={4} style={{ marginTop: "32px" }}>
                  <Flex direction="column" gap={2}>
                    <Text size="small">Team Role:</Text>
                    <Select value={selectValue} onValueChange={setSelectValue}>
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
                  </Flex>

                  <Flex direction="column" gap={2}>
                    <Popover>
                      <Popover.Trigger>
                        <Button variant="ghost" size="small">
                          <FilterIcon />
                          <Text size="small">Filter Help</Text>
                        </Button>
                      </Popover.Trigger>
                      <Popover.Content>
                        <Flex
                          direction="column"
                          gap={2}
                          style={{ padding: "8px" }}>
                          <Text size="small" weight="medium">
                            Filter Team Members
                          </Text>
                          <Text size="small">
                            You can filter team members by:
                          </Text>
                          <ul style={{ margin: 0, paddingLeft: "16px" }}>
                            <li>
                              <Text size="small">Name</Text>
                            </li>
                            <li>
                              <Text size="small">Role</Text>
                            </li>
                            <li>
                              <Text size="small">Department</Text>
                            </li>
                          </ul>
                        </Flex>
                      </Popover.Content>
                    </Popover>
                    <InputField
                      label="Filter Team Members"
                      placeholder="Type to filter..."
                      leadingIcon={<FilterIcon />}
                      width="100%"
                    />
                  </Flex>

                  <Flex direction="column" gap={2}>
                    <Text size="small">Actions:</Text>
                    <Flex gap={2}>
                      <Indicator variant="success" label="5">
                        <Button variant="outline">Active Members</Button>
                      </Indicator>
                      <DropdownMenu>
                        <DropdownMenu.Trigger asChild>
                          <Button variant="outline">Open Menu</Button>
                        </DropdownMenu.Trigger>
                        <DropdownMenu.Content>
                          <DropdownMenu.Label>Team Actions</DropdownMenu.Label>
                          <Tooltip
                            message="Add a new member to your team"
                            side="right">
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
                          <DropdownMenu.Item color="danger">
                            Delete Team
                          </DropdownMenu.Item>
                        </DropdownMenu.Content>
                      </DropdownMenu>
                    </Flex>
                  </Flex>
                </Flex>

                <TextArea
                  label="Example Text Area"
                  placeholder="Type something..."
                  value={inputValue}
                  onChange={e => setInputValue(e.target.value)}
                />
              </Sheet.Content>
            </Sheet>

            <Dialog open={nestedDialogOpen} onOpenChange={setNestedDialogOpen}>
              <Dialog.Content width="500px">
                <Dialog.Body>
                  <Text>This is the nested dialog content. </Text>
                  <Flex
                    direction="column"
                    gap={4}
                    style={{ marginTop: "16px" }}>
                    <Text size="small">Team Members:</Text>
                    <AvatarGroup>
                      <Avatar size={5} color="indigo" fallback="JD" />
                      <Avatar size={5} color="mint" fallback="AS" />
                      <Avatar size={5} color="sky" fallback="RK" />
                      <Avatar size={5} color="purple" fallback="+2" />
                    </AvatarGroup>

                    <Flex direction="column" gap={2}>
                      <Text size="small">Quick Actions:</Text>
                      <Tooltip
                        message="Click to send a message to all team members"
                        side="top">
                        <Button variant="solid" color="accent">
                          Show hover tooltip
                        </Button>
                      </Tooltip>
                    </Flex>
                  </Flex>

                  <Flex
                    direction="column"
                    gap={4}
                    style={{ marginTop: "32px" }}>
                    <Flex direction="column" gap={2}>
                      <Text size="small">Team Role:</Text>
                      <Select
                        value={selectValue}
                        onValueChange={setSelectValue}>
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
                    </Flex>

                    <Flex direction="column" gap={2}>
                      <Popover>
                        <Popover.Trigger>
                          <Button variant="ghost" size="small">
                            <FilterIcon />
                            <Text size="small">Filter Help</Text>
                          </Button>
                        </Popover.Trigger>
                        <Popover.Content>
                          <Flex
                            direction="column"
                            gap={2}
                            style={{ padding: "8px" }}>
                            <Text size="small" weight="medium">
                              Filter Team Members
                            </Text>
                            <Text size="small">
                              You can filter team members by:
                            </Text>
                            <ul style={{ margin: 0, paddingLeft: "16px" }}>
                              <li>
                                <Text size="small">Name</Text>
                              </li>
                              <li>
                                <Text size="small">Role</Text>
                              </li>
                              <li>
                                <Text size="small">Department</Text>
                              </li>
                            </ul>
                          </Flex>
                        </Popover.Content>
                      </Popover>
                      <InputField
                        label="Filter Team Members"
                        placeholder="Type to filter..."
                        leadingIcon={<FilterIcon />}
                        width="100%"
                      />
                    </Flex>

                    <Flex direction="column" gap={2}>
                      <Text size="small">Actions:</Text>
                      <Flex gap={2}>
                        <Indicator variant="success" label="5">
                          <Button variant="outline">Active Members</Button>
                        </Indicator>
                        <DropdownMenu>
                          <DropdownMenu.Trigger asChild>
                            <Button variant="outline">Open Menu</Button>
                          </DropdownMenu.Trigger>
                          <DropdownMenu.Content>
                            <DropdownMenu.Label>
                              Team Actions
                            </DropdownMenu.Label>
                            <Tooltip
                              message="Add a new member to your team"
                              side="right">
                              <DropdownMenu.Item>Add Member</DropdownMenu.Item>
                            </Tooltip>
                            <DropdownMenu.Item>Edit Team</DropdownMenu.Item>
                            <DropdownMenu.Separator />
                            <DropdownMenu.Group>
                              <DropdownMenu.Label>Settings</DropdownMenu.Label>
                              <DropdownMenu.Item>Permissions</DropdownMenu.Item>
                              <DropdownMenu.Item>
                                Notifications
                              </DropdownMenu.Item>
                            </DropdownMenu.Group>
                            <DropdownMenu.Separator />
                            <DropdownMenu.Item color="danger">
                              Delete Team
                            </DropdownMenu.Item>
                          </DropdownMenu.Content>
                        </DropdownMenu>
                      </Flex>
                    </Flex>
                  </Flex>
                </Dialog.Body>
              </Dialog.Content>
            </Dialog>
          </Flex>

          <Text
            size="large"
            weight="medium"
            style={{ marginTop: "32px", marginBottom: "16px" }}>
            Form Component Examples
          </Text>

          <Flex direction="column" gap={4} style={{ maxWidth: "300px" }}>
            {/* Select Examples */}
            <Flex direction="column" gap={2}>
              <Text size="small">Disabled Select:</Text>
              <Select
                value={selectValue}
                onValueChange={setSelectValue}
                disabled>
                <Select.Trigger size="small" variant="outline">
                  <Select.Value placeholder="Choose an option" />
                </Select.Trigger>
                <Select.Content>
                  {filterOptions.map(option => (
                    <Select.Item
                      key={option.value}
                      value={option.value}
                      leadingIcon={option.icon}>
                      {option.label}
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select>
            </Flex>

            <Flex direction="column" gap={2}>
              <Text size="small">Test Normal size:</Text>
              <Select
                value={selectValue}
                onValueChange={value => {
                  console.log(value);
                  setSelectValue(value);
                }}>
                <Select.Trigger>
                  <Select.Value placeholder="Choose an option" />
                </Select.Trigger>
                <Select.Content>
                  {selectOptions.map(option => (
                    <Select.Item
                      key={option.value}
                      value={option.value}
                      leadingIcon={option.icon}>
                      {option.label}
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select>
              {/* <Select
              value={selectValue}
              onValueChange={value => {
                console.log(value);
                setSelectValue(value);
              }}>
              <Select.Trigger size="small" variant="outline">
                <Select.Value placeholder="Choose an option" />
              </Select.Trigger>
              <Select.Content>
                {selectOptions.map(option => (
                  <Select.Item
                    key={option.value}
                    value={option.value}
                    leadingIcon={option.icon}>
                    {option.label}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select> */}
              <Select value={selectValue} onValueChange={setSelectValue}>
                <Select.Trigger size="small">
                  <Select.Value placeholder="Choose an options" />
                </Select.Trigger>
                <Select.Content>
                  {selectOptions.map(option => (
                    <Select.Item
                      key={option.value}
                      value={option.value}
                      // leadingIcon={option.icon}
                    >
                      {option.label}
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select>
            </Flex>
          </Flex>

          <Text
            size="large"
            weight="medium"
            style={{ marginTop: "32px", marginBottom: "16px" }}>
            Avatar Examples
          </Text>

          <Flex direction="column" gap={6}>
            <Flex direction="column" gap={3}>
              <AvatarGroup max={4}>
                <Tooltip message="JD">
                  <Avatar
                    radius="small"
                    size={7}
                    fallback="JD"
                    color="indigo"
                  />
                </Tooltip>
                <Tooltip message="AS">
                  <Avatar radius="small" size={7} fallback="AS" color="mint" />
                </Tooltip>
                <Tooltip message="RK">
                  <Avatar radius="small" size={7} fallback="RK" color="sky" />
                </Tooltip>
                <Tooltip message="PL">
                  <Avatar
                    radius="small"
                    size={7}
                    fallback="PL"
                    color="purple"
                  />
                </Tooltip>
                <Tooltip message="MN">
                  <Avatar radius="small" size={7} fallback="MN" color="pink" />
                </Tooltip>
              </AvatarGroup>
            </Flex>
          </Flex>
          <Flex style={{ maxWidth: 400, padding: 80 }}>
            <Select autocomplete>
              <Select.Trigger>
                <Select.Value placeholder="Choose an options" />
              </Select.Trigger>
              <Select.Content>
                {selectOptions.map(option => (
                  <Select.Item
                    key={option.value}
                    value={option.value}
                    leadingIcon={option.icon}>
                    {option.label}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select>
          </Flex>

          <Flex justify="center" style={{ marginTop: 40 }}>
            <Button type="submit">Submit button</Button>
          </Flex>
        </Flex>
      </Flex>
    </>
  );
};

export default Page;
