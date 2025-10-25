export const translate = {
  initial: {
    y: "100%",
    opacity: 0
  },
  enter: (i: number) => ({
    y: 0,
    opacity: 1,
    transition: { duration: 0.75, ease: [0.76, 0, 0.24, 1] as any, delay: 0.8 + i * 0.02 }
  }),
  exit: (i: number) => ({
    y: "-100%",
    opacity: 0,
    transition: { duration: 0.1, ease: "linear" as any, delay: i * 0.005 }
  })
};

export const translateParagraph = {
  initial: {
    y: "100%",
    opacity: 0
  },
  enter: (i: number) => ({
    y: 0,
    opacity: 1,
    transition: { duration: 0.75, ease: [0.76, 0, 0.24, 1] as any, delay: 0.8 + i * 0.001 }
  }),
  exit: (i: number) => ({
    y: "-100%",
    opacity: 0,
    transition: { duration: 0.6, ease: [0.76, 0, 0.24, 1] as any, delay: i * 0.0005 }
  })
};

export const fade = {
  initial: {
    opacity: 0
  },
  enter: {
    opacity: 1,
    transition: { duration: 0.75, ease: [0.76, 0, 0.24, 1] as any, delay: 0.8 }
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.1, ease: "linear" as any }
  }
};

export const normalText = {
  initial: {
    opacity: 0
  },
  enter: {
    opacity: 1,
    transition: { duration: 0.75, ease: [0.76, 0, 0.24, 1] as any, delay: 0.8 }
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.3, ease: [0.76, 0, 0.24, 1] as any }
  }
};