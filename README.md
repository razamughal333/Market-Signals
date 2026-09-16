# Market Signals

A live indicator-confluence dashboard for gold and major crypto — shows where multiple technical indicators currently agree or disagree, and combines them into a single composite score. It does **not** predict price direction, and there's no buy/sell functionality anywhere in the app.

## What it does

- Pulls live price data for tracked assets (currently Gold, BTC, ETH)
- Computes three independent technical indicators per asset: **RSI**, **MACD**, and **moving average crossover**
- Combines them into a single 0–100 composite score, with a breakdown showing exactly which indicators drove that score
- Pushes live updates to the dashboard every 5 minutes via WebSockets — no manual refresh needed
- Includes a **search page** to look up and score _any_ stock, forex pair, or crypto Twelve Data covers, beyond the tracked list

## Why this exists

Most portfolio CRUD projects don't demonstrate live data handling, background jobs, or real-time updates. This one does — and it's built on a real interest of mine (commodity trading) rather than a generic tutorial clone. Full methodology write-up is on the app's own `/about` page.

## Tech stack

**Frontend:** React, TypeScript, Tailwind CSS, React Router, Socket.io-client, [lightweight-charts](https://github.com/tradingview/lightweight-charts)

**Backend:** Node.js, Express, Socket.io, node-cron, [technicalindicators](https://www.npmjs.com/package/technicalindicators)

**Data:** [Twelve Data API](https://twelvedata.com/)

**Deployment:** Vercel (frontend) · Render (backend)

## Running locally

Clone the repo, then set up both sides:

```bash
# Backend
cd server
npm install
cp .env.example .env   # then add your own Twelve Data API key
node index.js

# Frontend (in a separate terminal)
cd client
npm install
npm run dev
```

Open `http://localhost:5173`.

You'll need a free [Twelve Data](https://twelvedata.com/) API key — no credit card required.

## Project structure

## Disclaimer

This project is for educational and portfolio purposes only. It is not financial advice and should not be used to make real trading decisions.

## Author

**Raza Ahmed Mughal**
[GitHub](https://github.com/razamughal333) · [LinkedIn](https://linkedin.com/in/raza-ahmed333) · [Portfolio](https://razamughal333.github.io/Portfolio)
