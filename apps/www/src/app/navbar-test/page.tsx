'use client';
import {
  Avatar,
  Badge,
  Button,
  Flex,
  IconButton,
  Navbar,
  Search,
  Text
} from '@raystack/apsara';
import {
  BellIcon,
  FilterIcon,
  OrganizationIcon,
  SidebarIcon
} from '@raystack/apsara/icons';

const Page = () => {
  return (
    <>
      {/* Main Sticky Navbar */}
      <Navbar sticky>
        <Navbar.Start>
          <Text size='regular' weight='medium'>
            Apsara Navbar
          </Text>
        </Navbar.Start>
        <Navbar.End>
          <Button variant='ghost' size='small'>
            Docs
          </Button>
          <Button variant='ghost' size='small'>
            Examples
          </Button>
          <Button variant='solid' color='accent' size='small'>
            Get Started
          </Button>
        </Navbar.End>
      </Navbar>

      <Flex
        direction='column'
        gap={8}
        style={{
          padding: '32px',
          minHeight: '200vh',
          backgroundColor: 'var(--rs-color-background-base-primary)'
        }}
      >
        {/* Header Section */}
        <Flex direction='column' gap={4}>
          <Text size='large' weight='medium'>
            Navbar Component Test Page
          </Text>
          <Text>
            This page contains various navbar variations and scenarios for
            thorough testing. Scroll down to see different examples and test the
            sticky behavior.
          </Text>
        </Flex>

        {/* Variation 1: Non-Sticky Navbar */}
        <Flex direction='column' gap={3}>
          <Text size='regular' weight='medium'>
            Variation 1: Non-Sticky Navbar
          </Text>
          <Navbar sticky={false}>
            <Navbar.Start>
              <Text size='regular' weight='medium'>
                Non-Sticky Navbar
              </Text>
            </Navbar.Start>
            <Navbar.End>
              <Button variant='outline' size='small'>
                Action
              </Button>
            </Navbar.End>
          </Navbar>
        </Flex>

        {/* Variation 2: Navbar with Icons */}
        <Flex direction='column' gap={3}>
          <Text size='regular' weight='medium'>
            Variation 2: Navbar with Icons
          </Text>
          <Navbar sticky={false}>
            <Navbar.Start>
              <IconButton size={3} aria-label='Menu'>
                <SidebarIcon />
              </IconButton>
              <Text size='regular' weight='medium'>
                Icon Navbar
              </Text>
            </Navbar.Start>
            <Navbar.End>
              <IconButton size={3} aria-label='Notifications'>
                <BellIcon />
              </IconButton>
              <IconButton size={3} aria-label='Filter'>
                <FilterIcon />
              </IconButton>
              <Avatar size={4} fallback='JD' color='indigo' />
            </Navbar.End>
          </Navbar>
        </Flex>

        {/* Variation 3: Navbar with Search */}
        <Flex direction='column' gap={3}>
          <Text size='regular' weight='medium'>
            Variation 3: Navbar with Search
          </Text>
          <Navbar sticky={false}>
            <Navbar.Start>
              <Text size='regular' weight='medium'>
                Search Navbar
              </Text>
            </Navbar.Start>
            <Navbar.End>
              <Search
                placeholder='Search...'
                size='small'
                style={{ width: '200px' }}
              />
              <Button variant='ghost' size='small'>
                Settings
              </Button>
            </Navbar.End>
          </Navbar>
        </Flex>

        {/* Variation 4: Minimal Navbar */}
        <Flex direction='column' gap={3}>
          <Text size='regular' weight='medium'>
            Variation 4: Minimal Navbar (Start Only)
          </Text>
          <Navbar sticky={false}>
            <Navbar.Start>
              <Text size='regular' weight='medium'>
                Minimal Navbar
              </Text>
            </Navbar.Start>
          </Navbar>
        </Flex>

        {/* Variation 5: Navbar with Badges */}
        <Flex direction='column' gap={3}>
          <Text size='regular' weight='medium'>
            Variation 5: Navbar with Badges
          </Text>
          <Navbar sticky={false}>
            <Navbar.Start>
              <Text size='regular' weight='medium'>
                Badge Navbar
              </Text>
              <Badge variant='success' size='small'>
                New
              </Badge>
            </Navbar.Start>
            <Navbar.End>
              <Button variant='ghost' size='small'>
                <Flex align='center' gap={2}>
                  <Text>Notifications</Text>
                  <Badge variant='danger' size='small'>
                    5
                  </Badge>
                </Flex>
              </Button>
            </Navbar.End>
          </Navbar>
        </Flex>

        {/* Variation 6: Navbar with Long Text */}
        <Flex direction='column' gap={3}>
          <Text size='regular' weight='medium'>
            Variation 6: Navbar with Long Text Content
          </Text>
          <Navbar sticky={false}>
            <Navbar.Start>
              <Text size='regular' weight='medium'>
                Very Long Navbar Title That Should Handle Text Overflow Properly
              </Text>
            </Navbar.Start>
            <Navbar.End>
              <Button variant='outline' size='small'>
                Short
              </Button>
              <Button variant='outline' size='small'>
                Medium Button
              </Button>
              <Button variant='solid' color='accent' size='small'>
                Long Action Button
              </Button>
            </Navbar.End>
          </Navbar>
        </Flex>

        {/* Variation 7: Navbar with Multiple Actions */}
        <Flex direction='column' gap={3}>
          <Text size='regular' weight='medium'>
            Variation 7: Navbar with Multiple Actions
          </Text>
          <Navbar sticky={false}>
            <Navbar.Start>
              <IconButton size={3} aria-label='Menu'>
                <SidebarIcon />
              </IconButton>
              <Text size='regular' weight='medium'>
                Multi-Action Navbar
              </Text>
            </Navbar.Start>
            <Navbar.End>
              <Button variant='ghost' size='small' leadingIcon={<BellIcon />}>
                Notifications
              </Button>
              <Button variant='ghost' size='small' leadingIcon={<FilterIcon />}>
                Filters
              </Button>
              <Button
                variant='ghost'
                size='small'
                leadingIcon={<OrganizationIcon />}
              >
                Organization
              </Button>
              <Avatar size={4} fallback='JD' color='indigo' />
            </Navbar.End>
          </Navbar>
        </Flex>

        {/* Variation 8: Navbar with Only End Section */}
        <Flex direction='column' gap={3}>
          <Text size='regular' weight='medium'>
            Variation 8: Navbar with Only End Section
          </Text>
          <Navbar sticky={false}>
            <Navbar.End>
              <Button variant='ghost' size='small'>
                Login
              </Button>
              <Button variant='solid' color='accent' size='small'>
                Sign Up
              </Button>
            </Navbar.End>
          </Navbar>
        </Flex>

        {/* Variation 9: Navbar with Different Button Variants */}
        <Flex direction='column' gap={3}>
          <Text size='regular' weight='medium'>
            Variation 9: Navbar with Different Button Variants
          </Text>
          <Navbar sticky={false}>
            <Navbar.Start>
              <Text size='regular' weight='medium'>
                Button Variants
              </Text>
            </Navbar.Start>
            <Navbar.End>
              <Button variant='text' size='small'>
                Text
              </Button>
              <Button variant='ghost' size='small'>
                Ghost
              </Button>
              <Button variant='outline' size='small'>
                Outline
              </Button>
              <Button variant='solid' color='accent' size='small'>
                Solid
              </Button>
            </Navbar.End>
          </Navbar>
        </Flex>

        {/* Variation 10: Navbar with Different Colors */}
        <Flex direction='column' gap={3}>
          <Text size='regular' weight='medium'>
            Variation 10: Navbar with Different Button Colors
          </Text>
          <Navbar sticky={false}>
            <Navbar.Start>
              <Text size='regular' weight='medium'>
                Color Variants
              </Text>
            </Navbar.Start>
            <Navbar.End>
              <Button variant='solid' color='neutral' size='small'>
                Neutral
              </Button>
              <Button variant='solid' color='accent' size='small'>
                Accent
              </Button>
              <Button variant='solid' color='success' size='small'>
                Success
              </Button>
              <Button variant='solid' color='danger' size='small'>
                Danger
              </Button>
            </Navbar.End>
          </Navbar>
        </Flex>

        {/* Scrollable Content Sections for Testing Sticky Behavior */}
        <Flex direction='column' gap={6} style={{ marginTop: '32px' }}>
          <Text size='regular' weight='medium'>
            Scrollable Content Sections (for testing sticky navbar)
          </Text>

          {Array.from({ length: 8 }, (_, i) => (
            <Flex
              key={i}
              direction='column'
              gap={4}
              style={{ maxWidth: '550px' }}
            >
              <Text size='regular' weight='medium'>
                Scrollable Content Section {i + 1}
              </Text>
              <Text>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
                in reprehenderit in voluptate velit esse cillum dolore eu fugiat
                nulla pariatur.
              </Text>
            </Flex>
          ))}
        </Flex>

        {/* Additional Test Scenarios */}
        <Flex direction='column' gap={6} style={{ marginTop: '48px' }}>
          <Text size='regular' weight='medium'>
            Additional Test Scenarios
          </Text>

          {/* Test: Navbar with Loading States */}
          <Flex direction='column' gap={3}>
            <Text size='small' weight='medium'>
              Loading States Test
            </Text>
            <Navbar sticky={false}>
              <Navbar.Start>
                <Text size='regular' weight='medium'>
                  Loading Navbar
                </Text>
              </Navbar.Start>
              <Navbar.End>
                <Button variant='solid' color='accent' size='small' loading>
                  Loading
                </Button>
                <Button variant='outline' size='small' loading>
                  Processing
                </Button>
              </Navbar.End>
            </Navbar>
          </Flex>

          {/* Test: Navbar with Disabled States */}
          <Flex direction='column' gap={3}>
            <Text size='small' weight='medium'>
              Disabled States Test
            </Text>
            <Navbar sticky={false}>
              <Navbar.Start>
                <Text size='regular' weight='medium'>
                  Disabled Navbar
                </Text>
              </Navbar.Start>
              <Navbar.End>
                <Button variant='ghost' size='small' disabled>
                  Disabled
                </Button>
                <Button variant='solid' color='accent' size='small' disabled>
                  Can&apos;t Click
                </Button>
              </Navbar.End>
            </Navbar>
          </Flex>

          {/* Test: Navbar with Mixed Sizes */}
          <Flex direction='column' gap={3}>
            <Text size='small' weight='medium'>
              Mixed Button Sizes Test
            </Text>
            <Navbar sticky={false}>
              <Navbar.Start>
                <Text size='regular' weight='medium'>
                  Mixed Sizes
                </Text>
              </Navbar.Start>
              <Navbar.End>
                <Button variant='ghost' size='small'>
                  Small
                </Button>
                <Button variant='ghost'>Normal</Button>
                <IconButton size={2} aria-label='Small Icon'>
                  <BellIcon />
                </IconButton>
                <IconButton size={4} aria-label='Large Icon'>
                  <FilterIcon />
                </IconButton>
              </Navbar.End>
            </Navbar>
          </Flex>
        </Flex>

        {/* Final Scrollable Content */}
        <Flex direction='column' gap={6} style={{ marginTop: '48px' }}>
          <Text size='regular' weight='medium'>
            More Scrollable Content (to test sticky navbar at bottom)
          </Text>
          {Array.from({ length: 5 }, (_, i) => (
            <Flex
              key={`bottom-${i}`}
              direction='column'
              gap={4}
              style={{ maxWidth: '550px' }}
            >
              <Text size='regular' weight='medium'>
                Bottom Section {i + 1}
              </Text>
              <Text>
                Continue scrolling to test the sticky navbar behavior. The
                navbar at the top should remain visible while scrolling through
                all this content.
              </Text>
            </Flex>
          ))}
        </Flex>
      </Flex>
    </>
  );
};

export default Page;
