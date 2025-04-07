import { useWebstoryStore } from "@/stores/webstoryStore"
import type { PhotoTimelineComponent } from "@/types/webstory"
import { useState } from "react"

import { PhotoTimelineRow } from "./PhotoTimelineRow"

interface EditablePhotoTimelineProps {
  id: string
}

export function EditablePhotoTimeline({ id }: EditablePhotoTimelineProps) {
  const components = useWebstoryStore((state) => state.components)

  const component = components.find((c) => c.id === id && c.type === "photoTimeline") as
    | PhotoTimelineComponent
    | undefined

  if (!component || component.type !== "photoTimeline") {
    console.warn(`Component with id ${id} not found or is not a PhotoTimelineComponent.`)
    return null
  }

  return (
    <div className="w-full py-8 relative" style={{ backgroundColor: component.backgroundColor }}>
      <div className="container mx-auto px-4">
        {component.rows.map((row, index) => (
          <PhotoTimelineRow
            key={row.id || index}
            row={row}
            index={index}
            alignment={component.alignment === "alternate" ? (index % 2 === 0 ? "left" : "right") : component.alignment}
            photoSize={component.photoSize}
          />
        ))}
      </div>
    </div>
  )
}
