# Disaster Evacuation System

[![Engine](https://github.com/RohitDSonawane/DisasterEvacuationSystem/actions/workflows/ci.yml/badge.svg)](https://github.com/RohitDSonawane/DisasterEvacuationSystem/actions/workflows/ci.yml)
![C++17](https://img.shields.io/badge/C%2B%2B-17-blue)
[![License: MIT](https://img.shields.io/badge/License-MIT-lightgrey)](LICENSE)

A C++ engine that treats disaster evacuation as a graph problem. It finds the shortest road route from a disaster zone to each relief center with Dijkstra's algorithm, then fills the nearest centers first with a greedy allocation that respects each center's capacity. It began as an academic project.

The engine in `engine/` is the main part of the repository. `ReliefRoute/` is a Next.js dashboard prototype that drives the engine through a web page.

## Quick start

```bash
cd engine
make
make run
```

On Windows without `make`:

```powershell
cd engine
g++ main.cpp AllocationModule.cpp GraphModule.cpp IOModule.cpp TreeModule.cpp TreeNode.cpp -o reliefroute_engine.exe -std=c++17 -Wall -O2
.\reliefroute_engine.exe samples\admin.txt samples\graph.txt
```

The commands are `AFFECTED <zone> <count>`, `EVACUATE <zone> <count>`, `STATUS`, `SUMMARY` and `EXIT`.

## Example

With the Maharashtra sample data, 20,000 affected people in Colaba are more than the nearest shelter can hold. Wankhede Stadium takes 15,000 and the rest go to BKC Complex, routed through Worli:

```text
> AFFECTED Colaba 20000
OK: Updated population for Colaba
> EVACUATE Colaba 20000
--- Evacuation Plan for Colaba (20000 people) ---
 Assignment [1]:
  Shelter  : Wankhede_Stadium (Allocated: 15000)
  Distance : 1 km
  Route    : Colaba -> Wankhede_Stadium
 Assignment [2]:
  Shelter  : BKC_Complex (Allocated: 5000)
  Distance : 12 km
  Route    : Colaba -> Worli -> BKC_Complex
> SUMMARY
Name                    Occupancy   Capacity   Status
Wankhede_Stadium        15000       15000      [FULL]
BKC_Complex             5000        25000      [OK]
...
```

## Algorithms

1. An N-ary tree holds the administrative hierarchy and adds up population from the bottom.
2. An adjacency list stores the road network, which is sparse.
3. Dijkstra's algorithm computes shortest paths from the disaster zone to every shelter.
4. A greedy allocation fills the nearest shelters first and sends the overflow to the next closest. This is simple and fast but it is not guaranteed to be globally optimal.

Pseudocode and complexity are in [docs/ALGORITHMS.md](./docs/ALGORITHMS.md).

## Sample data

`engine/samples/` holds a Maharashtra scenario with the districts Mumbai, Pune and Thane, 8 zones and 7 relief centers. `disaster.txt` is a short scripted run that the CI job replays on every push.

## ReliefRoute dashboard

ReliefRoute is an integration prototype and is not production-ready. It starts the C++ engine as a subprocess and talks to it with JSON over stdin and stdout.

```bash
# Terminal 1: build the engine, then start the API
cd engine && make
cd ../ReliefRoute
node backend/server.js

# Terminal 2: start the frontend
cd ReliefRoute
npm install
npm run dev
```

Open http://localhost:3000 and sign in with `admin` / `admin123`. These are development defaults. Set `ADMIN_USERNAME` and `ADMIN_PASSWORD` in `ReliefRoute/.env` before running it anywhere other than your own machine. More detail is in [ReliefRoute/README.md](./ReliefRoute/README.md).

## Documentation

| Document | Contents |
|----------|----------|
| [Algorithms](./docs/ALGORITHMS.md) | Problem definition, pseudocode and complexity |
| [Architecture](./docs/ARCHITECTURE.md) | The three-tier design |
| [Workflow](./docs/WORKFLOW.md) | Phases of a disaster response |
| [Data formats](./docs/DATA_FORMATS.md) | Syntax of `admin.txt` and `graph.txt` |
| [Roadmap](./docs/ROADMAP.md) | Current scope and planned work |

## Project layout

```
DisasterEvacuationSystem/
├── engine/          C++ algorithm core, Makefile and sample data
├── ReliefRoute/     Next.js dashboard prototype
│   └── backend/     Express API and engine bridge
├── docs/            algorithm and architecture notes
└── README.md
```

## License

MIT. See [LICENSE](./LICENSE).
