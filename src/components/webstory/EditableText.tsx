import { useWebstoryStore } from "@/stores/webstoryStore"
import type { TextComponent } from "@/types/webstory"
import React from "react"

interface EditableTextProps {
  id: string
}

export function EditableText({ id }: EditableTextProps) {
  const components = useWebstoryStore((state) => state.components)

  const textComponent = components.find((c) => c.id === id && c.type === "text") as TextComponent | undefined

  if (!textComponent || textComponent.type !== "text") {
    console.warn(`Component with id ${id} not found or is not a TextComponent.`)
    return null
  }

  const { height, verticalAlignment, alignment } = textComponent

  const verticalAlignMap: Record<NonNullable<TextComponent["verticalAlignment"]>, string> = {
    top: "flex-start",
    center: "center",
    bottom: "flex-end",
  }

  const textStyle: React.CSSProperties = {
    fontFamily: textComponent.fontFamily,
    fontSize: textComponent.fontSize,
    fontWeight: textComponent.bold ? "bold" : "normal",
    fontStyle: textComponent.italic ? "italic" : "normal",
    textDecoration: textComponent.underline ? "underline" : "none",
    wordWrap: "break-word",
    overflowWrap: "break-word",
  }

  const containerStyle: React.CSSProperties = {
    backgroundColor:
      textComponent.backgroundColor === "#" || !textComponent.backgroundColor
        ? "transparent"
        : textComponent.backgroundColor,
    textAlign: alignment || "left",
    height: height && height !== "0px" ? height : "auto",
    padding: "1rem",
    display: "flex",
    flexDirection: "column",
    justifyContent: verticalAlignMap[verticalAlignment || "center"],
  }

  return (
    <div style={containerStyle}>
      <div style={textStyle}>{textComponent.content}</div>
    </div>
  )
}
