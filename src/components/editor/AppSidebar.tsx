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
import { getTextColorClass } from "@/lib/color"
import { useWebstoryStore } from "@/stores/webstoryStore"
import type { HeaderComponent, PhotoTimelineComponent, TextComponent } from "@/types/webstory"
import {
  DndContext,
  DragEndEvent,
  DraggableAttributes,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Home, Image, Save, Send, Settings } from "lucide-react"
import { PlusCircle } from "lucide-react"
import React, { CSSProperties, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"

import { ComponentModal } from "./ComponentModal"
import { ConfigPanel } from "./ConfigPanel"
import { HeaderCard } from "./Header/HeaderCard"
import { HeaderConfig } from "./Header/HeaderConfig"
import { PhotoTimelineCard } from "./PhotoTimeline/PhotoTimelineCard"
import { PhotoTimelineConfig } from "./PhotoTimeline/PhotoTimelineConfig"
import { PhotoUploadModal } from "./PhotoUploader/PhotoUploadModal"
import { SidebarContent } from "./SidebarContent"
import { TextCard } from "./Text/TextCard"
import { TextConfig } from "./Text/TextConfig"
import { WebstorySettingsModal } from "./WebstorySettingsModal"

interface SortableInjectedProps {
  attributes?: DraggableAttributes
  listeners?: any
  isDragging?: boolean
}

interface SortableItemProps {
  id: string
  children: React.ReactElement
}

function SortableItem({ id, children }: SortableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })

  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  if (!React.isValidElement<SortableInjectedProps>(children)) {
    return (
      <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
        Invalid Child
      </div>
    )
  }

  const injectedProps: SortableInjectedProps = {
    attributes: attributes,
    listeners: listeners,
    isDragging: isDragging,
  }

  const childWithProps = React.cloneElement<SortableInjectedProps>(children, injectedProps)

  return (
    <div ref={setNodeRef} style={style}>
      {childWithProps}
    </div>
  )
}

const AddComponentButton = () => {
  const [isModalOpen, setModalOpen] = useState(false)

  return (
    <div className="mt-4">
      <Button variant="default" onClick={() => setModalOpen(true)} className="w-full flex items-center gap-2">
        Add Component
        <PlusCircle strokeWidth={2.5} size={24} />
      </Button>
      {isModalOpen && <ComponentModal closeModal={() => setModalOpen(false)} />}
    </div>
  )
}

interface AppSidebarProps {
  pageBackgroundColor?: string
  webstoryTitle?: string
  webstoryId?: string
  onPageBackgroundColorChange?: (color: string) => void
  onWebstoryTitleChange?: (title: string) => void
  onSave?: () => Promise<void>
  onPublish?: () => Promise<void>
}

