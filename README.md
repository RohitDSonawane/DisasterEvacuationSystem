# Disaster Evacuation System

Welcome to the **Disaster Evacuation System** repository! This project provides a complete suite of tools to manage emergency evacuations, regional hierarchies, and road networks during disaster scenarios.

This repository contains two main components to meet different needs:

1. **ReliefRoute (The Web Application):** A modern, interactive dashboard for visual and real-time crisis management.
2. **The C++ Engine (The Command Line Tool):** A blazing-fast, robust backend that handles the heavy lifting of calculating shortest paths and managing shelter allocations.

## What's Inside?

### 1. ReliefRoute - Web Dashboard

Located in the `ReliefRoute/` folder, this is a fully-featured Next.js web application. It provides a visual interface for tactical responders to plan routes, monitor shelter capacities, and track ongoing evacuations in real time. It uses the C++ Engine under the hood for highly optimized route calculations.
[Read the Web App Documentation](./ReliefRoute/README.md)

### 2. Core C++ Engine - Command Line Interface

Located in the `src/` folder, this is the core algorithm engine. It manages complex regional structures using tree data structures and calculates the most efficient evacuation routes using Dijkstra's Algorithm. It seamlessly handles multi-shelter allocations and can be run independently as an interactive CLI application.
[Read the CLI Documentation](./src/README.md)

## Getting Started

Depending on your preference, you can choose to run the highly interactive Web Dashboard or the lightning-fast Command Line script.

- **To start the visual dashboard:** Head over to the `ReliefRoute` folder and follow the setup instructions there.
- **To dive straight into the code or terminal:** Navigate to the `src` folder for the standalone CLI tool logic.

## Documentation

To help you understand the architecture, operation, and data requirements of this project, we have provided the following detailed guides:

- [System Architecture](./ARCHITECTURE.md): Explains the high-level decoupled design, detailing how the Next.js frontend, Node.js backend, and C++ engine interact.
- [Operational Workflow](./WORKFLOW.md): Outlines the lifecycle of a disaster event in the system, from map setup to executing an evacuation.
- [Data Formats Guide](./DATA_FORMATS.md): An in-depth syntax guide for the text files (`admin.txt`, `graph.txt`, `disaster.txt`) used to build custom scenarios.

We built this system aiming to save lives through smart, data-driven planning and rapid rescue coordination. Feel free to explore the modules to adapt them to your specific crisis management requirements.
