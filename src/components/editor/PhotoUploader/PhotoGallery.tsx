import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/hooks/use-toast"
import pb from "@/lib/pocketbase"
import { ImageOff, Loader2, Trash2 } from "lucide-react"
import { useState } from "react"

import { type Photo, usePhotoGallery } from "./PhotoGalleryProvider"

interface PhotoGalleryProps {
  onSelect?: (photo: Photo) => void
  selectable?: boolean
}

export function PhotoGallery({ onSelect, selectable = true }: PhotoGalleryProps) {
  const { photos, isLoading, error, deletePhoto, refreshPhotos } = usePhotoGallery()
  const [photoToDelete, setPhotoToDelete] = useState<Photo | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const { toast } = useToast()

  if (!pb.authStore.isValid) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <ImageOff className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">Authentication Required</h3>
        <p className="text-sm text-muted-foreground">You must be logged in to view your photos</p>
      </div>
    )
  }

  const handleDeletePhoto = async () => {
    if (!photoToDelete) return

    setIsDeleting(true)
    try {
      await deletePhoto(photoToDelete.id)
      toast({
        title: "Photo deleted",
        description: "The photo has been successfully deleted.",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Delete failed",
        description: "Failed to delete the photo. Please try again.",
      })
    } finally {
      setIsDeleting(false)
      setPhotoToDelete(null)
    }
  }

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <div className="text-destructive mb-4">
          <ImageOff className="h-12 w-12 mx-auto mb-2" />
          <h3 className="text-lg font-semibold">Failed to load photos</h3>
        </div>
        <p className="text-sm text-muted-foreground mb-4">There was an error loading your photos.</p>
        <Button onClick={refreshPhotos}>Try Again</Button>
      </div>
    )
  }

  if (photos.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <ImageOff className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">No photos yet</h3>
        <p className="text-sm text-muted-foreground">Upload some photos to see them here</p>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col p-4">
      <ScrollArea className="flex-1">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {photos.map((photo) => (
            <div
              key={photo.id}
              className={`group relative aspect-square rounded-md overflow-hidden border ${selectable ? "cursor-pointer" : ""}`}
              onClick={selectable && onSelect ? () => onSelect(photo) : undefined}
            >
              <img src={photo.url || "/placeholder.svg"} alt={photo.filename} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                {selectable && (
                  <Button variant="secondary" size="sm" className="mr-2">
                    Select
                  </Button>
                )}
                <Button
                  variant="destructive"
                  size="icon"
                  className="h-8 w-8"
                  onClick={(e) => {
                    e.stopPropagation()
                    setPhotoToDelete(photo)
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <AlertDialog open={!!photoToDelete} onOpenChange={(open) => !open && setPhotoToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Photo</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this photo? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeletePhoto}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
