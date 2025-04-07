import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useWebstoryStore } from "@/stores/webstoryStore"
import type { HeaderComponent, PhotoTimelineComponent, TextComponent, TimelineRow } from "@/types/webstory"
import { Clock, FileText, Type } from "lucide-react"

type ComponentModalProps = {
  closeModal: () => void
}

export const ComponentModal = ({ closeModal }: ComponentModalProps) => {
  const { addComponent, components } = useWebstoryStore()

  const headerExists = components.some((component) => component.type === "header")

  const handleAddTextComponent = () => {
    const newTextComponent: TextComponent = {
      id: `${Date.now()}`,
      type: "text",
      content: "This is a new text component",
      order: components.length + 1,
      backgroundColor: "none",
      fontSize: "16px",
      fontFamily: "Arial",
      italic: false,
      bold: false,
      underline: false,
      alignment: "left",
      height: "auto",
      verticalAlignment: "center",
    }
    addComponent(newTextComponent)
    closeModal()
  }

  const handleAddHeaderComponent = () => {
    const newHeaderComponent: HeaderComponent = {
      id: `${Date.now()}`,
      type: "header",
      backgroundColor: "#ffaaaa",
      order: 0,
      title: "New Header",
      subtitle: "Add your subtitle here",
      height: "200px",
      verticalAlignment: "center",
      titleStyle: {
        fontSize: "24px",
        fontFamily: "Arial",
        color: "#000000",
        textAlign: "center",
        bold: false,
        italic: false,
        underline: false,
      },
      subtitleStyle: {
        fontSize: "16px",
        fontFamily: "Arial",
        color: "#666666",
        textAlign: "center",
        bold: false,
        italic: false,
        underline: false,
      },
    }
    addComponent(newHeaderComponent)
    closeModal()
  }

  const createDefaultTimelineRow = (): TimelineRow => ({
    id: `row-${Date.now()}`,
    photos: [],
    date: new Date().toISOString().split("T")[0],
    text: "Add your story here...",
  })

  const handleAddPhotoTimelineComponent = () => {
    const newPhotoTimelineComponent: PhotoTimelineComponent = {
      id: `${Date.now()}`,
      type: "photoTimeline",
      backgroundColor: "#fff5f5",
      alignment: "alternate",
      order: components.length + 1,
      photoSize: "medium",
      rows: [createDefaultTimelineRow()],
    }
    addComponent(newPhotoTimelineComponent)
    closeModal()
  }

  return (
    <Dialog open onOpenChange={closeModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a Component</DialogTitle>
          <DialogDescription>Choose a component type to add to your webstory.</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-3 py-4">
          {!headerExists && (
            <Button
              variant="outline"
              onClick={handleAddHeaderComponent}
              className="flex items-center justify-start h-16 px-4"
            >
              <Type className="h-5 w-5 mr-3" />
              <div className="text-left">
                <div className="font-medium">Header</div>
                <div className="text-xs text-muted-foreground">Add a title and subtitle section</div>
              </div>
            </Button>
          )}

          <Button
            variant="outline"
            onClick={handleAddTextComponent}
            className="flex items-center justify-start h-16 px-4"
          >
            <FileText className="h-5 w-5 mr-3" />
            <div className="text-left">
              <div className="font-medium">Text</div>
              <div className="text-xs text-muted-foreground">Add a text paragraph</div>
            </div>
          </Button>

          <Button
            variant="outline"
            onClick={handleAddPhotoTimelineComponent}
            className="flex items-center justify-start h-16 px-4"
          >
            <Clock className="h-5 w-5 mr-3" />
            <div className="text-left">
              <div className="font-medium">Photo Timeline</div>
              <div className="text-xs text-muted-foreground">Add a timeline with photos and stories</div>
            </div>
          </Button>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={closeModal}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
