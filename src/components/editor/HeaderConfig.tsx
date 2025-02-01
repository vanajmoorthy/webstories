"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import { Card } from "../ui/card"

export function HeaderConfig({
  data,
  onChange,
  onBack,
}: {
  data: any
  onChange: (newData: any) => void
  onBack: () => void
}) {
  return (
    <div className="inset-0 pt-2 animate-in slide-in-from-right bg-sidebar">
      <Card className="p-2">
        <Button variant="ghost" size="sm" onClick={onBack} className="mb-4">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <div className="space-y-4">
          <div>
            <Label>Heading Text</Label>
            <Input value={data.heading} onChange={(e) => onChange({ ...data, heading: e.target.value })} />
          </div>

          <div>
            <Label>Background Color</Label>
            <Input
              type="color"
              value={data.backgroundColor}
              onChange={(e) => onChange({ ...data, backgroundColor: e.target.value })}
            />
          </div>
        </div>
      </Card>
    </div>
  )
}
