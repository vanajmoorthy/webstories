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

import { Card, CardContent } from "@/components/ui/card"

function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
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
      <div className="p-2">
        <Card className="mt-2">
          <CardContent className="p-3">
            <p>Header</p>
          </CardContent>
        </Card>
        <Card className="mt-2">
          <CardContent className="p-3">
            <p>Header</p>
          </CardContent>
        </Card>
      </div>
    </Sidebar>
  )
}
export default AppSidebar