export function AppSidebar({
  pageBackgroundColor = "#ffffff",
  webstoryTitle = "Untitled Webstory",
  webstoryId = "",
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
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false)
  const { toast } = useToast()
  const navigate = useNavigate()

  const components = useWebstoryStore((state) => state.components)
  const setComponents = useWebstoryStore((state) => state.setComponents)

  const headerComponent = useMemo(() => components.find((c) => c.type === "header"), [components])

  const textColorClass = getTextColorClass(pageBackgroundColor)

  const sortableItems = useMemo(
    () => components.filter((c) => c.type !== "header").sort((a, b) => a.order - b.order),
    [components]
  )

  const renderableSortableItems = useMemo(
    () => sortableItems.filter((comp) => comp.type === "text" || comp.type === "photoTimeline"),
    [sortableItems]
  )

  const renderableSortableItemIds = useMemo(
    () => renderableSortableItems.map((item) => item.id),
    [renderableSortableItems]
  )

  const handleCardClick = (configId: string) => {
    setActiveConfig(configId)
    setShowConfigPanel(true)
  }

  const handleBackFromConfig = () => {
    setShowConfigPanel(false)
    setActiveConfig(null)
  }

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 10 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = sortableItems.findIndex((item) => item.id === active.id)
      const newIndex = sortableItems.findIndex((item) => item.id === over.id)

      if (oldIndex !== -1 && newIndex !== -1) {
        const reorderedSortableItems = arrayMove(sortableItems, oldIndex, newIndex)

        const finalComponents = [...(headerComponent ? [headerComponent] : []), ...reorderedSortableItems].map(
          (component, index) => ({
            ...component,
            order: index,
          })
        )
        setComponents(finalComponents)
      }
    }
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
  const openPhotoModal = () => {
    setIsPhotoModalOpen(true)
  }
  const handleNavigateHome = () => {
    navigate("/")
  }

  const renderActiveConfig = () => {
    if (!activeConfig) return null
    const activeComponent = components.find((comp) =>
      activeConfig === "header" ? comp.type === "header" : activeConfig === `${comp.type}-${comp.id}`
    )
    if (!activeComponent) return null

    switch (activeComponent.type) {
      case "header":
        return <HeaderConfig headerComponent={activeComponent as HeaderComponent} onBack={handleBackFromConfig} />
      case "text":
        return <TextConfig textComponent={activeComponent as TextComponent} onBack={handleBackFromConfig} />
      case "photoTimeline":
        return (
          <PhotoTimelineConfig
            photoTimelineComponent={activeComponent as PhotoTimelineComponent}
            onBack={handleBackFromConfig}
            webstoryId={webstoryId}
          />
        )
      default:
        return null
    }
  }

  return (
    <Sidebar variant="inset">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" onClick={openSettingsModal} aria-label="Open webstory settings">
              <div
                className={`flex aspect-square size-8 flex-shrink-0 items-center justify-center rounded-lg  border border-gray-200  ${textColorClass}`}
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
          {headerComponent && <HeaderCard key={headerComponent.id} onClick={() => handleCardClick("header")} />}

          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={renderableSortableItemIds} strategy={verticalListSortingStrategy}>
              {renderableSortableItems.map((component) => (
                <SortableItem key={component.id} id={component.id}>
                  {component.type === "text" ? (
                    <TextCard
                      textComponent={component as TextComponent}
                      onClick={() => handleCardClick(`text-${component.id}`)}
                    />
                  ) : (
                    <PhotoTimelineCard
                      photoTimelineComponent={component as PhotoTimelineComponent}
                      onClick={() => handleCardClick(`photoTimeline-${component.id}`)}
                    />
                  )}
                </SortableItem>
              ))}
            </SortableContext>
          </DndContext>

          <AddComponentButton />
        </SidebarContent>
        <ConfigPanel show={showConfigPanel}>{renderActiveConfig()}</ConfigPanel>
      </div>

      <SidebarFooter className="flex items-center gap-2 p-2">
        <Button
          variant="outline"
          size="icon"
          onClick={handleNavigateHome}
          aria-label="Back to Home"
          className="flex-shrink-0"
        >
          <Home className="size-5" />
        </Button>
        <div className="flex items-center gap-2 flex-grow">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSave}
            disabled={!onSave || isSaving || isPublishing}
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
            size="sm"
            onClick={handlePublish}
            disabled={!onPublish || isSaving || isPublishing}
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
        <Button
          variant="outline"
          size="icon"
          onClick={openPhotoModal}
          aria-label="Open Photo Gallery"
          className="flex-shrink-0"
          disabled={isSaving || isPublishing}
        >
          <Image className="size-5" />
        </Button>
      </SidebarFooter>

      <WebstorySettingsModal
        open={isSettingsModalOpen}
        onOpenChange={setIsSettingsModalOpen}
        title={webstoryTitle}
        backgroundColor={pageBackgroundColor}
        onTitleChange={onWebstoryTitleChange}
        onBackgroundColorChange={onPageBackgroundColorChange}
      />
      {isPhotoModalOpen && (
        <PhotoUploadModal open={isPhotoModalOpen} onOpenChange={setIsPhotoModalOpen} webstoryId={webstoryId} />
      )}
    </Sidebar>
  )
}
