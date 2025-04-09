import { Card, CardContent } from "@/components/ui/card"
import { getTextColorClass } from "@/lib/color"
import type { PhotoTimelineComponent } from "@/types/webstory"
import type { DraggableAttributes } from "@dnd-kit/core"
import { Clock, GripVertical } from "lucide-react"

interface PhotoTimelineCardProps {
  photoTimelineComponent: PhotoTimelineComponent
  onClick: () => void
  attributes?: DraggableAttributes
  listeners?: ReturnType<typeof import("@dnd-kit/core").useDraggable>["listeners"]
  isDragging?: boolean
}

export function PhotoTimelineCard({
  photoTimelineComponent,
  onClick,
  attributes,
  listeners,
  isDragging,
}: PhotoTimelineCardProps) {
  const bgColor = photoTimelineComponent.backgroundColor || "#f3f4f6"
  const textColorClass = getTextColorClass(bgColor)
  const rowCount = photoTimelineComponent.rows.length
  const photoCount = photoTimelineComponent.rows.reduce((count, row) => count + row.photos.length, 0)

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
            <Clock className={`h-4 w-4 ${textColorClass}`} />
          </div>
          <div className="flex-1">
            <p className="font-medium text-sm truncate">Photo Timeline</p>
            <p className="text-xs text-muted-foreground truncate">
              {rowCount} {rowCount === 1 ? "row" : "rows"} · {photoCount} {photoCount === 1 ? "photo" : "photos"}
            </p>
          </div>
          <span {...attributes} {...listeners} className="cursor-grab p-1 -ml-1 touch-none">
            <GripVertical className="h-5 w-5 text-muted-foreground" />
          </span>
        </CardContent>
      </Card>
    </div>
  )
}
