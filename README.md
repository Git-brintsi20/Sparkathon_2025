# Smart Vendor Compliance System

[![React](https://img.shields.io/badge/React-18.2-blue?logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.x-646cff?logo=vite)](https://vitejs.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-18.x-green?logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?logo=mongodb)](https://www.mongodb.com/)
[![Solidity](https://img.shields.io/badge/Solidity-0.8.20-gray?logo=solidity)](https://soliditylang.org/)
[![License](https://img.shields.io/badge/License-MIT-blue)](LICENSE)

> A blockchain-powered solution for real-time vendor compliance tracking and fraud detection

## Walmart Sparkathon 2025 Submission

**Track**: Supply Chain Innovation

## Problem Statement

Addressing Walmart's supply chain challenges by:
- Reducing vendor compliance violations
- Detecting delivery fraud in real-time
- Automating verification processes
- Providing immutable audit trails via blockchain

## Key Features

| Feature | Technology | Impact |
|---------|-----------|--------|
| Real-time compliance dashboard | React 18 + Recharts + Socket.IO | Live vendor monitoring |
| Blockchain audit trail | Solidity smart contracts (Hardhat) | Tamper-proof records |
| Fraud detection engine | Node.js rule-based ML service | Anomaly-based flagging |
| Vendor scoring system | MongoDB aggregation pipelines | Data-driven selection |
| Mobile barcode scanning | React Native + Expo Camera | Faster gate checks |
| Real-time notifications | Socket.IO + MongoDB persistence | Instant compliance alerts |

## Tech Stack

**Frontend (Web)**
- React 18 + TypeScript + Vite
- Shadcn UI + Tailwind CSS
- Recharts, Framer Motion, Sonner toasts
- Socket.IO client for real-time updates

**Backend**
- Node.js + Express
- MongoDB Atlas (Mongoose ODM)
- JWT authentication (access + refresh tokens)
- Socket.IO for WebSocket push
- Cloudinary (image uploads)
- Nodemailer (SMTP email alerts)

**Blockchain**
- Solidity 0.8.20 smart contracts
- Hardhat 2.25 + OpenZeppelin 4.9.5
- 3 contracts: VendorCompliance, DeliveryLog, ComplianceToken
- 39 passing tests (ethers v6)

**Mobile**
- React Native + Expo ~49
- Barcode scanner + Camera modules

## Project Structure

```
smart-vendor-compliance/
├── backend/          # Express API + MongoDB + Socket.IO
├── blockchain/       # Hardhat project with 3 Solidity contracts
├── frontend/         # React 18 + Vite + TypeScript SPA
└── mobile/           # React Native / Expo app
```

## Installation

```bash
# Clone repository
git clone https://github.com/Git-brintsi20/Sparkathon_2025.git
cd Sparkathon_2025/smart-vendor-compliance

# Copy environment variables
cp ../.env.example ../.env   # Fill in the values

# Install all dependencies
npm run setup                 # Installs root, backend, frontend, blockchain

# Start development servers
npm run dev                   # Runs backend + frontend concurrently
```

### Blockchain (optional)

```bash
cd blockchain
npx hardhat compile
npx hardhat test              # 39 tests
npx hardhat run scripts/deploy.js --network localhost
```

## Environment Variables

See [`.env.example`](../.env.example) for the full list. Key variables:

| Variable | Required | Description |
|----------|----------|-------------|
| `MONGODB_URI` | Yes | MongoDB Atlas connection string |
| `JWT_SECRET` | Yes | Access token signing secret |
| `JWT_REFRESH_SECRET` | Yes | Refresh token signing secret |
| `CLOUDINARY_CLOUD_NAME` | No | Cloudinary cloud name |
| `SMTP_USER` / `SMTP_PASS` | No | Gmail SMTP for email alerts |
| `DEMO_MODE` | No | Enable demo mode (default: true) |

## Development Team

- **Salugu Harshita Bhanu** — Blockchain & Frontend Developer
- **Divanshu Bhargava** — ML Engineer
- **Ananya Yadav** — Mobile Developer
- **Aryan Kesarwani** — Backend Developer

## License

[MIT](LICENSE)