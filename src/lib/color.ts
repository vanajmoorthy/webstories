export function getTextColorClass(bgColor: string): string {
  if (!bgColor.startsWith("#")) return "text-white"

  let hex = bgColor.replace(/^#/, "")

  if (hex.length === 3 || hex.length === 4) {
    hex = hex
      .split("")
      .map((c) => c + c)
      .join("")
  }

  if (hex.length >= 6) {
    const r = parseInt(hex.substring(0, 2), 16)
    const g = parseInt(hex.substring(2, 4), 16)
    const b = parseInt(hex.substring(4, 6), 16)

    if ([r, g, b].every((v) => !isNaN(v))) {
      const luminance = 0.2126 * (r / 255) + 0.7152 * (g / 255) + 0.0722 * (b / 255)
      return luminance > 0.5 ? "text-black" : "text-white"
    }
  }

  return "text-white"
}
