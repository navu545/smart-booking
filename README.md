# 🚀 Smart Booking System

<p align="center">
  <img src="./assets/demo.png" alt="Demo Preview" width="800"/>
</p>

A **real-time service marketplace platform** where customers can book workers for specific time slots — built with **strong concurrency guarantees**, **live updates**, and a **scalable monorepo architecture**.

---

## 🌐 Live Demo

👉 https://smart-booking-frontend.netlify.app/

---

## 🧪 Demo Instructions

To fully experience the system:

### 1. Simulate different users
- Use the **user selector dropdown** to switch between users  
- Or open the app in **multiple tabs/windows** to simulate parallel users  

---

### 2. Test real-time updates
- Select the same worker  
- Book a slot as one user  

✅ Other users see updates instantly  

---

### 3. Test concurrency handling
- Try booking the **same slot simultaneously** (multi-tab recommended)

✅ Only one booking succeeds  
❌ Others fail gracefully  

---

### 4. Explore smart matching
- Use filters (rating, availability, distance)  
- Observe how workers are ranked dynamically  

---

### 5. Reset system (optional)
- Trigger system reset via API or UI (if exposed)

✅ All clients refresh via WebSocket  

---

## 📌 Overview

This system enables:

### 👤 Customers
- Browse available workers  
- View time slots  
- Book a slot in real-time  

### 🛠️ Workers
- Define availability via slots  
- Cannot be double-booked (strict guarantee)  

---

## 🏗️ Tech Stack

### Frontend
- React (TypeScript)
- Tailwind CSS
- Vite

### Backend
- Node.js + Express
- Prisma ORM
- PostgreSQL

### Real-Time
- WebSockets (`ws`)

### Tooling
- TurboRepo (Monorepo architecture)
- Docker (local database)

---

## 📁 Project Structure (Overview)

```
smart-booking/
├── apps/
│   ├── frontend/     # React UI
│   ├── http/         # REST API server
│   └── ws/           # WebSocket server
│
├── packages/
│   └── db/           # Prisma (shared DB layer)
│
├── package.json
└── turbo.json
```

---

## 🚀 Key Features

### ⚡ Concurrency-Safe Booking
- Database-level constraint (`slotId @unique`)
- Prisma transaction ensures atomic operations  
- Graceful handling of race conditions (`P2002`)

---

### 🎯 Real-Time Updates
- Clients subscribe to specific workers  
- Only relevant users receive updates  
- Avoids unnecessary global broadcasts  

---

### 🧠 Smart Worker Matching
Workers matched using:
- Rating  
- Availability  
- Distance (Haversine calculation using lat/lng)  

---

### ⚡ Performance Optimizations (Scaling signals)
- Worker data caching (30s TTL)  
- Cache invalidation on booking  
- Reduced database load  

---

### 🔄 System Reset (Admin Control)
- Clears database  
- Reseeds data  
- Broadcasts reset event to all clients  

---

### 🛡️ API Safety
- Input validation using Zod  
- Centralized error handling  
- Rate limiting (100 req/min)  

---

### 🔌 Clean Architecture
- HTTP server → business logic + DB  
- WebSocket server → real-time events only  
- Shared DB layer via Prisma package  

---

## 🧠 System Design

### Core Models

- **User** → Customer or Worker  
- **Worker** → Linked to User  
- **Slot** → Time availability  
- **Booking** → Links User + Worker + Slot  

👉 See `schema.prisma` in `packages/db/prisma`

---

### 🔥 Key Constraint (Critical)

```ts
slotId Int @unique
```

**Guarantee:**
- Only **ONE booking per slot**, enforced at the database level

---

### 🔄 Booking Flow

1. User selects worker + slot  

2. Request sent → `POST /booking`  

3. Backend executes transaction:
   - Validate slot  
   - Check availability  
   - Create booking  
   - Update slot  

4. Conflict case:
   - DB throws unique constraint error  
   - API returns graceful failure  

---

### ⚠️ Concurrency Handling

Handled via:

- ✅ Database constraint (UNIQUE)  
- ✅ Prisma transaction  
- ✅ Error handling (`P2002`)  

