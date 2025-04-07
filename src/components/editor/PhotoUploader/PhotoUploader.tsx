import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import pb from "@/lib/pocketbase"
import { cn } from "@/lib/utils"
import { Loader2, Upload } from "lucide-react"
import { useCallback, useRef, useState } from "react"
import { useDropzone } from "react-dropzone"

import { usePhotoGallery } from "./PhotoGalleryProvider"

interface PhotoUploaderProps {
  webstoryId: string
}

interface UploadProgressEvent {
  loaded: number
  total?: number
}

export function PhotoUploader({ webstoryId }: PhotoUploaderProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({})
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()
  const { refreshPhotos } = usePhotoGallery()

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return

      if (!pb.authStore.isValid) {
        toast({
          variant: "destructive",
          title: "Authentication Required",
          description: "You must be logged in to upload photos.",
        })
        return
      }

      if (!webstoryId) {
        toast({
          variant: "destructive",
          title: "Missing Webstory ID",
          description: "A webstory ID is required to upload photos.",
        })
        return
      }

      setIsLoading(true)
      const newProgress: Record<string, number> = {}
      acceptedFiles.forEach((file) => {
        newProgress[file.name] = 0
      })
      setUploadProgress(newProgress)

      const uploadPromises = acceptedFiles.map(async (file) => {
        const formData = new FormData()

        formData.append("file", file)

        formData.append("filename", file.name)
        formData.append("user", pb.authStore.record?.id || "")
        formData.append("webstory_id", webstoryId)

        try {
          await pb.collection("photos").create(formData, {
            onUploadProgress: (progressEvent: UploadProgressEvent) => {
              if (progressEvent.total) {
                const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
                setUploadProgress((prev) => ({
                  ...prev,
                  [file.name]: progress,
                }))
              }
            },
          })

          return true
        } catch (error) {
          console.error(`Error uploading ${file.name}:`, error)
          toast({
            variant: "destructive",
            title: "Upload Failed",
            description: `Failed to upload ${file.name}. Please try again.`,
          })
          return false
        }
      })

      try {
        const results = await Promise.all(uploadPromises)
        const successCount = results.filter(Boolean).length

        if (successCount > 0) {
          toast({
            title: "Upload Successful",
            description: `Successfully uploaded ${successCount} photo${successCount > 1 ? "s" : ""}.`,
          })

          refreshPhotos()
        }
      } catch (error) {
        console.error("Error during upload:", error)
      } finally {
        setIsLoading(false)
        setUploadProgress({})
      }
    },
    [toast, refreshPhotos, webstoryId]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp"],
    },
    disabled: isLoading,
  })

  const handleFileSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  return (
    <div
      {...getRootProps()}
      className={cn(
        "border-2 border-dashed rounded-lg flex-1 flex flex-col items-center justify-center p-8 m-4 transition-colors",
        isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/20 hover:border-primary/50"
      )}
    >
      <input {...getInputProps()} ref={fileInputRef} />

      <div className="flex flex-col items-center justify-center text-center">
        <Upload className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">Drag & drop photos here</h3>
        <p className="text-sm text-muted-foreground mb-4">or click to select files from your computer</p>
        <Button onClick={handleFileSelect} disabled={isLoading} variant="outline">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            "Select Files"
          )}
        </Button>
      </div>

      {Object.keys(uploadProgress).length > 0 && (
        <div className="w-full mt-6 space-y-2">
          {Object.entries(uploadProgress).map(([filename, progress]: [string, number]) => (
            <div key={filename} className="w-full">
              <div className="flex justify-between text-xs mb-1">
                <span className="truncate max-w-[200px]">{filename}</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                <div
                  className="bg-primary h-full transition-all duration-300 ease-in-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
