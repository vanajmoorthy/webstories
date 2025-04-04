import { ColorPicker } from "@/components/ui/color-picker"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface ColorPickerFieldProps {
  label: string
  value: string
  onChange: (value: string) => void
  className?: string
}

export function ColorPickerField({ label, value, onChange, className }: ColorPickerFieldProps) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="flex-1">
        <Label>{label}</Label>
      </div>
      <div className="flex items-center gap-2">
        <ColorPicker value={value} onChange={onChange} />
        <span className="text-sm font-mono">{value === "#" ? "none" : value}</span>
      </div>
    </div>
  )
}
