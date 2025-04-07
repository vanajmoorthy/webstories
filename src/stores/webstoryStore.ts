import { create } from "zustand"

import { HeaderComponent, PhotoTimelineComponent, TextComponent, WebstoryComponent } from "../types/webstory"

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
        const existingHeaderIndex = state.components.findIndex((comp) => comp.type === "header")

        if (existingHeaderIndex > -1) {
          const newComponents = [...state.components]
          newComponents[existingHeaderIndex] = component
          return { components: newComponents }
        }

        return { components: [component, ...state.components] }
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
        if (component.type === "photoTimeline") {
          return { ...component, ...updates } as PhotoTimelineComponent
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
          titleStyle: {
            fontSize: "24px",
            fontFamily: "Arial",
            color: "#000000",
            textAlign: "center",
          },
          subtitleStyle: {
            fontSize: "16px",
            fontFamily: "Arial",
            color: "#666666",
            textAlign: "center",
          },
        } as HeaderComponent,
      ],
    }),
}))
