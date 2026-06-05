# Disaster Evacuation System

![C++](https://img.shields.io/badge/Core-C%2B%2B17-blue)
![Algorithms](https://img.shields.io/badge/Algorithms-Dijkstra%20%7C%20Greedy-green)
![Status](https://img.shields.io/badge/Status-Algorithm%20Prototype-yellow)
![License](https://img.shields.io/badge/License-MIT-lightgrey)

An academic computer-science project that models disaster evacuation as a **graph optimization problem**: shortest-path routing (Dijkstra) plus **capacity-constrained shelter allocation** (greedy strategy).

> **Current focus:** C++ algorithm engine  
> **Future vision:** Full operational dashboard for emergency coordinators

---

## What's Inside

| Component | Path | Status |
|-----------|------|--------|
| **Algorithm Engine** | [`engine/`](./engine/) | Primary artifact — CLI + JSON modes |
| **ReliefRoute Dashboard** | [`ReliefRoute/`](./ReliefRoute/) | Prototype integration layer |
| **Documentation** | [`docs/`](./docs/) | Algorithms, architecture, roadmap |

---

## Quick Start (Engine)

```bash
cd engine
make
make run
```

Windows (without `make`):

```powershell
cd engine
g++ main.cpp AllocationModule.cpp GraphModule.cpp IOModule.cpp TreeModule.cpp TreeNode.cpp -o reliefroute_engine.exe -std=c++17 -Wall -O2
.\reliefroute_engine.exe samples\admin.txt samples\graph.txt
```

**CLI commands:** `AFFECTED <zone> <count>`, `EVACUATE <zone> <count>`, `STATUS`, `SUMMARY`, `EXIT`

---

## Optional: ReliefRoute Prototype Dashboard

```bash
# Terminal 1 — build engine first, then start API
cd engine && make
cd ../ReliefRoute
node backend/server.js

# Terminal 2 — frontend
cd ReliefRoute
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Development login: `admin` / `admin123`.

See [ReliefRoute/README.md](./ReliefRoute/README.md) for details.

---

## Algorithms at a Glance

1. **N-ary tree** — administrative hierarchy with population aggregation
2. **Adjacency list** — sparse road network representation
3. **Dijkstra** — shortest paths from disaster zone to all shelters
4. **Greedy allocation** — fill nearest shelters first, overflow to next closest

Full analysis: [docs/ALGORITHMS.md](./docs/ALGORITHMS.md)

---

## Sample Scenario

The committed `engine/samples/` dataset models a **Maharashtra** evacuation scenario with Mumbai, Pune, and Thane districts, 8 zones, and 7 relief centers.

---

## Documentation

| Document | Description |
|----------|-------------|
| [Algorithms](./docs/ALGORITHMS.md) | Problem definition, pseudocode, complexity |
| [Architecture](./docs/ARCHITECTURE.md) | Three-tier system design |
| [Workflow](./docs/WORKFLOW.md) | Disaster lifecycle phases |
| [Data Formats](./docs/DATA_FORMATS.md) | `admin.txt` and `graph.txt` syntax |
| [Roadmap](./docs/ROADMAP.md) | Current scope vs future vision |

---

## Project Structure

```
DisasterEvacuationSystem/
├── engine/                 # Canonical C++ algorithm core
│   ├── samples/            # Committed test scenarios
│   ├── Makefile
│   └── README.md
├── ReliefRoute/            # Next.js prototype dashboard
│   └── backend/            # Express API + engine bridge
├── docs/                   # Academic & architecture docs
└── README.md
```

---

## License

MIT — see [LICENSE](./LICENSE).
