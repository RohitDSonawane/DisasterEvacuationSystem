/**
 * ReliefRoute API Server
 * Core service for disaster evacuation coordination
 */
const express = require('express');
const cors = require('cors');
const engine = require('./engine');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const app = express();
const PORT = 8080;
const VERSION = '1.2.0-TACTICAL';
const SESSION_TTL_MS = 24 * 60 * 60 * 1000;
const sessions = new Map();
const DATA_DIR = path.join(__dirname, 'data');
const ACTIVITY_LOG_PATH = path.join(DATA_DIR, 'activity.log.json');

app.use(cors());
app.use(express.json());

// Start the C++ engine
engine.start();

function parseCookieValue(header = '') {
    return header.split(';').reduce((acc, chunk) => {
        const [key, ...value] = chunk.trim().split('=');
        if (!key) return acc;
        acc[key] = decodeURIComponent(value.join('='));
        return acc;
    }, {});
}

function getFormattedTime() {
    return new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

function loadActivityLog() {
    try {
        if (fs.existsSync(ACTIVITY_LOG_PATH)) {
            const parsed = JSON.parse(fs.readFileSync(ACTIVITY_LOG_PATH, 'utf8'));
            if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
    } catch (err) {
        console.error('Failed to load activity log:', err.message);
    }
    return [{ id: Date.now(), zone: 'INIT', task: 'System Boot Sequence', time: getFormattedTime(), status: 'Cleared', color: 'emerald' }];
}

function persistActivityLog(log) {
    fs.writeFileSync(ACTIVITY_LOG_PATH, JSON.stringify(log, null, 2));
}

let activityLog = loadActivityLog();

function addActivity(zone, task, status, color = 'primary') {
    activityLog.unshift({
        id: Date.now(),
        zone,
        task,
        time: getFormattedTime(),
        status,
        color
    });
    if (activityLog.length > 20) activityLog.pop();
    persistActivityLog(activityLog);
}

function sendSuccess(res, data, message) {
    return res.json({ success: true, data, message });
}

function sendError(res, status, error) {
    return res.status(status).json({ success: false, error });
}

function extractToken(req) {
    const authHeader = req.headers['authorization'];
    if (authHeader) {
        if (authHeader.startsWith('Bearer ')) return authHeader.slice(7);
        return authHeader;
    }

    const cookies = parseCookieValue(req.headers.cookie || '');
    return cookies.rr_token || null;
}

function validateAdminPayload(content) {
    const lines = content.split('\n').map((line) => line.trim()).filter((line) => line && !line.startsWith('#'));
    for (const line of lines) {
        const parts = line.split(/\s+/);
        if (parts.length < 4 || parts[0] !== 'ENTITY') {
            return `Malformed admin line: ${line}`;
        }
    }
    return null;
}

function validateGraphPayload(content) {
    const lines = content.split('\n').map((line) => line.trim()).filter((line) => line && !line.startsWith('#'));
    for (const line of lines) {
        const parts = line.split(/\s+/);
        if (parts.length !== 4 || parts[0] !== 'ROAD' || Number.isNaN(Number(parts[3]))) {
            return `Malformed graph line: ${line}`;
        }
    }
    return null;
}

// Auth Middleware (Basic) - BYPASSED AS REQUESTED
const validateAuth = (req, res, next) => {
    next();
};

// --- Routes ---

// Mock user for now, but easily expandable to DB
const ADMIN_USER = {
    username: process.env.ADMIN_USERNAME || 'admin',
    password: process.env.ADMIN_PASSWORD || 'admin123'
};

// Login - HARDCODED AS REQUESTED
app.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body;
    // Always succeed with mock token
    const token = 'rr_session_HARDCODED_OFFICER_STATION';
    sessions.set(token, { username: username || 'admin', issuedAt: Date.now(), expiresAt: Date.now() + SESSION_TTL_MS });
    sendSuccess(res, { token }, 'Login successful');
});

// Get Full Tree Status
app.get('/api/status', validateAuth, async (req, res) => {
    try {
        const tree = await engine.sendCommand({ cmd: "STATUS" });
        if (!tree || tree.error) {
            return sendSuccess(res, { totalAffected: 0, totalEvacuated: 0, tree: null }, 'Engine empty');
        }
        
        // Simple aggregation logic
        const calculateTotals = (node) => {
            if (!node) return { affected: 0, evacuated: 0 };
            let affected = node.type !== 'RELIEFCENTER' ? node.affectedPeople : 0;
            let evacuated = node.type === 'RELIEFCENTER' ? node.occupancy : 0;
            
            if (node.children) {
                for (const child of node.children) {
                    const childTotals = calculateTotals(child);
                    // Standard nodes (State, District, City) already have aggregated affectedPeople from engine
                    // But we want to ensure we get the root level total
                    if (node.type === 'RELIEFCENTER') evacuated += childTotals.evacuated;
                    else evacuated += childTotals.evacuated;
                }
            }
            return { affected: node.affectedPeople, evacuated };
        };

        const totals = calculateTotals(tree);

        sendSuccess(res, {
                totalAffected: tree.affectedPeople,
                totalEvacuated: totals.evacuated,
                tree: tree
        });
    } catch (err) {
        sendError(res, 500, err.message);
    }
});

