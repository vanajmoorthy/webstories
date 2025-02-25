import { AppSidebar } from "@/components/editor/AppSidebar"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { EditableHeader } from "@/components/webstory/EditableHeader"
import { useWebstoryStore } from "@/stores/webstoryStore"
import { useState } from "react"

export default function EditablePage() {
  const components = useWebstoryStore((state) => state.components)
  const [headerData, setHeaderData] = useState({
    heading: "My Webstory Header",
    subheading: "A customizable header section",
    backgroundColor: "#ffaaaa",
  })

  return (
    <SidebarProvider>
      <AppSidebar headerData={headerData} onHeaderChange={setHeaderData} />

      <SidebarInset>
        <SidebarTrigger className="absolute left-2 top-2 z-10" />
        <main className="z-10">
          {components.map((component) => {
            if (component.type === "header") {
              return (
                <EditableHeader
                  key={component.id}
                  id={component.id}
                  heading={component.title}
                  subheading={component.subtitle}
                  backgroundColor={component.backgroundColor}
                />
              )
            }
            return null
          })}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
