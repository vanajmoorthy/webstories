import { AppSidebar } from "@/components/editor/AppSidebar"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { EditableHeader } from "@/components/webstory/EditableHeader"
import { EditablePhotoTimeline } from "@/components/webstory/EditablePhotoTimeline"
import { EditableText } from "@/components/webstory/EditableText"
import { useToast } from "@/hooks/use-toast"
import pb from "@/lib/pocketbase"
import { useWebstoryStore } from "@/stores/webstoryStore"
import type { WebstoryComponent } from "@/types/webstory"
import { useEffect, useMemo, useState } from "react"
import { useParams } from "react-router-dom"

export default function Editor() {
  const { id } = useParams()
  const { components, setComponents } = useWebstoryStore()
  const [pageBackgroundColor, setPageBackgroundColor] = useState("#ffffff")
  const [webstoryTitle, setWebstoryTitle] = useState("Untitled Webstory")
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    if (!id) {
      console.log("No id found in URL params, skipping loadWebstory.")
      setIsLoading(false)
      return
    }

    const loadWebstory = async () => {
      console.log("Fetching webstory with id:", id)
      setIsLoading(true)

      try {
        const webstory = await pb.collection("webstories").getOne(id)
        console.log("Loaded webstory:", webstory)

        setWebstoryTitle(webstory.title || "Untitled Webstory")
        setPageBackgroundColor(webstory.pageBackgroundColor || "#ffffff")

        let loadedComponents: WebstoryComponent[] = []
        if (typeof webstory.content === "string") {
          try {
            loadedComponents = JSON.parse(webstory.content) as WebstoryComponent[]

            if (!Array.isArray(loadedComponents)) {
              console.error("Parsed content is not an array:", loadedComponents)
              loadedComponents = []
            }
          } catch (e) {
            console.error("Failed to parse webstory content:", e)
            loadedComponents = []
          }
        } else if (Array.isArray(webstory.content)) {
          loadedComponents = webstory.content as WebstoryComponent[]
        }
        setComponents(loadedComponents.sort((a: WebstoryComponent, b: WebstoryComponent) => a.order - b.order))
      } catch (error) {
        console.error("Failed to load webstory", error)
        toast({
          variant: "destructive",
          title: "Error Loading Webstory",
          description: "Failed to load webstory. Please try again.",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadWebstory()
  }, [id, setComponents, toast])

  const sortedEditorComponents = useMemo(
    () => [...components].sort((a: WebstoryComponent, b: WebstoryComponent) => a.order - b.order),
    [components]
  )

  const saveWebstory = async () => {
    try {
      if (!id) {
        console.error("No webstory ID found.")
        toast({
          variant: "destructive",
          title: "Save Failed",
          description: "No webstory ID found.",
        })
        return
      }

      const user = pb.authStore.record

      if (!user) {
        toast({
          variant: "destructive",
          title: "Authentication Required",
          description: "Please log in to save your webstory.",
        })
        return
      }

      const sortedComponentsForSave = [...components].sort((a, b) => a.order - b.order)

      await pb.collection("webstories").update(id, {
        user: user.id,
        title: webstoryTitle,
        content: JSON.stringify(sortedComponentsForSave),
        pageBackgroundColor: pageBackgroundColor,
      })

      toast({
        title: "Webstory Saved",
        description: "Your webstory has been saved successfully.",
      })
    } catch (error) {
      console.error("Failed to save webstory", error)

      toast({
        variant: "destructive",
        title: "Save Failed",
        description: "Failed to save webstory. Please try again.",
      })

      throw error
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    )
  }

  return (
    <SidebarProvider>
      <AppSidebar
        pageBackgroundColor={pageBackgroundColor}
        webstoryTitle={webstoryTitle}
        webstoryId={id}
        onPageBackgroundColorChange={setPageBackgroundColor}
        onWebstoryTitleChange={setWebstoryTitle}
        onSave={saveWebstory}
      />

      <SidebarInset>
        <SidebarTrigger className="absolute left-4 top-4 z-20" />

        <main className="z-10 h-full overflow-auto rounded-xl" style={{ backgroundColor: pageBackgroundColor }}>
          {sortedEditorComponents.map((component) => {
            switch (component.type) {
              case "header":
                return <EditableHeader key={component.id} id={component.id} />
              case "text":
                return <EditableText key={component.id} id={component.id} />
              case "photoTimeline":
                return <EditablePhotoTimeline key={component.id} id={component.id} />
              default:
                const exhaustiveCheck: never = component
                console.warn("Unhandled component type in editor:", exhaustiveCheck)
                return null
            }
          })}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
