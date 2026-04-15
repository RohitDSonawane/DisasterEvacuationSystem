# ReliefRoute: Web Dashboard

**ReliefRoute** is the visual front-end dashboard of the Disaster Evacuation System. Designed with Next.js and React, it provides an intuitive, high-precision interface for emergency management and immediate disaster response. 

## Features

- **Operations Dashboard:** A centralized control hub for tracking evacuated people, critical alerts, and active locations.
- **Real-Time Shelter Monitoring:** Visually monitor shelter occupancy and capacity in real-time, ensuring everyone finds a safe place quickly.
- **Evacuation Planning:** Select an area at risk, generate safe routes based on current road capacities, and trigger immediate evacuation plans using our advanced C++ routing engine securely running in the background.
- **Network Overview:** View connectivity graphs to understand the roads and accessibility between different zones seamlessly.

## Architecture

- **Frontend:** Built with Next.js (App Router), React, and Tailwind CSS for rapid styling and highly responsive interfaces.
- **Backend Communication:** A custom Node.js Express server (`backend/server.js`) interfaces smoothly with the centralized C++ engine. The C++ application acts as a sub-process passing real-time JSON payloads back and forth to keep your data accurate.
- **State Management:** Utilizes modern solutions like Zustand to keep your dashboard synchronized without performance drops.

## Getting Started

To get the application up and running on your local machine, you will need to start both the Node.js backend server and the Next.js frontend development server.

1. Add your project data: Ensure `admin.txt` and `graph.txt` (and conditionally `disaster.txt`) are present in the `backend/data/` folder.
2. Install the necessary Node dependencies:
   ```bash
   npm install
   ```
3. Start the custom Node.js backend server. This will also initiate the compiled C++ engine for route calculations. Open a terminal and run:
   ```bash
   node backend/server.js
   ```
4. Start the Next.js development server. Open a **new** terminal window and run:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser to launch the dashboard and begin planning.

This project was built to empower emergency teams. Explore the dashboard's features to visualize safety routes directly on screen!
