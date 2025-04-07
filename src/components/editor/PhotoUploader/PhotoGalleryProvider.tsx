import pb from "@/lib/pocketbase"
import { type ReactNode, createContext, useContext, useEffect, useState } from "react"

export interface Photo {
  id: string
  collectionId: string
  url: string
  filename: string
  created: string
  updated: string
  size: number
  userId: string
  webstoryId: string
}

interface PhotoGalleryContextType {
  photos: Photo[]
  isLoading: boolean
  error: Error | null
  refreshPhotos: () => Promise<void>
  deletePhoto: (id: string) => Promise<void>
}

const PhotoGalleryContext = createContext<PhotoGalleryContextType | undefined>(undefined)

export function usePhotoGallery() {
  const context = useContext(PhotoGalleryContext)
  if (context === undefined) {
    throw new Error("usePhotoGallery must be used within a PhotoGalleryProvider")
  }
  return context
}

interface PhotoGalleryProviderProps {
  children: ReactNode
  webstoryId?: string // Make this optional to support both filtering by webstory and showing all user photos
}

export function PhotoGalleryProvider({ children, webstoryId }: PhotoGalleryProviderProps) {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const fetchPhotos = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Make sure we have an authenticated user
      if (!pb.authStore.isValid) {
        setPhotos([])
        setError(new Error("You must be logged in to view photos"))
        return
      }

      // Build the filter based on whether we have a webstoryId
      let filter = `user = "${pb.authStore.model?.id}"`
      if (webstoryId) {
        filter += ` && webstory_id = "${webstoryId}"`
      }

      const records = await pb.collection("photos").getList(1, 100, {
        sort: "-created",
        filter: filter,
        expand: "user,webstory_id", // Expand relations if needed
      })

      const formattedPhotos = records.items.map((record) => ({
        id: record.id,
        collectionId: record.collectionId,
        url: pb.files.getURL(record, record.file),
        filename: record.filename || "Untitled",
        created: record.created,
        updated: record.updated,
        size: record.size || 0,
        userId: record.user,
        webstoryId: record.webstory_id,
      }))

      setPhotos(formattedPhotos as Photo[])
    } catch (err) {
      console.error("Error fetching photos:", err)
      setError(err instanceof Error ? err : new Error("Failed to fetch photos"))
    } finally {
      setIsLoading(false)
    }
  }

  const deletePhoto = async (id: string) => {
    try {
      await pb.collection("photos").delete(id)
      setPhotos(photos.filter((photo) => photo.id !== id))
    } catch (err) {
      console.error("Error deleting photo:", err)
      throw err instanceof Error ? err : new Error("Failed to delete photo")
    }
  }

  useEffect(() => {
    fetchPhotos()
  }, [webstoryId]) // Re-fetch when webstoryId changes

  const value = {
    photos,
    isLoading,
    error,
    refreshPhotos: fetchPhotos,
    deletePhoto,
  }

  return <PhotoGalleryContext.Provider value={value}>{children}</PhotoGalleryContext.Provider>
}
