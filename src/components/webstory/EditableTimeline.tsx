// components/webstory/EditableTimeline.tsx
import React from "react"
import { TimelineComponent } from "@/types/webstory"

export const EditableTimeline = ({ component, onSelect }: { component: TimelineComponent; onSelect: () => void }) => {
  return (
    <div style={{ backgroundColor: component.backgroundColor }} className="p-4 my-4 rounded-lg" onClick={onSelect}>
      {component.rows.map((row, rowIndex) => (
        <div key={row.id} className="flex gap-4 mb-4">
          {row.items.map((item) => (
            <div key={item.id} className="flex-1">
              <img src={item.imageUrl} alt={item.caption} className="w-full h-48 object-cover rounded" />
              <div
                style={{
                  fontSize: item.captionStyle.fontSize,
                  color: item.captionStyle.color,
                }}
                className="mt-2 text-center"
                contentEditable
                suppressContentEditableWarning
              >
                {item.caption}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
