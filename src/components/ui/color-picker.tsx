import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Check, X } from "lucide-react"
import React, { useCallback, useEffect, useRef, useState } from "react"

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

function rgbToHex(rgb: RGB): string {
  const toHex = (c: number) => ("0" + c.toString(16)).slice(-2)
  return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`
}

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

interface ColorPickerProps {
  value: string //  HEX color string or ""
  onChange: (value: string) => void
  disabled?: boolean
  className?: string
  triggerClassName?: string
}

export function ColorPicker({
  value = "#000000",
  onChange,
  disabled = false,
  className,
  triggerClassName,
}: ColorPickerProps) {
  const initialHsv = value && value.startsWith("#") ? hexToHsv(value) : { h: 0, s: 0, v: 0 }
  const [hsv, setHsv] = useState<HSV>(initialHsv || { h: 0, s: 0, v: 0 })
  const [hexColor, setHexColor] = useState<string>(value)
  const [open, setOpen] = useState(false)

  const saturationValueRef = useRef<HTMLDivElement>(null)
  const hueSliderRef = useRef<HTMLInputElement>(null)
  const isDraggingRef = useRef(false)

  useEffect(() => {
    if (value !== hexColor) {
      const newHsv = value && value.startsWith("#") ? hexToHsv(value) : null
      if (newHsv) {
        setHsv(newHsv)
        setHexColor(value)
      } else {
        setHsv({ h: 0, s: 0, v: 100 })
        setHexColor("")
      }
    }
  }, [value])

  useEffect(() => {
    if (hexColor !== "") {
      setHexColor(hsvToHex(hsv))
    }
  }, [hsv])

  const handleHsvChange = useCallback((newHsv: Partial<HSV>) => {
    setHsv((prevHsv) => {
      const updatedHsv = { ...prevHsv, ...newHsv }
      setHexColor(hsvToHex(updatedHsv))
      return updatedHsv
    })
  }, [])

  const handleSaturationValueInteraction = useCallback(
    (event: React.MouseEvent<HTMLDivElement> | MouseEvent) => {
      if (!saturationValueRef.current) return

      const rect = saturationValueRef.current.getBoundingClientRect()
      const x = Math.max(0, Math.min(event.clientX - rect.left, rect.width))
      const y = Math.max(0, Math.min(event.clientY - rect.top, rect.height))

      const newSaturation = Math.round((x / rect.width) * 100)
      const newValue = Math.round(100 - (y / rect.height) * 100)

      handleHsvChange({ s: newSaturation, v: newValue })
    },
    [handleHsvChange]
  )

  const handleMouseUp = useCallback(() => {
    if (isDraggingRef.current) {
      isDraggingRef.current = false
      window.removeEventListener("mousemove", handleSaturationValueInteraction)
      window.removeEventListener("mouseup", handleMouseUp)
    }
  }, [handleSaturationValueInteraction])

  const handleMouseDown = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (disabled) return
      isDraggingRef.current = true
      handleSaturationValueInteraction(event)

      window.addEventListener("mousemove", handleSaturationValueInteraction)
      window.addEventListener("mouseup", handleMouseUp)
    },
    [disabled, handleSaturationValueInteraction, handleMouseUp]
  )

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

    setHexColor(newHex)

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
      setHexColor(presetColor)
    }
  }

  const handleNoColorClick = () => {
    if (disabled) return
    setHexColor("")
    setHsv({ h: 0, s: 0, v: 100 })
  }

  const handleSave = () => {
    onChange(hexColor)
    setOpen(false)
  }

  const handleCancel = () => {
    const originalHsv = value && value.startsWith("#") ? hexToHsv(value) : { h: 0, s: 0, v: 100 }
    setHsv(originalHsv || { h: 0, s: 0, v: 100 })
    setHexColor(value)
    setOpen(false)
  }

  const saturationBackground = `hsl(${hsv.h}, 100%, 50%)`
  const handleLeft = `${hsv.s}%`
  const handleTop = `${100 - hsv.v}%`

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
          style={{ backgroundColor: triggerDisplayColor }}
        >
          {hexColor === "" && <div className="w-9 h-0.5 bg-red-500 rotate-45 absolute" />}
          <span className="sr-only">Pick a color</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className={cn("w-64 p-3", className)} align="start" sideOffset={5}>
        <div className="space-y-3">
          <div
            ref={saturationValueRef}
            className="relative h-32 w-full rounded-md overflow-hidden cursor-crosshair border"
            style={{ backgroundColor: saturationBackground }}
            onMouseDown={handleMouseDown}
          >
            <div className="absolute inset-0" style={{ background: "linear-gradient(to right, white, transparent)" }} />
            <div className="absolute inset-0" style={{ background: "linear-gradient(to top, black, transparent)" }} />
            <div
              className="absolute h-3 w-3 rounded-full border-2 border-white shadow-md pointer-events-none transform -translate-x-1/2 -translate-y-1/2"
              style={{
                left: handleLeft,
                top: handleTop,
                backgroundColor: hexColor === "" ? "transparent" : hexColor,
              }}
            />
          </div>

          <div className="flex flex-col gap-1">
            <Label htmlFor="color-preview-small">Preview</Label>
            <div
              id="color-preview-small"
              className="h-8 w-100 rounded-sm border"
              style={{ backgroundColor: hexColor === "" ? "transparent" : hexColor }}
            >
              {hexColor === "" && (
                <div className="w-full h-full flex items-center justify-center relative">
                  <div className="w-9 h-0.5 bg-red-500 rotate-45 absolute" />
                </div>
              )}
            </div>
          </div>

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
              <div
                className="absolute top-1/2 h-3 w-1 rounded-full bg-white border border-gray-500 shadow pointer-events-none transform -translate-y-1/2"
                style={{ left: `${(hsv.h / 360) * 100}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-6 gap-1 pt-1">
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
              "#FF0000",
              "#FFA500",
              "#FFFF00",
              "#00FF00",
              "#00FFFF",
              "#0000FF",
              "#FF00FF",
              "#FFFFFF",
              "#808080",
              "#000000",
              "#A52A2A",
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

          <div className="space-y-1.5">
            <Label htmlFor="hex-input">Hex Color</Label>
            <div className="flex items-center gap-2">
              <div className="flex-1 relative">
                <Input
                  id="hex-input"
                  value={hexColor}
                  onChange={handleHexInputChange}
                  className="pl-3 pr-1"
                  placeholder="#RRGGBB"
                  disabled={disabled || hexColor === ""}
                />
              </div>
            </div>
          </div>

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
