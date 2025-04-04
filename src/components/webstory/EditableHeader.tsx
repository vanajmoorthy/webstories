import { useWebstoryStore } from "@/stores/webstoryStore"
import { HeaderComponent } from "@/types/webstory"

export function EditableHeader({
  id,
  heading,
  subheading,
  backgroundColor,
  titleStyle,
  subtitleStyle,
}: {
  id: string
  heading: string
  subheading: string
  backgroundColor: string
  titleStyle: HeaderComponent["titleStyle"]
  subtitleStyle: HeaderComponent["subtitleStyle"]
}) {
  return (
    <div style={{ backgroundColor }} className="p-4 rounded-t-xl">
      <h1
        style={{
          fontSize: titleStyle.fontSize,
          fontFamily: titleStyle.fontFamily,
          color: titleStyle.color,
          textAlign: titleStyle.textAlign,
          fontWeight: titleStyle.bold ? "bold" : "normal",
          fontStyle: titleStyle.italic ? "italic" : "normal",
          textDecoration: titleStyle.underline ? "underline" : "none",
        }}
      >
        {heading}
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
        {subheading}
      </h2>
    </div>
  )
}
