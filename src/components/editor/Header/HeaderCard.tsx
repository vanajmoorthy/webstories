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

  let title = headerComponent?.title

  let subtitle = headerComponent?.subtitle

  if ((title?.length || 0) > 15) {
    title = title?.slice(0, 15) + "..."
  }

  if ((subtitle?.length || 0) > 10) {
    subtitle = subtitle?.slice(0, 10) + "..."
  }

  return (
    <Card className="mt-2 cursor-pointer hover:shadow-md transition-shadow" onClick={onClick}>
      <CardContent className="p-3 flex items-center gap-3">
        <div className="flex items-center justify-center h-8 w-8 rounded-md" style={{ backgroundColor: bgColor }}>
          <Type className={`h-4 w-4 ${textColorClass}`} />
        </div>
        <div className="flex-1">
          <p className="font-medium">Header</p>
          <p className="text-xs text-muted-foreground truncate">
            {title || "Title"} / {subtitle || "Subtitle"}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
