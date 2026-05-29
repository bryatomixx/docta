# Docta Proposal — LPS

Single-page React proposal for **Docta Consulting LLC**, presented by **Latin Prime Systems**.

Stack: Vite + React 19 + TypeScript, Tailwind CSS v4, Framer Motion, GSAP (ScrollTrigger), Lenis (smooth scroll), Lucide React, React Intersection Observer.

## Run

```bash
npm install
npm run dev      # Vite picks a free port (typically 5173)
npm run build    # outputs to dist/
npm run preview  # serve the production build
```

## Edit content

All textual content lives in **`src/data/proposal.ts`** as a strongly-typed object. Edit copy, prices, phases, or contacts there — no need to touch component code.

## Structure

```
src/
  components/
    layout/       SmoothScroll (Lenis wrapper)
    sections/     Cover, ExecutiveSummary, Understanding, Vision,
                  Capabilities, Methodology, Support247, Investment,
                  WhyLPS, NextSteps, Footer
    ui/           Eyebrow, SectionNumber, RevealText, MagneticButton,
                  AnimatedCounter, ScrollProgress, Cursor
  hooks/          useMagnetic, useParallax, useScrollReveal
  lib/            theme.ts (design tokens), animations.ts (FM variants)
  data/           proposal.ts (all copy + types)
```

## Design system

Tokens are declared in **`src/index.css`** (Tailwind v4 `@theme`) and mirrored in `src/lib/theme.ts`:

- **Colors:** `ink`, `ink-deep`, `ink-soft`, `gold`, `gold-bright`, `gold-deep`, `paper`, `paper-soft`
- **Fonts:** `serif` (Cormorant Garamond), `sans` (Inter), `mono` (JetBrains Mono)
- **Easings:** `smooth` (expo-out), `snappy`, `elegant`

Use Tailwind classes directly: `text-gold`, `bg-ink-deep`, `font-serif`, etc.

## Accessibility & performance

- Respects `prefers-reduced-motion` — heavy animations and Lenis are disabled.
- Custom cursor hidden on touch / coarse-pointer devices.
- Type-safe everywhere; `tsc -b` runs as part of `build`.
- Production bundle ≈ 122 KB gzipped JS, 7 KB gzipped CSS.

## Notes & assumptions

- Tailwind v4 is wired via `@tailwindcss/vite` (not PostCSS). Parent-directory PostCSS configs are ignored via `css.postcss: {}` in `vite.config.ts`.
- Lenis is set to a 1.2s duration with exponential easing.
- Section-number watermarks and the cover gradient sit at 6–15% opacity so they read as ornamental, not loud.
- Email CTA in **Next Steps** targets `alex@latinprimesystems.com`. Update in `proposal.ts` if you want a different address or to switch to a WhatsApp link.
- The original spec called for clipPath-based reveal animations on the summary paragraphs; in Framer Motion v12 this had reliability issues with intersection observer triggers, so it was simplified to `opacity + y` while keeping the same staged feel.
