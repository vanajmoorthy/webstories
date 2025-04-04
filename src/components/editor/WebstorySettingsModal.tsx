import { Button } from "@/components/ui/button"
import { ColorPickerField } from "@/components/ui/color-picker-field"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type React from "react"

interface WebstorySettingsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  backgroundColor: string
  onTitleChange?: (title: string) => void
  onBackgroundColorChange?: (color: string) => void
}

export function WebstorySettingsModal({
  open,
  onOpenChange,
  title,
  backgroundColor,
  onTitleChange,
  onBackgroundColorChange,
}: WebstorySettingsModalProps) {
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onTitleChange) {
      onTitleChange(e.target.value)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Webstory Settings</DialogTitle>
          <DialogDescription>Update your webstory title and background color.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Title
            </Label>
            <Input
              id="title"
              value={title}
              onChange={handleTitleChange}
              className="col-span-3"
              placeholder="My Awesome Webstory"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="backgroundColor" className="text-right">
              Background
            </Label>
            <div className="col-span-3">
              <ColorPickerField
                label=""
                value={backgroundColor}
                onChange={onBackgroundColorChange || (() => { })}
                className="m-0"
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Done</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
