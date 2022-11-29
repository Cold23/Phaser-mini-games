import create from 'zustand'

export const eventsStore = create((set) => ({
  eventManager: undefined,
  setEventManager: (value) => set({ eventManager: value }),
}))

export const stackingLevels = [
  [
    {
      items: [0xff0000, 0x0000ff, 0x00ff00, 0xff0000, 0x0000ff, 0xff0000],
      xOffset: -300,
    },
    {
      items: [],
      xOffset: 0,
    },
    {
      items: [],
      xOffset: 300,
    },
  ],
  [
    {
      items: [
        0xff0000, 0x0000ff, 0x00ff00, 0xff0000, 0x0000ff, 0xff0000, 0x00ff00,
      ],
      xOffset: -300,
    },
    {
      items: [],
      xOffset: 0,
    },
    {
      items: [],
      xOffset: 300,
    },
  ],
  [
    {
      items: [
        0xff0000, 0x0000ff, 0x00ff00, 0xff0000, 0x0000ff, 0xff0000, 0x00ff00,
      ],
      xOffset: -400,
    },

    {
      items: [
        0xff0000, 0x0000ff, 0x00ff00, 0xff0000, 0x0000ff, 0xff0000, 0x00ff00,
      ],
      xOffset: -133,
    },
    {
      items: [],
      xOffset: 133,
    },
    {
      items: [],
      xOffset: 400,
    },
  ],
  [
    {
      items: [
        0xff0000, 0x0000ff, 0x00ff00, 0xff0000, 0x0000ff, 0xff0000, 0x0000ff,
      ],
      xOffset: -400,
    },

    {
      items: [
        0xff0000, 0x0000ff, 0x00ff00, 0xff0000, 0x0000ff, 0x0000ff, 0x00ff00,
      ],
      xOffset: -133,
    },
    {
      items: [0xff0000, 0x0000ff, 0x00ff00, 0xff0000],
      xOffset: 133,
    },
    {
      items: [],
      xOffset: 400,
    },
  ],
]
