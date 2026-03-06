# Smart Vendor Compliance & Loss Detection System

[![React](https://img.shields.io/badge/React-18.2-blue?logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.x-646cff?logo=vite)](https://vitejs.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green?logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?logo=mongodb)](https://www.mongodb.com/)
[![Solidity](https://img.shields.io/badge/Solidity-0.8.20-gray?logo=solidity)](https://soliditylang.org/)
[![Hardhat](https://img.shields.io/badge/Hardhat-2.25-yellow?logo=ethereum)](https://hardhat.org/)
[![License](https://img.shields.io/badge/License-MIT-blue)](LICENSE)

> A full-stack, blockchain-integrated platform for real-time vendor compliance tracking, delivery verification, and fraud detection — built for the **Walmart Sparkathon 2025**.

---

## Table of Contents

- [Problem Statement](#problem-statement)
- [Key Features](#key-features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Blockchain Contracts](#blockchain-contracts)
- [Fraud Detection & ML](#fraud-detection--ml)
- [Mobile App](#mobile-app)
- [Deployment](#deployment)
- [Team](#team)
- [License](#license)

---

## Problem Statement

Walmart's supply chain handles millions of vendor interactions. This system addresses:

- **Compliance violations** — Automated scoring, audit trails, and real-time alerts reduce manual oversight.
- **Delivery fraud** — Rule-based anomaly detection flags quantity mismatches, late deliveries, and suspicious patterns.
- **Verification delays** — Mobile barcode scanning and photo uploads speed up gate checks.
- **Audit integrity** — Blockchain-backed logs create tamper-proof records of every compliance event.

---

## Key Features

| Feature | How It Works |
|---------|-------------|
| **Real-time Dashboard** | React 18 + Recharts charts, Socket.IO live updates for vendor scores, deliveries, and alerts |
| **Vendor Management** | Full CRUD with compliance scoring, risk-level classification, and document uploads |
| **Delivery Tracking** | End-to-end lifecycle (pending → in_transit → delivered → verified), item-level verification |
| **Fraud Detection Engine** | Rule-based service checking quantity deviations, late deliveries, damaged items, vendor history |
| **ML Risk Prediction** | Heuristic model scoring vendor risk from on-time rates, fraud rates, and compliance history |
| **Blockchain Audit Trail** | 3 Solidity smart contracts logging vendor registrations, compliance updates, and deliveries on-chain |
| **Compliance Token (ERC-20)** | Reward/penalty token system — vendors earn tokens for compliance, lose them for violations |
| **Real-time Notifications** | Socket.IO push + MongoDB-persisted notifications with read/unread tracking |
| **Mobile Scanner** | React Native app with Expo Camera for barcode scanning and delivery photo capture |
| **Role-based Access** | JWT auth with access + refresh tokens; roles: admin, manager, inspector, viewer |
| **Email Alerts** | Nodemailer SMTP integration for compliance alerts and password resets |
| **Image Uploads** | Cloudinary integration for delivery evidence photos and vendor documents |

---

## Architecture

```
┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│   React SPA      │────▶│  Express API     │────▶│  MongoDB Atlas   │
│   (Vite + TS)    │◀────│  (Node.js)       │◀────│  (Mongoose ODM)  │
│                  │     │                  │     │                  │
│  • Shadcn UI     │     │  • JWT Auth      │     │  6 Collections:  │
│  • Recharts      │     │  • Socket.IO     │     │  User, Vendor,   │
│  • React Query   │     │  • Rate Limiter  │     │  Delivery, PO,   │
│  • Zustand       │     │  • Helmet/CORS   │     │  ComplianceLog,  │
│  • Socket.IO     │     │  • Cloudinary    │     │  Notification    │
└──────────────────┘     │  • Nodemailer    │     └──────────────────┘
                         │  • ethers v6     │
┌──────────────────┐     └────────┬─────────┘     ┌──────────────────┐
│  React Native    │              │               │  Hardhat          │
│  (Expo ~49)      │──────────────┘               │  (Solidity 0.8.20)│
│                  │                              │                  │
│  • Camera/QR     │                              │  3 Contracts:    │
│  • Geolocation   │                              │  VendorCompliance│
│  • Async Storage │                              │  DeliveryLog     │
└──────────────────┘                              │  ComplianceToken │
                                                  │  39 passing tests│
                                                  └──────────────────┘
```

---

## Tech Stack

### Frontend (Web)
| Technology | Purpose |
|-----------|---------|
| React 18 + TypeScript | UI framework |
| Vite 5 | Build tool & dev server |
| Tailwind CSS 3.4 | Utility-first styling |
| Shadcn UI (Radix primitives) | Accessible component library |
| React Router 6 | Client-side routing |
| TanStack React Query 5 | Server state management & caching |
| Zustand | Client state management |
| Recharts + D3 | Data visualization & charts |
| Framer Motion + GSAP | Animations |
| Socket.IO Client | Real-time WebSocket updates |
| Axios | HTTP client |
| Sonner | Toast notifications |
| React Hook Form | Form handling |

### Backend
| Technology | Purpose |
|-----------|---------|
| Node.js + Express 4.18 | REST API server |
| MongoDB Atlas (Mongoose 8) | Database with ODM |
| Socket.IO 4.7 | Real-time bidirectional events |
| JWT (jsonwebtoken) | Access + refresh token authentication |
| bcryptjs | Password hashing |
| ethers 6.9 | Blockchain interaction (Ethereum/EVM) |
| Cloudinary | Image/document upload & CDN |
| Nodemailer | SMTP email service |
| Multer | Multipart file upload middleware |
| Helmet + CORS | Security headers & cross-origin |
| express-rate-limit | API rate limiting |
| express-validator | Request validation |
| Morgan + Compression | Logging & response compression |

### Blockchain
| Technology | Purpose |
|-----------|---------|
| Solidity 0.8.20 | Smart contract language |
| Hardhat 2.25 | Development framework & local node |
| OpenZeppelin 4.9.5 | Audited contract libraries (ERC-20, Ownable, ReentrancyGuard) |
| ethers v6 | Contract deployment & interaction |
| Chai + Mocha | Contract unit testing |
| solidity-coverage | Code coverage reporting |
| hardhat-gas-reporter | Gas usage analysis |

### Mobile
| Technology | Purpose |
|-----------|---------|
| React Native 0.72 | Cross-platform mobile framework |
| Expo ~49 | Managed workflow & build tooling |
| React Navigation 6 | Screen navigation (stack + bottom tabs) |
| Expo Camera | Barcode/QR scanning |
| Expo Location | GPS-tagged deliveries |
| React Native Paper | Material Design components |
| Async Storage | Local data persistence |
| Axios | API communication |

---

## Project Structure

```
smart-vendor-compliance/
├── package.json              # Root scripts (dev, build, install:all)
├── backend/
│   ├── server.js             # HTTP + Socket.IO server entry point
│   └── src/
│       ├── app.js            # Express app (routes, middleware)
│       ├── config/           # Database, JWT, Cloudinary config
│       ├── controllers/      # Route handlers (auth, vendor, delivery, analytics, blockchain)
│       ├── middleware/        # Auth, validation, rate limiter, file upload, error handler
│       ├── models/           # Mongoose schemas (User, Vendor, Delivery, PO, ComplianceLog, Notification)
│       ├── routes/           # Express route definitions (6 route files)
│       ├── services/         # Business logic (blockchain, fraud detection, ML, notifications, image analysis)
│       └── utils/            # Helpers, validators, logger, email service
├── blockchain/
│   ├── hardhat.config.js     # Hardhat config (Sepolia, Amoy networks)
│   ├── contracts/
│   │   ├── VendorCompliance.sol   # Vendor registration, compliance scoring, dispute resolution
│   │   ├── DeliveryLog.sol        # Immutable delivery logging & verification
│   │   └── ComplianceToken.sol    # ERC-20 reward/penalty token with staking
│   ├── scripts/              # deploy.js, interact.js, verify.js
│   └── test/                 # 39 unit tests (VendorCompliance, DeliveryLog)
├── frontend/
│   └── src/
│       ├── components/       # Reusable UI (charts, forms, layout, common)
│       ├── config/           # Routes, theme, env, blockchain config
│       ├── contexts/         # Auth, Theme, Notification providers
│       ├── hooks/            # useVendors, useDeliveries, useAnalytics, useNotifications, etc.
│       ├── pages/            # Dashboard, Vendors, Deliveries, Analytics, Settings, Auth
│       ├── services/         # API client (Axios), blockchain service, notification service
│       ├── types/            # TypeScript interfaces
│       └── utils/            # Constants, formatters, helpers
└── mobile/
    ├── index.ts              # App entry point
    └── src/
        ├── App.tsx           # Root navigator
        ├── components/       # Shared mobile components
        ├── navigation/       # Stack & tab navigators
        ├── screens/          # Dashboard, Scanner, VendorList, DeliveryDetail, etc.
        ├── services/         # API service, auth service
        └── utils/            # Helpers, constants
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- MongoDB Atlas account (free tier works)

### Installation

```bash
# Clone
git clone https://github.com/Git-brintsi20/Sparkathon_2025.git
cd Sparkathon_2025/smart-vendor-compliance

# Install all dependencies (root + backend + frontend + blockchain + mobile)
npm run install:all

# Set up backend environment
cp backend/.env.example backend/.env
# Edit backend/.env with your credentials (see Environment Variables below)

# Start development (backend + frontend concurrently)
npm run dev
```

The frontend dev server runs on **http://localhost:5173** and the backend API on **http://localhost:3000**.

### Blockchain (optional)

```bash
cd blockchain
npx hardhat compile           # Compile Solidity contracts
npx hardhat test              # Run 39 unit tests
npx hardhat node              # Start local Hardhat node
npx hardhat run scripts/deploy.js --network localhost   # Deploy locally
```

### Mobile (optional)

```bash
cd mobile
npm install
npm start                     # Starts Expo dev server
# Scan QR code with Expo Go app on your phone
```

---

## Environment Variables

Create `backend/.env` from `backend/.env.example`. Key variables:

| Variable | Required | Description |
|----------|----------|-------------|
| `PORT` | No | Server port (default: 3000) |
| `MONGODB_URI` | **Yes** | MongoDB Atlas connection string |
| `JWT_SECRET` | **Yes** | Access token signing secret |
| `JWT_REFRESH_SECRET` | **Yes** | Refresh token signing secret |
| `JWT_EXPIRE` | No | Access token expiry (default: 7d) |
| `JWT_REFRESH_EXPIRE` | No | Refresh token expiry (default: 30d) |
| `FRONTEND_URL` | No | Frontend URL for CORS (default: http://localhost:5173) |
| `CLOUDINARY_CLOUD_NAME` | No | Cloudinary cloud name for image uploads |
| `CLOUDINARY_API_KEY` | No | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | No | Cloudinary API secret |
| `SMTP_HOST` | No | SMTP server (default: smtp.gmail.com) |
| `SMTP_PORT` | No | SMTP port (default: 587) |
| `SMTP_USER` | No | Email address for sending alerts |
| `SMTP_PASS` | No | Email app password |
| `DEMO_MODE` | No | `true` = mock blockchain calls (default: true) |
| `RPC_URL` | No | Ethereum RPC endpoint (Alchemy/Infura) |
| `PRIVATE_KEY` | No | Deployer wallet private key |

---

## API Endpoints

### Authentication (`/api/auth`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/register` | — | Create new user account |
| POST | `/login` | — | Login, returns access + refresh tokens |
| POST | `/refresh-token` | — | Refresh access token |
| POST | `/forgot-password` | — | Send password reset email |
| GET | `/me` | JWT | Get current user profile |
| PUT | `/profile` | JWT | Update profile |

### Vendors (`/api/vendors`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/` | JWT | List vendors (paginated, filterable) |
| GET | `/:id` | JWT | Get vendor details |
| POST | `/` | JWT + Admin/Manager | Create vendor |
| PUT | `/:id` | JWT + Admin/Manager | Update vendor |
| DELETE | `/:id` | JWT + Admin | Delete vendor |

### Deliveries (`/api/deliveries`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/` | JWT | List deliveries (paginated) |
| GET | `/:id` | JWT | Get delivery details |
| POST | `/` | JWT | Create delivery |
| PUT | `/:id` | JWT | Update delivery |
| PUT | `/:id/status` | JWT | Update delivery status |
| PUT | `/:id/verify` | JWT | Verify delivery (runs fraud detection) |
| POST | `/:id/upload` | JWT + File | Upload delivery evidence photo |

### Analytics (`/api/analytics`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/dashboard` | JWT | Dashboard stats (counts, scores, trends) |
| GET | `/compliance` | JWT | Compliance report data |
| GET | `/fraud` | JWT | Fraud detection analytics |
| GET | `/performance` | JWT | Performance metrics |
| GET | `/export` | JWT + Admin/Manager | Export report data |

### Blockchain (`/api/blockchain`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/vendor/register` | JWT | Register vendor on-chain |
| POST | `/compliance/update` | JWT | Update compliance score on-chain |
| GET | `/network` | JWT | Get network info (gas price, block number) |
| GET | `/verify/:txHash` | JWT | Verify a transaction hash |

### Notifications (`/api/notifications`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/` | JWT | List user notifications |
| PUT | `/:id/read` | JWT | Mark notification as read |
| PUT | `/read-all` | JWT | Mark all as read |

### Health Check
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Returns `{ status: 'ok', timestamp }` |

---

## Blockchain Contracts

Three Solidity 0.8.20 contracts deployed via Hardhat with OpenZeppelin:

### VendorCompliance.sol
- Registers vendors on-chain with wallet address, name, email
- Stores compliance scores (0–100) with full history
- Compliance levels: PENDING, LOW, MEDIUM, HIGH, CRITICAL
- Dispute resolution system (open → under review → resolved/rejected)
- Role-based access: only owner or authorized auditors can update scores

### DeliveryLog.sol
- Immutable delivery records with status tracking (PENDING → IN_TRANSIT → DELIVERED → verified/rejected)
- Verification workflow with quality scores and verifier tracking
- Dispute mechanism for contested deliveries
- Counter-based delivery IDs

### ComplianceToken.sol (ERC-20)
- Reward token for compliant vendors (configurable reward rate: 10 tokens/event)
- Penalty slashing for violations (configurable penalty rate: 5 tokens/event)
- Staking mechanism — vendors lock tokens as compliance bond
- Authorized minter pattern (owner controls who can mint)
- Max supply cap: 100,000,000 tokens

### Testing

```bash
cd blockchain
npx hardhat test    # 39 passing tests covering all contract functions
```

---

## Fraud Detection & ML

### Fraud Detection Service (`backend/src/services/fraudDetection.js`)
A rule-based anomaly detection engine that analyzes each delivery across multiple risk dimensions:

| Check | Trigger | Severity |
|-------|---------|----------|
| Quantity mismatch | Item quantity deviates >10% from expected | Medium (>10%) / High (>30%) |
| Late delivery | Delivery arrives >3 days late | Medium (3–7 days) / High (>7 days) |
| Low compliance vendor | Vendor score below 60 | High |
| Damaged items | Items marked as damaged or expired | Medium / High |
| Unusual delivery time | Delivery outside normal hours | Low |

Each check adds to a cumulative risk score (0–100). Deliveries with score ≥ 50 are flagged for manual review.

### ML Risk Prediction Service (`backend/src/services/mlService.js`)
A heuristic scoring model that predicts vendor risk levels:

- **Inputs**: On-time delivery rate, fraud flag rate, compliance score, delivery history (last 50 deliveries)
- **Outputs**: Risk level (low/medium/high), confidence score (0–0.95), contributing factors
- **Compliance trend prediction**: Projects future compliance scores based on current averages with variance
- **Anomaly detection**: Flags deliveries with unusual amounts, timing, or vendor patterns

> **Note**: The ML service uses statistical heuristics rather than a trained machine learning model. This is appropriate for the hackathon scope and demonstrates the detection logic that would feed into a production ML pipeline.

---

## Mobile App

The React Native (Expo) mobile app provides field workers with:

- **Barcode Scanner** — Scan delivery barcodes using the device camera to pull up delivery details
- **Delivery Verification** — Confirm quantities, capture photos of received goods, flag discrepancies
- **Dashboard** — View assigned deliveries, pending verifications, and alerts
- **Vendor Details** — Quick lookup of vendor compliance status and contact info
- **Offline Support** — AsyncStorage caches critical data for areas with poor connectivity

```bash
cd mobile
npm start           # Expo dev server
npm run android     # Launch on Android emulator
npm run ios         # Launch on iOS simulator
```

---

## Deployment

### Vercel (Recommended for demo)

The project includes Vercel configuration for deploying the frontend as a static SPA and the backend as serverless functions.

### Docker

```bash
docker-compose up --build     # Starts backend + frontend
```

### Manual

```bash
# Build frontend
cd frontend && npm run build   # Output: frontend/dist/

# Start backend
cd backend && npm start        # Runs on PORT from .env
```

---

## Scripts Reference

| Script | Location | Description |
|--------|----------|-------------|
| `npm run dev` | Root | Start backend + frontend concurrently |
| `npm run dev:frontend` | Root | Start Vite dev server only |
| `npm run dev:backend` | Root | Start Express with nodemon only |
| `npm run dev:mobile` | Root | Start Expo dev server |
| `npm run install:all` | Root | Install deps in all 4 folders |
| `npm run build` | Root | Build frontend for production |
| `npm start` | Root | Start backend in production mode |
| `npm run seed` | Backend | Seed database with sample data |
| `npm test` | Backend | Run Jest tests |
| `npx hardhat compile` | Blockchain | Compile Solidity contracts |
| `npx hardhat test` | Blockchain | Run 39 contract tests |
| `npx hardhat node` | Blockchain | Start local Hardhat node |

---

## Team

**Walmart Sparkathon 2025 — Supply Chain Innovation Track**

- **Salugu Harshita Bhanu** — Blockchain & Frontend Developer
- **Divanshu Bhargava** — ML Engineer
- **Ananya Yadav** — Mobile Developer
- **Aryan Kesarwani** — Backend Developer

---

## License

[MIT](LICENSE)