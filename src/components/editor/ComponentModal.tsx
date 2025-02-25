import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useWebstoryStore } from "@/stores/webstoryStore"
import { TextComponent } from "@/types/webstory"

type ComponentModalProps = {
  closeModal: () => void
}

export const ComponentModal = ({ closeModal }: ComponentModalProps) => {
  const addComponent = useWebstoryStore((state) => state.addComponent)

  const handleAddTextComponent = () => {
    const newTextComponent: TextComponent = {
      id: `${Date.now()}`,
      type: "text",
      content: "This is a new text component",
      order: 2,
      backgroundColor: "#ffffff",
      fontSize: "16px",
      fontFamily: "Arial",
      italic: false,
      bold: false,
    }
    addComponent(newTextComponent)
    closeModal()
  }

  return (
    <Dialog open onOpenChange={closeModal}>
      <DialogContent>
        <DialogTitle>Select a Component</DialogTitle>
        <div className="flex flex-col space-y-2">
          <Button variant="outline" onClick={handleAddTextComponent}>
            Text Component
          </Button>
        </div>
        <DialogFooter>
          <Button variant="link" onClick={closeModal}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
