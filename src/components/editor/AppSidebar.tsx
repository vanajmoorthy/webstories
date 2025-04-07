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
import { Home, Save, Send, Settings } from "lucide-react"
// Removed ArrowLeft
import { useState } from "react"
import { useNavigate } from "react-router-dom"

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
      <Button variant="default" onClick={() => setModalOpen(true)} className="w-full">
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
  onPublish?: () => Promise<void>
}

export function AppSidebar({
  pageBackgroundColor = "#ffffff",
  webstoryTitle = "Untitled Webstory",
  onPageBackgroundColorChange,
  onWebstoryTitleChange,
  onSave,
  onPublish,
}: AppSidebarProps) {
  const [activeConfig, setActiveConfig] = useState<string | null>(null)
  const [showConfigPanel, setShowConfigPanel] = useState(false)
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isPublishing, setIsPublishing] = useState(false)
  const { toast } = useToast()
  const navigate = useNavigate()

  const components = useWebstoryStore((state) => state.components)
  const headerComponent = components.find((component) => component.type === "header") as HeaderComponent | undefined
  const textComponents = components.filter((component) => component.type === "text") as TextComponent[]

  const handleCardClick = (configType: string) => {
    setActiveConfig(configType)
    setShowConfigPanel(true)
  }

  const handleSave = async () => {
    if (onSave) {
      setIsSaving(true)
      try {
        await onSave()
        toast({
          title: "Saved Successfully",
          description: "Your webstory draft has been saved.",
        })
      } catch (error) {
        console.error("Error saving webstory:", error)
        toast({
          variant: "destructive",
          title: "Save Failed",
          description: "Failed to save webstory draft. Please try again.",
        })
      } finally {
        setIsSaving(false)
      }
    }
  }

  const handlePublish = async () => {
    if (onPublish) {
      setIsPublishing(true)
      try {
        await onPublish()
        toast({
          title: "Published Successfully",
          description: "Your webstory has been published.",
        })
      } catch (error) {
        console.error("Error publishing webstory:", error)
        toast({
          variant: "destructive",
          title: "Publish Failed",
          description: "Failed to publish webstory. Please try again.",
        })
      } finally {
        setIsPublishing(false)
      }
    } else {
      console.warn("Publish action not implemented.")
      toast({
        variant: "default",
        title: "Publish Not Available",
        description: "The publish functionality is not configured.",
      })
    }
  }

  const openSettingsModal = () => {
    setIsSettingsModalOpen(true)
  }

  const handleNavigateHome = () => {
    navigate("/")
  }

  return (
    <Sidebar variant="inset">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" onClick={openSettingsModal} aria-label="Open webstory settings">
              <div
                className="flex aspect-square size-8 flex-shrink-0 items-center justify-center rounded-lg text-white"
                style={{ backgroundColor: pageBackgroundColor }}
              >
                {webstoryTitle.charAt(0).toUpperCase()}
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight ml-2 min-w-0">
                <span className="truncate font-semibold">{webstoryTitle}</span>
                <span className="truncate text-xs text-muted-foreground">Click to edit</span>
              </div>
              <Settings className="ml-2 size-4 flex-shrink-0 text-muted-foreground" />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarSeparator />

      <div className="relative flex-1 overflow-y-auto">
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
              textComponent={textComponent}
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

      {/* Modified Footer with expanding Save/Publish */}
      <SidebarFooter className="flex items-center gap-2 p-2">
        {" "}
        {/* Removed justify-between */}
        {/* Home Button (Left, fixed size) */}
        <Button
          variant="outline"
          size="icon"
          onClick={handleNavigateHome}
          aria-label="Back to Home"
          className="flex-shrink-0" // Prevent shrinking
        >
          <Home className="size-5" />
        </Button>
        {/* Save and Publish Buttons Container (Takes remaining space) */}
        {/* Added flex-grow to this div */}
        <div className="flex items-center gap-2 flex-grow">
          <Button
            variant="outline"
            size="icon"
            onClick={handleSave}
            disabled={!onSave || isSaving || isPublishing}
            // Added flex-grow and justify-center
            className="flex flex-grow items-center justify-center gap-1.5"
          >
            {isSaving ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save
              </>
            )}
          </Button>
          <Button
            size="icon"
            onClick={handlePublish}
            disabled={!onPublish || isSaving || isPublishing}
            // Added flex-grow and justify-center
            className="flex flex-grow items-center justify-center gap-1.5"
          >
            {isPublishing ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Publishing...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Publish
              </>
            )}
          </Button>
        </div>
      </SidebarFooter>

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
