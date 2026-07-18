# 🌍 WeatherSite — Weather at a Glance

**Your one-stop dashboard for global weather, earthquakes, and more — all on a beautiful interactive map.**

![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

---

## 👀 What is this?

WeatherSite is a real-time weather & earthquake monitoring app that puts the world at your fingertips. Explore live data on a stunning interactive map, get notified when things shake, filter events however you want, and export what you find — all from your browser.

> Built with ❤️ using React, Vite, and Leaflet.

---

## ✨ Highlights

- 🗺️ **Interactive Map** — earthquakes, weather overlays, and custom themes on one smooth map
- 🌤️ **Live Weather** — real-time conditions pulled from Open-Meteo
- 🔔 **Smart Alerts** — browser notifications when significant quakes hit (M ≥ 5.0)
- 🔍 **Powerful Filters** — drill down by magnitude, depth, location, or data source
- 📊 **Stats Dashboard** — at-a-glance charts for 24-hour activity, intensity, and more
- 💾 **Export Anything** — CSV for spreadsheets, GeoJSON for GIS tools
- 📱 **PWA Ready** — install it like a native app, works offline too
- 🎨 **Dark & Light Modes** — your eyes, your choice

---

## 🚀 Getting Started

### You'll need

- [Node.js](https://nodejs.org/) 18 or newer
- [pnpm](https://pnpm.io/) (or npm, if you prefer)

### 1. Clone & install

```bash
git clone https://github.com/your-username/weathersite.git
cd weathersite
pnpm install
```

### 2. Set up your keys

```bash
cp .env.example .env
```

Then open `.env` and pop in your [Jawg Maps](https://www.jawg.io/) API token (it's free for personal use).

### 3. Fire it up

```bash
pnpm dev
```

Open **http://localhost:5173** and you're off. 🌍

---

## 🛠️ Handy Commands

| Command        | What it does                         |
| -------------- | ------------------------------------ |
| `pnpm dev`     | Start the dev server                 |
| `pnpm build`   | Build for production                 |
| `pnpm preview` | Preview the production build locally |
| `pnpm test`    | Run the test suite                   |
| `pnpm lint`    | Check your code style                |

---

## 🧱 Built With

- **[React](https://react.dev/)** — UI framework
- **[Vite](https://vitejs.dev/)** — blazing-fast bundler
- **[Leaflet](https://leafletjs.com/)** — the map behind the magic
- **[DaisyUI](https://daisyui.com/)** + **[Tailwind CSS](https://tailwindcss.com/)** — styling
- **[Open-Meteo](https://open-meteo.com/)** — free weather API
- **[USGS](https://earthquake.usgs.gov/)** & others — earthquake data

---

## 🤝 Contributing

Got an idea? Found a bug? PRs are always welcome.

1. Fork the repo
2. Create a branch (`git checkout -b feature/cool-thing`)
3. Commit your changes (`git commit -m 'Add cool thing'`)
4. Push it up (`git push origin feature/cool-thing`)
5. Open a Pull Request 🎉

---

**⭐ If you like this project, drop it a star!**
