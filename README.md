<div align="center">

# 🛡️ Smart Vendor Compliance & Loss Detection System

### *Blockchain-powered supply chain compliance for the modern enterprise*

<br>

[![React](https://img.shields.io/badge/React-18.2-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Solidity](https://img.shields.io/badge/Solidity-0.8.20-363636?style=for-the-badge&logo=solidity&logoColor=white)](https://soliditylang.org/)
[![Hardhat](https://img.shields.io/badge/Hardhat-2.25-FFF100?style=for-the-badge&logo=ethereum&logoColor=black)](https://hardhat.org/)
[![Expo](https://img.shields.io/badge/Expo-49-000020?style=for-the-badge&logo=expo&logoColor=white)](https://expo.dev/)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)

<br>

**A full-stack platform combining real-time analytics, blockchain auditability, fraud detection, and mobile verification — purpose-built for Walmart's Sparkathon 2025.**

[Getting Started](#-getting-started) · [Architecture](#-architecture) · [API Docs](#-api-endpoints) · [Smart Contracts](#-blockchain-contracts) · [Team](#-team)

<br>

---

</div>

## 🏆 Walmart Sparkathon 2025

> **Track**: Supply Chain Innovation
>
> This system addresses Walmart's supply chain challenges by combining **real-time compliance monitoring**, **blockchain-backed audit trails**, **rule-based fraud detection**, and **mobile delivery verification** into a single unified platform.

---

## 🎯 Problem Statement

<table>
<tr>
<td width="50%">

### The Challenge

Walmart's supply chain handles **millions** of vendor interactions annually. Current pain points include:

- 📋 Manual compliance tracking prone to human error
- 🕒 Delayed fraud detection after damage is done
- 📱 Slow gate-check verification processes
- 🔍 Audit trails easily disputed or tampered with

</td>
<td width="50%">

### Our Solution

| Problem | Solution |
|---------|----------|
| Manual tracking | **Automated scoring** with real-time alerts |
| Late fraud detection | **Rule-based engine** flags anomalies instantly |
| Slow verification | **Mobile scanner** with camera + barcode |
| Disputed audits | **Blockchain logs** = tamper-proof records |

</td>
</tr>
</table>

---

## ✨ Key Features

<table>
<tr>
<td align="center" width="33%">
<h3>📊 Real-time Dashboard</h3>
<p>Live charts via React 18 + Recharts with Socket.IO WebSocket push for instant vendor score, delivery, and alert updates</p>
</td>
<td align="center" width="33%">
<h3>🔗 Blockchain Audit Trail</h3>
<p>3 Solidity smart contracts with 39 passing tests create immutable, tamper-proof records of every compliance event</p>
</td>
<td align="center" width="33%">
<h3>🔍 Fraud Detection</h3>
<p>Rule-based anomaly engine analyzes quantity deviations, late delivers, damaged goods, and vendor history in real-time</p>
</td>
</tr>
<tr>
<td align="center" width="33%">
<h3>🏢 Vendor Management</h3>
<p>Full CRUD with compliance scoring (0–100), risk classification, document uploads, and historical tracking</p>
</td>
<td align="center" width="33%">
<h3>🪙 Compliance Token (ERC-20)</h3>
<p>Reward/penalty token system — vendors earn tokens for high compliance and get slashed for violations</p>
</td>
<td align="center" width="33%">
<h3>📱 Mobile Scanning</h3>
<p>React Native app with Expo Camera for barcode scanning, photo evidence capture, and field verification</p>
</td>
</tr>
<tr>
<td align="center" width="33%">
<h3>🔔 Real-time Notifications</h3>
<p>Socket.IO push notifications with MongoDB persistence, read/unread tracking, and severity levels</p>
</td>
<td align="center" width="33%">
<h3>🤖 ML Risk Prediction</h3>
<p>Heuristic model scoring vendor risk from delivery history, on-time rates, fraud flags, and compliance trends</p>
</td>
<td align="center" width="33%">
<h3>🔐 Role-based Access</h3>
<p>JWT auth with access + refresh tokens; four roles: admin, manager, inspector, viewer</p>
</td>
</tr>
</table>

---

## 🏗️ Architecture

```
                          ┌─────────────────────────────────────┐
                          │         🌐 FRONTEND (Web)           │
                          │   React 18 · TypeScript · Vite 5    │
                          │   Shadcn UI · Tailwind · Recharts   │
                          │   Socket.IO · React Query · Zustand │
                          └──────────────┬──────────────────────┘
                                         │ REST + WebSocket
                                         ▼
┌─────────────────┐      ┌─────────────────────────────────────┐      ┌─────────────────┐
│  📱 MOBILE      │      │         ⚙️  BACKEND (API)           │      │  ⛓️  BLOCKCHAIN  │
│  React Native   │─────▶│   Node.js · Express · Socket.IO     │◀────▶│  Solidity 0.8.20│
│  Expo ~49       │      │   JWT Auth · Rate Limiter · Helmet  │      │  Hardhat 2.25   │
│  Camera/QR      │      │   Cloudinary · Nodemailer           │      │  OpenZeppelin   │
│  Geolocation    │      │   Fraud Detection · ML Service      │      │  ethers v6      │
└─────────────────┘      │   ethers v6 · Blockchain Service    │      │                 │
                          └──────────────┬──────────────────────┘      │  3 Contracts:   │
                                         │                             │  • VendorCompl. │
                                         ▼                             │  • DeliveryLog  │
                          ┌─────────────────────────────────────┐      │  • Compliance   │
                          │       🗄️  DATABASE                  │      │    Token (ERC20)│
                          │   MongoDB Atlas (Mongoose 8)        │      │                 │
                          │                                     │      │  39 Tests ✅     │
                          │   Collections: User, Vendor,        │      └─────────────────┘
                          │   Delivery, PurchaseOrder,          │
                          │   ComplianceLog, Notification       │
                          └─────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

<details>
<summary><strong>🖥️ Frontend — React 18 + TypeScript + Vite</strong></summary>

| Technology | Version | Purpose |
|:-----------|:--------|:--------|
| React | 18.2 | UI framework with hooks |
| TypeScript | 5.2 | Type safety |
| Vite | 5.2 | Lightning-fast build tool |
| Tailwind CSS | 3.4 | Utility-first styling |
| Shadcn UI | latest | Radix-based accessible components |
| React Router | 6.23 | Client-side routing |
| TanStack React Query | 5.37 | Server state management & caching |
| Zustand | 4.5 | Lightweight client state |
| Recharts + D3 | 2.12 / 7.9 | Data visualization & charts |
| Framer Motion + GSAP | 11.2 / 3.12 | Smooth animations |
| Socket.IO Client | 4.8 | Real-time WebSocket updates |
| Axios | 1.7 | HTTP client |
| Sonner | 2.0 | Toast notifications |
| React Hook Form | 7.51 | Declarative form handling |

</details>

<details>
<summary><strong>⚙️ Backend — Node.js + Express + MongoDB</strong></summary>

| Technology | Version | Purpose |
|:-----------|:--------|:--------|
| Express | 4.18 | REST API server |
| MongoDB Atlas (Mongoose) | 8.0 | Database with ODM |
| Socket.IO | 4.7 | Real-time bidirectional events |
| jsonwebtoken | 9.0 | Access + refresh token auth |
| bcryptjs | 2.4 | Password hashing (12 salt rounds) |
| ethers | 6.9 | Blockchain interaction |
| Cloudinary | 1.41 | Image upload & CDN |
| Nodemailer | 6.9 | SMTP email alerts |
| Multer | 1.4 | File upload middleware |
| Helmet + CORS | 7.1 / 2.8 | Security headers & cross-origin |
| express-rate-limit | 7.1 | API rate limiting |
| express-validator | 7.0 | Request input validation |

</details>

<details>
<summary><strong>⛓️ Blockchain — Solidity + Hardhat + OpenZeppelin</strong></summary>

| Technology | Version | Purpose |
|:-----------|:--------|:--------|
| Solidity | 0.8.20 | Smart contract language |
| Hardhat | 2.25 | Development framework & local chain |
| OpenZeppelin | 4.9.5 | Audited contract libraries |
| ethers | v6 | Contract deployment & interaction |
| Chai + Mocha | 4.3 / 10.2 | Smart contract unit testing |
| solidity-coverage | 0.8 | Code coverage reporting |
| hardhat-gas-reporter | 1.0 | Gas usage analysis |
| TypeChain | 8.2 | TypeScript bindings for contracts |

</details>

<details>
<summary><strong>📱 Mobile — React Native + Expo</strong></summary>

| Technology | Version | Purpose |
|:-----------|:--------|:--------|
| React Native | 0.72 | Cross-platform mobile framework |
| Expo | ~49 | Managed workflow & OTA builds |
| React Navigation | 6.1 | Stack + bottom tab navigation |
| Expo Camera | 13.4 | Barcode/QR scanning |
| Expo Location | 16.1 | GPS-tagged deliveries |
| React Native Paper | 5.11 | Material Design components |
| Async Storage | 1.18 | Encrypted local data persistence |
| Axios | 1.6 | API communication |

</details>

---

## 📁 Project Structure

```
smart-vendor-compliance/
│
├── 📦 package.json                 # Root monorepo scripts
│
├── ⚙️  backend/
│   ├── server.js                   # HTTP + Socket.IO entry point
│   └── src/
│       ├── app.js                  # Express app (routes + middleware)
│       ├── config/                 # 🔧 Database, JWT, Cloudinary
│       ├── controllers/            # 🎮 Auth, Vendor, Delivery, Analytics, Blockchain
│       ├── middleware/             # 🛡️ Auth guards, validation, rate limiter, uploads
│       ├── models/                 # 📊 User, Vendor, Delivery, PO, ComplianceLog, Notification
│       ├── routes/                 # 🛤️  6 route files (auth, vendor, delivery, analytics, blockchain, notification)
│       ├── services/               # 🧠 Blockchain, Fraud Detection, ML, Notifications, Image Analysis
│       └── utils/                  # 🔨 Helpers, validators, logger, email
│
├── ⛓️  blockchain/
│   ├── hardhat.config.js           # Networks: localhost, Sepolia, Amoy
│   ├── contracts/
│   │   ├── VendorCompliance.sol    # 📋 Vendor registration + compliance scoring + disputes
│   │   ├── DeliveryLog.sol         # 📦 Immutable delivery logging + verification
│   │   └── ComplianceToken.sol     # 🪙 ERC-20 reward/penalty token + staking
│   ├── scripts/                    # 🚀 deploy.js, interact.js, verify.js
│   └── test/                       # ✅ 39 unit tests
│
├── 🖥️  frontend/
│   └── src/
│       ├── components/             # 🧩 Charts, forms, layout, UI primitives
│       ├── config/                 # ⚙️  Routes, theme, env, blockchain config
│       ├── contexts/               # 🔄 Auth, Theme, Notification providers
│       ├── hooks/                  # 🪝 useVendors, useDeliveries, useAnalytics, useNotifications
│       ├── pages/                  # 📄 Dashboard, Vendors, Deliveries, Analytics, Settings, Auth
│       ├── services/               # 📡 API client (Axios), blockchain, notifications
│       ├── types/                  # 📝 TypeScript interfaces
│       └── utils/                  # 🔨 Constants, formatters
│
└── 📱 mobile/
    ├── index.ts                    # App entry point
    └── src/
        ├── navigation/             # 🧭 Stack + Tab navigators
        ├── screens/                # 📱 Dashboard, Scanner, Vendors, Deliveries
        ├── services/               # 📡 API, auth, vendor, delivery services
        └── utils/                  # 🔨 Helpers, constants
```

---

## 🚀 Getting Started

### Prerequisites

| Requirement | Minimum |
|:------------|:--------|
| Node.js | v18+ |
| npm | v9+ |
| MongoDB Atlas | Free tier (M0) |
| Git | v2.30+ |

### ⚡ Quick Start

```bash
# 1️⃣  Clone the repository
git clone https://github.com/Git-brintsi20/Sparkathon_2025.git
cd Sparkathon_2025/smart-vendor-compliance

# 2️⃣  Install ALL dependencies (root + backend + frontend + blockchain + mobile)
npm run install:all

# 3️⃣  Configure environment
cp backend/.env.example backend/.env
# ✏️  Edit backend/.env with your MongoDB URI, JWT secrets, etc.

# 4️⃣  Start development (backend + frontend concurrently)
npm run dev
```

| Service | URL |
|:--------|:----|
| 🖥️ Frontend | http://localhost:5173 |
| ⚙️ Backend API | http://localhost:3000 |
| 🏥 Health Check | http://localhost:3000/api/health |

### ⛓️ Blockchain (optional)

```bash
cd blockchain
npx hardhat compile                                    # Compile contracts
npx hardhat test                                       # Run 39 tests
npx hardhat node                                       # Local chain
npx hardhat run scripts/deploy.js --network localhost   # Deploy locally
```

### 📱 Mobile (optional)

```bash
cd mobile
npm install
npm start             # Expo dev server → scan QR with Expo Go
npm run android       # Android emulator
npm run ios           # iOS simulator
```

---

## 🔐 Environment Variables

Create `backend/.env` from [`backend/.env.example`](backend/.env.example):

<details>
<summary><strong>Click to expand full env var reference</strong></summary>

| Variable | Required | Default | Description |
|:---------|:--------:|:--------|:------------|
| `PORT` | | `3000` | Server port |
| `NODE_ENV` | | `development` | Environment mode |
| **Database** | | | |
| `MONGODB_URI` | ✅ | — | MongoDB Atlas connection string |
| **Authentication** | | | |
| `JWT_SECRET` | ✅ | — | Access token signing secret |
| `JWT_REFRESH_SECRET` | ✅ | — | Refresh token signing secret |
| `JWT_EXPIRE` | | `7d` | Access token lifetime |
| `JWT_REFRESH_EXPIRE` | | `30d` | Refresh token lifetime |
| **CORS** | | | |
| `FRONTEND_URL` | | `http://localhost:5173` | Allowed frontend origin |
| **Cloudinary** | | | |
| `CLOUDINARY_CLOUD_NAME` | | — | Cloud name for image uploads |
| `CLOUDINARY_API_KEY` | | — | API key |
| `CLOUDINARY_API_SECRET` | | — | API secret |
| **Email (SMTP)** | | | |
| `SMTP_HOST` | | `smtp.gmail.com` | Mail server |
| `SMTP_PORT` | | `587` | Mail port |
| `SMTP_USER` | | — | Sender email |
| `SMTP_PASS` | | — | App password |
| **Blockchain** | | | |
| `DEMO_MODE` | | `true` | `true` = mock blockchain calls |
| `RPC_URL` | | — | Ethereum RPC (Alchemy/Infura) |
| `PRIVATE_KEY` | | — | Deployer wallet private key |

</details>

> 💡 **Tip**: Generate JWT secrets with: `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`

---

## 📡 API Endpoints

<details>
<summary><strong>🔑 Authentication — <code>/api/auth</code></strong></summary>

| Method | Endpoint | Auth | Description |
|:------:|:---------|:----:|:------------|
| `POST` | `/register` | — | Create account |
| `POST` | `/login` | — | Login → access + refresh tokens |
| `POST` | `/refresh-token` | — | Refresh expired access token |
| `POST` | `/forgot-password` | — | Send password reset email |
| `GET` | `/me` | 🔒 | Current user profile |
| `PUT` | `/profile` | 🔒 | Update profile |

</details>

<details>
<summary><strong>🏢 Vendors — <code>/api/vendors</code></strong></summary>

| Method | Endpoint | Auth | Description |
|:------:|:---------|:----:|:------------|
| `GET` | `/` | 🔒 | List vendors (paginated, filterable) |
| `GET` | `/:id` | 🔒 | Vendor details + compliance history |
| `POST` | `/` | 🔒👑 | Create vendor (admin/manager) |
| `PUT` | `/:id` | 🔒👑 | Update vendor (admin/manager) |
| `DELETE` | `/:id` | 🔒🛡️ | Delete vendor (admin only) |

</details>

<details>
<summary><strong>📦 Deliveries — <code>/api/deliveries</code></strong></summary>

| Method | Endpoint | Auth | Description |
|:------:|:---------|:----:|:------------|
| `GET` | `/` | 🔒 | List deliveries (paginated) |
| `GET` | `/:id` | 🔒 | Delivery details |
| `POST` | `/` | 🔒 | Create delivery |
| `PUT` | `/:id` | 🔒 | Update delivery |
| `PUT` | `/:id/status` | 🔒 | Update status (pending → delivered) |
| `PUT` | `/:id/verify` | 🔒 | Verify + run fraud detection |
| `POST` | `/:id/upload` | 🔒📎 | Upload evidence photo |

</details>

<details>
<summary><strong>📊 Analytics — <code>/api/analytics</code></strong></summary>

| Method | Endpoint | Auth | Description |
|:------:|:---------|:----:|:------------|
| `GET` | `/dashboard` | 🔒 | Dashboard stats & KPIs |
| `GET` | `/compliance` | 🔒 | Compliance report data |
| `GET` | `/fraud` | 🔒 | Fraud detection analytics |
| `GET` | `/performance` | 🔒 | Performance metrics |
| `GET` | `/export` | 🔒👑 | Export report (admin/manager) |

</details>

<details>
<summary><strong>⛓️ Blockchain — <code>/api/blockchain</code></strong></summary>

| Method | Endpoint | Auth | Description |
|:------:|:---------|:----:|:------------|
| `POST` | `/vendor/register` | 🔒 | Register vendor on-chain |
| `POST` | `/compliance/update` | 🔒 | Update compliance score on-chain |
| `GET` | `/network` | 🔒 | Network info (gas, block number) |
| `GET` | `/verify/:txHash` | 🔒 | Verify transaction hash |

</details>

<details>
<summary><strong>🔔 Notifications — <code>/api/notifications</code></strong></summary>

| Method | Endpoint | Auth | Description |
|:------:|:---------|:----:|:------------|
| `GET` | `/` | 🔒 | List user notifications |
| `PUT` | `/:id/read` | 🔒 | Mark as read |
| `PUT` | `/read-all` | 🔒 | Mark all as read |

</details>

> **Legend**: 🔒 = JWT required · 👑 = Admin/Manager role · 🛡️ = Admin only · 📎 = File upload

---

## ⛓️ Blockchain Contracts

Three production-ready Solidity 0.8.20 contracts using OpenZeppelin:

<table>
<tr>
<td width="33%" valign="top">

### 📋 VendorCompliance

**Vendor registration & compliance scoring**

- Register vendors with wallet, name, email
- Compliance scores 0–100 with full history
- 5 levels: `PENDING` → `LOW` → `MEDIUM` → `HIGH` → `CRITICAL`
- Dispute system with resolution workflow
- `onlyOwner` access control on score updates
- Activate/deactivate vendors

</td>
<td width="33%" valign="top">

### 📦 DeliveryLog

**Immutable delivery records**

- Full lifecycle tracking:
  `PENDING` → `IN_TRANSIT` → `DELIVERED`
- Verification with quality scores
- Verification codes for secure confirmation
- Tracking number lookup
- Delivery items storage
- Dispute mechanism

</td>
<td width="33%" valign="top">

### 🪙 ComplianceToken

**ERC-20 reward/penalty system**

- **Rewards**: 10 tokens per compliance event
- **Penalties**: 5 tokens slashed per violation
- **Staking**: Lock tokens as compliance bond
- Authorized minter pattern
- Token burning support
- Max supply: 100M tokens

</td>
</tr>
</table>

```bash
cd blockchain && npx hardhat test    # ✅ 39 passing tests
```

---

## 🤖 Fraud Detection & ML

### 🔍 Fraud Detection Engine

Real-time rule-based anomaly detection analyzing every delivery:

```
Delivery ──▶ ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
             │  Quantity     │    │  Timing      │    │  Vendor      │
             │  Analysis     │    │  Analysis    │    │  History     │
             │  ±10% = med   │    │  >3d = med   │    │  Score <60   │
             │  ±30% = high  │    │  >7d = high  │    │  = high risk │
             └──────┬───────┘    └──────┬───────┘    └──────┬───────┘
                    │                   │                    │
                    └───────────┬───────┘────────────────────┘
                                ▼
                    ┌────────────────────┐
                    │   Risk Score 0-100 │
                    │   ≥50 = 🚨 FLAGGED │
                    └────────────────────┘
```

| Check | Trigger | Score Impact |
|:------|:--------|:-------------|
| Quantity mismatch | >10% deviation from expected | +15 (med) / +30 (high) |
| Late delivery | >3 days past expected date | +10 (med) / +25 (high) |
| Low compliance vendor | Vendor score < 60 | +20 |
| Damaged/expired items | Items flagged by inspector | +10–25 |
| Unusual delivery time | Outside business hours | +5 |

### 🧠 ML Risk Prediction

Heuristic scoring model for vendor risk assessment:

- **Inputs**: On-time rate, fraud flag rate, compliance score, last 50 deliveries
- **Outputs**: Risk level (low/medium/high), confidence (0–0.95), contributing factors
- **Trend Prediction**: Projects compliance scores for the next 6 months
- **Anomaly Detection**: Z-score analysis on delivery amounts vs vendor history

> 📝 The ML service uses statistical heuristics designed to demonstrate the detection pipeline for a hackathon context. In production, this would be backed by a trained model.

---

## 📱 Mobile App

<table>
<tr>
<td width="50%">

### Features

- 📷 **Barcode Scanner** — Camera-based delivery barcode scanning
- ✅ **Delivery Verification** — Confirm quantities, flag discrepancies
- 📸 **Photo Evidence** — Capture and upload delivery photos
- 📊 **Dashboard** — View pending verifications and alerts
- 🏢 **Vendor Lookup** — Quick compliance status check
- 📴 **Offline Mode** — AsyncStorage caches critical data
- 🌐 **Cross-platform** — Android + iOS from single codebase

</td>
<td width="50%">

### Quick Start

```bash
cd mobile
npm install
npm start           # Expo dev server
```

**Platform-specific:**
```bash
npm run android     # Android emulator
npm run ios         # iOS simulator
npm run web         # Web browser
```

**Environment:**
```env
EXPO_PUBLIC_API_URL=http://your-backend:3000/api
```

</td>
</tr>
</table>

---

## 🚢 Deployment

<details>
<summary><strong>Vercel (Recommended for demo)</strong></summary>

The project includes Vercel configuration for deploying the frontend as a static SPA and the backend as serverless functions.

</details>

<details>
<summary><strong>Docker</strong></summary>

```bash
docker-compose up --build     # Starts backend + frontend
```

</details>

<details>
<summary><strong>Manual</strong></summary>

```bash
# Build frontend
cd frontend && npm run build   # Output: frontend/dist/

# Start backend in production
cd backend && NODE_ENV=production npm start
```

</details>

---

## 📜 Scripts Reference

| Script | Location | Description |
|:-------|:---------|:------------|
| `npm run dev` | Root | 🟢 Start backend + frontend concurrently |
| `npm run dev:frontend` | Root | Start Vite dev server only |
| `npm run dev:backend` | Root | Start Express with nodemon only |
| `npm run dev:mobile` | Root | Start Expo dev server |
| `npm run install:all` | Root | Install deps in all 4 folders |
| `npm run build` | Root | Build frontend for production |
| `npm start` | Root | Start backend in production mode |
| `npm run seed` | Backend | Seed database with sample data |
| `npm test` | Backend | Run Jest tests |
| `npx hardhat compile` | Blockchain | Compile Solidity contracts |
| `npx hardhat test` | Blockchain | ✅ Run 39 contract tests |
| `npx hardhat node` | Blockchain | Start local Hardhat node |

---

## 👥 Team

<div align="center">

**Walmart Sparkathon 2025 — Supply Chain Innovation Track**

| | Name | Role |
|:---:|:-----|:-----|
| ⛓️ | **Salugu Harshita Bhanu** | Blockchain & Frontend Developer |
| 🤖 | **Divanshu Bhargava** | ML Engineer |
| 📱 | **Ananya Yadav** | Mobile Developer |
| ⚙️ | **Aryan Kesarwani** | Backend Developer |

</div>

---

<div align="center">

### Built with ❤️ for Walmart Sparkathon 2025

[![Made with React](https://img.shields.io/badge/Made%20with-React-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![Powered by MongoDB](https://img.shields.io/badge/Powered%20by-MongoDB-47A248?style=flat-square&logo=mongodb)](https://mongodb.com)
[![Secured by Blockchain](https://img.shields.io/badge/Secured%20by-Blockchain-363636?style=flat-square&logo=ethereum)](https://ethereum.org)

[⬆ Back to Top](#️-smart-vendor-compliance--loss-detection-system)

</div>