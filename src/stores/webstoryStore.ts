import { create } from "zustand"

import { HeaderComponent, TextComponent, TimelineComponent, WebstoryComponent } from "../types/webstory"

type WebstoryState = {
  components: WebstoryComponent[]
  addComponent: (component: WebstoryComponent) => void
  updateComponent: (id: string, updates: Partial<WebstoryComponent>) => void
  setComponents: (components: WebstoryComponent[]) => void
  resetComponents: () => void
}

export const useWebstoryStore = create<WebstoryState>((set) => ({
  components: [],

  addComponent: (component: WebstoryComponent) =>
    set((state) => {
      if (component.type === "header") {
        const existingHeader = state.components.find((comp) => comp.type === "header")
        if (existingHeader) return { components: state.components }
      }
      return { components: [...state.components, component] }
    }),

  updateComponent: (id, updates) =>
    set((state) => ({
      components: state.components.map((component) => {
        if (component.id !== id) return component

        if (component.type === "text") {
          return { ...component, ...updates } as TextComponent
        }
        if (component.type === "timeline") {
          return { ...component, ...updates } as TimelineComponent
        }
        if (component.type === "header") {
          return { ...component, ...updates } as HeaderComponent
        }

        return component
      }),
    })),

  setComponents: (components) => set({ components }),

  resetComponents: () =>
    set({
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
    }),
}))
