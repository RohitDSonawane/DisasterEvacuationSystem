const { spawn } = require('child_process');
const path = require('path');

class ReliefRouteEngine {
    constructor() {
        this.engineProcess = null;
        this.commandQueue = [];
        this.isProcessing = false;
        this.isReady = false;
        this.readyResolvers = [];
        
        // Paths to data files
        this.adminPath = path.join(__dirname, 'data', 'admin.txt');
        this.graphPath = path.join(__dirname, 'data', 'graph.txt');
        this.engineBinary = path.join(__dirname, 'src', 'reliefroute_engine.exe');
    }

    start() {
        console.log('Starting ReliefRoute C++ Engine...');
        this.isReady = false;
        this.engineProcess = spawn(this.engineBinary, [this.adminPath, this.graphPath, '--json']);
        this.isReady = true;
        this._resolveReady();

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
            this.isReady = false;
            console.log(`Engine process exited with code ${code}. Restarting in 2s...`);
            setTimeout(() => this.start(), 2000);
        });
    }

    async restart() {
        this.isReady = false;
        if (this.engineProcess) {
            this.engineProcess.kill();
        }
        await this.awaitReady(5000);
    }

    awaitReady(timeoutMs = 5000) {
        if (this.isReady && this.engineProcess && !this.engineProcess.killed) {
            return Promise.resolve(true);
        }

        return new Promise((resolve) => {
            const timeout = setTimeout(() => resolve(false), timeoutMs);
            this.readyResolvers.push(() => {
                clearTimeout(timeout);
                resolve(true);
            });
        });
    }

    sendCommand(cmdObj) {
        return new Promise((resolve, reject) => {
            const cmdStr = this._serializeCommand(cmdObj);
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

    _resolveReady() {
        while (this.readyResolvers.length > 0) {
            const resolve = this.readyResolvers.shift();
            resolve();
        }
    }

    _serializeCommand(cmdObj) {
        const payload = {
            cmd: cmdObj.cmd,
            zone: cmdObj.zone,
            count: cmdObj.count
        };
        // Filter out undefined values
        const cleanPayload = Object.fromEntries(
            Object.entries(payload).filter(([_, v]) => v !== undefined)
        );
        return `${JSON.stringify(cleanPayload)}\n`;
    }
}

module.exports = new ReliefRouteEngine();
