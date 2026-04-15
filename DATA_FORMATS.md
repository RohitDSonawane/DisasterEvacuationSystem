# Deep-Dive: Data Formatting and Syntax Guide

Because the core routing engine operates at maximum speeds using optimized C++ memory representations, it assumes pristine data sets at compile and execution times. A single malformed edge could break the connectivity algorithms computationally.

This guide serves to exhaustively outline the string-matching criteria required by the internal parsers, enabling engineers to confidently generate customized testing beds, massive metropolitan maps, and complex hierarchy rules freely.

---

## 1. Administrative Hierarchy Constraints (`admin.txt`)

This file constructs the topological N-ary administrative tree structure and mathematically registers all relief shelter instances and capacities within memory.

### Mandatory Rules

1. **The Root Identifier:** The absolute first record provided must specify the tree's logical root. The root node mathematically requires its parent to explicitly be defined by the literal string `ROOT`.
2. **Whitespace Constraint:** Node identifiers (names) cannot include natural spaces. Underscores `_` are highly recommended for naming standards (e.g., `San_Francisco`).
3. **Hierarchy Validation:** A child entity must correctly name a parent entity _that has already been declared_ higher up in the file structure.

### Standardized Syntax

```text
ENTITY <CATEGORICAL_TYPE> <UNIQUE_NAME> <VALID_PARENT_NAME> [CAPACITY_REQUIRED_FOR_SHELTERS]
```

### Extensive Example Configuration

```text
ENTITY State Maryland ROOT
ENTITY District Central_District Maryland
ENTITY City Baltimore Central_District
ENTITY Zone Harbor_Sector Baltimore
ENTITY Zone Financial_District Baltimore

ENTITY District Eastern_District Maryland
ENTITY City Annapolis Eastern_District
ENTITY Zone Dock_Area Annapolis

ENTITY Shelter SafeHaven_Alpha Harbor_Sector 3500
ENTITY Shelter SafeHaven_Beta Financial_District 5000
ENTITY Shelter Annapolis_High_School Dock_Area 1500
```

_Note: Once parsed, aggregating 100 people structurally against `Harbor_Sector` implies that those 100 people mathematically count upwards towards `Baltimore`, `Central_District`, and `Maryland` totals instantaneously._

---

## 2. Geometric Network Construction (`graph.txt`)

While the previous file dictates regional administration, pathfinding relies purely on physical geometric travel properties. The `GraphModule` creates an Adjacency List to map traversable distances.

### Mandatory Rules

1. **Node Validation:** Every location referenced (either as `NODE1` or `NODE2`) must accurately match a `UNIQUE_NAME` established accurately inside `admin.txt`. If you declare a road for a zone but mistype the name, the system drops the connection gracefully but logs an IO mismatch error.
2. **Bidirectional Assumption:** The C++ graphs create automatic mirror edges. Declaring a road from A to B mathematically creates an identical capacity path backwards from B to A. Do not duplicate statements physically.
3. **Weight Formatting:** Distances must remain positive integers natively representing miles, kilometers, or purely arbitrary heuristic impedance logic.

### Standardized Syntax

```text
ROAD <VALID_NODE_1> <VALID_NODE_2> <ABSOLUTE_WEIGHT>
```

### Extensive Example Configuration

```text
ROAD Harbor_Sector Financial_District 5
ROAD Financial_District SafeHaven_Beta 1
ROAD Harbor_Sector SafeHaven_Alpha 2
ROAD Financial_District Annapolis_High_School 45
```

_Note: Dijkstra's path calculation traverses these geometric edges aggressively to evaluate combinations. Ensure your graph does not inadvertently leave structural "islands" entirely disconnected from the main grid._

---

## 3. Automated Disaster States (`disaster.txt`) (Conditionally Optional)

To facilitate automated CI/CD load testing or dry-runs without the UI backend, the internal system enables pre-loaded macro processing.

When loaded locally inside standard C++ execution via the fourth command-line parameter, the system rapidly iterates standard input behaviors consecutively without blocking runtime logic loops.

### Standardized Syntax

```text
AFFECTED <VALID_ZONE> <POPULATION_INTEGER>
EVACUATE <VALID_ZONE> <POPULATION_INTEGER>
```

### Extensive Example Configuration

```text
AFFECTED Harbor_Sector 2200
AFFECTED Financial_District 8000
EVACUATE Harbor_Sector 2200
AFFECTED Harbor_Sector 500
```

_By loading this exact file simultaneously at runtime, operators can confirm mathematically what behavior occurs given extreme edge cases effortlessly._
