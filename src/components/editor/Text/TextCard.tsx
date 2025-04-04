import { Card, CardContent } from "@/components/ui/card"
import { getTextColorClass } from "@/lib/color"
import { useWebstoryStore } from "@/stores/webstoryStore"
import { FileText } from "lucide-react"

interface TextCardProps {
  onClick: () => void
}

export function TextCard({ onClick }: TextCardProps) {
  const components = useWebstoryStore((state) => state.components)
  const textComponent = components.find((component) => component.type === "text")
  let bgColor = textComponent?.backgroundColor || "#000000"

  if (bgColor === "#") {
    bgColor = "#000000"
  }

  const textColorClass = getTextColorClass(bgColor)

  return (
    <Card className="mt-2 cursor-pointer hover:shadow-md transition-shadow" onClick={onClick}>
      <CardContent className="p-3 flex items-center gap-3">
        <div className="flex items-center justify-center h-8 w-8 rounded-md" style={{ backgroundColor: bgColor }}>
          <FileText className={`h-4 w-4 ${textColorClass}`} />
        </div>
        <div className="flex-1">
          <p className="font-medium">Text Block</p>
          <p className="text-xs text-muted-foreground truncate">{textComponent?.content || "Click to edit text"}</p>
        </div>
      </CardContent>
    </Card>
  )
}
