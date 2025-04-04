import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ColorPickerField } from "@/components/ui/color-picker-field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useWebstoryStore } from "@/stores/webstoryStore"
import type { TextComponent } from "@/types/webstory"
import { Bold, ChevronLeft, FileText, Italic, Trash2, Underline } from "lucide-react"
import { useState } from "react"

interface TextConfigProps {
  textComponent: TextComponent
  onBack: () => void
}

export function TextConfig({ textComponent, onBack }: TextConfigProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const updateComponent = useWebstoryStore((state) => state.updateComponent)
  const components = useWebstoryStore((state) => state.components)
  const setComponents = useWebstoryStore((state) => state.setComponents)

  // Real-time update functions
  const updateContent = (content: string) => {
    updateComponent(textComponent.id, { content })
  }

  const updateFontSize = (fontSize: string) => {
    updateComponent(textComponent.id, { fontSize })
  }

  const updateFontFamily = (fontFamily: string) => {
    updateComponent(textComponent.id, { fontFamily })
  }

  const updateBold = (bold: boolean) => {
    updateComponent(textComponent.id, { bold })
  }

  const updateItalic = (italic: boolean) => {
    updateComponent(textComponent.id, { italic })
  }

  const updateUnderline = (underline: boolean) => {
    updateComponent(textComponent.id, { underline })
  }

  const updateBackgroundColor = (backgroundColor: string) => {
    updateComponent(textComponent.id, { backgroundColor })
  }

  const updateAlignment = (alignment: "left" | "center" | "right") => {
    updateComponent(textComponent.id, { alignment })
  }

  const handleDelete = () => {
    const updatedComponents = components.filter((component) => component.id !== textComponent.id)
    setComponents(updatedComponents)
    onBack()
  }

  return (
    <div className="inset-0 pt-2 bg-sidebar">
      <Card className="p-3">
        {/* Header with back button and title */}
        <div className="flex items-center mb-3">
          <Button variant="ghost" size="sm" onClick={onBack} className="mr-2 px-2">
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Button>

          <div className="flex items-center gap-2 flex-1">
            <FileText className="h-5 w-5 text-muted-foreground" />
            <h3 className="font-medium">Text Component</h3>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowDeleteDialog(true)}
            className="text-destructive hover:text-destructive hover:bg-destructive/10 px-2"
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Delete</span>
          </Button>
        </div>

        <Tabs defaultValue="content" className="w-full">
          <TabsList className="grid grid-cols-2 mb-4 h-9">
            <TabsTrigger value="content" className="text-xs px-1">
              Content
            </TabsTrigger>
            <TabsTrigger value="style" className="text-xs px-1">
              Style
            </TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="space-y-4 mt-0">
            <div>
              <Label htmlFor="text-content">Text Content</Label>
              <Input id="text-content" value={textComponent.content} onChange={(e) => updateContent(e.target.value)} />
            </div>

            <ColorPickerField
              label="Background Color"
              value={textComponent.backgroundColor ?? ""}
              onChange={updateBackgroundColor}
            />
          </TabsContent>

          <TabsContent value="style" className="space-y-4 mt-0">
            <div>
              <Label htmlFor="font-size">Font Size</Label>
              <Input id="font-size" value={textComponent.fontSize} onChange={(e) => updateFontSize(e.target.value)} />
            </div>

            <div>
              <Label htmlFor="font-family">Font Family</Label>
              <Input
                id="font-family"
                value={textComponent.fontFamily}
                onChange={(e) => updateFontFamily(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="text-style">Text Style</Label>
              <div className="flex gap-1 mt-1">
                <Button
                  type="button"
                  size="sm"
                  variant={textComponent.bold ? "default" : "outline"}
                  className={`px-3 h-8 ${textComponent.bold ? "bg-primary/90" : ""}`}
                  onClick={() => updateBold(!textComponent.bold)}
                >
                  <Bold className="h-4 w-4" />
                  <span className="sr-only">Bold</span>
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant={textComponent.italic ? "default" : "outline"}
                  className={`px-3 h-8 ${textComponent.italic ? "bg-primary/90" : ""}`}
                  onClick={() => updateItalic(!textComponent.italic)}
                >
                  <Italic className="h-4 w-4" />
                  <span className="sr-only">Italic</span>
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant={textComponent.underline ? "default" : "outline"}
                  className={`px-3 h-8 ${textComponent.underline ? "bg-primary/90" : ""}`}
                  onClick={() => updateUnderline(!textComponent.underline)}
                >
                  <Underline className="h-4 w-4" />
                  <span className="sr-only">Underline</span>
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor="text-alignment">Text Alignment</Label>
              <Select
                value={textComponent.alignment || "left"}
                onValueChange={(value) => updateAlignment(value as "left" | "center" | "right")}
              >
                <SelectTrigger id="text-alignment">
                  <SelectValue placeholder="Select alignment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="left">Left</SelectItem>
                  <SelectItem value="center">Center</SelectItem>
                  <SelectItem value="right">Right</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </TabsContent>
        </Tabs>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Text Component</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this text component? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
