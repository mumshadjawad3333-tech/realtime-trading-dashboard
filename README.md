# Real-Time Trading Dashboard

A high-performance, full-stack trading application built to demonstrate real-time data streaming, secure authentication, and cross-platform notification integration.

---

##  Key Features

*   **Real-Time Price Streaming**: Market data delivered via **Socket.io** with sub-second latency.
*   **Push Notifications (FCM)**: Integrated **Firebase Cloud Messaging** for OS-level alerts (macOS/Windows) even when the tab is backgrounded.
*   **Secure Authentication**: Fully implemented **JWT (JSON Web Tokens)** for protected REST APIs and WebSocket namespaces.
*   **Emerald UI Alerts**: Custom in-app notification system for immediate price threshold events.
*   **Mock Market Simulation**: A robust backend simulation engine that mimics real-world market volatility.
*   **Modern Frontend**: Built with **Vite**, **React 18**, **TypeScript**, and **Tailwind CSS**.

---

##  Tech Stack

- **Frontend**: React, TypeScript, Vite, Tailwind CSS, Recharts, Firebase SDK.
- **Backend**: Node.js, Express, Socket.io, Firebase Admin, JWT.
- **Testing**: Vitest (Backend logic and API simulation).
- **DevOps**: Docker, Docker Compose.

---

##  Getting Started

#Security & Configuration

To adhere to security best practices and prevent credential exposure, this repository uses environment templates.

### Setup Steps:
1. *Environment Variables:*
   - Copy backend/.env.example to backend/.env.
   - Copy frontend/.env.example to frontend/.env.
2. *Firebase Service Account:*
   - Place your Firebase Admin SDK JSON file in the /backend directory and name it service-account-file.json.
3. *Service Worker:*
   - Update the placeholders in frontend/public/firebase-messaging-sw.js with your specific Firebase web credentials.
4. *Run with Docker:*
   - Execute docker compose up --build.

### Credentials
Use the following details to access the dashboard:
*   **Username**: `admin`
*   **Password**: `password123`

---

### Option 1: Running Locally (Without Docker)

**1. Backend Setup:**
```bash
cd backend
npm install
npm run dev

cd frontend
npm install
npm run dev


**Option 2: Running Locally (Without Docker)**
docker compose down
docker compose up --build

**Testing**
cd backend
npm test


---
**NOTE : Please refer simulator.ts for fcm notification price alter triggers**
---
Architecture & Scalability
Clean Architecture: The project follows a modular structure with separated concerns for network calls (API Client), helpers (FCM logic), and core services.

Containerization & Future Growth: The application is fully containerized and designed with a stateless architecture, making it ready for orchestration via Kubernetes (K8s).

Scalability Roadmap: I have structured the services to support high-availability requirements, including readiness for:

Horizontal Pod Autoscaling (HPA) based on resource utilization.

Ingress configuration with Session Affinity to maintain stable Socket.io connections.# realtime-trading-dashboard



