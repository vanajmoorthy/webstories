import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import AppSidebar from "@/components/editor/AppSidebar"
import { Separator } from "@radix-ui/react-separator"
import { EditableHeader } from "@/components/webstory/EditableHeader"
import { useState } from "react"

function EditablePage() {
  const [headerData, setHeaderData] = useState({
    heading: "My Webstory Header",
    subheading: "A customizable header section",
    backgroundColor: "#ffaaaa",
  })
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <SidebarTrigger className="absolute left-2 top-2 z-10" />
        <main className=""></main>
        <EditableHeader
          heading={headerData.heading}
          subheading={headerData.subheading}
          backgroundColor={headerData.backgroundColor}
          onHeadingChange={(newHeading) => setHeaderData((prev) => ({ ...prev, heading: newHeading }))}
          onSubheadingChange={(newSubheading) => setHeaderData((prev) => ({ ...prev, subheading: newSubheading }))}
          onBackgroundColorChange={(newColor) => setHeaderData((prev) => ({ ...prev, backgroundColor: newColor }))}
        />{" "}
      </SidebarInset>
    </SidebarProvider>
  )
}

export default EditablePage
