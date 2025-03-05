import { useEffect, useState } from "react"

interface ConfigPanelProps {
  show: boolean
  children: React.ReactNode
}

export function ConfigPanel({ show, children }: ConfigPanelProps) {
  const [shouldRender, setShouldRender] = useState(show)

  useEffect(() => {
    if (show) {
      setShouldRender(true)
    }
  }, [show])

  const onAnimationEnd = () => {
    if (!show) {
      console.log(show)
      setShouldRender(false)
    }
  }

  return (
    shouldRender && (
      <div
        className={`absolute top-0 left-0 right-0 z-50 bg-sidebar  ${show ? "slide-in" : "slide-out"}`}
        onAnimationEnd={onAnimationEnd}
      >
        {children}
      </div>
    )
  )
}
