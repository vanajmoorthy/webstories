import { Card, CardContent } from "@/components/ui/card"
import { getTextColorClass } from "@/lib/color"
import { useWebstoryStore } from "@/stores/webstoryStore"
import { Type } from "lucide-react"

interface HeaderCardProps {
  onClick: () => void
}

export function HeaderCard({ onClick }: HeaderCardProps) {
  const components = useWebstoryStore((state) => state.components)
  const headerComponent = components.find((component) => component.type === "header")
  const bgColor = headerComponent?.backgroundColor || "#f3f4f6"

  const textColorClass = getTextColorClass(bgColor)

  const title = headerComponent?.title || "Title"
  const subtitle = headerComponent?.subtitle || "Subtitle"

  let combinedText = `${title} / ${subtitle}`

  if (combinedText.length > 37) {
    combinedText = combinedText.slice(0, 37) + "..."
  }

  return (
    <Card className="mt-2 cursor-pointer hover:shadow-md transition-shadow" onClick={onClick}>
      <CardContent className="p-3 flex items-center gap-3">
        <div
          className="flex items-center justify-center h-8 w-8 rounded-md border border-gray-200"
          style={{ backgroundColor: bgColor }}
        >
          <Type className={`h-4 w-4 ${textColorClass}`} />
        </div>
        <div className="flex-1">
          <p className="font-medium text-sm truncate">Header</p>
          <p className="text-xs text-muted-foreground truncate">{combinedText}</p>
        </div>
      </CardContent>
    </Card>
  )
}
