// app/editable-page.tsx
"use client"

import { useState } from "react"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { EditableHeader } from "@/components/webstory/EditableHeader"
import { AppSidebar } from "@/components/editor/AppSidebar"

export default function EditablePage() {
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
          <EditableHeader
            heading={headerData.heading}
            subheading={headerData.subheading}
            backgroundColor={headerData.backgroundColor}
            onHeadingChange={(newHeading) => setHeaderData((prev) => ({ ...prev, heading: newHeading }))}
            onSubheadingChange={(newSubheading) => setHeaderData((prev) => ({ ...prev, subheading: newSubheading }))}
            onBackgroundColorChange={(newColor) => setHeaderData((prev) => ({ ...prev, backgroundColor: newColor }))}
          />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
