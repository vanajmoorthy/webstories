// components/webstory/EditableText.tsx
import { TextComponent } from "@/types/webstory"

export const EditableText = ({ component, onSelect }: { component: TextComponent; onSelect: () => void }) => {
  return (
    <div
      style={{
        backgroundColor: component.backgroundColor,
        fontSize: component.fontSize,
        fontFamily: component.fontFamily,
        fontStyle: component.italic ? "italic" : "normal",
        fontWeight: component.bold ? "bold" : "normal",
      }}
      className="p-4 my-4 rounded-lg cursor-text"
      onClick={onSelect}
      contentEditable
      suppressContentEditableWarning
    >
      {component.content}
    </div>
  )
}
