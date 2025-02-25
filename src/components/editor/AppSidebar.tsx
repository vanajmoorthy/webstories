import { Button } from "@/components/ui/button"
import {
  Sidebar,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { useWebstoryStore } from "@/stores/webstoryStore"
import { HeaderComponent } from "@/types/webstory"
import { Command } from "lucide-react"
import { useState } from "react"

import { HeaderCard } from "./HeaderCard"
import { HeaderConfig } from "./HeaderConfig"

export function AppSidebar() {
  const [showHeaderMenu, setShowHeaderMenu] = useState(false)
  const [selectedHeader, setSelectedHeader] = useState<HeaderComponent | null>(null)
  const components = useWebstoryStore((state) => state.components)
  const addComponent = useWebstoryStore((state) => state.addComponent)

  const handleAddHeader = () => {
    const newHeader: HeaderComponent = {
      id: `${Date.now()}`,
      type: "header",
      backgroundColor: "#ffaaaa",
      order: 1,
      title: "New Header",
      subtitle: "Subtitle",
      titleStyle: { fontSize: "20px", fontFamily: "Arial", color: "black" },
    }
    addComponent(newHeader)
  }

  const headerComponent = components.find((component) => component.type === "header")

  return (
    <Sidebar variant="inset">
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

      {headerComponent && (
        <div className="p-2">
          <HeaderCard
            onClick={() => {
              setSelectedHeader(headerComponent)
              setShowHeaderMenu(true)
            }}
          />
        </div>
      )}

      <div className="p-2">
        <Button onClick={handleAddHeader}>Add Header</Button>
      </div>

      {showHeaderMenu && selectedHeader && (
        <HeaderConfig headerComponent={selectedHeader} onBack={() => setShowHeaderMenu(false)} />
      )}
    </Sidebar>
  )
}
