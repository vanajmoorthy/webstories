import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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

  const updateComponent = useWebstoryStore((state) => state.updateComponent)

  const handleSave = () => {
    updateComponent(headerComponent.id, {
      title: localHeading,
      subtitle: localSubheading,
      backgroundColor: localBackgroundColor,
    })
  }

  return (
    <div className="inset-0 pt-2 animate-in slide-in-from-right bg-sidebar">
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

          <Button onClick={handleSave}>Save</Button>
        </div>
      </Card>
    </div>
  )
}
