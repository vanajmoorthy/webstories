import { useWebstoryStore } from "@/stores/webstoryStore"
import type { TextComponent } from "@/types/webstory"

export function EditableText({ id }: { id: string }) {
  const components = useWebstoryStore((state) => state.components)

  // Get the current component data
  const textComponent = components.find((c) => c.id === id) as TextComponent | undefined

  if (!textComponent) return null

  // Text styling
  const textStyle = {
    fontFamily: textComponent.fontFamily,
    fontSize: textComponent.fontSize,
    fontWeight: textComponent.bold ? "bold" : "normal",
    fontStyle: textComponent.italic ? "italic" : "normal",
    textDecoration: textComponent.underline ? "underline" : "none",
  }

  return (
    <div
      className="p-4"
      style={{
        backgroundColor: textComponent.backgroundColor === "#" ? "transparent" : textComponent.backgroundColor,
        textAlign: textComponent.alignment || "left",
      }}
    >
      <div style={textStyle}>{textComponent.content}</div>
    </div>
  )
}
