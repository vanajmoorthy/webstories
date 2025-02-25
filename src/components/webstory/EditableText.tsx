import { useWebstoryStore } from "@/stores/webstoryStore"
import { useState } from "react"

export function EditableText({ id, content }: { id: string; content: string }) {
  const [isEditing, setIsEditing] = useState(false)
  const [localContent, setLocalContent] = useState(content)
  const updateComponent = useWebstoryStore((state) => state.updateComponent)

  const handleSave = () => {
    updateComponent(id, { content: localContent })
    setIsEditing(false)
  }

  return (
    <div className="p-4">
      {isEditing ? (
        <div className="flex flex-col">
          <textarea
            value={localContent}
            onChange={(e) => setLocalContent(e.target.value)}
            className="border border-gray-300 p-2"
          />
          <button onClick={handleSave} className="mt-2">
            Save
          </button>
        </div>
      ) : (
        <div onClick={() => setIsEditing(true)} className="cursor-pointer">
          <p>{content}</p>
        </div>
      )}
    </div>
  )
}
