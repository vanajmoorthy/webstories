import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
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
import { Card } from "@/components/ui/card"
import { ColorPickerField } from "@/components/ui/color-picker-field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { useWebstoryStore } from "@/stores/webstoryStore"
import type { PhotoTimelineComponent, TimelinePhoto, TimelineRow } from "@/types/webstory"
import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { ChevronLeft, Clock, GripVertical, Image, PlusCircle, Trash2 } from "lucide-react"
import { CSSProperties, useState } from "react"

import type { Photo } from "../PhotoUploader/PhotoGalleryProvider"
import { PhotoUploadModal } from "../PhotoUploader/PhotoUploadModal"

interface SortableTimelineRow extends TimelineRow {
  id: string
}

interface PhotoTimelineConfigProps {
  photoTimelineComponent: PhotoTimelineComponent
  onBack: () => void
  webstoryId: string
}

interface SortableRowCardProps {
  row: SortableTimelineRow
  index: number
  webstoryId: string
  componentId: string
  updateRowDate: (index: number, date: string) => void
  updateRowText: (index: number, text: string) => void
  deleteRow: (index: number) => void
  openPhotoModal: (rowIndex: number) => void
  removePhoto: (rowIndex: number, photoIndex: number) => void
}

function SortableRowCard({
  row,
  index,
  componentId,
  webstoryId,
  updateRowDate,
  updateRowText,
  deleteRow,
  openPhotoModal,
  removePhoto,
}: SortableRowCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: row.id })

  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.8 : 1,
    zIndex: isDragging ? 10 : "auto",
  }

  const displayCaption = row.text.length > 23 ? row.text.substring(0, 23) + "..." : row.text || `Row ${index + 1}`

  return (
    <div ref={setNodeRef} style={style} className="mb-2">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value={row.id} className="border rounded-md bg-card overflow-hidden">
          <AccordionTrigger className="px-3 py-2 hover:no-underline hover:bg-muted/50 data-[state=open]:border-b">
            <div className="flex items-center gap-2 w-full">
              <span {...attributes} {...listeners} className="cursor-grab p-1 -ml-1">
                <GripVertical className="h-5 w-5 text-muted-foreground" />
              </span>
              <span className="font-normal text-sm flex-1 text-left truncate" title={row.text}>
                {displayCaption}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation()
                  deleteRow(index)
                }}
                className="text-destructive hover:text-destructive hover:bg-destructive/10 h-7 w-7"
                aria-label="Delete Row"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </AccordionTrigger>
          <AccordionContent className="p-3 space-y-3 border-t">
            <div>
              <Label htmlFor={`row-${index}-date`} className="text-xs">
                Date
              </Label>
              <Input
                id={`row-${index}-date`}
                type="date"
                value={typeof row.date === "string" ? row.date : row.date.toISOString().split("T")[0]}
                onChange={(e) => updateRowDate(index, e.target.value)}
                className="h-8 text-sm"
              />
            </div>
            <div>
              <Label htmlFor={`row-${index}-text`} className="text-xs">
                Text Content
              </Label>
              <Textarea
                id={`row-${index}-text`}
                value={row.text}
                onChange={(e) => updateRowText(index, e.target.value)}
                rows={4}
                className="text-sm"
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <Label className="text-xs">Photos ({row.photos.length}/7)</Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openPhotoModal(index)}
                  disabled={row.photos.length >= 7}
                >
                  <Image className="h-3 w-3 mr-1" />
                  Add
                </Button>
              </div>

              {row.photos.length > 0 ? (
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-1.5">
                  {row.photos.map((photo, photoIndex) => (
                    <div key={photo.id || `photo-${photoIndex}`} className="relative group aspect-square">
                      <img
                        src={photo.url || "/placeholder.svg"}
                        alt={photo.caption || `Photo ${photoIndex + 1}`}
                        className="w-full h-full object-cover rounded border"
                      />
                      <Button
                        variant="destructive"
                        size="icon"
                        className="h-5 w-5 absolute top-0.5 right-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removePhoto(index, photoIndex)}
                      >
                        <Trash2 className="h-2.5 w-2.5" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center p-3 border border-dashed rounded-md text-muted-foreground text-xs">
                  No photos added.
                </div>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}

export function PhotoTimelineConfig({ photoTimelineComponent, onBack, webstoryId }: PhotoTimelineConfigProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false)
  const [currentRowForPhoto, setCurrentRowForPhoto] = useState<number | null>(null)

  const updateComponent = useWebstoryStore((state) => state.updateComponent)
  const components = useWebstoryStore((state) => state.components)
  const setComponents = useWebstoryStore((state) => state.setComponents)
  const { toast } = useToast()

  const sortableRows: SortableTimelineRow[] = photoTimelineComponent.rows.map((row, index) => ({
    ...row,
    id: row.id || `row-${photoTimelineComponent.id}-${index}-${Date.now()}`,
  }))

  const handleDeleteComponent = () => {
    const updatedComponents = components.filter((component) => component.id !== photoTimelineComponent.id)
    setComponents(updatedComponents)
    onBack()
  }

  const updateBackgroundColor = (backgroundColor: string) => {
    updateComponent(photoTimelineComponent.id, { backgroundColor })
  }

  const updateAlignment = (alignment: "left" | "right" | "alternate") => {
    updateComponent(photoTimelineComponent.id, { alignment })
  }

  const updatePhotoSize = (photoSize: "small" | "medium" | "large") => {
    updateComponent(photoTimelineComponent.id, { photoSize })
  }

  const addRow = () => {
    const newRowId = `row-${photoTimelineComponent.id}-${Date.now()}`
    const newRow: TimelineRow = {
      id: newRowId,
      photos: [],
      date: new Date().toISOString().split("T")[0],
      text: "New row content...",
    }
    const updatedRows = [...photoTimelineComponent.rows, newRow]
    updateComponent(photoTimelineComponent.id, { rows: updatedRows })
  }

  const deleteRow = (index: number) => {
    if (photoTimelineComponent.rows.length <= 1) {
      toast({
        title: "Cannot Delete Row",
        description: "A photo timeline must have at least one row.",
        variant: "destructive",
      })
      return
    }
    const updatedRows = photoTimelineComponent.rows.filter((_, i) => i !== index)
    updateComponent(photoTimelineComponent.id, { rows: updatedRows })
  }

  const updateRowText = (index: number, text: string) => {
    const updatedRows = photoTimelineComponent.rows.map((row, i) => (i === index ? { ...row, text } : row))
    updateComponent(photoTimelineComponent.id, { rows: updatedRows })
  }

  const updateRowDate = (index: number, date: string) => {
    const updatedRows = photoTimelineComponent.rows.map((row, i) => (i === index ? { ...row, date } : row))
    updateComponent(photoTimelineComponent.id, { rows: updatedRows })
  }

  const openPhotoModal = (rowIndex: number) => {
    setCurrentRowForPhoto(rowIndex)
    setIsPhotoModalOpen(true)
  }

  const handlePhotoSelect = (photo: Photo) => {
    if (currentRowForPhoto === null) return

    const updatedRows = [...photoTimelineComponent.rows]
    const currentRow = updatedRows[currentRowForPhoto]

    if (!currentRow || currentRow.photos.length >= 7) {
      if (currentRow && currentRow.photos.length >= 7) {
        toast({
          title: "Maximum Photos Reached",
          description: "You can only add up to 7 photos per row.",
          variant: "destructive",
        })
      }
      return
    }

    const newPhoto: TimelinePhoto = {
      id: photo.id,
      url: photo.url,
      caption: photo.filename,
    }

    const newPhotos = [...currentRow.photos, newPhoto]

    updatedRows[currentRowForPhoto] = {
      ...currentRow,
      photos: newPhotos,
    }

    updateComponent(photoTimelineComponent.id, { rows: updatedRows })
  }

  const removePhoto = (rowIndex: number, photoIndex: number) => {
    const updatedRows = photoTimelineComponent.rows.map((row, i) => {
      if (i === rowIndex) {
        const updatedPhotos = row.photos.filter((_, pIndex) => pIndex !== photoIndex)
        return { ...row, photos: updatedPhotos }
      }
      return row
    })
    updateComponent(photoTimelineComponent.id, { rows: updatedRows })
  }

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = photoTimelineComponent.rows.findIndex(
        (row) =>
          (row.id || `row-${photoTimelineComponent.id}-${photoTimelineComponent.rows.indexOf(row)}-${Date.now()}`) ===
          active.id
      )
      const newIndex = photoTimelineComponent.rows.findIndex(
        (row) =>
          (row.id || `row-${photoTimelineComponent.id}-${photoTimelineComponent.rows.indexOf(row)}-${Date.now()}`) ===
          over.id
      )

      if (oldIndex !== -1 && newIndex !== -1) {
        const reorderedRows = arrayMove(photoTimelineComponent.rows, oldIndex, newIndex)
        updateComponent(photoTimelineComponent.id, { rows: reorderedRows })
      } else {
        console.warn("Could not find dragged items for reordering", {
          activeId: active.id,
          overId: over.id,
          rows: photoTimelineComponent.rows,
        })
      }
    }
  }

  return (
    <div className="inset-0 pt-2 bg-sidebar">
      <Card className="p-3">
        <div className="flex items-center mb-3">
          <Button variant="ghost" size="sm" onClick={onBack} className="mr-2 px-2">
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Button>
          <div className="flex items-center gap-2 flex-1">
            <Clock className="h-5 w-5 text-muted-foreground" />
            <h3 className="font-medium">Photo Timeline</h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowDeleteDialog(true)}
            className="text-destructive hover:text-destructive hover:bg-destructive/10 px-2"
            aria-label="Delete Component"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4 h-9">
            <TabsTrigger value="general" className="text-xs px-1">
              General
            </TabsTrigger>
            <TabsTrigger value="content" className="text-xs px-1">
              Content
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4 mt-0">
            <ColorPickerField
              label="Background Color"
              value={photoTimelineComponent.backgroundColor}
              onChange={updateBackgroundColor}
            />
            <div>
              <Label htmlFor="alignment">Layout Alignment</Label>
              <Select
                value={photoTimelineComponent.alignment}
                onValueChange={(value) => updateAlignment(value as "left" | "right" | "alternate")}
              >
                <SelectTrigger id="alignment" className="h-9">
                  <SelectValue placeholder="Select alignment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="left">Left</SelectItem>
                  <SelectItem value="right">Right</SelectItem>
                  <SelectItem value="alternate">Alternate</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="photo-size">Photo Size</Label>
              <Select
                value={photoTimelineComponent.photoSize || "medium"}
                onValueChange={(value) => updatePhotoSize(value as "small" | "medium" | "large")}
              >
                <SelectTrigger id="photo-size" className="h-9">
                  <SelectValue placeholder="Select photo size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">Small</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="large">Large</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </TabsContent>

          <TabsContent value="content" className="mt-0 space-y-2">
            {sortableRows.length > 0 ? (
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={sortableRows.map((row) => row.id)} strategy={verticalListSortingStrategy}>
                  {sortableRows.map((row, index) => (
                    <SortableRowCard
                      key={row.id}
                      row={row}
                      index={index}
                      componentId={photoTimelineComponent.id}
                      webstoryId={webstoryId}
                      updateRowDate={updateRowDate}
                      updateRowText={updateRowText}
                      deleteRow={deleteRow}
                      openPhotoModal={openPhotoModal}
                      removePhoto={removePhoto}
                    />
                  ))}
                </SortableContext>
              </DndContext>
            ) : (
              <div className="text-center py-6 px-4 border border-dashed rounded-md text-muted-foreground text-sm">
                No rows added yet. Click the button below to add one.
              </div>
            )}
            <div className="flex justify-center pt-2">
              <Button
                onClick={addRow}
                size="sm"
                variant="outline"
                className="border-primary text-primary hover:bg-primary/10"
                aria-label="Add Row"
              >
                <PlusCircle className="h-4 w-4 mr-1" strokeWidth={2} />
                Add row
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </Card>
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Photo Timeline Component</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this photo timeline component? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteComponent}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {isPhotoModalOpen && currentRowForPhoto !== null && (
        <PhotoUploadModal
          open={isPhotoModalOpen}
          onOpenChange={setIsPhotoModalOpen}
          webstoryId={webstoryId}
          onPhotoSelect={handlePhotoSelect}
        />
      )}
    </div>
  )
}
