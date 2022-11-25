import create from 'zustand'

export const eventsStore = create((set) => ({
  eventManager: undefined,
  setEventManager: (value) => set({ eventManager: value }),
}))