**Result:**
> Even if multiple users book simultaneously → only one succeeds  

---

### ⚙️ Additional Design Decisions

- Worker location stored (lat/lng) for distance-based ranking  
- Slot indexing for faster queries  
- Separate Slot table enables clean concurrency control  

---

## ⚡ Real-Time Updates

WebSocket system supports:

### Subscription Model
Clients subscribe to specific workers:

```json
{
  "type": "SUBSCRIBE",
  "workerId": 1
}
```

---

### Events

#### Slot Booked
```json
{
  "type": "SLOT_BOOKED",
  "data": { "slotId": 1, "workerId": 1 }
}
```

→ Sent only to relevant subscribers  

---

#### System Reset
```json
{
  "type": "SYSTEM_RESET"
}
```

→ Broadcast to all clients  

---

## 🧪 Edge Cases

### Double Booking
✔ Prevented via DB constraint  

### Stale UI
✔ Backend validation ensures correctness  

### API Failure
✔ Optimistic UI + rollback  

### System Reset
✔ Admin endpoint + WebSocket broadcast  

---

## 🧑‍💻 API Endpoints

### Workers
- `GET /workers`  
- `GET /workers/slots`  

### Booking
- `POST /booking`  

### Users
- `GET /users`  

### Admin
- `POST /admin/reset`  

---

## 📁 Project Structure (Detailed)

```
smart-booking/
│
├── apps/
│   │
│   ├── frontend/                  # React App (UI Layer)
│   │   ├── public/                # Static assets
│   │   │
│   │   ├── src/
│   │   │   ├── api/               # API layer (handles HTTP calls)
│   │   │   │   ├── bookings.ts    # Booking API (POST /booking)
│   │   │   │   ├── client.ts      # API base configuration
│   │   │   │   ├── slots.ts       # Fetch worker slots
│   │   │   │   └── workers.ts     # Fetch workers
│   │   │   │
│   │   │   ├── components/        # Reusable UI components
│   │   │   │   ├── SlotGrid.tsx   # Slot list container
│   │   │   │   ├── SlotItem.tsx   # Individual slot UI + booking logic
│   │   │   │   └── WorkerList.tsx # Worker selection UI
│   │   │   │
│   │   │   ├── hooks/             # Custom hooks (state + side effects)
│   │   │   │   ├── useSlots.ts    # Fetch + manage slot state
│   │   │   │   ├── useWebSocket.ts# Real-time updates subscription
│   │   │   │   └── useWorkers.ts  # Fetch workers data
│   │   │   │
│   │   │   ├── pages/             # Page-level components
│   │   │   │   └── Home.tsx       # Main booking interface
│   │   │   │
│   │   │   ├── types/             # TypeScript types/interfaces
│   │   │   │   └── index.ts       # User, Worker, Slot definitions
│   │   │   │
│   │   │   ├── App.tsx            # Root React component
│   │   │   ├── main.tsx           # Application entry point
│   │   │   └── index.css          # Global styles (Tailwind)
│   │   │
│   │   └── index.html             # HTML template
│   │
│   │
│   ├── http/                     # REST API Server (Core Backend)
│   │   ├── src/
│   │   │   ├── controllers/      # Handles HTTP req/res (thin layer)
│   │   │   │   ├── admin.controller.ts
│   │   │   │   ├── booking.controller.ts
│   │   │   │   └── worker.controller.ts
│   │   │   │
│   │   │   ├── routes/           # API route definitions
│   │   │   │   ├── admin.routes.ts
│   │   │   │   ├── booking.routes.ts
│   │   │   │   ├── user.routes.ts
│   │   │   │   └── worker.routes.ts
│   │   │   │
│   │   │   ├── services/         # Core business logic (transactions, rules)
│   │   │   │   ├── admin.service.ts
│   │   │   │   ├── booking.service.ts   # Handles concurrency-safe booking
│   │   │   │   └── worker.service.ts
│   │   │   │
│   │   │   ├── validators/       # Request validation (Zod schemas)
│   │   │   │   ├── booking.validator.ts
│   │   │   │   └── worker.validator.ts
│   │   │   │
│   │   │   ├── middleware/       # Express middleware (error handling, etc.)
│   │   │   │   └── error.middleware.ts
│   │   │   │
│   │   │   ├── lib/              # External integrations
│   │   │   │   └── wsClient.ts   # Sends events to WebSocket server
│   │   │   │
│   │   │   ├── utils/            # Helper utilities
│   │   │   │   ├── AppError.ts   # Custom error class
│   │   │   │   ├── asyncHandler.ts # Async wrapper for routes
│   │   │   │   └── distance.ts   # Distance calculation logic
│   │   │   │
│   │   │   └── index.ts          # Server entry point
│   │
│   │
│   ├── ws/                       # WebSocket Server (Realtime Layer)
│   │   ├── src/
│   │   │   └── index.ts          # Handles subscriptions + broadcasts
│   │
│
├── packages/
│   │
│   └── db/                      # Shared Database Layer (Prisma)
│       ├── prisma/
│       │   ├── migrations/      # Database migrations
│       │   └── schema.prisma    # DB schema (models + relations)
│       │
│       ├── index.ts             # Prisma client singleton (shared)
│       ├── seed.ts              # Seed runner script
│       └── seedData.ts          # Seed data logic
│
│
├── package.json                 # Root workspace config (TurboRepo)
└── turbo.json                   # Build pipeline configuration
```


