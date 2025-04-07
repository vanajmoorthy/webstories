import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const parsePixelValue = (value: string | undefined): number | null => {
  if (typeof value === "string" && value.endsWith("px")) {
    const num = parseInt(value.replace("px", ""), 10)

    return isNaN(num) ? null : num
  }

  if (typeof value === "string") {
    const num = parseInt(value, 10)

    if (!isNaN(num) && num.toString() === value) {
      return num
    }
  }
  return null
}
