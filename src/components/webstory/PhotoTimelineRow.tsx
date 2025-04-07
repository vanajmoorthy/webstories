import { cn } from "@/lib/utils"
import type { TimelineRow } from "@/types/webstory"
import { format } from "date-fns"

interface PhotoTimelineRowProps {
  row: TimelineRow
  index: number
  alignment: "left" | "right"
  photoSize: "small" | "medium" | "large"
}

export function PhotoTimelineRow({ row, index, alignment, photoSize = "medium" }: PhotoTimelineRowProps) {
  const isLeft = alignment === "left"
  const photoCount = row.photos.length

  const formatDate = (date: string | Date): string => {
    try {
      const dateObj = typeof date === "string" ? new Date(date) : date
      if (isNaN(dateObj.getTime())) {
        return typeof date === "string" ? date : "Invalid Date"
      }
      return format(dateObj, "do MMMM, yyyy")
    } catch (error) {
      console.error("Error formatting date:", error)
      return typeof date === "string" ? date : "Invalid Date"
    }
  }

  const sizeClasses = {
    small: "w-48",
    medium: "w-64",
    large: "w-80",
  }

  const containerHeightClass = {
    small: "h-80",
    medium: "h-[24rem]",
    large: "h-[28rem]",
  }

  return (
    <div
      className={`flex flex-col md:flex-row items-center md:items-center gap-2 md:gap-4 mb-16 ${index > 0 ? "mt-16" : ""}`}
    >
      <div className={`w-full md:w-1/2 order-1 ${!isLeft ? "md:order-2" : ""}`}>
        <div className={cn("relative flex justify-center items-center", containerHeightClass[photoSize])}>
          {row.photos.map((photo, photoIndex) => {
            const centerOffset = (photoCount - 1) / 2
            const deviation = photoIndex - centerOffset
            const horizontalOffsetPerStep = photoCount > 1 ? 8 : 0

            const finalRotation = deviation * 3
            const horizontalShift = deviation * horizontalOffsetPerStep

            return (
              <div
                key={photo.id || `photo-${photoIndex}`}
                className={cn(
                  "absolute bg-white p-2 pb-8 shadow-lg transform-gpu transition-transform duration-300 ease-out hover:scale-105 hover:z-10 aspect-[3/4] transform-origin-bottom",
                  sizeClasses[photoSize]
                )}
                style={{
                  left: "50%",
                  transform: `translateX(calc(-50% + ${horizontalShift}px)) rotate(${finalRotation}deg)`,
                  zIndex: photoIndex,
                }}
              >
                <img
                  src={photo.url || "/placeholder.svg"}
                  alt={photo.caption || `Photo ${photoIndex + 1}`}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                {row.date && photoIndex === photoCount - 1 && (
                  <div className="absolute bottom-1.5 left-2 right-2 text-center text-xs font-semibold text-gray-700 z-10">
                    {formatDate(row.date)}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      <div
        className={`flex flex-col justify-center w-full md:w-1/2 order-2 ${!isLeft ? "md:order-1 md:text-right" : "md:text-left"}`}
      >
        <div className="max-w-xl text-base md:text-lg text-wrap break-words px-4 md:px-0">{row.text}</div>
      </div>
    </div>
  )
}