// Get Shelter Summary
app.get('/api/summary', validateAuth, async (req, res) => {
    try {
        const shelters = await engine.sendCommand({ cmd: "SUMMARY" });
        sendSuccess(res, shelters);
    } catch (err) {
        sendError(res, 500, err.message);
    }
});

// Get Road Network Graph
app.get('/api/graph', validateAuth, async (req, res) => {
    try {
        const graphData = await engine.sendCommand({ cmd: "GRAPH" });
        sendSuccess(res, graphData);
    } catch (err) {
        sendError(res, 500, err.message);
    }
});


// Get Activity Log
app.get('/api/debug/paths', (req, res) => {
    res.json({
        cwd: process.cwd(),
        dirname: __dirname,
        dataDir: DATA_DIR,
        adminPath: path.join(DATA_DIR, 'admin.txt'),
        graphPath: path.join(DATA_DIR, 'graph.txt')
    });
});

app.get('/api/activity', validateAuth, (req, res) => {
    sendSuccess(res, activityLog);
});

// Update Affected People
app.post('/api/affected', validateAuth, async (req, res) => {
    const { zone, count } = req.body;
    if (!zone || typeof zone !== 'string' || Number.isNaN(Number(count)) || Number(count) < 0) {
        return sendError(res, 400, 'zone (string) and count (non-negative number) are required');
    }
    try {
        const result = await engine.sendCommand({ cmd: "AFFECTED", zone, count: Number(count) });
        if (result.success) {
            addActivity(zone, `Population Update: ${count}`, 'Updated', 'primary');
        }
        sendSuccess(res, result);
    } catch (err) {
        sendError(res, 500, err.message);
    }
});

// Run Evacuation
app.post('/api/evacuate', validateAuth, async (req, res) => {
    const { zone, count } = req.body;
    if (!zone || typeof zone !== 'string' || Number.isNaN(Number(count)) || Number(count) < 0) {
        return sendError(res, 400, 'zone (string) and count (non-negative number) are required');
    }
    try {
        const result = await engine.sendCommand({ cmd: "EVACUATE", zone, count: Number(count) });
        if (result.success) {
            addActivity(zone, `Evacuation Run: ${count}`, 'In Transit', 'primary');
        } else {
            addActivity(zone, 'Evacuation Failed', 'Error', 'red');
        }
        sendSuccess(res, result);
    } catch (err) {
        sendError(res, 500, err.message);
    }
});

// Data Setup (Overwrite files and reload)
app.post('/api/setup', validateAuth, async (req, res) => {
    const { adminData, graphData } = req.body;
    try {
        if (typeof adminData !== 'string' || typeof graphData !== 'string') {
            return sendError(res, 400, 'adminData and graphData are required');
        }

        const adminError = validateAdminPayload(adminData);
        if (adminError) {
            return sendError(res, 400, adminError);
        }
        const graphError = validateGraphPayload(graphData);
        if (graphError) {
            return sendError(res, 400, graphError);
        }

        const adminPath = path.join(DATA_DIR, 'admin.txt');
        const graphPath = path.join(DATA_DIR, 'graph.txt');
        const adminTemp = `${adminPath}.tmp`;
        const graphTemp = `${graphPath}.tmp`;

        fs.writeFileSync(adminTemp, adminData, 'utf8');
        fs.writeFileSync(graphTemp, graphData, 'utf8');
        fs.renameSync(adminTemp, adminPath);
        fs.renameSync(graphTemp, graphPath);

        await engine.restart();
        const ready = await engine.awaitReady(8000);
        if (!ready) {
            return sendError(res, 503, 'Engine restart timed out');
        }

        const healthCheck = await engine.sendCommand({ cmd: "STATUS" });
        if (!healthCheck || healthCheck.error) {
            return sendError(res, 500, 'Engine health check failed after setup');
        }

        addActivity('SETUP', 'Configuration deployed and engine reloaded', 'Cleared', 'emerald');
        sendSuccess(res, { reloaded: true }, 'System reloaded with new data configurations');
    } catch (err) {
        sendError(res, 500, err.message);
    }
});

