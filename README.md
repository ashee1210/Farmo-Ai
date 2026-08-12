# FARMO AI SaaS Website

A React + TypeScript + Vite web app (Tailwind CSS v4, shadcn/ui, Radix UI, lucide-react icons)
for the FARMO AI farming platform: landing page, features, market, pricing, contact,
login, farmer dashboard and admin dashboard.

## Prerequisites

- [Node.js](https://nodejs.org/) v18 or later
- npm (comes with Node) — or yarn/pnpm if you prefer

## Run it in VS Code

1. Open this folder in VS Code (`File > Open Folder...`).
2. Open a terminal in VS Code (`` Ctrl+` ``) and install dependencies:

   ```bash
   npm install
   ```

3. Start the dev server:

   ```bash
   npm run dev
   ```

4. Open the URL Vite prints (usually `http://localhost:5173`) in your browser.

## Build for production

```bash
npm run build
npm run preview   # preview the production build locally
```

## What's premium about this version

- **12 AI features** (up from 6): crop recommendation, disease detection, smart
  irrigation, weather intelligence, market price prediction, AI assistant, soil
  health card, IoT & drone monitoring, government scheme advisor, crop insurance
  assistant, and a farmer community forum.
- **22 crops in the Market Intelligence page**, covering cereals, pulses, oilseeds,
  vegetables, fruits, spices, plantation crops, tubers and millets — rice, wheat,
  corn, cotton, vegetables, sugarcane, groundnut, soybean, mustard, chickpea, green
  gram, tomato, onion, potato, banana, mango, coconut, black pepper, cardamom,
  turmeric, ginger, tea, coffee, rubber, tapioca and ragi.
- **Animated backgrounds** on every hero section (`AnimatedBackground.tsx`) — drifting
  leaf particles, glowing gradient orbs and a soft light sweep, all pure CSS
  animation (see the `krishi-anim-*` keyframes in `src/styles/theme.css`), so there's
  no runtime cost and `prefers-reduced-motion` is respected automatically.

## Project structure

```
src/
  app/
    App.tsx              # route switch (page state, no react-router needed)
    krishi/               # the actual pages used by the app
      LandingPage.tsx
      FeaturesPage.tsx
      MarketPage.tsx
      PricingPage.tsx
      ContactPage.tsx
      LoginPage.tsx
      FarmerDashboard.tsx
      AdminDashboard.tsx
      Navbar.tsx / Footer.tsx
      data.ts             # shared mock data & types
    components/            # earlier/alternate component set + shadcn/ui primitives
      ui/                  # shadcn/ui components (button, card, dialog, etc.)
      figma/               # ImageWithFallback helper (from Figma export)
  styles/                  # Tailwind & theme CSS
  main.tsx                 # React entry point
index.html
vite.config.ts             # Vite config (Tailwind v4 plugin, @ alias -> src/)
```

## Notes

- This project was exported from Figma Make and is already a standard Vite + React
  + TypeScript app — no framework conversion was needed. The setup was adjusted so it
  runs as a normal local project: `react`/`react-dom` were added as real dependencies
  (they were only listed as optional peer dependencies), and `tsconfig.json` /
  `tsconfig.node.json` / `src/vite-env.d.ts` were added since the export didn't include
  them.
- The `@` import alias points to `src/` (see `vite.config.ts` and `tsconfig.json`).
- Routing is handled with simple React state in `App.tsx`, not `react-router`, even
  though `react-router` is listed as a dependency.
