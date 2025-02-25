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
import { useState } from "react"

import { ComponentModal } from "./ComponentModal"
import { HeaderCard } from "./HeaderCard"
import { HeaderConfig } from "./HeaderConfig"
import { TextCard } from "./TextCard"

const AddComponentButton = () => {
  const [isModalOpen, setModalOpen] = useState(false)

  const openModal = () => setModalOpen(true)
  const closeModal = () => setModalOpen(false)

  return (
    <div>
      <Button onClick={openModal}>Add Component</Button>
      {isModalOpen && <ComponentModal closeModal={closeModal} />}
    </div>
  )
}

export function AppSidebar() {
  const [showHeaderMenu, setShowHeaderMenu] = useState(false)
  const [selectedHeader, setSelectedHeader] = useState<HeaderComponent | null>(null)
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
        {textComponents.map((textComponent: TextComponent) => (
          <TextCard key={textComponent.id} onClick={() => { }} />
        ))}
      </div>

      <div className="p-2">
        <AddComponentButton />
      </div>

      {showHeaderMenu && selectedHeader && (
        <HeaderConfig headerComponent={selectedHeader} onBack={() => setShowHeaderMenu(false)} />
      )}
    </Sidebar>
  )
}
