# Disaster Evacuation System

A robust C++ application designed to manage regional hierarchies, road networks, and optimize the evacuation of affected populations to nearby relief centers during disasters.

## 🚀 Features

- **Administrative Hierarchy**: Manages complex regional structures (States -> Districts -> Cities -> Zones) using a tree data structure.
- **Shortest Path Analysis**: Implements **Dijkstra's Algorithm** to find the most efficient routes from affected zones to relief centers.
- **Multi-Shelter Allocation**: Automatically splits populations across multiple shelters if the closest one is at capacity.
- **Interactive CLI**: Real-time management of disaster scenarios with commands for updating populations and triggering evacuations.
- **Dynamic Status Tracking**: Live monitoring of relief center occupancy rates with status indicators (`OK`, `CRITICAL`, `FULL`).

---

## 🏗️ Architecture

The system is built on a modular C++ architecture:

- **TreeModule**: Manages the administrative tree and handles population aggregation.
- **GraphModule**: Handles the road network adjacency list and shortest-path calculations.
- **AllocationModule**: core logic for greedy multi-shelter assignment based on distance and remaining capacity.
- **IOModule**: Handles file parsing and the interactive user interface.

---

## 📁 Data Format

The system uses space-separated text files for initialization:

### `admin.txt`
Defines the regional hierarchy and relief centers.
`ENTITY <TYPE> <NAME> <PARENT_NAME> [CAPACITY]`

### `graph.txt`
Defines road connections (Edges) between nodes.
`ROAD <NODE1> <NODE2> <DISTANCE>`

### `disaster.txt` (Optional)
Pre-loads disaster data.
`AFFECTED <ZONE_NAME> <COUNT>`
`EVACUATE <ZONE_NAME> <COUNT>`

---

## 🛠️ Compilation

Use any standard C++ compiler (C++11 or later):

```powershell
g++ src/main.cpp src/AllocationModule.cpp src/GraphModule.cpp src/IOModule.cpp src/TreeModule.cpp src/TreeNode.cpp -o program.exe
```

---

## 💻 Usage

Run the program from the `src` directory or provide paths to the files:

```powershell
cd src
.\program.exe admin.txt graph.txt [disaster.txt]
```

### Interactive Commands

Once in the system, you can use the following commands:

- `AFFECTED <Zone> <Count>`: Update the number of people affected in a specific zone.
- `EVACUATE <Zone> <Count>`: Assign the population to the closest available shelter(s).
- `STATUS`: View the entire administrative hierarchy and total affected counts.
- `SUMMARY`: View relief center status, occupancy, and remaining capacity.
- `EXIT`: Terminate the program.

---

## 📝 Example Output

```text
--- Evacuation Plan for Zone_A (700 people) ---
 Assignment [1]:
  Shelter  : Shelter_1 (Allocated: 500)
  Distance : 5 km
  Route    : Zone_A -> Shelter_1
 Assignment [2]:
  Shelter  : Shelter_2 (Allocated: 200)
  Distance : 7 km
  Route    : Zone_A -> Zone_B -> Shelter_2
--------------------------------------------------------
```
