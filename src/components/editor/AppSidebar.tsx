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
import { HeaderComponent, TextComponent } from "@/types/webstory"
import { Command } from "lucide-react"
import { useEffect, useState } from "react"

import { ComponentModal } from "./ComponentModal"
import { ConfigPanel } from "./ConfigPanel"
import { HeaderCard } from "./HeaderCard"
import { HeaderConfig } from "./HeaderConfig"
import { SidebarContent } from "./SidebarContent"
import { TextCard } from "./TextCard"

const AddComponentButton = () => {
  const [isModalOpen, setModalOpen] = useState(false)
  return (
    <div>
      <Button onClick={() => setModalOpen(true)}>Add Component</Button>
      {isModalOpen && <ComponentModal closeModal={() => setModalOpen(false)} />}
    </div>
  )
}

export function AppSidebar() {
  const [activeConfig, setActiveConfig] = useState<string | null>(null)
  const [showHeaderConfig, setShowHeaderConfig] = useState(false)
  const components = useWebstoryStore((state) => state.components)
  const headerComponent = components.find((component) => component.type === "header")
  const textComponents = components.filter((component) => component.type === "text")

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

      <div className="relative">
        <SidebarContent hidden={showHeaderConfig}>
          {headerComponent && (
            <HeaderCard
              onClick={() => {
                setActiveConfig("header")
                setShowHeaderConfig((showHeaderConfig) => !showHeaderConfig)
              }}
            />
          )}

          {textComponents.map((textComponent) => (
            <TextCard key={textComponent.id} onClick={() => setActiveConfig(`text-${textComponent.id}`)} />
          ))}

          <AddComponentButton />
        </SidebarContent>
        <ConfigPanel show={showHeaderConfig}>
          {activeConfig === "header" && headerComponent && (
            <HeaderConfig
              headerComponent={headerComponent}
              onBack={() => {
                setShowHeaderConfig((showHeaderConfig) => !showHeaderConfig)
                //setActiveConfig(null)
              }}
            />
          )}

          {activeConfig === "text" && <TextConfig onBack={() => setActiveConfig(null)} />}
        </ConfigPanel>
      </div>
    </Sidebar>
  )
}
