import { Card, CardContent } from "@/components/ui/card"
import { getTextColorClass } from "@/lib/color"
import type { PhotoTimelineComponent } from "@/types/webstory"
import { Clock } from "lucide-react"

interface PhotoTimelineCardProps {
  photoTimelineComponent: PhotoTimelineComponent
  onClick: () => void
}

export function PhotoTimelineCard({ photoTimelineComponent, onClick }: PhotoTimelineCardProps) {
  const bgColor = photoTimelineComponent.backgroundColor || "#f3f4f6"
  const textColorClass = getTextColorClass(bgColor)
  const rowCount = photoTimelineComponent.rows.length
  const photoCount = photoTimelineComponent.rows.reduce((count, row) => count + row.photos.length, 0)

  return (
    <Card className="mt-2 cursor-pointer hover:shadow-md transition-shadow" onClick={onClick}>
      <CardContent className="p-3 flex items-center gap-3">
        <div className="flex items-center justify-center h-8 w-8 rounded-md" style={{ backgroundColor: bgColor }}>
          <Clock className={`h-4 w-4 ${textColorClass}`} />
        </div>
        <div className="flex-1">
          <p className="font-medium">Photo Timeline</p>
          <p className="text-xs text-muted-foreground truncate">
            {rowCount} {rowCount === 1 ? "row" : "rows"} · {photoCount} {photoCount === 1 ? "photo" : "photos"}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
