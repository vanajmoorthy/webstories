import { useWebstoryStore } from "@/stores/webstoryStore"
import { useState } from "react"

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
  const [isEditing, setIsEditing] = useState(false)
  const [localHeading, setLocalHeading] = useState(heading)
  const [localSubheading, setLocalSubheading] = useState(subheading)
  const [localBackgroundColor, setLocalBackgroundColor] = useState(backgroundColor)
  const updateComponent = useWebstoryStore((state) => state.updateComponent)

  const handleSave = () => {
    updateComponent(id, {
      title: localHeading,
      subtitle: localSubheading,
      backgroundColor: localBackgroundColor,
    })
    setIsEditing(false)
  }

  return (
    <div style={{ backgroundColor }} className="p-4 rounded-t-xl">
      {isEditing ? (
        <div className="flex flex-col">
          <input value={localHeading} onChange={(e) => setLocalHeading(e.target.value)} />
          <input value={localSubheading} onChange={(e) => setLocalSubheading(e.target.value)} />
          <input type="color" value={localBackgroundColor} onChange={(e) => setLocalBackgroundColor(e.target.value)} />
          <button onClick={handleSave}>Save</button>
        </div>
      ) : (
        <div onClick={() => setIsEditing(true)}>
          <h1
            style={{
              fontSize: titleStyle.fontSize,
              fontFamily: titleStyle.fontFamily,
              color: titleStyle.color,
              textAlign: titleStyle.textAlign,
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
            }}
          >
            {subheading}
          </h2>
        </div>
      )}
    </div>
  )
}
