# Disaster Evacuation Engine (C++)

The **canonical algorithm core** of this project. Implements hierarchical region management, Dijkstra shortest-path routing, and greedy multi-shelter evacuation allocation.

> For algorithm details see [docs/ALGORITHMS.md](../docs/ALGORITHMS.md).

---

## Quick Start

```bash
# Build
make

# Run interactive CLI (Maharashtra sample scenario)
make run

# Or manually:
./reliefroute_engine samples/admin.txt samples/graph.txt

# JSON mode (for ReliefRoute web prototype)
./reliefroute_engine samples/admin.txt samples/graph.txt --json
```

On Windows without `make`:

```powershell
g++ main.cpp AllocationModule.cpp GraphModule.cpp IOModule.cpp TreeModule.cpp TreeNode.cpp -o reliefroute_engine.exe -std=c++17 -Wall -O2
.\reliefroute_engine.exe samples\admin.txt samples\graph.txt
```

---

## CLI Commands

| Command | Example | Description |
|---------|---------|-------------|
| `AFFECTED` | `AFFECTED Colaba 500` | Set affected population for a zone |
| `EVACUATE` | `EVACUATE Colaba 500` | Run evacuation plan |
| `STATUS` | `STATUS` | Print hierarchy tree |
| `SUMMARY` | `SUMMARY` | Print shelter occupancy |
| `EXIT` | `EXIT` | Quit |

Batch mode: pass `samples/disaster.txt` as a third argument to auto-run scripted commands.

---

## Sample Data

| File | Description |
|------|-------------|
| `samples/admin.txt` | Maharashtra hierarchy with 7 relief centers |
| `samples/graph.txt` | Road network connecting districts, zones, shelters |
| `samples/disaster.txt` | Scripted AFFECTED/EVACUATE commands for testing |

See [docs/DATA_FORMATS.md](../docs/DATA_FORMATS.md) for file syntax.

---

## Module Structure

```
engine/
├── main.cpp              Entry point (CLI + --json mode)
├── TreeModule.*          Administrative hierarchy
├── GraphModule.*         Road network + Dijkstra
├── AllocationModule.*    Evacuation planning
├── IOModule.*            File I/O, CLI, JSON protocol
├── TreeNode.*            Tree node data structure
├── Constants.h           Shared constants
├── samples/              Committed test scenarios
└── Makefile              Build automation
```

---

## Integration with ReliefRoute

The web prototype (`ReliefRoute/`) spawns this engine as a subprocess and communicates via JSON over stdin/stdout. The engine binary is built here and referenced by `ReliefRoute/backend/engine.js`.
