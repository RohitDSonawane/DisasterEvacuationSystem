# ReliefRoute — Prototype Dashboard

> **Status:** Integration prototype, not production-ready.  
> The primary artifact of this repository is the C++ engine in [`../engine/`](../engine/).

ReliefRoute is a Next.js visual layer that demonstrates how the evacuation engine could be operated through a web interface. It spawns the C++ engine as a subprocess and communicates via JSON over stdin/stdout.

---

## Prerequisites

- Node.js 18+
- C++ engine built from `../engine/` (see [engine/README.md](../engine/README.md))

---

## Setup

```bash
# 1. Build the engine
cd ../engine
make

# 2. Install frontend dependencies
cd ../ReliefRoute
npm install

# 3. Start API server (Terminal 1)
node backend/server.js

# 4. Start frontend (Terminal 2)
npm run dev
```

On first launch, the API seeds `backend/data/` from `engine/samples/` automatically.

Open [http://localhost:3000](http://localhost:3000).

---

## Development Login

| Field | Value |
|-------|-------|
| Username | `admin` |
| Password | `admin123` |

Authentication is prototype-only during development. See [docs/ROADMAP.md](../docs/ROADMAP.md) for production auth plans.

---

## Dashboard Pages

| Route | Purpose |
|-------|---------|
| `/dashboard` | Operations overview |
| `/planner` | Set affected population, run evacuations |
| `/shelters` | Shelter occupancy monitoring |
| `/hierarchy` | Administrative tree view |
| `/network` | Road network visualization |
| `/setup` | Edit scenario data, factory reset |

---

## Architecture

```
Next.js (:3000)  →  Express API (:8080)  →  engine/reliefroute_engine (--json)
```

See [docs/ARCHITECTURE.md](../docs/ARCHITECTURE.md) for the full system design.

---

## Environment Variables

Copy `.env.example` to `.env` (optional):

```
PORT=8080
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
NODE_ENV=development
```
