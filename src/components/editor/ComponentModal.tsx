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
import { HeaderComponent, TextComponent } from "@/types/webstory"
import { FileText, Type } from "lucide-react"

type ComponentModalProps = {
  closeModal: () => void
}

export const ComponentModal = ({ closeModal }: ComponentModalProps) => {
  const { addComponent, components } = useWebstoryStore()

  // Check if a header component already exists
  const headerExists = components.some((component) => component.type === "header")

  const handleAddTextComponent = () => {
    const newTextComponent: TextComponent = {
      id: `${Date.now()}`,
      type: "text",
      content: "This is a new text component",
      order: components.length + 1,
      backgroundColor: "#ffffff",
      fontSize: "16px",
      fontFamily: "Arial",
      italic: false,
      bold: false,
      underline: false,
      alignment: "left",
    }
    addComponent(newTextComponent)
    closeModal()
  }

  const handleAddHeaderComponent = () => {
    const newHeaderComponent: HeaderComponent = {
      id: `${Date.now()}`,
      type: "header",
      backgroundColor: "#ffaaaa",
      order: 1,
      title: "New Header",
      subtitle: "Add your subtitle here",
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
