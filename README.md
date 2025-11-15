<div align="center">

# Ethereum Staking Rewards Dashboard

Monitor **staking**, **validator rewards**, **top validators**, and **staking pool** performance on Ethereum using real-time Bitquery data.

[Live Demo](https://staking-dashboard-self-beta.vercel.app) · [Sign up to Bitquery](https://ide.bitquery.io/?utm_source=github&utm_medium=footer&utm_campaign=staking-dashboard)

</div>

---

## Table of Contents

1. [Overview](#overview)
2. [Key Features](#key-features)
3. [Bitquery Resources](#bitquery-resources)
4. [Quick Start](#quick-start)
5. [Configuration](#configuration)
6. [Available Scripts](#available-scripts)
7. [Architecture](#architecture)
8. [Roadmap Ideas](#roadmap-ideas)
9. [License](#license)

---

## Overview

This project is a Next.js staking dashboard dedicated to **Ethereum staking rewards**. It showcases:

- real-time **validator rewards**,
- the top earning validators from the past 24 hours,
- streaming events for **staking pools**,
- deep dives into any validator’s reward history,
- and a polished UI geared toward staking pool monitoring.

All data is powered by the [`staking-rewards-api`](https://www.npmjs.com/package/staking-rewards-api?utm_source=github&utm_medium=footer&utm_campaign=staking-dashboard) SDK, which wraps Bitquery’s Transaction Balance API for lightning-fast **staking data** access.

👉 **Live site:** https://staking-dashboard-self-beta.vercel.app

---

## Key Features

- **Top Validators** – leaderboard showing the highest earning Ethereum validators (native & USD rewards, block counts).
- **Spotlight Validator** – highlights the strongest performer with quick stats at a glance.
- **Validator Details** – per-address dashboard covering historical rewards, staking rewards in ETH/USD, pre/post balances, and streaming hooks you can reuse in your staking pool tooling.
- **Network-wide Streaming Table** – click “Start stream” to display a live feed of rewards for every validator (address, reward in ETH/USD, tx hash linked to Etherscan).
- **Monitor Wallet Widget** – track a single validator’s rewards in real-time via WebSocket streaming.
- **Env-based Secrets** – sensitive access handled server-side through `BITQUERY_TOKEN` so frontend bundles remain clean.

This combination makes the project perfect for **staking pool monitoring**, **validator operators**, **staking analytics dashboards**, and anyone needing a quick view into **staking rewards Ethereum** wide.

---

## Bitquery Resources

| Action | Link |
| --- | --- |
| Create a Bitquery account | [https://ide.bitquery.io/?utm_source=github&utm_medium=footer&utm_campaign=staking-dashboard](https://ide.bitquery.io/?utm_source=github&utm_medium=footer&utm_campaign=staking-dashboard) |
| Generate an access token | [https://account.bitquery.io/user/api_v2/access_tokens?utm_source=github&utm_medium=footer&utm_campaign=staking-dashboard](https://account.bitquery.io/user/api_v2/access_tokens?utm_source=github&utm_medium=footer&utm_campaign=staking-dashboard) |
| Ethereum staking / validator docs | [https://docs.bitquery.io/docs/blockchain/Ethereum/balances/transaction-balance-tracker/eth-validator-balance-tracker/?utm_source=github&utm_medium=footer&utm_campaign=staking-dashboard](https://docs.bitquery.io/docs/blockchain/Ethereum/balances/transaction-balance-tracker/eth-validator-balance-tracker/?utm_source=github&utm_medium=footer&utm_campaign=staking-dashboard) |
| Contact the Bitquery team | [https://t.me/Bloxy_info/?utm_source=github&utm_medium=footer&utm_campaign=staking-dashboard](https://t.me/Bloxy_info/?utm_source=github&utm_medium=footer&utm_campaign=staking-dashboard) |
| npm package powering this dashboard | [https://www.npmjs.com/package/staking-rewards-api?utm_source=github&utm_medium=footer&utm_campaign=staking-dashboard](https://www.npmjs.com/package/staking-rewards-api?utm_source=github&utm_medium=footer&utm_campaign=staking-dashboard) |
| Repo link (you are here) | [https://github.com/Kshitij0O7/staking-dashboard?utm_source=github&utm_medium=footer&utm_campaign=staking-dashboard](https://github.com/Kshitij0O7/staking-dashboard?utm_source=github&utm_medium=footer&utm_campaign=staking-dashboard) |

---

## Quick Start

```bash
# install dependencies
npm install

# run locally
npm run dev

# lint
npm run lint
```

Navigate to `http://localhost:3000` to view the staking dashboard.

---

## Configuration

Create a `.env.local` file and add your Bitquery access token:

```bash
BITQUERY_TOKEN=ory_at_********************************
```

> **Why only an env var?**  
> The dashboard, validator detail page, and streaming APIs all call our internal API routes. Those routes add the `Authorization: Bearer <token>` header server-side, so the token never leaves your infrastructure.

---

## Available Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start the Next.js dev server. |
| `npm run build` | Create an optimized production build. |
| `npm run start` | Start the production server. |
| `npm run lint` | Run ESLint against the entire project. |

---

## Architecture

- **Next.js App Router** – app-first routing, server components where possible.
- **Tailwind CSS** – design system for cards, tables, dark theme.
- **Bitquery SDK (`staking-rewards-api`)** – queries for top validators, validator rewards, and streaming.
- **API Routes**
  - `/api/dashboard` – fetches top validator data via Bitquery.
  - `/api/validator` – fetches a specific validator’s historical rewards.
  - `/api/validator-stream` – WebSocket bridge for single validator streams.
  - `/api/validator-stream/all` – Server-Sent Events for the “Live validator rewards” table.
- **Client Components** – interactive sections like the stream table, monitor widget, and reload buttons.

---

## Roadmap Ideas

- Add wallet alerts / notifications.
- Export staking data to CSV for staking pool reports.
- Add charts for validator reward trends.
- Expand beyond Ethereum (Polygon, BSC, etc.) by flipping Bitquery queries.

Contributions are welcome! Feel free to open issues or pull requests.

---

## License

MIT © [Kshitij0O7](https://github.com/Kshitij0O7/staking-dashboard?utm_source=github&utm_medium=footer&utm_campaign=staking-dashboard)
