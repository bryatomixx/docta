export const theme = {
  colors: {
    ink: '#0a1628',
    inkDeep: '#050d1a',
    inkSoft: '#14233d',
    gold: '#c9a55a',
    goldBright: '#e4c478',
    goldDeep: '#8a6f30',
    paper: '#f4f0e6',
    paperSoft: '#e8e1d0',
    line: 'rgba(201, 165, 90, 0.25)',
    lineStrong: 'rgba(201, 165, 90, 0.5)',
  },
  fonts: {
    serif: '"Cormorant Garamond", Georgia, serif',
    sans: '"Inter", sans-serif',
    mono: '"JetBrains Mono", monospace',
  },
  easings: {
    smooth: [0.16, 1, 0.3, 1] as const,
    snappy: [0.6, 0.01, 0.05, 0.95] as const,
    elegant: [0.25, 0.1, 0.25, 1] as const,
  },
} as const

export type Theme = typeof theme
