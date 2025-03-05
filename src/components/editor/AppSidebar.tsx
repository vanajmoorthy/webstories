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
import { HeaderCard } from "./Header/HeaderCard"
import { HeaderConfig } from "./Header/HeaderConfig"
import { SidebarContent } from "./SidebarContent"
import { TextCard } from "./Text/TextCard"
import { TextConfig } from "./Text/TextConfig"

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
  const [showConfigPanel, setShowConfigPanel] = useState(false)
  const components = useWebstoryStore((state) => state.components)
  const headerComponent = components.find((component) => component.type === "header")
  const textComponents = components.filter((component) => component.type === "text")

  const handleCardClick = (configType: string) => {
    setActiveConfig(configType)
    setShowConfigPanel(true)
  }

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
        <SidebarContent hidden={showConfigPanel}>
          {headerComponent && (
            <HeaderCard
              onClick={() => {
                handleCardClick("header")
              }}
            />
          )}

          {textComponents.map((textComponent) => (
            <TextCard key={textComponent.id} onClick={() => handleCardClick(`text-${textComponent.id}`)} />
          ))}

          <AddComponentButton />
        </SidebarContent>
        <ConfigPanel show={showConfigPanel}>
          {activeConfig === "header" && headerComponent && (
            <HeaderConfig
              headerComponent={headerComponent}
              onBack={() => {
                setShowConfigPanel(false)
              }}
            />
          )}
          {textComponents.map(
            (textComponent) =>
              activeConfig === `text-${textComponent.id}` && (
                <TextConfig
                  key={textComponent.id}
                  textComponent={textComponent}
                  onBack={() => {
                    setShowConfigPanel(false)
                  }}
                />
              )
          )}{" "}
        </ConfigPanel>
      </div>
    </Sidebar>
  )
}
