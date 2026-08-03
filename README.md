# 🌊 FloodGuard AI

**AI-Driven Flood Prediction & Offline-Resilient Early Warning System for Indian Districts**

FloodGuard AI predicts flooding **24–48 hours in advance**, sends **SMS alerts to citizens before internet connectivity fails**, and keeps **cached offline evacuation maps** working even after the network goes down — because the only warning that saves lives is the one that arrives before the water does.

*Live Demo:* [https://wa-03-forge.vercel.app/](https://wa-03-forge.vercel.app/)

---

## 📌 Problem Statement

In India's flood-prone districts, early-warning systems routinely fail at the exact moment they're needed most. Floodwaters knock out the internet and mobile networks *before* residents receive any alert. FloodGuard AI closes this gap by predicting risk early, alerting citizens by SMS ahead of time, and remaining fully functional offline once connectivity is lost.

---

## ✨ Key Features

- 🧠 **Machine learning-based risk prediction** trained on rainfall, river level, soil moisture, and historical flood data
- 🗺️ **Live district risk map** with color-coded severity (Green → Yellow → Orange → Red)
- 💬 **AI-generated plain-English explanations** for every risk score
- 📊 **Impact Score** — measures human consequence, not just weather severity
- 📩 **Automated SMS alerts** generated via the Claude API, sent *before* the flood hits
- 🧭 **Offline-capable GIS evacuation map** with safe routes, relief camps, and hospitals
- 📡 **LIVE / LIMITED / OFFLINE** connection-aware mode across every screen

---

## 🧩 How It Works

### 1. Risk Engine
A machine learning-based prediction model continuously evaluates flood risk (0–100) using:
- Rainfall
- River Level
- Soil Moisture
- Historical Flood Index

Districts are displayed on an interactive map, refreshed every 30 minutes, and color-coded:

| Score Range | Level | Color |
|---|---|---|
| 0 – 30 | Safe | 🟢 Green |
| 31 – 60 | Watch | 🟡 Yellow |
| 61 – 80 | Warning | 🟠 Orange |
| 81 – 100 | Evacuate | 🔴 Red |

### 2. Prediction Dashboard
Clicking a district shows:
- Large risk-score gauge
- Severity label (Watch / Warning / Evacuate)
- Estimated time-to-flood window
- Affected population estimate
- Prediction confidence %
- AI-generated explanation line (e.g. *"High risk due to: 310mm rainfall in 48hrs + river at 94% capacity + saturated soil"*)
- **Impact Score** badge = `Risk Score × Population Density Factor × Critical Infrastructure Multiplier`
- 72-hour forecast chart with Yellow/Orange/Red threshold lines and peak-flood hour highlighted

### 3. Alert Engine
Automatically classifies districts and triggers the right response:

| Level | Score Range | Action |
|---|---|---|
| WATCH | 60–74 | Dashboard notification to officials |
| WARNING | 75–84 | Dashboard + SMS to volunteers |
| EVACUATE | 85–100 | SMS blast to entire district |

- SMS drafted via the **Claude API**, kept under 160 characters, with exact road names and relief camp names
- Editable before sending
- Districts ranked by Impact Score so officials know who to alert first
- Delivery confirmation (e.g. *"✓ 1,847 numbers notified"*) and alert history log

### 4. GIS Evacuation Map
Built with **Leaflet.js**, showing:
- 🟥 Flood zone overlays
- 🛣️ Flood-prone roads to avoid
- 🟩 Safe evacuation routes
- 🔵 Relief camps (name, distance, capacity)
- ➕ Hospitals
- 🟡 High-ground assembly points

Routes and map tiles are pre-cached to **IndexedDB** and the **Cache API** once a district's risk score crosses 50, so the map keeps working fully offline.

### 5. Offline Resilience Mode
A persistent connection badge tracks network quality across every screen:

| Badge | Mode |
|---|---|
| ● LIVE | Full mode — live data, all features active |
| ● LIMITED | 2G mode — compressed, text-only |
| ● OFFLINE | Cached mode — no new data, cached maps only |

Offline mode never sends new alerts or updates scores — it only displays what was cached before the flood hit, including last-known risk data, evacuation zones, and confirmation of alerts already sent.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js + Tailwind CSS |
| Mapping | Leaflet.js (offline-capable GIS) |
| Data Visualization | Recharts |
| AI / NLP | Anthropic Claude API (`claude-sonnet-4-6`) — SMS + explanation generation |
| Weather Data | OpenWeather API |
| Offline Storage | IndexedDB + Cache API |

---

## 🚀 Getting Started

```bash
# Clone the repository
git clone https://github.com/<your-username>/floodguard-ai.git
cd floodguard-ai

# Install dependencies
npm install

# Add environment variables
cp .env.example .env
# Add your CLAUDE_API_KEY and OPENWEATHER_API_KEY

# Run the app
npm run dev
```

### Environment Variables

```env
CLAUDE_API_KEY=your_anthropic_api_key
OPENWEATHER_API_KEY=your_openweather_api_key
```

> If no API key is provided, the app falls back to realistic mock data for demo purposes.

---

## 🎬 Demo Flow

1. Open the app → India map loads → Cuddalore glowing red
2. Click Cuddalore → Risk Score 86, Impact Score HIGH, AI explanation, 72-hr chart peaking at hour 10
3. Go to Alert screen → auto-generated SMS, districts ranked by Impact Score
4. Click **Send Alert** → delivery confirmation
5. Go to Map screen → flood zones, safe routes, relief camps
6. Toggle **Offline Mode** → badge changes, map still works, last SMS still shown as sent
7. Tap a relief camp pin → camp details + route

A built-in **[DEMO MODE]** toggle simulates the entire risk-escalation sequence (72 → 86) with live-updating explanations and auto-triggered alerts, in under 3 minutes.

---

## 📁 Project Structure

```
floodguard-ai/
├── src/
│   ├── components/
│   │   ├── Dashboard/         # Module 1 — Prediction Dashboard
│   │   ├── AlertEngine/       # Module 2 — Alert Engine
│   │   ├── EvacuationMap/     # Module 3 — GIS Evacuation Map
│   │   └── OfflineMode/       # Module 4 — Offline Resilience
│   ├── services/
│   │   ├── claudeApi.js       # SMS + explanation generation
│   │   ├── weatherApi.js      # OpenWeather integration
│   │   └── riskEngine.js      # ML-based risk scoring
│   ├── storage/
│   │   └── indexedDb.js       # Offline data persistence
│   └── App.jsx
├── public/
├── .env.example
└── README.md
```

---

## 🏆 Why FloodGuard AI

- **Explainable AI** — every risk score comes with a human-readable reason, not just a number
- **Impact Score** — separates weather severity from actual human consequence
- **SMS-first design** — alerts are sent *before* the flood, not during
- **True offline resilience** — the app keeps working after the internet dies, not just before

---

## 📄 License

This project is built for educational and hackathon demonstration purposes.

---

*"FloodGuard watches rainfall and river levels, explains exactly why each district is at risk, warns every citizen by SMS before the internet fails, and keeps evacuation maps working offline when it does — because the only warning that saves lives is the one that arrives before the water does."*

