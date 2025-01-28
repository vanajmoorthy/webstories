// components/webstory/EditableHeader.tsx
import React from "react"

type EditableHeaderProps = {
  heading: string
  subheading?: string
  backgroundColor?: string
  onHeadingChange: (newHeading: string) => void
  onSubheadingChange?: (newSubheading: string) => void
  onBackgroundColorChange: (newColor: string) => void
}

export function EditableHeader({
  heading,
  subheading,
  backgroundColor = "#ffffff",
  onHeadingChange,
  onSubheadingChange,
  onBackgroundColorChange,
}: EditableHeaderProps) {
  return (
    <header className="p-8 rounded-lg mb-8 relative group" style={{ backgroundColor }}>
      <div className="max-w-4xl mx-auto">
        <h1
          className="text-4xl font-bold mb-4 cursor-text"
          contentEditable
          suppressContentEditableWarning
          onBlur={(e) => onHeadingChange(e.target.textContent || "")}
        >
          {heading}
        </h1>

        {subheading && (
          <p
            className="text-xl text-muted-foreground cursor-text"
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => onSubheadingChange?.(e.target.textContent || "")}
          >
            {subheading}
          </p>
        )}
      </div>
    </header>
  )
}
