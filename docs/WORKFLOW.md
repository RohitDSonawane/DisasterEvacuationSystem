# Comprehensive Operational Workflow

This document offers an exhaustive walkthrough of the operational lifecycle during a disaster simulation inside the Disaster Evacuation System. It is critical for emergency management coordinators, system administrators, and software maintainers to understand exactly how data transforms from static files into life-saving evacuation routes.

---

## Phase 1: Pre-Disaster Preparedness & Initialization

Before any emergency can be effectively handled, the engine requires a rigidly defined understanding of the geographic and administrative reality.

### 1. Ingesting Administrative Trees (`admin.txt`)

- The system must first parse the administrative hierarchy. This defines exactly what cities belong to which districts, and what zones exist under those cities.
- The system inherently links these structures via a custom N-ary Tree data structure in C++.
- Following the regional breakdown, it logs all safe-haven relief shelters, assigning them strict maximum occupancy limits.

### 2. Mapping the Geometric Graph (`graph.txt`)

- Real-world road structures do not always match administrative bounds. The system builds an Adjacency List graph representing exact road distances and connectivities between zones and shelters.
- The C++ `GraphModule` ensures that no isolated, disconnected nodes exist that would prevent mathematical routing.

### 3. Dashboard Synchronization

- In a web context, once the backend server spins up the C++ subroutine, it immediately polls an initial `STATUS` check.
- The frontend (ReliefRoute Dashboard) populates drop-downs and selection menus strictly matching the parsed tree to prevent users from requesting data for mathematically non-existent locations.

---

## Phase 2: Active Disaster Detection & Logging

When a real-world incident occurs (a flash flood, an earthquake, or an active threat report), operators must declare the impacted populations.

### 1. Operator Input

- A tactical commander logs into the ReliefRoute dashboard. Using the **Operations Plan** panel, they select the specific impacted zone.
- They estimate and enter the exact number of individuals actively requiring extraction (e.g., `AFFECTED Downtown_Zone 4800`).

### 2. Algorithmic Population Aggregation

- The moment this command hits the engine, the C++ `TreeModule` updates the leaf node.
- It immediately iterates recursively upward from the affected Zone to the City, up to the District, and up to the root State level.
- This creates instant, top-level dashboard metrics allowing regional commanders to observe cumulative impact across massive geographical spreads instantly.

---

## Phase 3: Triggering Evacuation Protocols

This phase represents the core utility of standard Dijkstra pathfinding.

### 1. The Trigger

- The web operator clicks "Commence Evacuation". The Express server generates an HTTP POST request pushing `EVACUATE Downtown_Zone 4800` into the C++ `AllocationModule`.

### 2. Shortest-Path Determination

- The C++ engine executes Dijkstra's shortest-path logic. It mathematically scopes out from the disaster node traversing through all contiguous road network edges.
- It creates a sorted list of all active shelters across the entire graph, ordered precisely by geometric distance metrics.

### 3. The Greedy Multi-Objective Allocation

- The algorithm evaluates the nearest Shelter (e.g., `Shelter_Alpha`).
- **If the shelter can fit everyone:** The entire 4800-person group is routed in a single pass.
- **If the shelter is too small (Overflow Scenario):** The system implements a deterministic greedy slice. If `Shelter_Alpha` only holds 3000 people, the system assigns exactly 3000 to `Shelter_Alpha`.
- The system then deducts 3000, leaving a remaining population of 1800.
- It immediately selects the _next_ closest valid shelter on its sorted priority matrix, continuing this exact sequence until the remaining population reaches absolute zero.

### 4. Route Publication

- An array of distinct allocation directives, detailing exactly how many people should take which precise roads step-by-step, is JSON-stringified and passed back to the Node server, reflecting instantly on the operator's dashboard.

---

## Phase 4: Dynamic Capacity Monitoring

During the chaotic progression of the physical evacuation, maintaining shelter status mathematically prevents fatal overcrowding errors.

### 1. Live Deductions

- The system strictly guards shelter integer values in memory. As the allocations from Phase 3 arrive, global remaining capacities plummet across the graph network mapping.

### 2. The 90% Threshold (CRITICAL Status)

- To prevent disastrous false-positive routing where a shelter reaches physical capacity right as evacuees arrive, the system calculates visual warning thresholds.
- The web dashboard queries shelter statistics precisely every few seconds.
- When an individual shelter payload records an occupancy factor crossing the `90%` threshold (`Occupancy / Capacity >= 0.90`), the frontend styling shifts aggressively to warning models (red highlights, flashing UI elements). It strictly displays `CRITICAL` tags against that shelter.
- An absolute `100%` saturation marks the node as `FULL`, causing the algorithmic pathfinder to definitively sever its availability in future iterations.
