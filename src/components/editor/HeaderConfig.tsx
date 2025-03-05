import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useWebstoryStore } from "@/stores/webstoryStore"
import { HeaderComponent } from "@/types/webstory"
import { ChevronLeft } from "lucide-react"
import { useState } from "react"

import { Card } from "../ui/card"

interface HeaderConfigProps {
  headerComponent: HeaderComponent
  onBack: () => void
}

export function HeaderConfig({ headerComponent, onBack }: HeaderConfigProps) {
  const [localHeading, setLocalHeading] = useState(headerComponent.title)
  const [localSubheading, setLocalSubheading] = useState(headerComponent.subtitle)
  const [localBackgroundColor, setLocalBackgroundColor] = useState(headerComponent.backgroundColor)

  const [titleStyle, setTitleStyle] = useState(headerComponent.titleStyle)
  const [subtitleStyle, setSubtitleStyle] = useState(headerComponent.subtitleStyle)

  const updateComponent = useWebstoryStore((state) => state.updateComponent)

  const handleSave = () => {
    updateComponent(headerComponent.id, {
      title: localHeading,
      subtitle: localSubheading,
      backgroundColor: localBackgroundColor,
      titleStyle,
      subtitleStyle,
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
            <Label>Heading Text</Label>
            <Input value={localHeading} onChange={(e) => setLocalHeading(e.target.value)} />
          </div>

          <div>
            <Label>Subheading Text</Label>
            <Input value={localSubheading} onChange={(e) => setLocalSubheading(e.target.value)} />
          </div>

          <div>
            <Label>Background Color</Label>
            <Input
              type="color"
              value={localBackgroundColor}
              onChange={(e) => setLocalBackgroundColor(e.target.value)}
            />
          </div>

          <div>
            <Label>Title Font Size</Label>
            <Input
              value={titleStyle.fontSize}
              onChange={(e) => setTitleStyle({ ...titleStyle, fontSize: e.target.value })}
            />
          </div>

          <div>
            <Label>Title Font Family</Label>
            <Input
              value={titleStyle.fontFamily}
              onChange={(e) => setTitleStyle({ ...titleStyle, fontFamily: e.target.value })}
            />
          </div>

          <div>
            <Label>Title Color</Label>
            <Input
              type="color"
              value={titleStyle.color}
              onChange={(e) => setTitleStyle({ ...titleStyle, color: e.target.value })}
            />
          </div>

          <div>
            <Label>Title Alignment</Label>
            <Select
              value={titleStyle.textAlign}
              onValueChange={(value) =>
                setTitleStyle({ ...titleStyle, textAlign: value as "left" | "right" | "center" })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select alignment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="left">Left</SelectItem>
                <SelectItem value="center">Center</SelectItem>
                <SelectItem value="right">Right</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button onClick={handleSave}>Save</Button>
        </div>
      </Card>
    </div>
  )
}
