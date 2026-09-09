# Chimavet Online Platform

Smart farming platform for farmers — agrovet shop, irrigation control, vaccination tracking, and AI assistant.

Built in **three versions** so you can pick what fits your needs:

## 📁 Project Structure

```
chimavet-platform/
├── html/           # Single-file HTML (no build, runs in any browser)
├── vite/           # React + Vite SPA
└── nextjs/         # Next.js 14 full-stack (App Router + API routes)
```

## 🚀 Quick Start

### Option 1: Single HTML (no install)
Just open `html/index.html` in any browser. That's it.

### Option 2: React + Vite
```bash
cd vite
npm install
npm run dev      # http://localhost:5173
npm run build    # production build to dist/
```

### Option 3: Next.js (with API)
```bash
cd nextjs
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm start        # serve production build
```

## ✨ Features

| Feature | HTML | Vite | Next.js |
|---|---|---|---|
| Splash screen with tractor logo | ✓ | ✓ | ✓ |
| Home with featured products | ✓ | ✓ | ✓ |
| **Chimaguli Agrovet** shop | ✓ | ✓ | ✓ |
| Cart drawer (clickable) | ✓ | ✓ | ✓ |
| Cart persistence | localStorage | React state | localStorage |
| Irrigation (auto + manual + override) | ✓ | ✓ | ✓ |
| Live sensor simulation (4s tick) | ✓ | ✓ | ✓ |
| AI floating button (animated) | ✓ | ✓ | ✓ |
| AI chat with keyword responses | ✓ | ✓ | ✓ |
| Search + category filter | — | ✓ | ✓ |
| Checkout API endpoint | — | — | ✓ (`/api/cart`) |
| Server-side rendering | — | — | ✓ |
| **🌿 Crop Doctor (photo diagnosis)** | ✓ | ✓ | ✓ + API |
| **📈 Market Scout (live prices + advice)** | ✓ | ✓ | ✓ + API |
| **🎙️ Voice AI (Swahili, Web Speech)** | ✓ | ✓ | ✓ |

## 🎨 Brand
- **Name**: Chimavet Online Platform
- **Agrovet brand**: Chimaguli Agrovet
- **Color**: Emerald green + gold
- **Logo**: Tractor (lucide-react icon)

## 🔧 Customization

- **Products**: edit `src/data/catalog.js` (vite) or `lib/data.js` (nextjs) or inline in `index.html`
- **Vaccines**: same files
- **AI responses**: same files
- **Theme colors**: `tailwind.config.js` or CSS variables in `index.html`

## 📦 Tech Stack
- React 18
- Vite 5 / Next.js 14 (App Router)
- Tailwind CSS 3
- lucide-react (icons)
- recharts (vite only, for future charts)
