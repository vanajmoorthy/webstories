import { AppSidebar } from "@/components/editor/AppSidebar"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { EditableHeader } from "@/components/webstory/EditableHeader"
import { EditableText } from "@/components/webstory/EditableText"
import { useWebstoryStore } from "@/stores/webstoryStore"

export default function EditablePage() {
  const components = useWebstoryStore((state) => state.components)

  return (
    <SidebarProvider>
      <AppSidebar />

      <SidebarInset>
        <SidebarTrigger className="absolute left-2 top-2 z-20" />
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
