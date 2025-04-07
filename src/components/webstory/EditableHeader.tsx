import { useWebstoryStore } from "@/stores/webstoryStore"
import { HeaderComponent } from "@/types/webstory"
import React from "react"

interface EditableHeaderProps {
  id: string
}

export function EditableHeader({ id }: EditableHeaderProps) {
  const components = useWebstoryStore((state) => state.components)
  const headerComponent = components.find((c) => c.id === id && c.type === "header") as HeaderComponent | undefined

  if (!headerComponent || headerComponent.type !== "header") {
    console.warn(`Component with id ${id} not found or is not a HeaderComponent.`)
    return null
  }

  const { title, subtitle, backgroundColor, titleStyle, subtitleStyle, height, verticalAlignment } = headerComponent

  const verticalAlignMap: Record<HeaderComponent["verticalAlignment"], string> = {
    top: "flex-start",
    center: "center",
    bottom: "flex-end",
  }

  const containerStyle: React.CSSProperties = {
    backgroundColor: backgroundColor,
    height: height || "auto",
    display: "flex",
    flexDirection: "column",
    justifyContent: verticalAlignMap[verticalAlignment || "center"],
    padding: "1rem",
  }

  return (
    <div style={containerStyle} className="rounded-t-xl">
      <h1
        style={{
          fontSize: titleStyle.fontSize,
          fontFamily: titleStyle.fontFamily,
          color: titleStyle.color,
          textAlign: titleStyle.textAlign,
          fontWeight: titleStyle.bold ? "bold" : "normal",
          fontStyle: titleStyle.italic ? "italic" : "normal",
          textDecoration: titleStyle.underline ? "underline" : "none",
          marginBottom: "0.5rem",
        }}
      >
        {title}
      </h1>
      <h2
        style={{
          fontSize: subtitleStyle.fontSize,
          fontFamily: subtitleStyle.fontFamily,
          color: subtitleStyle.color,
          textAlign: subtitleStyle.textAlign,
          fontWeight: subtitleStyle.bold ? "bold" : "normal",
          fontStyle: subtitleStyle.italic ? "italic" : "normal",
          textDecoration: subtitleStyle.underline ? "underline" : "none",
        }}
      >
        {subtitle}
      </h2>
    </div>
  )
}
