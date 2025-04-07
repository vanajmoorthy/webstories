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
import { parsePixelValue } from "@/lib/utils"
import { useWebstoryStore } from "@/stores/webstoryStore"
import type { HeaderComponent } from "@/types/webstory"
import { Bold, ChevronLeft, Italic, Trash2, Type, Underline } from "lucide-react"
import { useState } from "react"

interface HeaderConfigProps {
  headerComponent: HeaderComponent
  onBack: () => void
}

export function HeaderConfig({ headerComponent, onBack }: HeaderConfigProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const updateComponent = useWebstoryStore((state) => state.updateComponent)
  const components = useWebstoryStore((state) => state.components)
  const setComponents = useWebstoryStore((state) => state.setComponents)

  const updateTitle = (title: string) => {
    updateComponent(headerComponent.id, { title })
  }

  const updateSubtitle = (subtitle: string) => {
    updateComponent(headerComponent.id, { subtitle })
  }

  const updateBackgroundColor = (backgroundColor: string) => {
    updateComponent(headerComponent.id, { backgroundColor })
  }

  const updateHeight = (height: string) => {
    updateComponent(headerComponent.id, { height })
  }

  const updateVerticalAlignment = (alignment: "top" | "center" | "bottom") => {
    updateComponent(headerComponent.id, { verticalAlignment: alignment })
  }

  // --- Input Change Handlers ---
  const handleHeightInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value
    if (rawValue === "") {
      updateHeight("0px")
      return
    }
    const numValue = parseInt(rawValue, 10)
    if (!isNaN(numValue)) {
      updateHeight(`${Math.max(0, numValue)}px`)
    }
  }

  const handleFontSizeInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    updateFn: (updates: { fontSize: string }) => void
  ) => {
    const rawValue = e.target.value
    if (rawValue === "") {
      updateFn({ fontSize: "0px" })
      return
    }
    const numValue = parseInt(rawValue, 10)
    if (!isNaN(numValue)) {
      updateFn({ fontSize: `${Math.max(0, numValue)}px` }) // Store font size with px
    }
  }
  // --- End Input Change Handlers ---

  const updateTitleStyle = (updates: Partial<HeaderComponent["titleStyle"]>) => {
    updateComponent(headerComponent.id, {
      titleStyle: { ...headerComponent.titleStyle, ...updates },
    })
  }

  const updateSubtitleStyle = (updates: Partial<HeaderComponent["subtitleStyle"]>) => {
    updateComponent(headerComponent.id, {
      subtitleStyle: { ...headerComponent.subtitleStyle, ...updates },
    })
  }

  // --- Get Display Values ---
  const displayHeightValue = (parsePixelValue(headerComponent.height) ?? "").toString()
  const displayTitleFontSize = (parsePixelValue(headerComponent.titleStyle.fontSize) ?? "").toString()
  const displaySubtitleFontSize = (parsePixelValue(headerComponent.subtitleStyle.fontSize) ?? "").toString()
  // --- End Display Values ---

  const handleDelete = () => {
    const updatedComponents = components.filter((component) => component.id !== headerComponent.id)
    setComponents(updatedComponents)
    onBack()
  }

  return (
    <div className="inset-0 pt-2 bg-sidebar">
      <Card className="p-3">
        <div className="flex items-center mb-3">
          <Button variant="ghost" size="sm" onClick={onBack} className="mr-2 px-2">
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Button>
          <div className="flex items-center gap-2 flex-1">
            <Type className="h-5 w-5 text-muted-foreground" />
            <h3 className="font-medium">Header Component</h3>
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

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid grid-cols-3 mb-4 h-9">
            <TabsTrigger value="general" className="text-xs px-1">
              General
            </TabsTrigger>
            <TabsTrigger value="title" className="text-xs px-1">
              Title Style
            </TabsTrigger>
            <TabsTrigger value="subtitle" className="text-xs px-1">
              Subtitle Style
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4 mt-0">
            <div>
              <Label htmlFor="heading">Heading Text</Label>
              <Input id="heading" value={headerComponent.title} onChange={(e) => updateTitle(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="subheading">Subheading Text</Label>
              <Input
                id="subheading"
                value={headerComponent.subtitle}
                onChange={(e) => updateSubtitle(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="header-height-input">Header Height (px)</Label>
              <Input
                id="header-height-input"
                type="number"
                min="0"
                placeholder="e.g., 100 (leave blank for auto)"
                value={displayHeightValue}
                onChange={handleHeightInputChange}
                className="h-9"
                aria-label="Header height in pixels"
              />
            </div>
            <div>
              <Label htmlFor="vertical-alignment">Vertical Alignment</Label>
              <Select
                value={headerComponent.verticalAlignment || "center"}
                onValueChange={(value) => updateVerticalAlignment(value as "top" | "center" | "bottom")}
              >
                <SelectTrigger id="vertical-alignment" className="h-9">
                  <SelectValue placeholder="Select vertical alignment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="top">Top</SelectItem>
                  <SelectItem value="center">Center</SelectItem>
                  <SelectItem value="bottom">Bottom</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <ColorPickerField
              label="Background Color"
              value={headerComponent.backgroundColor}
              onChange={updateBackgroundColor}
            />
          </TabsContent>

          <TabsContent value="title" className="space-y-4 mt-0">
            {/* --- Updated Title Font Size Input --- */}
            <div>
              <Label htmlFor="title-font-size">Font Size (px)</Label>
              <Input
                id="title-font-size"
                type="number"
                min="0"
                placeholder="e.g., 24"
                value={displayTitleFontSize}
                onChange={(e) => handleFontSizeInputChange(e, updateTitleStyle)}
                className="h-9"
                aria-label="Title font size in pixels"
              />
            </div>
            {/* --- End Updated Input --- */}
            <div>
              <Label htmlFor="title-font-family">Font Family</Label>
              <Input
                id="title-font-family"
                value={headerComponent.titleStyle.fontFamily}
                onChange={(e) => updateTitleStyle({ fontFamily: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="title-text-style">Text Style</Label>
              <div className="flex gap-1 mt-1">
                <Button
                  type="button"
                  size="sm"
                  variant={headerComponent.titleStyle.bold ? "default" : "outline"}
                  className={`px-3 h-8 ${headerComponent.titleStyle.bold ? "bg-primary/90" : ""}`}
                  onClick={() => updateTitleStyle({ bold: !headerComponent.titleStyle.bold })}
                >
                  <Bold className="h-4 w-4" />
                  <span className="sr-only">Bold</span>
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant={headerComponent.titleStyle.italic ? "default" : "outline"}
                  className={`px-3 h-8 ${headerComponent.titleStyle.italic ? "bg-primary/90" : ""}`}
                  onClick={() => updateTitleStyle({ italic: !headerComponent.titleStyle.italic })}
                >
                  <Italic className="h-4 w-4" />
                  <span className="sr-only">Italic</span>
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant={headerComponent.titleStyle.underline ? "default" : "outline"}
                  className={`px-3 h-8 ${headerComponent.titleStyle.underline ? "bg-primary/90" : ""}`}
                  onClick={() => updateTitleStyle({ underline: !headerComponent.titleStyle.underline })}
                >
                  <Underline className="h-4 w-4" />
                  <span className="sr-only">Underline</span>
                </Button>
              </div>
            </div>
            <ColorPickerField
              label="Text Color"
              value={headerComponent.titleStyle.color}
              onChange={(color) => updateTitleStyle({ color })}
            />
            <div>
              <Label htmlFor="title-alignment">Text Alignment</Label>
              <Select
                value={headerComponent.titleStyle.textAlign}
                onValueChange={(value) => updateTitleStyle({ textAlign: value as "left" | "right" | "center" })}
              >
                <SelectTrigger id="title-alignment" className="h-9">
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

          <TabsContent value="subtitle" className="space-y-4 mt-0">
            {/* --- Updated Subtitle Font Size Input --- */}
            <div>
              <Label htmlFor="subtitle-font-size">Font Size (px)</Label>
              <Input
                id="subtitle-font-size"
                type="number"
                min="0"
                placeholder="e.g., 16"
                value={displaySubtitleFontSize}
                onChange={(e) => handleFontSizeInputChange(e, updateSubtitleStyle)}
                className="h-9"
                aria-label="Subtitle font size in pixels"
              />
            </div>
            {/* --- End Updated Input --- */}
            <div>
              <Label htmlFor="subtitle-font-family">Font Family</Label>
              <Input
                id="subtitle-font-family"
                value={headerComponent.subtitleStyle.fontFamily}
                onChange={(e) => updateSubtitleStyle({ fontFamily: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="subtitle-text-style">Text Style</Label>
              <div className="flex gap-1 mt-1">
                <Button
                  type="button"
                  size="sm"
                  variant={headerComponent.subtitleStyle.bold ? "default" : "outline"}
                  className={`px-3 h-8 ${headerComponent.subtitleStyle.bold ? "bg-primary/90" : ""}`}
                  onClick={() => updateSubtitleStyle({ bold: !headerComponent.subtitleStyle.bold })}
                >
                  <Bold className="h-4 w-4" />
                  <span className="sr-only">Bold</span>
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant={headerComponent.subtitleStyle.italic ? "default" : "outline"}
                  className={`px-3 h-8 ${headerComponent.subtitleStyle.italic ? "bg-primary/90" : ""}`}
                  onClick={() => updateSubtitleStyle({ italic: !headerComponent.subtitleStyle.italic })}
                >
                  <Italic className="h-4 w-4" />
                  <span className="sr-only">Italic</span>
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant={headerComponent.subtitleStyle.underline ? "default" : "outline"}
                  className={`px-3 h-8 ${headerComponent.subtitleStyle.underline ? "bg-primary/90" : ""}`}
                  onClick={() => updateSubtitleStyle({ underline: !headerComponent.subtitleStyle.underline })}
                >
                  <Underline className="h-4 w-4" />
                  <span className="sr-only">Underline</span>
                </Button>
              </div>
            </div>
            <ColorPickerField
              label="Text Color"
              value={headerComponent.subtitleStyle.color}
              onChange={(color) => updateSubtitleStyle({ color })}
            />
            <div>
              <Label htmlFor="subtitle-alignment">Text Alignment</Label>
              <Select
                value={headerComponent.subtitleStyle.textAlign}
                onValueChange={(value) => updateSubtitleStyle({ textAlign: value as "left" | "right" | "center" })}
              >
                <SelectTrigger id="subtitle-alignment" className="h-9">
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

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Header Component</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this header component? This action cannot be undone.
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
