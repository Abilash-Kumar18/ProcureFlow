# ProcureFlow — Smart Procurement Centre Queue & Status Platform

[![SIH 2026](https://img.shields.io/badge/SIH-2026-brightgreen.svg)](https://www.sih.gov.in/)
[![Problem Statement ID](https://img.shields.io/badge/Problem%20ID-26032-orange.svg)](#)
[![Ministry](https://img.shields.io/badge/Ministry-Consumer%20Affairs%2C%20Food%20%26%20Public%20Distribution-blue.svg)](#)

> **ProcureFlow** is a multilingual, low-bandwidth, farmer-first operational orchestration and communication platform developed for **Smart India Hackathon 2026 (Problem Statement 26032)**. It eliminates long waiting times, opaque procurement schedules, and payment uncertainty at agricultural procurement centres (APMCs / PPCs).

---

## 🌾 Core Features & Capabilities

### 1. Farmer Experience (Mobile-First PWA)
- **Virtual Token Allocation:** Season-aware slot reservation with token issuance (`TK-009`) and unique booking reference.
- **Dynamic Circular Queue Ring:** Real-time visibility of farmers ahead and calculated arrival window (~35 mins).
- **5-Step Procurement Stepper:** `Slot Booked` $\rightarrow$ `Gate Check-in` $\rightarrow$ `Weighbridge Bay` $\rightarrow$ `Moisture Tested` $\rightarrow$ `Direct DBT Credit`.
- **Urgent Counter Call Alert:** Visual pulse alert + audible synthesizer chime when token is called to a counter bay.
- **Printable Verified Procurement Receipt:** Official weight slip with tare/gross breakdown, moisture deduction, and MSP rate calculations.
- **Multilingual Support:** Instant switching between English, हिन्दी (Hindi), and தமிழ் (Tamil).

### 2. Centre Operator Command Console
- **Air-Traffic Control Telemetry:** Real-time capacity utilization meter, gate arrivals, and active waiting queue count.
- **Weighbridge Instrument Terminal:** Digital LED readout terminal (`[ 22,500.00 KG GROSS ]`), tare subtraction, and moisture deduction analyzer.
- **Live Queue Table:** Instant actions (`Call Next`, `Start Service`, `Defer`, `No-Show`) with priority classes for elderly/smallholders.
- **Assisted Walk-in Registration:** 1-click modal for operators to onboard non-digital farmers directly at the mandi gate.
- **DBT Payment Reconciliation Desk:** 1-click transition of payouts from `PROCESSING` to `PAID` with simulated PFMS reference numbers.

### 3. District Administrator Dashboard
- **District-Wide Overview:** Real-time monitoring across 4 direct purchase centres in the Thanjavur Agricultural Zone.
- **Congestion Heatmap:** Live status cards highlighting overloaded mandis (e.g. Vallam APMC) with capacity bars to prevent bottlenecks.
- **Immutable Audit Trail Explorer:** Tamper-evident append-only event stream capturing every state transition and payout.
- **CSV Report Exporter:** 1-click export of daily procurement and disbursement records.

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js >= 20.0.0
- npm >= 10.0.0

### Installation

```bash
# 1. Clone repository
git clone <your-repo-url>
cd procureflow

# 2. Install backend dependencies & initialize database
cd backend
npm install
npm run seed

# 3. Install frontend dependencies
cd ../frontend
npm install

# 4. Start backend (Terminal 1)
cd ../backend
npm run dev

# 5. Start frontend (Terminal 2)
cd ../frontend
npm run dev
```

Open [http://localhost:3000/](http://localhost:3000/) in your browser.

---

## 👥 Demo Personas (1-Click Evaluation Toolbar)
- **Farmer:** Ramesh Kumar (`9876543210`) — Has active token `TK-009` at Pillaiyarpatti PPC.
- **Centre Operator:** Suresh Patel (`9876500001`) — Operational operator at Counter 1.
- **District Admin:** P. Sundaram, IAS (`9876500002`) — District Collector with zone-wide command.

---

## 🏗️ Architecture & Technology Stack
- **Frontend:** React 18, TypeScript, Vite, Custom Design System, Canvas Confetti, Web Audio API.
- **Backend:** Node.js, Express, TypeScript, Server-Sent Events (SSE).
- **Database:** Relational SQLite / PostgreSQL with foreign keys and ACID transactions.
- **Audit & Notification:** Append-only event store with mock SMS & Push notification logs.
