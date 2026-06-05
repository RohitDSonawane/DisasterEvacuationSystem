# Algorithms & Data Structures

This document describes the computational core of the Disaster Evacuation System. The engine models evacuation as a **graph optimization problem** with **capacity constraints**.

---

## Problem Definition

Given:

- An administrative hierarchy (State → District → City → Zone)
- A road network with weighted edges
- Relief centers (shelters) with maximum capacity
- A disaster zone `Z` with `N` people requiring evacuation

**Goal:** Assign people from `Z` to reachable shelters such that:

1. Travel distance is minimized (shortest-path routing)
2. Shelter capacity is never exceeded
3. Overflow is distributed to the next-nearest available shelter

---

## Data Structures

### 1. N-ary Tree (`TreeModule`, `TreeNode`)

Represents the administrative hierarchy and shelter registry.

| Operation | Purpose |
|-----------|---------|
| Insert entity | Build hierarchy from `admin.txt` |
| Search node | Lookup zone or shelter by name |
| Aggregate population | Propagate `affectedPeople` from leaves to root |

**Why a tree?** Administrative regions are naturally hierarchical. Affected population at a zone automatically rolls up to city, district, and state totals.

### 2. Adjacency List (`GraphModule`)

Represents the road network as an undirected weighted graph.

| Operation | Complexity |
|-----------|------------|
| Add edge | O(degree) — deduplicates, keeps minimum weight |
| Neighbor lookup | O(degree) |
| Node existence check | O(1) average |

**Why adjacency list?** Road networks are sparse. Lists use less memory than adjacency matrices and allow efficient neighbor traversal during pathfinding.

---

## Core Algorithms

### Dijkstra's Shortest Path (`GraphModule::dijkstra`)

Computes shortest distances from a source zone to all reachable nodes.

```
DIJKSTRA(source):
    dist[source] ← 0, all others ← ∞
    pq ← min-heap with (0, source)

    while pq not empty:
        (d, u) ← pop minimum
        if d > dist[u]: continue    // stale entry
        for each neighbor (v, weight) of u:
            if dist[u] + weight < dist[v]:
                dist[v] ← dist[u] + weight
                parent[v] ← u
                push (dist[v], v) into pq

    return dist
```

**Time complexity:** O((V + E) log V) with a binary heap  
**Space complexity:** O(V)

Route reconstruction uses the `parentMap` via `GraphModule::getRoute`.

### Greedy Shelter Allocation (`AllocationModule::evacuate`)

After Dijkstra, shelters are sorted by distance and filled greedily.

```
EVACUATE(zone, count):
    distances ← DIJKSTRA(zone)
    shelters ← all RELIEFCENTER nodes reachable from zone
    sort shelters by distance ascending

    remaining ← count
    for each shelter in sorted order:
        available ← shelter.capacity - shelter.occupancy
        if available > 0:
            allocate ← min(remaining, available)
            record assignment with route from getRoute(shelter)
            shelter.occupancy += allocate
            remaining -= allocate
        if remaining = 0: break

    return success if remaining = 0
```

**Time complexity:** O(S log S + E log V) where S = number of shelters  
**Space complexity:** O(V + S)

---

## Design Decisions & Limitations

| Decision | Rationale | Limitation |
|----------|-----------|------------|
| Greedy allocation | Fast, deterministic, easy to explain | Not globally optimal for multi-shelter assignment |
| Static graph | Simplifies academic prototype | No dynamic road closures or traffic |
| In-memory state | Zero-latency for CLI/JSON mode | No persistence across restarts |
| Single-source Dijkstra | One disaster zone at a time | Concurrent multi-zone disasters need extension |

---

## Module Map

| Module | File(s) | Responsibility |
|--------|---------|----------------|
| `TreeModule` | `TreeModule.cpp/.h` | Hierarchy, population aggregation |
| `GraphModule` | `GraphModule.cpp/.h` | Road network, Dijkstra, route paths |
| `AllocationModule` | `AllocationModule.cpp/.h` | Evacuation planning logic |
| `IOModule` | `IOModule.cpp/.h` | File parsing, CLI, JSON protocol |

---

## Execution Modes

| Mode | Flag | Use case |
|------|------|----------|
| Interactive CLI | (default) | Terminal commands: `AFFECTED`, `EVACUATE`, `STATUS` |
| JSON stream | `--json` | ReliefRoute web prototype via stdin/stdout |

---

## References

- E. W. Dijkstra, *A Note on Two Problems in Connexion with Graphs* (1959)
- Cormen, Leiserson, Rivest, Stein — *Introduction to Algorithms* (Dijkstra, greedy strategies)
- Course concepts: N-ary trees, adjacency lists, priority queues, shortest-path algorithms
