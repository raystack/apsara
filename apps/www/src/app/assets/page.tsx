"use client"
import { Button, Flex, Sidebar, Text, IconButton, EmptyState } from '@raystack/apsara/v1'
import React, { useState } from 'react'
import { BellIcon, FilterIcon, OrganizationIcon, SidebarIcon } from '@raystack/apsara/icons'

const Page = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  
  return (
    <Flex style={{ height: 'calc(100vh - 60px)', backgroundColor: "var(--rs-color-background-base-primary)" }}>
      <Sidebar 
        open={sidebarOpen} 
        onOpenChange={setSidebarOpen}
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            setSidebarOpen(!sidebarOpen)
          }
        }}
      >
        <Sidebar.Header 
          logo={<BellIcon width={24} height={24} />} 
          title="Raystack"
          onLogoClick={() => console.log('Logo clicked')} 
        />
        
        <Sidebar.Main>
          <Sidebar.Item 
            href="#" 
            icon={<BellIcon />}
            active
          >
            Dashboard
          </Sidebar.Item>
          
          <Sidebar.Item 
            href="#" 
            icon={<BellIcon />}
          >
            Analytics
          </Sidebar.Item>
          
          <Sidebar.Group name="Resources">
            <Sidebar.Item 
              href="#" 
              icon={<FilterIcon />}
            >
              Reports
            </Sidebar.Item>
            
            <Sidebar.Item 
              href="#" 
              icon={<FilterIcon />}
            >
              Activities
            </Sidebar.Item>
          </Sidebar.Group>
          
          <Sidebar.Group name="Account">
            <Sidebar.Item 
              href="#" 
              icon={<FilterIcon />}
            >
              Settings
            </Sidebar.Item>
            
            <Sidebar.Item 
              href="#" 
              icon={<BellIcon />}
            >
              Notifications
            </Sidebar.Item>
          </Sidebar.Group>
        </Sidebar.Main>
        
        <Sidebar.Footer>
          <Sidebar.Item 
            href="#" 
            icon={<OrganizationIcon />}
          >
            Help & Support
          </Sidebar.Item>
          
          <Sidebar.Item 
            href="#" 
            icon={<SidebarIcon />}
          >
            Preferences
          </Sidebar.Item>
        </Sidebar.Footer>
      </Sidebar>
      
      <Flex 
        direction="column" 
        style={{ 
          padding: '32px', 
          flex: 1, 
          overflow: 'auto'
        }}
      >
        <IconButton
          aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          variant="ghost"
          style={{ marginBottom: '16px' }}
        ><FilterIcon /></IconButton>
      
        <Text size="large" weight="medium" style={{ marginBottom: '24px' }}>
          Empty States
        </Text>
        
        <Flex direction="column" gap="large">
          {/* empty1 */}
          <EmptyState
            icon={<BellIcon />}
            heading="No notifications yet"
            subHeading="When you have notifications, they will appear here"
            primaryAction={
              <Button>Enable notifications</Button>
            }
            secondaryAction={
              <Button variant="ghost">Learn more</Button>
            }
          />

          {/* empty2 */}
          <EmptyState
            variant="empty2"
            icon={<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M0.800049 2.19998C0.800049 2.04085 0.863263 1.88823 0.975785 1.77571C1.08831 1.66319 1.24092 1.59998 1.40005 1.59998H9.80005C9.95918 1.59998 10.1118 1.66319 10.2243 1.77571C10.3368 1.88823 10.4 2.04085 10.4 2.19998C10.4 2.35911 10.3368 2.51172 10.2243 2.62424C10.1118 2.73676 9.95918 2.79998 9.80005 2.79998H9.60005V13.8C9.60005 13.9591 9.53683 14.1117 9.42431 14.2242C9.31179 14.3368 9.15918 14.4 9.00005 14.4H7.80005C7.64092 14.4 7.48831 14.3368 7.37578 14.2242C7.26326 14.1117 7.20005 13.9591 7.20005 13.8V11.8C7.20005 11.6408 7.13683 11.4882 7.02431 11.3757C6.91179 11.2632 6.75918 11.2 6.60005 11.2H4.60005C4.44092 11.2 4.28831 11.2632 4.17578 11.3757C4.06326 11.4882 4.00005 11.6408 4.00005 11.8V13.8C4.00005 13.9591 3.93683 14.1117 3.82431 14.2242C3.71179 14.3368 3.55918 14.4 3.40005 14.4H1.40005C1.24092 14.4 1.08831 14.3368 0.975785 14.2242C0.863263 14.1117 0.800049 13.9591 0.800049 13.8C0.800049 13.6408 0.863263 13.4882 0.975785 13.3757C1.08831 13.2632 1.24092 13.2 1.40005 13.2H1.60005V2.79998H1.40005C1.24092 2.79998 1.08831 2.73676 0.975785 2.62424C0.863263 2.51172 0.800049 2.35911 0.800049 2.19998ZM3.20005 4.39998C3.20005 4.29389 3.24219 4.19215 3.31721 4.11713C3.39222 4.04212 3.49396 3.99998 3.60005 3.99998H4.40005C4.50614 3.99998 4.60788 4.04212 4.68289 4.11713C4.75791 4.19215 4.80005 4.29389 4.80005 4.39998V5.19998C4.80005 5.30606 4.75791 5.4078 4.68289 5.48282C4.60788 5.55783 4.50614 5.59998 4.40005 5.59998H3.60005C3.49396 5.59998 3.39222 5.55783 3.31721 5.48282C3.24219 5.4078 3.20005 5.30606 3.20005 5.19998V4.39998ZM3.60005 7.19998C3.49396 7.19998 3.39222 7.24212 3.31721 7.31713C3.24219 7.39215 3.20005 7.49389 3.20005 7.59998V8.39998C3.20005 8.50606 3.24219 8.6078 3.31721 8.68282C3.39222 8.75783 3.49396 8.79998 3.60005 8.79998H4.40005C4.50614 8.79998 4.60788 8.75783 4.68289 8.68282C4.75791 8.6078 4.80005 8.50606 4.80005 8.39998V7.59998C4.80005 7.49389 4.75791 7.39215 4.68289 7.31713C4.60788 7.24212 4.50614 7.19998 4.40005 7.19998H3.60005ZM6.40005 4.39998C6.40005 4.29389 6.44219 4.19215 6.51721 4.11713C6.59222 4.04212 6.69396 3.99998 6.80005 3.99998H7.60005C7.70613 3.99998 7.80788 4.04212 7.88289 4.11713C7.95791 4.19215 8.00005 4.29389 8.00005 4.39998V5.19998C8.00005 5.30606 7.95791 5.4078 7.88289 5.48282C7.80788 5.55783 7.70613 5.59998 7.60005 5.59998H6.80005C6.69396 5.59998 6.59222 5.55783 6.51721 5.48282C6.44219 5.4078 6.40005 5.30606 6.40005 5.19998V4.39998ZM6.80005 7.19998C6.69396 7.19998 6.59222 7.24212 6.51721 7.31713C6.44219 7.39215 6.40005 7.49389 6.40005 7.59998V8.39998C6.40005 8.50606 6.44219 8.6078 6.51721 8.68282C6.59222 8.75783 6.69396 8.79998 6.80005 8.79998H7.60005C7.70613 8.79998 7.80788 8.75783 7.88289 8.68282C7.95791 8.6078 8.00005 8.50606 8.00005 8.39998V7.59998C8.00005 7.49389 7.95791 7.39215 7.88289 7.31713C7.80788 7.24212 7.70613 7.19998 7.60005 7.19998H6.80005ZM11.4 4.79998C11.2409 4.79998 11.0883 4.86319 10.9758 4.97571C10.8633 5.08823 10.8 5.24085 10.8 5.39998V13.6C10.8 13.8121 10.8843 14.0156 11.0344 14.1657C11.1844 14.3157 11.3879 14.4 11.6 14.4H14.6C14.7592 14.4 14.9118 14.3368 15.0243 14.2242C15.1368 14.1117 15.2 13.9591 15.2 13.8C15.2 13.6408 15.1368 13.4882 15.0243 13.3757C14.9118 13.2632 14.7592 13.2 14.6 13.2H14.4V5.99998H14.6C14.7592 5.99998 14.9118 5.93676 15.0243 5.82424C15.1368 5.71172 15.2 5.55911 15.2 5.39998C15.2 5.24085 15.1368 5.08823 15.0243 4.97571C14.9118 4.86319 14.7592 4.79998 14.6 4.79998H11.4ZM11.8 7.59998C11.8 7.49389 11.8422 7.39215 11.9172 7.31713C11.9922 7.24212 12.094 7.19998 12.2 7.19998H13C13.1061 7.19998 13.2079 7.24212 13.2829 7.31713C13.3579 7.39215 13.4 7.49389 13.4 7.59998V8.39998C13.4 8.50606 13.3579 8.6078 13.2829 8.68282C13.2079 8.75783 13.1061 8.79998 13 8.79998H12.2C12.094 8.79998 11.9922 8.75783 11.9172 8.68282C11.8422 8.6078 11.8 8.50606 11.8 8.39998V7.59998ZM12.2 10.4C12.094 10.4 11.9922 10.4421 11.9172 10.5171C11.8422 10.5921 11.8 10.6939 11.8 10.8V11.6C11.8 11.7061 11.8422 11.8078 11.9172 11.8828C11.9922 11.9578 12.094 12 12.2 12H13C13.1061 12 13.2079 11.9578 13.2829 11.8828C13.3579 11.8078 13.4 11.7061 13.4 11.6V10.8C13.4 10.6939 13.3579 10.5921 13.2829 10.5171C13.2079 10.4421 13.1061 10.4 13 10.4H12.2Z" fill="currentColor"/>
              </svg>}
            heading="Organization"
            subHeading="An organization in Aurora is a shared workspace where teams manage projects, AOIs, and image orders. It streamlines collaboration, analysis, and decision-making across industries."
            primaryAction={
              <Button size="small">Add new organization</Button>
            }
            secondaryAction={
              <Button size="small" variant="outline" color='neutral'>Documentation</Button>
            }
          />
        </Flex>
      </Flex>
    </Flex>
  )
}

export default Page