# FloodGuard AI — WA03-Forge

A flood prediction and early warning system for Indian districts, developed for ISTE Hackathon 2026.

**Live Demo:** [https://wa-03-forge.vercel.app/](https://wa-03-forge.vercel.app/)

---

## Problem It Solves

Warnings often fail to reach people in time because most systems depend on internet connectivity that floods themselves disrupt. FloodGuard predicts flooding 24-48 hours in advance, dispatches alerts to citizens before connectivity is lost, and provides cached offline evacuation information when it is.

---

## Key Features

- **AI-Powered Flood Prediction Dashboard** — live risk scores (0-100) per district, computed from rainfall, river level, soil moisture, and historical flood index
- **Explainable Risk Scoring** — plain-English reasoning behind every risk score, not just a raw number
- **Impact Score** — combines flood risk with population density and nearby critical infrastructure (hospitals, schools) to help prioritize response
- **72-Hour Forecast Trend** — hour-by-hour risk projection with threshold markers
- **Tiered Alert & Dispatch System** — WATCH / WARNING / EVACUATE levels, with AI-generated alert messaging
- **Real Alert Delivery** — live alert dispatch via EmailJS, tested and functioning end-to-end
- **GIS Evacuation Map** — flood zones, safe routes, relief camps, and hospitals plotted on an interactive map
- **Offline-Resilient Design** — cached risk data, maps, and evacuation information remain accessible without a live connection

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, Vite, Tailwind CSS |
| Maps | Leaflet.js |
| Charts | Recharts |
| AI Alert Generation | Claude API |
| Alert Delivery | EmailJS |
| Deployment | Vercel |
| Data Sources | OpenWeather API, historical flood datasets (simulated for demo purposes) |

---

## Running Locally

```bash
git clone https://github.com/harinivenugopal26/WA03-Forge.git
cd WA03-Forge
npm install
npm run dev
```

The application will start at `http://localhost:3000` (or the port shown in your terminal).

---

## Team

- Harini Vettrivel
- Harini Venugopal
- Harshitha T
- Dhiya Gowda

---

## Problem Statement

Develop a platform that combines rainfall forecasts, river water levels, satellite imagery, and historical flood data to provide location-based flood predictions, improving disaster preparedness through an early warning system that functions even with limited internet connectivity.

**Deliverables covered:**
- Flood prediction dashboard
- Emergency alert system
- GIS visualization
- Evacuation support module
- Multi-district support
- Offline-resilient alert design

---

Built for ISTE Hackathon 2026.
