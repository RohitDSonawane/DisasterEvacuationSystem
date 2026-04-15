# System Architecture: In-Depth Overview

The Disaster Evacuation System is engineered on a modern, decoupled three-tier architecture paradigm. This robust architectural design completely separates the user interface, the middleware request handler, and the high-performance computational back-end. By isolating these concerns, the computationally heavy pathfinding algorithms can run without blocking the web server or the client dashboard, providing real-time updates and seamless interactions to emergency coordinators.

---

## 1. The Presentation Tier: Next.js Web Dashboard

Located in the `ReliefRoute/` directory, the frontend is built using the latest Next.js React framework leveraging the App Router methodology.

### Core Objectives

The primary purpose of this tier is to deliver a tactical, highly visual, and strictly responsive user interface tailored for mission-critical emergency operators. Every millisecond counts, so the UI is designed to render datasets quickly without lag.

### Key Technologies

- **Next.js & React:** Provides server-side rendering where applicable and highly responsive client-side components to visualize real-time JSON datasets.
- **Tailwind CSS:** Enables rapid, consistent styling utilizing design tokens strictly created for professional, dark-mode/tactical aesthetics suitable for low-light command centers.
- **Zustand:** Provides an incredibly lightweight, boilerplate-free global state management system. It caches active disaster zones, real-time shelter statuses, and operations logs, drastically reducing unnecessary API polling.

### Data Flow

The frontend operates by polling and pushing data to the Node.js backend via secure REST API endpoints. Polling ensures that the visual representation of connectivity graphs, active disaster zones, and capacity progress bars reflect the absolute latest reality on the ground as evacuated capacities change.

---

## 2. The Middleware Tier: Node.js Express Server

Located at `ReliefRoute/backend/server.js`, this tier acts as the crucial operational bridge and orchestrator between the visual web dashboard and the C++ routing engine.

### Core Objectives

This tier must securely handle incoming HTTP requests from the React frontend, validate payloads, and perform system translations to issue commands directly to the core engine process.

### Engine Spawning & Management

Using Node.js's native `child_process` module, the Express server essentially "spawns" the compiled C++ application upon startup.

- It persistently keeps the process running in the background.
- If the core engine crashes for any unexpected reason, the middleware is responsible for logging the failure and safely terminating or restarting the subprocess.

### Protocol: Standard I/O Streams

The hallmark of this architectural design is the Inter-Process Communication (IPC) protocol.

1. **JSON Payload Formatting:** The Express server packages standardized API requests into stringified JSON.
2. **Piping:** Node.js pipes this JSON string directly into the standard input (`stdin`) of the running C++ executable.
3. **Awaiting Resolution:** Node.js asynchronously waits for the C++ engine to resolve the shortest-path algorithm and flush its standard output (`stdout`).
4. **Delivery:** The middleware parses the C++ stdout back into a JavaScript object and serves it as an HTTP response to the waiting Next.js frontend client.

---

## 3. The Core Processing Tier: C++ Core Application

Located strictly in the `src/` directory, this layer represents the algorithmic brain and heavy-lifter of the entire operation.

### Core Objectives

Maintain absolute structural integrity of the geographical map in-memory and provide lightning-fast, latency-free mathematical calculations when lives are on the line.

### Modular Architecture

The C++ software is strictly object-oriented and modularized:

- **`TreeModule.cpp/.h`**: Manages the N-ary tree representing the administrative hierarchy (State -> District -> City -> Zone). As populations update at the leaf (Zone) nodes, this module propagates and aggregates the total affected populations up the tree branches iteratively.
- **`GraphModule.cpp/.h`**: Represents the physical road network using Adjacency Lists. This structure optimizes memory footprint while ensuring that neighbor traversal during pathfinding remains as close to O(1) as mathematically possible.
- **`AllocationModule.cpp/.h`**: This is the mission-critical strategy logic. It relies on **Dijkstra's Algorithm** to calculate the absolute shortest physical paths dynamically from a declared disaster node out to all available shelter nodes. It utilizes priority queues to ensure performance stays reliable even as map complexity scales. If it detects the nearest shelter lacks sufficient capacity, it gracefully implements a greedy logic flow to slice the population and direct the overflow to the mathematically next-best alternative.
- **`IOModule.cpp/.h`**: Processes string streams and handles direct file I/O or interactive command parsing depending on the initialization mode.

### Execution Modes

- **Interactive CLI:** Functions perfectly locally natively in a terminal window, interpreting human-typed strings (like `AFFECTED Zone_A 500`).
- **JSON Stream Protocol:** When invoked with specific flags by the Node middleware, the IO module switches its parsing logic into JSON string consumption and production mode, perfectly conforming to REST expectations.
