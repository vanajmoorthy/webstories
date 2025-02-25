import { create } from "zustand"

import { WebstoryComponent } from "../types/webstory"

type WebstoryState = {
  components: WebstoryComponent[]
  addComponent: (component: WebstoryComponent) => void
  updateComponent: (id: string, updates: Partial<WebstoryComponent>) => void
}

export const useWebstoryStore = create<WebstoryState>((set) => ({
  components: [],
  addComponent: (component: WebstoryComponent) =>
    set((state: WebstoryState) => {
      // If there's already a header, replace it, otherwise add the new one
      const existingHeader = state.components.find((comp) => comp.type === "header")
      if (existingHeader) {
        return {
          components: state.components.map((comp) => (comp.type === "header" ? { ...comp, ...component } : comp)),
        }
      } else {
        return {
          components: [...state.components, component],
        }
      }
    }),
  updateComponent: (id: string, updates: Partial<WebstoryComponent>) =>
    set((state: WebstoryState) => ({
      components: state.components.map((component) => (component.id === id ? { ...component, ...updates } : component)),
    })),
}))
