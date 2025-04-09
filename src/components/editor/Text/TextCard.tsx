import { Card, CardContent } from "@/components/ui/card"
import { getTextColorClass } from "@/lib/color"
import type { TextComponent } from "@/types/webstory"
import type { DraggableAttributes } from "@dnd-kit/core"
import { FileText, GripVertical } from "lucide-react"

interface TextCardProps {
  textComponent: TextComponent
  onClick: () => void
  attributes?: DraggableAttributes
  listeners?: ReturnType<typeof import("@dnd-kit/core").useDraggable>["listeners"]
  isDragging?: boolean
}

export function TextCard({ textComponent, onClick, attributes, listeners, isDragging }: TextCardProps) {
  let bgColor = textComponent?.backgroundColor || "#cecece"

  if (bgColor === "#" || !/^#[0-9A-F]{6}$/i.test(bgColor)) {
    bgColor = "#FFFFFF"
  }

  const textColorClass = getTextColorClass(bgColor)

  let content = textComponent?.content

  if ((content?.length || 0) > 40) {
    content = content?.slice(0, 40) + "..."
  }

  return (
    <div
      className={`mt-2 transition-shadow ${isDragging ? "opacity-50 shadow-lg" : "hover:shadow-md"}`}
      onClick={onClick}
    >
      <Card className="cursor-pointer">
        <CardContent className="p-3 flex items-center gap-3">
          <div
            className="flex items-center justify-center h-8 w-8 rounded-md flex-shrink-0 border border-gray-200"
            style={{ backgroundColor: bgColor }}
          >
            <FileText className={`h-4 w-4 ${textColorClass}`} />
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="font-medium text-sm truncate">Text Block</p>
            <p className="text-xs text-muted-foreground truncate">{content || "Click to edit text"}</p>
          </div>
          <span {...attributes} {...listeners} className="cursor-grab p-1 -ml-1 touch-none">
            <GripVertical className="h-5 w-5 text-muted-foreground" />
          </span>
        </CardContent>
      </Card>
    </div>
  )
}
