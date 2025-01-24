// components/webstory/EditableHeader.tsx
import React from "react"
import { HeaderComponent } from "@/types/webstory"

export const EditableHeader = ({ component, onSelect }: { component: HeaderComponent; onSelect: () => void }) => {
  return (
    <div
      style={{ backgroundColor: component.backgroundColor }}
      className="p-8 rounded-lg mb-8 cursor-text"
      onClick={onSelect}
    >
      <h1
        style={{
          fontSize: component.titleStyle.fontSize,
          fontFamily: component.titleStyle.fontFamily,
          color: component.titleStyle.color,
        }}
        className="text-center mb-4"
        contentEditable
        suppressContentEditableWarning
        onBlur={(e) => {
          const newTitle = e.target.textContent || ""
          onUpdate({ ...component, title: newTitle })
        }}
      >
        {component.title}
      </h1>
      <p
        className="text-center text-muted-foreground"
        contentEditable
        suppressContentEditableWarning
        onBlur={(e) => {
          const newSubtitle = e.target.textContent || ""
          onUpdate({ ...component, subtitle: newSubtitle })
        }}
      >
        {component.subtitle}
      </p>
    </div>
  )
}
