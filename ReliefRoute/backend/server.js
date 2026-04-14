const express = require('express');
const cors = require('cors');
const engine = require('./engine');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 8080;

app.use(cors());
app.use(express.json());

// Start the C++ engine
engine.start();

// Auth Middleware (Basic)
const validateAuth = (req, res, next) => {
    const token = req.headers['authorization'];
    if (token && token.startsWith('rr_session_')) {
        next();
    } else {
        res.status(401).json({ success: false, message: "Unauthorized access" });
    }
};

// --- Routes ---

// Login
app.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body;
    if (username === 'admin' && password === 'admin123') {
        const token = `rr_session_${Date.now()}`;
        res.json({ success: true, token });
    } else {
        res.status(401).json({ success: false, message: "Invalid credentials" });
    }
});

// Get Full Tree Status
app.get('/api/status', validateAuth, async (req, res) => {
    try {
        const status = await engine.sendCommand({ cmd: "STATUS" });
        res.json(status);
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Get Shelter Summary
app.get('/api/summary', validateAuth, async (req, res) => {
    try {
        const summary = await engine.sendCommand({ cmd: "SUMMARY" });
        res.json(summary);
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Get Road Network Graph
app.get('/api/graph', validateAuth, async (req, res) => {
    try {
        const graphData = await engine.sendCommand({ cmd: "GRAPH" });
        res.json(graphData);
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});


// Update Affected People
app.post('/api/affected', validateAuth, async (req, res) => {
    const { zone, count } = req.body;
    try {
        const result = await engine.sendCommand({ cmd: "AFFECTED", zone, count });
        res.json(result);
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Run Evacuation
app.post('/api/evacuate', validateAuth, async (req, res) => {
    const { zone, count } = req.body;
    try {
        const result = await engine.sendCommand({ cmd: "EVACUATE", zone, count });
        res.json(result);
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Data Setup (Overwrite files and reload)
app.post('/api/setup', validateAuth, async (req, res) => {
    const { adminData, graphData } = req.body;
    try {
        if (adminData) fs.writeFileSync(path.join(__dirname, 'data', 'admin.txt'), adminData);
        if (graphData) fs.writeFileSync(path.join(__dirname, 'data', 'graph.txt'), graphData);
        
        // Signal reload by killing the engine; start() will auto-restart with new files
        if (engine.engineProcess) {
            engine.engineProcess.kill();
        }
        
        res.json({ success: true, message: "System reloaded with new data configurations" });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`ReliefRoute API Server running on http://localhost:${PORT}`);
});
