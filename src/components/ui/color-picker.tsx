import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Check, X } from "lucide-react"
import React, { useCallback, useEffect, useRef, useState } from "react"

// --- Helper Color Conversion Functions ---

interface HSV {
  h: number
  s: number
  v: number
}
interface RGB {
  r: number
  g: number
  b: number
}

// Basic HSV to RGB (values 0-1)
function hsvToRgb(hsv: HSV): RGB {
  let r = 0,
    g = 0,
    b = 0
  const h = hsv.h / 360
  const s = hsv.s / 100
  const v = hsv.v / 100

  const i = Math.floor(h * 6)
  const f = h * 6 - i
  const p = v * (1 - s)
  const q = v * (1 - f * s)
  const t = v * (1 - (1 - f) * s)

  switch (i % 6) {
    case 0:
      r = v
      g = t
      b = p
      break
    case 1:
      r = q
      g = v
      b = p
      break
    case 2:
      r = p
      g = v
      b = t
      break
    case 3:
      r = p
      g = q
      b = v
      break
    case 4:
      r = t
      g = p
      b = v
      break
    case 5:
      r = v
      g = p
      b = q
      break
  }

  return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) }
}

// Basic RGB to HEX
function rgbToHex(rgb: RGB): string {
  const toHex = (c: number) => ("0" + c.toString(16)).slice(-2)
  return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`
}

// Basic HEX to RGB
function hexToRgb(hex: string): RGB | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16),
    }
    : null
}

// Basic RGB to HSV
function rgbToHsv(rgb: RGB): HSV {
  const r = rgb.r / 255,
    g = rgb.g / 255,
    b = rgb.b / 255
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b)
  let h = 0,
    s = 0,
    v = max

  const d = max - min
  s = max === 0 ? 0 : d / max

  if (max !== min) {
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0)
        break
      case g:
        h = (b - r) / d + 2
        break
      case b:
        h = (r - g) / d + 4
        break
    }
    h /= 6
  }

  return { h: Math.round(h * 360), s: Math.round(s * 100), v: Math.round(v * 100) }
}

function hsvToHex(hsv: HSV): string {
  return rgbToHex(hsvToRgb(hsv))
}

function hexToHsv(hex: string): HSV | null {
  const rgb = hexToRgb(hex)
  return rgb ? rgbToHsv(rgb) : null
}

// --- Component ---

interface ColorPickerProps {
  value: string // Expects HEX color string (e.g., "#RRGGBB") or ""
  onChange: (value: string) => void
  disabled?: boolean
  className?: string // Class for the PopoverContent
  triggerClassName?: string // Class for the Trigger Button
}

export function ColorPicker({
  value = "#000000", // Default to black if value is "" initially? Or handle "" state? Let's default display to black but store ""
  onChange,
  disabled = false,
  className,
  triggerClassName,
}: ColorPickerProps) {
  const initialHsv = value && value.startsWith("#") ? hexToHsv(value) : { h: 0, s: 0, v: 0 } // Default to black if invalid/empty
  const [hsv, setHsv] = useState<HSV>(initialHsv || { h: 0, s: 0, v: 0 })
  const [hexColor, setHexColor] = useState<string>(value) // Store the original hex or ""
  const [open, setOpen] = useState(false)

  const saturationValueRef = useRef<HTMLDivElement>(null)
  const hueSliderRef = useRef<HTMLInputElement>(null)
  const isDraggingRef = useRef(false)

  // Update internal HSV and derived HEX when the external value prop changes
  useEffect(() => {
    if (value !== hexColor) {
      // Avoid loops if onChange updates the prop instantly
      const newHsv = value && value.startsWith("#") ? hexToHsv(value) : null
      if (newHsv) {
        setHsv(newHsv)
        setHexColor(value)
      } else {
        // Handle empty or invalid string case
        setHsv({ h: 0, s: 0, v: 100 }) // Reset to white, maybe? Or keep last valid? Let's reset to white.
        setHexColor("") // Keep the internal hex empty
      }
    }
  }, [value]) // Only run when the external value prop changes

  // Update derived HEX color whenever HSV changes
  useEffect(() => {
    // Only update hex if we are not in the "no color" state
    if (hexColor !== "") {
      setHexColor(hsvToHex(hsv))
    }
  }, [hsv]) // Run whenever h, s, or v changes

  const handleHsvChange = useCallback((newHsv: Partial<HSV>) => {
    setHsv((prevHsv) => {
      const updatedHsv = { ...prevHsv, ...newHsv }
      // Ensure HEX is recalculated based on the new combined HSV
      setHexColor(hsvToHex(updatedHsv))
      return updatedHsv
    })
  }, [])

  // --- Event Handlers for Saturation/Value Area ---

  const handleSaturationValueInteraction = useCallback(
    (event: React.MouseEvent<HTMLDivElement> | MouseEvent) => {
      if (!saturationValueRef.current) return

      const rect = saturationValueRef.current.getBoundingClientRect()
      // Calculate relative X and Y, clamped between 0 and width/height
      const x = Math.max(0, Math.min(event.clientX - rect.left, rect.width))
      const y = Math.max(0, Math.min(event.clientY - rect.top, rect.height))

      const newSaturation = Math.round((x / rect.width) * 100)
      const newValue = Math.round(100 - (y / rect.height) * 100) // Y=0 is top (Value=100), Y=height is bottom (Value=0)

      handleHsvChange({ s: newSaturation, v: newValue })
    },
    [handleHsvChange]
  )

  const handleMouseUp = useCallback(() => {
    if (isDraggingRef.current) {
      isDraggingRef.current = false
      window.removeEventListener("mousemove", handleSaturationValueInteraction)
      window.removeEventListener("mouseup", handleMouseUp)
      // Optional: Call onChange here if you want updates only on mouse up
    }
  }, [handleSaturationValueInteraction])

  const handleMouseDown = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (disabled) return
      isDraggingRef.current = true
      handleSaturationValueInteraction(event) // Update on initial click

      window.addEventListener("mousemove", handleSaturationValueInteraction)
      window.addEventListener("mouseup", handleMouseUp)
    },
    [disabled, handleSaturationValueInteraction, handleMouseUp]
  )

  // --- Other Handlers ---

  const handleHueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return
    handleHsvChange({ h: parseInt(event.target.value, 10) })
  }

  const handleHexInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return
    let newHex = e.target.value

    if (!newHex.startsWith("#")) {
      newHex = `#${newHex}`
    }
    newHex = newHex.replace(/[^#0-9A-Fa-f]/g, "").substring(0, 7)

    setHexColor(newHex) // Update hex input immediately

    // If valid hex, update HSV
    if (/^#[0-9A-Fa-f]{6}$/i.test(newHex)) {
      const newHsv = hexToHsv(newHex)
      if (newHsv) {
        setHsv(newHsv)
      }
    }
  }

  const handlePresetClick = (presetColor: string) => {
    if (disabled) return
    const newHsv = hexToHsv(presetColor)
    if (newHsv) {
      setHsv(newHsv)
      setHexColor(presetColor) // Directly set hex for presets
    }
  }

  const handleNoColorClick = () => {
    if (disabled) return
    setHexColor("") // Set hex state to empty
    // Optionally reset HSV to a default like white or black
    setHsv({ h: 0, s: 0, v: 100 }) // Reset HSV to white
  }

  const handleSave = () => {
    onChange(hexColor) // Use the current hexColor state ("" or "#RRGGBB")
    setOpen(false)
  }

  const handleCancel = () => {
    // Revert state back to the initial prop value
    const originalHsv = value && value.startsWith("#") ? hexToHsv(value) : { h: 0, s: 0, v: 100 } // Reset to white if original was ""
    setHsv(originalHsv || { h: 0, s: 0, v: 100 })
    setHexColor(value) // Revert hex state too
    setOpen(false)
  }

  // --- Calculate styles ---
  const saturationBackground = `hsl(${hsv.h}, 100%, 50%)` // Pure hue for the base
  const handleLeft = `${hsv.s}%`
  const handleTop = `${100 - hsv.v}%` // Y=0 is top (Value=100)

  // Determine display color for trigger (use white if hexColor is empty)
  const triggerDisplayColor = hexColor === "" ? "#FFFFFF" : hexColor

  return (
    <Popover open={open} modal={true} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "h-8 w-8 p-0 flex items-center justify-center border-2 ",
            disabled && "opacity-50 cursor-not-allowed",
            triggerClassName
          )}
          disabled={disabled}
          style={{ backgroundColor: triggerDisplayColor }} // Use derived hex or white for background
        >
          {/* Show diagonal line if actual value is no color */}
          {hexColor === "" && <div className="w-9 h-0.5 bg-red-500 rotate-45 absolute" />}
          <span className="sr-only">Pick a color</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className={cn("w-64 p-3", className)} align="start" sideOffset={5}>
        <div className="space-y-3">
          {/* Saturation/Value Area */}
          <div
            ref={saturationValueRef}
            className="relative h-32 w-full rounded-md overflow-hidden cursor-crosshair border"
            style={{ backgroundColor: saturationBackground }}
            onMouseDown={handleMouseDown}
          >
            {/* Saturation Gradient (White to Hue) */}
            <div className="absolute inset-0" style={{ background: "linear-gradient(to right, white, transparent)" }} />
            {/* Value Gradient (Transparent to Black) */}
            <div className="absolute inset-0" style={{ background: "linear-gradient(to top, black, transparent)" }} />
            {/* Handle Indicator */}
            <div
              className="absolute h-3 w-3 rounded-full border-2 border-white shadow-md pointer-events-none transform -translate-x-1/2 -translate-y-1/2"
              style={{
                left: handleLeft,
                top: handleTop,
                backgroundColor: hexColor === "" ? "transparent" : hexColor, // Show current color unless "no color"
              }}
            />
          </div>

          {/* Reduced Size Preview */}
          <div className="flex flex-col gap-1">
            <Label htmlFor="color-preview-small">Preview</Label>
            <div
              id="color-preview-small"
              className="h-8 w-100 rounded-sm border" // Reduced height h-8 w-8
              style={{ backgroundColor: hexColor === "" ? "transparent" : hexColor }}
            >
              {hexColor === "" && (
                <div className="w-full h-full flex items-center justify-center relative">
                  <div className="w-9 h-0.5 bg-red-500 rotate-45 absolute" />
                </div>
              )}
            </div>
          </div>

          {/* Hue Slider */}
          <div className="space-y-1.5">
            <Label htmlFor="hue-slider">Hue</Label>
            <div
              className="h-4 rounded-md relative"
              style={{
                background: "linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)",
              }}
            >
              <Input
                ref={hueSliderRef}
                id="hue-slider"
                type="range"
                min="0"
                max="360"
                value={hsv.h}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={handleHueChange}
                disabled={disabled}
              />
              {/* Optional: Hue Handle Visual */}
              <div
                className="absolute top-1/2 h-3 w-1 rounded-full bg-white border border-gray-500 shadow pointer-events-none transform -translate-y-1/2"
                style={{ left: `${(hsv.h / 360) * 100}%` }}
              />
            </div>
          </div>

          {/* Presets */}
          <div className="grid grid-cols-6 gap-1 pt-1">
            {/* Adjusted grid cols */}
            <Button
              variant="outline"
              className="h-6 w-6 p-0 rounded-sm relative border-muted-foreground"
              onClick={handleNoColorClick}
              title="No color"
              disabled={disabled}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full h-0.5 bg-red-500 rotate-45" />
              </div>
            </Button>
            {[
              "#FF0000", // Red
              "#FFA500", // Orange
              "#FFFF00", // Yellow
              "#00FF00", // Lime Green
              "#00FFFF", // Cyan
              "#0000FF", // Blue
              "#FF00FF", // Magenta
              "#FFFFFF", // White
              "#808080", // Gray
              "#000000", // Black
              // Add 1 more common color if needed, e.g., Brown #A52A2A
              "#A52A2A", // Brown
            ].map((presetColor) => (
              <Button
                key={presetColor}
                variant="outline"
                className="h-6 w-6 p-0 rounded-sm border-muted-foreground"
                style={{ backgroundColor: presetColor }}
                onClick={() => handlePresetClick(presetColor)}
                disabled={disabled}
                title={presetColor}
              />
            ))}
          </div>

          {/* Hex Input */}
          <div className="space-y-1.5">
            <Label htmlFor="hex-input">Hex Color</Label>
            <div className="flex items-center gap-2">
              <div className="flex-1 relative">
                <Input
                  id="hex-input"
                  value={hexColor} // Display the derived/stored hex
                  onChange={handleHexInputChange}
                  className="pl-3 pr-1" // Adjust padding slightly
                  placeholder="#RRGGBB"
                  disabled={disabled || hexColor === ""} // Disable input if "no color" is selected
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between mt-4">
            <Button variant="outline" size="sm" onClick={handleCancel} className="flex items-center gap-1">
              <X className="h-3.5 w-3.5" />
              Cancel
            </Button>
            <Button size="sm" onClick={handleSave} className="flex items-center gap-1" disabled={disabled}>
              <Check className="h-3.5 w-3.5" />
              Apply
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
