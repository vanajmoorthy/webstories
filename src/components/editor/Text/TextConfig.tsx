import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useWebstoryStore } from "@/stores/webstoryStore"
import { TextComponent } from "@/types/webstory"
import { ChevronLeft } from "lucide-react"
import { useState } from "react"

interface TextConfigProps {
  textComponent: TextComponent
  onBack: () => void
}

export function TextConfig({ textComponent, onBack }: TextConfigProps) {
  const [localContent, setLocalContent] = useState(textComponent.content)
  const [fontSize, setFontSize] = useState(textComponent.fontSize)
  const [fontFamily, setFontFamily] = useState(textComponent.fontFamily)
  const [bold, setBold] = useState(textComponent.bold)
  const [italic, setItalic] = useState(textComponent.italic)

  const updateComponent = useWebstoryStore((state) => state.updateComponent)

  const handleSave = () => {
    updateComponent(textComponent.id, {
      content: localContent,
      fontSize,
      fontFamily,
      bold,
      italic,
    })
  }

  return (
    <div className={"inset-0 pt-2 bg-sidebar"}>
      <Card className="p-2">
        <Button variant="ghost" size="sm" onClick={onBack} className="mb-4">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <div className="space-y-4">
          <div>
            <Label>Text Content</Label>
            <Input value={localContent} onChange={(e) => setLocalContent(e.target.value)} />
          </div>

          <div>
            <Label>Font Size</Label>
            <Input value={fontSize} onChange={(e) => setFontSize(e.target.value)} />
          </div>

          <div>
            <Label>Font Family</Label>
            <Input value={fontFamily} onChange={(e) => setFontFamily(e.target.value)} />
          </div>

          <div>
            <Label>Text Style</Label>
            <Select
              value={bold ? "bold" : italic ? "italic" : "normal"}
              onValueChange={(value) => {
                setBold(value === "bold")
                setItalic(value === "italic")
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select style" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="bold">Bold</SelectItem>
                <SelectItem value="italic">Italic</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button onClick={handleSave}>Save</Button>
        </div>
      </Card>
    </div>
  )
}