---

## ⚙️ Local Setup

### 1️⃣ Install dependencies

```bash
npm install
```

---

### 2️⃣ Start PostgreSQL (Docker)

```bash
docker run --name booking-db \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=booking \
  -p 5432:5432 \
  -v pgdata:/var/lib/postgresql/data \
  -d postgres
```

---

### 3️⃣ Configure environment variables

Create `.env`:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/booking"
WS_URL="ws://localhost:3002"
```

---

### 4️⃣ Setup database

```bash
npx prisma migrate dev
npx prisma generate
npx prisma db seed
```

---

### 5️⃣ Build shared DB package (IMPORTANT)

```bash
npm run build --workspace=@repo/db
```

---

### 6️⃣ Run the app

```bash
npm run dev
```

This starts:
- HTTP server (3001)
- WebSocket server (3002)
- Frontend (5173)

---

## 🧪 Testing the System

### 1. Verify database

```bash
npx prisma studio
```

- Confirm users, workers, and slots exist  

---

### 2. Test API

```bash
curl http://localhost:3001/workers
```

---

### 3. Test concurrency (CRITICAL)

- Open multiple browser tabs  
- Try booking the same slot simultaneously  

✅ Expected:
- Only ONE booking succeeds  
- Others fail gracefully  

---

### 4. Test real-time updates

- Open two clients  
- Subscribe to same worker  
- Book slot in one  

✅ Expected:
- Other client updates instantly  

---

### 5. Test cache behavior

- Call `/workers` multiple times → fast response  
- Book a slot  
- Call again  

✅ Expected:
- Updated data (cache invalidated)  

---

### 6. Test system reset

```bash
POST /admin/reset
```

✅ Expected:
- DB cleared + reseeded  
- All clients receive `SYSTEM_RESET` event  

---

## 🔌 Ports

| Service    | Port |
|------------|------|
| Frontend   | 5173 |
| HTTP API   | 3001 |
| WebSocket  | 3002 |

---

## 🎯 Key Highlights

- Strong concurrency handling (DB + transaction level)  
- Selective real-time updates (not naive broadcasting)  
- Performance optimizations with caching  
- Clean scalable architecture (monorepo + separation of concerns)  
- Optimistic UI with rollback  

---

## 📌 Summary

This system is designed as a **modular, scalable architecture** where:

- Frontend handles UI  
- HTTP server handles business logic  
- WebSocket server handles real-time updates  
- Database layer is centralized and reusable  

Built with a focus on **real-world reliability**, **scalability**, and **clean system design**.

---

## 👨‍💻 Author

**Navdeep Singh**  
GitHub: https://github.com/navu545