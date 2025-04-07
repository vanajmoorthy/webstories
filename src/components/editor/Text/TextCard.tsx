import { Card, CardContent } from "@/components/ui/card"
import { getTextColorClass } from "@/lib/color"
import type { TextComponent } from "@/types/webstory"
import { FileText } from "lucide-react"

interface TextCardProps {
  textComponent: TextComponent
  onClick: () => void
}

export function TextCard({ textComponent, onClick }: TextCardProps) {
  let bgColor = textComponent?.backgroundColor || "#cecece"

  if (bgColor === "#" || !/^#[0-9A-F]{6}$/i.test(bgColor)) {
    bgColor = "#FFFFFF"
  }

  const textColorClass = getTextColorClass(bgColor)

  let content = textComponent?.content

  if ((content.length || 0) > 40) {
    content = content?.slice(0, 40) + "..."
  }

  return (
    <Card className="mt-2 cursor-pointer hover:shadow-md transition-shadow" onClick={onClick}>
      <CardContent className="p-3 flex items-center gap-3">
        <div className="flex items-center justify-center h-8 w-8 rounded-md" style={{ backgroundColor: bgColor }}>
          <FileText className={`h-4 w-4 ${textColorClass}`} />
        </div>
        <div className="flex-1 overflow-hidden">
          <p className="font-medium text-sm truncate">Text Block</p>
          <p className="text-xs text-muted-foreground truncate">{content || "Click to edit text"}</p>
        </div>
      </CardContent>
    </Card>
  )
}
