# Disaster Evacuation System: Core Engine (CLI)

This is the standalone **Command Line Interface (CLI)** and core algorithm engine of the Disaster Evacuation System. Written purely in C++, it delivers lightning-fast calculations to manage populations, regions, and evacuation targets.

## Features

- **Administrative Hierarchy:** Manages complex region maps (States to Zones) using efficient tree data structures.
- **Dynamic Fast Routing:** Implements optimization algorithms, such as Dijkstra's, to discover the shortest paths to safety quickly.
- **Intelligent Resource Allocation:** Operates a greedy multi-shelter assignment system. If one shelter fills up, it directly redirects people to the next best alternative perfectly automatically.
- **Interactive Console Mode:** Allows immediate querying, scenario updating, and population management straight from your terminal. 
- **JSON Capability:** Also acts as a background runner (via `IOModule`) providing JSON streams directly to the frontend web application when needed.

## Code Structure

The repository is modularized for rapid understanding and modification:

- `main.cpp`: The entry point for starting up the modules, loading data, and handing control over to the IO.
- `TreeModule` & `TreeNode`: Represent the hierarchies (e.g., District -> Zone) and aggregate population totals dynamically.
- `GraphModule`: Acts as the road network engine handling edges, weights, and pathway requests.
- `AllocationModule`: The strategy handler connecting people to shelters logically based on distances and available capacities.
- `IOModule`: Your interface loop—processes commands (`AFFECTED`, `EVACUATE`, `STATUS`, `SUMMARY`) and prints human-readable or machine-readable results.

## Setup and Usage

1. Compile the application using any standard C++ compiler (C++11 or higher is required):
   ```bash
   g++ main.cpp AllocationModule.cpp GraphModule.cpp IOModule.cpp TreeModule.cpp TreeNode.cpp -o engine.exe
   ```
2. Run the application by pointing it to your setup files:
   ```bash
   ./engine.exe admin.txt graph.txt [disaster.txt]
   ```

Inside the CLI, use straightforward commands like `AFFECTED <Zone> <Count>` or `EVACUATE <Zone> <Count>` to start managing simulated or real emergency situations efficiently.