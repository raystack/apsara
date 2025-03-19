"use client"
import { Button, Flex, Sidebar, Text, IconButton } from '@raystack/apsara/v1'
import React, { useState } from 'react'
import { BellIcon, BellSlashIcon, CheckCircleFilledIcon, CoinColoredIcon, CoinIcon, CrossCircleFilledIcon, FilterIcon, OrganizationIcon, SidebarIcon } from '@raystack/apsara/icons'

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
          Main 
        </Text>
        
        <Flex justify="center" style={{ marginTop: 40}}>
          <Button type='submit'>Submit button</Button>
        </Flex>
      </Flex>
    </Flex>
  )
}

export default Page