"use client"

import * as React from "react"
import { Command } from "lucide-react"

import {
  Sidebar,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"

import { HeaderCard } from "./HeaderCard"
import { useState } from "react"
import { HeaderConfig } from "./HeaderConfig"

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  headerData: {
    heading: string
    backgroundColor: string
  }
  onHeaderChange: (newData: { heading?: string; backgroundColor?: string }) => void
}

export function AppSidebar({ headerData, onHeaderChange, ...props }: AppSidebarProps) {
  const [showHeaderMenu, setShowHeaderMenu] = useState(false)

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">orange-fish.webstories.live</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarSeparator />

      {!showHeaderMenu ? (
        <div className="p-2">
          <HeaderCard
            onClick={() => {
              setShowHeaderMenu(true)
            }}
          />
        </div>
      ) : (
        <HeaderConfig
          onChange={() => { }}
          onBack={() => {
            setShowHeaderMenu(false)
          }}
          data={headerData}
        />
      )}
    </Sidebar>
  )
}