// Get Current Config
app.get('/api/setup/admin', validateAuth, (req, res) => {
    try {
        const content = fs.readFileSync(path.join(DATA_DIR, 'admin.txt'), 'utf8');
        sendSuccess(res, { content });
    } catch (err) {
        sendError(res, 500, err.message);
    }
});

app.get('/api/setup/graph', validateAuth, (req, res) => {
    try {
        const content = fs.readFileSync(path.join(DATA_DIR, 'graph.txt'), 'utf8');
        sendSuccess(res, { content });
    } catch (err) {
        sendError(res, 500, err.message);
    }
});

app.post('/api/reset', validateAuth, async (req, res) => {
    try {
        // 1. Clear activity log
        activityLog = [{ id: Date.now(), zone: 'RESET', task: 'System Factory Reset', time: new Date().toLocaleTimeString(), status: 'Completed', color: 'red' }];
        persistActivityLog(activityLog);

        // 2. Wipe data files
        const adminPath = path.join(DATA_DIR, 'admin.txt');
        const graphPath = path.join(DATA_DIR, 'graph.txt');
        fs.writeFileSync(adminPath, '# type name parentName [capacity]\n', 'utf8');
        fs.writeFileSync(graphPath, '# node1 node2 weight\n', 'utf8');

        // 3. Restart engine
        await engine.restart();
        const ready = await engine.awaitReady(10000);
        
        if (!ready) {
            return sendError(res, 503, 'Engine restart timed out during reset');
        }

        sendSuccess(res, { reset: true }, 'System configuration, state, and activity logs have been fully wiped');
    } catch (err) {
        sendError(res, 500, err.message);
    }
});

app.post('/api/dry-run-path', validateAuth, async (req, res) => {
    try {
        const { origin, dest } = req.body;
        if (!origin || !dest) return sendError(res, 400, 'Origin and destination are required');

        const graphPath = path.join(DATA_DIR, 'graph.txt');
        const graphData = fs.readFileSync(graphPath, 'utf8').split('\n');
        
        // Build graph adj list
        const adj = {};
        for (const line of graphData) {
            const trimmed = line.trim();
            if (!trimmed || trimmed.startsWith('#')) continue;
            const parts = trimmed.split(/\s+/);
            if (parts.length >= 4 && parts[0] === 'ROAD') {
                const u = parts[1], v = parts[2], w = parseInt(parts[3], 10);
                if (!adj[u]) adj[u] = {};
                if (!adj[v]) adj[v] = {};
                adj[u][v] = w;
                adj[v][u] = w;
            } else if (parts.length === 3 && parts[0] !== 'ROAD' && parts[0] !== 'ENTITY') {
                // Fallback for old format
                const u = parts[0], v = parts[1], w = parseInt(parts[2], 10);
                if (!adj[u]) adj[u] = {};
                if (!adj[v]) adj[v] = {};
                adj[u][v] = w;
                adj[v][u] = w;
            }
        }

        // Vanilla Dijkstra
        const dist = {};
        const prev = {};
        const q = new Set();
        
        for (const node of Object.keys(adj)) {
            dist[node] = Infinity;
            prev[node] = null;
            q.add(node);
        }
        
        if (!adj[origin] || !adj[dest]) {
            return sendSuccess(res, { route: [] }, 'Origin or destination not found in graph');
        }

        dist[origin] = 0;
        
        while (q.size > 0) {
            let u = null;
            let minDist = Infinity;
            for (const node of q) {
                if (dist[node] < minDist) {
                    minDist = dist[node];
                    u = node;
                }
            }
            if (u === null || u === dest) break;
            q.delete(u);
            
            for (const neighbor in adj[u]) {
                if (q.has(neighbor)) {
                    const alt = dist[u] + adj[u][neighbor];
                    if (alt < dist[neighbor]) {
                        dist[neighbor] = alt;
                        prev[neighbor] = u;
                    }
                }
            }
        }
        
        const pathArr = [];
        let curr = dest;
        if (prev[curr] !== null || curr === origin) {
            while (curr !== null) {
                pathArr.unshift(curr);
                curr = prev[curr];
            }
        }
        
        const distance = dist[dest] === Infinity ? 0 : dist[dest];
        
        sendSuccess(res, { route: pathArr, distance });
    } catch (err) {
        sendError(res, 500, err.message);
    }
});

app.get('/api/health', validateAuth, async (req, res) => {
    try {
        const status = await engine.sendCommand({ cmd: "STATUS" });
        sendSuccess(res, { engineReady: !!status, timestamp: Date.now() });
    } catch (err) {
        sendError(res, 500, err.message);
    }
});

app.listen(PORT, () => {
    console.log(`ReliefRoute API Server v${VERSION} running on http://localhost:${PORT}`);
    console.log(`Node Environment: ${process.env.NODE_ENV || 'development'}`);
});
