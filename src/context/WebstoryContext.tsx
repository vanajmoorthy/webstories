// context/WebstoryContext.tsx
import React, { createContext, useContext, useState } from "react"
import { WebstoryComponent } from "@/types/webstory"

type WebstoryContextType = {
  components: WebstoryComponent[]
  addComponent: (type: WebstoryComponent["type"]) => void
  updateComponent: (id: string, updates: Partial<WebstoryComponent>) => void
  reorderComponents: (newOrder: WebstoryComponent[]) => void
  selectedComponent: WebstoryComponent | null
  setSelectedComponent: (component: WebstoryComponent | null) => void
}

const WebstoryContext = createContext<WebstoryContextType>(null!)

export function WebstoryProvider({ children }: { children: React.ReactNode }) {
  const [components, setComponents] = useState<WebstoryComponent[]>([])
  const [selectedComponent, setSelectedComponent] = useState<WebstoryComponent | null>(null)

  const addComponent = (type: WebstoryComponent["type"]) => {
    const baseComponent = {
      id: Date.now().toString(),
      order: components.length,
      backgroundColor: "#ffffff",
    }

    switch (type) {
      case "text":
        setComponents((prev) => [
          ...prev,
          {
            ...baseComponent,
            type: "text",
            content: "New text block",
            fontSize: "16px",
            fontFamily: "Arial",
            italic: false,
            bold: false,
          },
        ])
        break
      case "timeline":
        setComponents((prev) => [
          ...prev,
          {
            ...baseComponent,
            type: "timeline",
            itemsPerRow: 3,
            rows: [],
          },
        ])
        break
      case "header":
        setComponents((prev) => [
          ...prev,
          {
            ...baseComponent,
            type: "header",
            title: "My Webstory",
            subtitle: "A beautiful timeline",
            titleStyle: {
              fontSize: "24px",
              fontFamily: "Arial",
              color: "#000000",
            },
          },
        ])
    }
  }

  const updateComponent = (id: string, updates: Partial<WebstoryComponent>) => {
    setComponents((prev) => prev.map((comp) => (comp.id === id ? { ...comp, ...updates } : comp)))
  }

  const reorderComponents = (newOrder: WebstoryComponent[]) => {
    setComponents(newOrder)
  }

  return (
    <WebstoryContext.Provider
      value={{
        components,
        addComponent,
        updateComponent,
        reorderComponents,
        selectedComponent,
        setSelectedComponent,
      }}
    >
      {children}
    </WebstoryContext.Provider>
  )
}

export const useWebstory = () => useContext(WebstoryContext)
