import { AppSidebar } from "@/components/editor/AppSidebar"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { EditableHeader } from "@/components/webstory/EditableHeader"
import { EditableText } from "@/components/webstory/EditableText"
import pb from "@/lib/pocketbase"
import { useWebstoryStore } from "@/stores/webstoryStore"
import { useEffect } from "react"
import { useParams } from "react-router-dom"

export default function Editor() {
  const { id } = useParams()
  const { components, setComponents } = useWebstoryStore()

  useEffect(() => {
    if (!id) {
      console.log("No id found in URL params, skipping loadWebstory.")
      return
    }
    const loadWebstory = async () => {
      console.log("Fetching webstory with id:", id)

      try {
        const webstory = await pb.collection("webstories").getOne(id)
        console.log("Loaded webstory:", webstory)

        setComponents(webstory.content)
      } catch (error) {
        console.error("Failed to load webstory", error)
      }
    }
    loadWebstory()
  }, [id, setComponents])

  const saveWebstory = async () => {
    try {
      if (!id) {
        console.error("No webstory ID found.")
        return
      }

      const user = pb.authStore.model
      if (!user) {
        alert("Please log in to save.")
        return
      }

      await pb.collection("webstories").update(id, {
        user: user.id,
        content: JSON.stringify(components),
      })

      alert("Webstory saved!")
    } catch (error) {
      console.error("Failed to save webstory", error)
    }
  }

  if (!components) {
    return <div>Loading...</div>
  }

  return (
    <SidebarProvider>
      <AppSidebar />

      <SidebarInset>
        <SidebarTrigger className="absolute left-2 top-2 z-20" />
        <button onClick={saveWebstory} className="absolute right-2 top-2 z-20 p-2 bg-blue-500 text-white rounded">
          Save
        </button>
        <main className="z-10 h-full bg-background">
          {components.map((component) => {
            if (component.type === "header") {
              return (
                <EditableHeader
                  key={component.id}
                  id={component.id}
                  heading={component.title}
                  subheading={component.subtitle}
                  backgroundColor={component.backgroundColor}
                  titleStyle={component.titleStyle}
                  subtitleStyle={component.subtitleStyle}
                />
              )
            }
            if (component.type === "text") {
              return <EditableText key={component.id} id={component.id} content={component.content} />
            }
            return null
          })}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
