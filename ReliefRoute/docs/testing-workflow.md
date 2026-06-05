# Comprehensive Testing Workflow for ReliefRoute

This document outlines a complete, step-by-step testing workflow to systematically verify all features and pages within the ReliefRoute application. Following these procedures will validate the frontend UI, backend engine communication, logical processing, and error handling.

## Phase 1: Environment Initialization & Sanity Checks

### 1.1 Start the Application Servers

1. Open a terminal and navigate to the project root (`ReliefRoute/`).
2. Start the Backend (`Node.js` + `C++ Engine`):

   ```bash
   node backend/server.js
   ```

   **Expected Outcome:**
   - Prints `Starting ReliefRoute C++ Engine...`
   - Prints `ReliefRoute API Server running on http://localhost:8080`.
   - No crashes or syntax errors.

3. Start the Frontend (`Next.js`):
   ```bash
   npm run dev
   ```
   **Expected Outcome:**
   - Frontend starts successfully on `http://localhost:3000`.

---

## Phase 2: Public Access & Authentication Validation

### 2.1 Landing Page Verification (`app/(public)/page.tsx`)

1. Navigate to `http://localhost:3000`.
2. **Review Elements:** Ensure the hero section ("ReliefRoute", "Operational control..."), brief description, and the "Officer Login" links are visible and styled properly.
3. **Interaction:** Click on the "Officer Login" button.
4. **Expected Outcome:** Successfully routes the user to `http://localhost:3000/login`.

### 2.2 Login Flow Validation (`app/(public)/login/page.tsx`)

1. On the Login page, observe the hardcoded Admin credentials (or input `admin` for username, `admin123` for password if not auto-filled).
2. **Interaction:** Click the submit / "Sign In" button.
3. **Expected Outcome:**
   - A `rr_token` cookie is set.
   - The user is redirected to the `/dashboard` route automatically.
   - Any previous 401 Unauthorized API responses are cleanly bypassed or resolved.

_(Note: Auth bypassing was set up in previous steps. If testing strict mode, ensure accurate username/password triggers the specific token assignment in `server.js`.)_

---

## Phase 3: Setup & Data Ingestion (`app/(dashboard)/setup/page.tsx`)

Before operating on disaster workflows, the administrative tree and network graph must be loaded.

### 3.1 Reviewing Setup Page

1. Navigate to **Setup** (via Sidebar or URL `/setup`).
2. **UI Check:** Verify the presence of textareas for the Administrative Registry (`admin.txt`) and Tactical Road Network (`graph.txt`).
3. **Template Loading:**
   - Click the **"Load Template"** button.
   - **Expected Outcome:** Text areas should populate with the default mock data template structure (`ENTITY ...`, `ROAD ...`).
4. **Submitting Configuration:**
   - Click the deploy/submit button.
   - **Expected Outcome:** Success notification. The backend engine should parse the trees and output them seamlessly. The UI should reflect a "Deployment Successful" state.
5. **Reset Test:**
   - Click **"Reset Fields"**.
   - **Expected Outcome:** Text areas clear out.

---

## Phase 4: Validating Topography Visualizers

### 4.1 Hierarchy Tree Validation (`app/(dashboard)/hierarchy/page.tsx`)

1. Navigate to **Hierarchy** in the sidebar.
2. **Expected Behavior:**
   - A full visual breakdown of the populated zones, districts, and municipalities based on the `admin.txt` data inputted in Phase 3.
   - Nodes should correctly show capacities (if applicable) and connections.
   - The interface should handle empty states properly if no data was submitted.

### 4.2 Network Validation (`app/(dashboard)/network/page.tsx`)

1. Navigate to **Network** in the sidebar.
2. **Expected Behavior:**
   - A node-edge graph visualization of the `graph.txt` tactical road networks routes.
   - Source nodes, destination nodes, and weights (route distances/costs) should map accurately to the submitted text configuration.

---

## Phase 5: Evacuation Planning & Simulation (`app/(dashboard)/planner/page.tsx`)

This is the primary tactical tool utilizing the C++ Allocation Module.

### 5.1 Simulating Disasters

1. Navigate to the **Evacuation Planner** (`/planner`).
2. Input a Disaster Payload.
   - Structure follows typical alerts (e.g., specifying affected zones and the number of affected individuals).
3. **Interaction:** Execute the Simulation / Upload disaster configuration.
4. **Expected Outcome:**
   - The frontend triggers an API post to the `/api/evacuate` or similar allocation endpoints.
   - The C++ backend engine runs the Dijkstra/graph algorithm.
   - The frontend successfully displays the generated evacuation paths and times.
5. **UI Check:** The planner page should display the step-by-step route allocation visually.

---

## Phase 6: Monitoring & Overview Metrics

### 6.1 Shelter Monitoring (`app/(dashboard)/shelters/page.tsx`)

1. Navigate to the **Shelters** page.
2. **Review Top-level Metrics:**
   - "Total Capacity", "Available Space", "Critical Alerts" should properly reflect the current engine state.
3. **Review Individual Shelter Cards:**
   - Occupancy rates must render visually (progress bars).
   - Expected color-coding: `Emerald` (healthy), `Orange` (critical >= 90%), `Red` (Full).
4. **Live Polling:** Observe the page for 10 seconds. The "LAST SYNC" timestamp should automatically update every 5 seconds.

### 6.2 Main Dashboard Summary (`app/(dashboard)/dashboard/page.tsx`)

1. Navigate to the root **Dashboard** (`/dashboard`).
2. **Data Aggregation:** The main dashboard aggregates global metrics. Ensure `Total Affected` and `Total Evacuated` counts correctly match up with the sums calculated through the simulation step.
3. **Activity Logs:** Active debugging logs or recent actions should display in the Activity Feed panel (if tracking actions).

---

## Phase 7: Edge Cases & Error Handling

To guarantee system stability in crisis mode, forcefully trigger the following exceptions:

1. **Malformed Admin Data:**
   - Go to Setup -> Input invalid `admin.txt` data (e.g., missing entity types or parents).
   - **Expected Outcome:** The API refuses the payload; frontend displays an explicit validation error stating "Malformed admin line".
2. **Malformed Graph Data:**
   - Go to Setup -> Input strings instead of numbers for road weights.
   - **Expected Outcome:** Validation drops the graph payload; error pop-up is shown.
3. **Backend Disconnection:**
   - Stop `node backend/server.js`.
   - Refresh the Shelter monitoring page.
   - **Expected Outcome:** The UI must gracefully catch the connection error (`fetch failed` or `500 Server Error`) and display appropriate error banners in the UI instead of throwing white-screen exceptions.

---

### End of Testing Sequence📋
