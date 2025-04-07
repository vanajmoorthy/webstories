import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useEffect, useState } from "react"

import { PhotoGallery } from "./PhotoGallery"
import { type Photo, PhotoGalleryProvider } from "./PhotoGalleryProvider"
import { PhotoUploader } from "./PhotoUploader"

interface PhotoUploadModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onPhotoSelect?: (photo: Photo) => void
  webstoryId: string
}

export function PhotoUploadModal({ open, onOpenChange, onPhotoSelect, webstoryId }: PhotoUploadModalProps) {
  const [activeTab, setActiveTab] = useState("upload")

  useEffect(() => {
    if (open) {
      setActiveTab("upload")
    }
  }, [open])

  const handlePhotoSelect = (photo: Photo) => {
    if (onPhotoSelect) {
      onPhotoSelect(photo)
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] h-[600px] flex flex-col p-0 gap-0">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle>Photo Gallery</DialogTitle>
        </DialogHeader>

        <PhotoGalleryProvider webstoryId={webstoryId}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
            <TabsList className="grid grid-cols-2 mx-6">
              <TabsTrigger value="upload">Upload Photos</TabsTrigger>
              <TabsTrigger value="gallery">Gallery</TabsTrigger>
            </TabsList>

            <TabsContent
              value="upload"
              className="flex-1 data-[state=active]:flex mt-0 p-0 border-0"
              style={{ margin: 0 }}
            >
              <PhotoUploader webstoryId={webstoryId} />
            </TabsContent>

            <TabsContent
              value="gallery"
              className="flex-1 data-[state=active]:flex mt-0 p-0 border-0"
              style={{ margin: 0 }}
            >
              <PhotoGallery onSelect={handlePhotoSelect} />
            </TabsContent>
          </Tabs>
        </PhotoGalleryProvider>
      </DialogContent>
    </Dialog>
  )
}
