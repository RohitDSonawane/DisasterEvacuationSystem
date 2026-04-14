const { spawn } = require('child_process');
const path = require('path');

class ReliefRouteEngine {
    constructor() {
        this.engineProcess = null;
        this.commandQueue = [];
        this.isProcessing = false;
        
        // Paths to data files
        this.adminPath = path.join(__dirname, 'data', 'admin.txt');
        this.graphPath = path.join(__dirname, 'data', 'graph.txt');
        this.engineBinary = path.join(__dirname, 'src', 'reliefroute_engine.exe');
    }

    start() {
        console.log('Starting ReliefRoute C++ Engine...');
        this.engineProcess = spawn(this.engineBinary, [this.adminPath, this.graphPath, '--json']);

        this.engineProcess.stdout.on('data', (data) => {
            const lines = data.toString().split('\n');
            for (const line of lines) {
                if (line.trim()) {
                    this._onResponse(line.trim());
                }
            }
        });

        this.engineProcess.stderr.on('data', (data) => {
            console.error(`Engine Error: ${data}`);
        });

        this.engineProcess.on('close', (code) => {
            console.log(`Engine process exited with code ${code}. Restarting in 2s...`);
            setTimeout(() => this.start(), 2000);
        });
    }

    sendCommand(cmdObj) {
        return new Promise((resolve, reject) => {
            const cmdStr = JSON.stringify(cmdObj) + '\n';
            this.commandQueue.push({ resolve, reject, cmdStr });
            this._processQueue();
        });
    }

    _processQueue() {
        if (this.isProcessing || this.commandQueue.length === 0) return;

        this.isProcessing = true;
        const { cmdStr } = this.commandQueue[0];
        
        if (this.engineProcess && this.engineProcess.stdin.writable) {
            this.engineProcess.stdin.write(cmdStr);
        } else {
            const { reject } = this.commandQueue.shift();
            this.isProcessing = false;
            reject(new Error("Engine process not available"));
            this._processQueue();
        }
    }

    _onResponse(response) {
        if (this.commandQueue.length === 0) return;

        const { resolve } = this.commandQueue.shift();
        this.isProcessing = false;

        try {
            const json = JSON.parse(response);
            resolve(json);
        } catch (e) {
            resolve({ success: false, raw: response, error: "Invalid JSON from engine" });
        }

        this._processQueue();
    }
}

module.exports = new ReliefRouteEngine();
