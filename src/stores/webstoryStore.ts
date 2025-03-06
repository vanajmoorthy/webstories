import { create } from "zustand"

import { HeaderComponent, TextComponent, TimelineComponent, WebstoryComponent } from "../types/webstory"

type WebstoryState = {
  components: WebstoryComponent[]
  addComponent: (component: WebstoryComponent) => void
  updateComponent: (id: string, updates: Partial<WebstoryComponent>) => void
}

export const useWebstoryStore = create<WebstoryState>((set) => ({
  components: [
    {
      id: `${Date.now()}`,
      type: "header",
      backgroundColor: "#ffaaaa",
      order: 1,
      title: "Default Header",
      subtitle: "Subtitle",
      titleStyle: { fontSize: "20px", fontFamily: "Arial", color: "black", textAlign: "center" },
      subtitleStyle: { fontSize: "16px", fontFamily: "Arial", color: "gray", textAlign: "center" },
    } as HeaderComponent,
  ],
  addComponent: (component: WebstoryComponent) =>
    set((state: WebstoryState) => {
      if (component.type === "header") {
        const existingHeader = state.components.find((comp) => comp.type === "header")
        if (existingHeader) {
          return {
            components: state.components,
          }
        }
      }

      return {
        components: [...state.components, component],
      }
    }),
  updateComponent: (id: string, updates: Partial<WebstoryComponent>) =>
    set((state: WebstoryState) => ({
      components: state.components.map((component) => {
        if (component.id !== id) return component

        switch (component.type) {
          case "text":
            return { ...component, ...updates } as TextComponent
          case "timeline":
            return { ...component, ...updates } as TimelineComponent
          case "header":
            return { ...component, ...updates } as HeaderComponent
          default:
            return component
        }
      }),
    })),
}))
