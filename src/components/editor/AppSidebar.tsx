import { Button } from "@/components/ui/button"
import {
  Sidebar,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { useToast } from "@/hooks/use-toast"
import { useWebstoryStore } from "@/stores/webstoryStore"
import type { HeaderComponent, TextComponent } from "@/types/webstory"
import { Save } from "lucide-react"
import { useState } from "react"

import { ComponentModal } from "./ComponentModal"
import { ConfigPanel } from "./ConfigPanel"
import { HeaderCard } from "./Header/HeaderCard"
import { HeaderConfig } from "./Header/HeaderConfig"
import { SidebarContent } from "./SidebarContent"
import { TextCard } from "./Text/TextCard"
import { TextConfig } from "./Text/TextConfig"
import { WebstorySettingsModal } from "./WebstorySettingsModal"

const AddComponentButton = () => {
  const [isModalOpen, setModalOpen] = useState(false)
  return (
    <div className="mt-4">
      <Button onClick={() => setModalOpen(true)} className="w-full">
        Add Component
      </Button>
      {isModalOpen && <ComponentModal closeModal={() => setModalOpen(false)} />}
    </div>
  )
}

interface AppSidebarProps {
  pageBackgroundColor?: string
  webstoryTitle?: string
  onPageBackgroundColorChange?: (color: string) => void
  onWebstoryTitleChange?: (title: string) => void
  onSave?: () => Promise<void>
}

export function AppSidebar({
  pageBackgroundColor = "#ffffff",
  webstoryTitle = "Untitled Webstory",
  onPageBackgroundColorChange,
  onWebstoryTitleChange,
  onSave,
}: AppSidebarProps) {
  const [activeConfig, setActiveConfig] = useState<string | null>(null)
  const [showConfigPanel, setShowConfigPanel] = useState(false)
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast() // Use the toast hook

  const components = useWebstoryStore((state) => state.components)
  const headerComponent = components.find((component) => component.type === "header") as HeaderComponent | undefined
  const textComponents = components.filter((component) => component.type === "text") as TextComponent[]

  const handleCardClick = (configType: string) => {
    setActiveConfig(configType)
    setShowConfigPanel(true)
  }

  const handleSave = async () => {
    if (onSave) {
      try {
        setIsSaving(true)
        await onSave()
        setIsSaving(false)
      } catch (error) {
        console.error("Error saving webstory:", error)
        setIsSaving(false)

        // Show error toast
        toast({
          variant: "destructive",
          title: "Save Failed",
          description: "Failed to save webstory. Please try again.",
        })
      }
    }
  }

  const openSettingsModal = () => {
    setIsSettingsModalOpen(true)
  }

  return (
    <Sidebar variant="inset">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" onClick={openSettingsModal}>
              <div
                className="flex aspect-square size-8 items-center justify-center rounded-lg text-white"
                style={{ backgroundColor: pageBackgroundColor }}
              >
                {webstoryTitle.charAt(0).toUpperCase()}
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{webstoryTitle}</span>
                <span className="truncate text-xs text-muted-foreground">Click to edit</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarSeparator />

      <div className="relative flex-1">
        <SidebarContent hidden={showConfigPanel}>
          {headerComponent && (
            <HeaderCard
              onClick={() => {
                handleCardClick("header")
              }}
            />
          )}

          {textComponents.map((textComponent) => (
            <TextCard
              key={textComponent.id}
              textComponent={textComponent} // Pass the component object
              onClick={() => handleCardClick(`text-${textComponent.id}`)}
            />
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
          )}
        </ConfigPanel>
      </div>

      {/* Save Button in Footer */}
      <SidebarFooter>
        <Button
          onClick={handleSave}
          className="w-full flex items-center justify-center gap-2"
          disabled={!onSave || isSaving}
        >
          {isSaving ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Save Webstory
            </>
          )}
        </Button>
      </SidebarFooter>

      {/* Webstory Settings Modal */}
      <WebstorySettingsModal
        open={isSettingsModalOpen}
        onOpenChange={setIsSettingsModalOpen}
        title={webstoryTitle}
        backgroundColor={pageBackgroundColor}
        onTitleChange={onWebstoryTitleChange}
        onBackgroundColorChange={onPageBackgroundColorChange}
      />
    </Sidebar>
  )
}
