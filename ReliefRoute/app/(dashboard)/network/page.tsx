'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { useStore } from '@/lib/store';

interface GraphEdge {
    u: string;
    v: string;
    weight: number;
}

interface GraphData {
    nodes: string[];
    edges: GraphEdge[];
}

export default function RoadNetworkPage() {
    const { setIsLoading } = useStore();
    const [graph, setGraph] = useState<GraphData | null>(null);
    const [selectedOrigin, setSelectedOrigin] = useState('');
    const [selectedDest, setSelectedDest] = useState('');
    const [activeRoute, setActiveRoute] = useState<string[]>([]);

    const fetchGraph = async () => {
        try {
            const data = await api.getGraph();
            if (data && data.nodes) {
                setGraph(data);
            }
        } catch (err) {
            console.error('Failed to fetch graph:', err);
        }
    };

    useEffect(() => {
        fetchGraph();
    }, []);

    // Generate stable coordinates for nodes based on their names
    const getCoords = (name: string) => {
        let hash = 0;
        for (let i = 0; i < name.length; i++) {
            hash = name.charCodeAt(i) + ((hash << 5) - hash);
        }
        const x = Math.abs(hash % 700) + 100;
        const y = Math.abs((hash >> 8) % 500) + 100;
        return { x, y };
    };

    const handleFindRoute = async () => {
        if (!selectedOrigin || !selectedDest) return;
        setIsLoading(true);
        try {
            const result = await api.evacuate(selectedOrigin, 1, selectedDest);
            if (result && result.paths && result.paths[0]) {
                setActiveRoute(result.paths[0].route);
            }
        } catch (err) {
            console.error('Route finding failed:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="flex-1 flex flex-col lg:flex-row h-[calc(100vh-64px)] overflow-hidden">
            {/* Graph Visualization Area */}
            <div className="flex-1 bg-slate-900 relative overflow-hidden flex flex-col">
                <div className="absolute top-8 left-8 z-10">
                    <h1 className="text-3xl font-black text-white uppercase tracking-tighter">Tactical Road Network</h1>
                    <div className="flex gap-2 mt-2">
                        <span className="bg-white/10 backdrop-blur-md px-3 py-1 rounded text-[10px] text-white font-mono uppercase tracking-widest border border-white/5">
                            Nodes: {graph?.nodes.length || 0}
                        </span>
                        <span className="bg-white/10 backdrop-blur-md px-3 py-1 rounded text-[10px] text-white font-mono uppercase tracking-widest border border-white/5">
                            Edges: {graph?.edges.length || 0}
                        </span>
                    </div>
                </div>

                <div className="flex-1 w-full h-full p-10 flex items-center justify-center">
                    <svg className="w-full h-full max-w-5xl max-h-[700px]" viewBox="0 0 900 700">
                        {/* Define Gradients & Markers */}
                        <defs>
                            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="15" refY="3.5" orient="auto">
                                <polygon points="0 0, 10 3.5, 0 7" fill="#ff6101" />
                            </marker>
                        </defs>

                        {/* Rendering Edges */}
                        {graph?.edges.map((edge, idx) => {
                            const p1 = getCoords(edge.u);
                            const p2 = getCoords(edge.v);
                            const isPath = activeRoute.some((node, i) => 
                                (node === edge.u && activeRoute[i+1] === edge.v) ||
                                (node === edge.v && activeRoute[i+1] === edge.u)
                            );

                            return (
                                <g key={idx}>
                                    <line 
                                        x1={p1.x} y1={p1.y} 
                                        x2={p2.x} y2={p2.y} 
                                        className={`transition-all duration-500 ${isPath ? 'stroke-primary-container stroke-[6px] opacity-100' : 'stroke-slate-700 stroke-[1px] opacity-30'}`}
                                        style={isPath ? { filter: 'drop-shadow(0 0 8px rgba(255,97,1,0.6))' } : {}}
                                    />
                                    {isPath && (
                                        <circle cx={p1.x} cy={p1.y} r="3" fill="white" className="animate-pulse" />
                                    )}
                                </g>
                            );
                        })}

                        {/* Rendering Nodes */}
                        {graph?.nodes.map((node, idx) => {
                            const { x, y } = getCoords(node);
                            const isActive = activeRoute.includes(node);
                            const isShelter = node.toLowerCase().includes('shelter') || node.toLowerCase().includes('center');

                            return (
                                <g key={idx} className="group cursor-pointer">
                                    <circle 
                                        cx={x} cy={y} r={isShelter ? 10 : 7} 
                                        className={`transition-all duration-300 ${
                                            isActive ? 'fill-primary-container scale-150' : 
                                            isShelter ? 'fill-emerald-500' : 
                                            'fill-slate-600'
                                        } group-hover:scale-125 group-hover:fill-white`}
                                    />
                                    <text 
                                        x={x} y={y - 15} 
                                        className={`text-[10px] font-black uppercase tracking-widest pointer-events-none transition-all ${
                                            isActive ? 'fill-white scale-110' : 'fill-slate-500 group-hover:fill-white'
                                        }`}
                                        textAnchor="middle"
                                    >
                                        {node}
                                    </text>
                                </g>
                            );
                        })}
                    </svg>
                </div>

                {/* Legend Overlay */}
                <div className="absolute bottom-8 left-8 flex gap-6 p-4 bg-slate-900/80 backdrop-blur-xl rounded-xl border border-white/10 shadow-2xl">
                    <div className="flex items-center gap-3">
                        <span className="w-3 h-3 rounded-full bg-slate-600 shadow-lg"></span>
                        <span className="text-[10px] text-slate-300 font-black uppercase tracking-widest">Tactical Node</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-lg"></span>
                        <span className="text-[10px] text-slate-300 font-black uppercase tracking-widest">Relief Center</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="w-8 h-1.5 bg-primary-container rounded-full shadow-[0_0_10px_rgba(255,97,1,0.5)]"></span>
                        <span className="text-[10px] text-slate-300 font-black uppercase tracking-widest">Active Corridor</span>
                    </div>
                </div>
            </div>

            {/* Path Control Side Panel */}
            <aside className="w-full lg:w-[320px] bg-white border-l border-slate-100 h-full p-8 flex flex-col gap-10">
                <section>
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6 flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm">route</span>
                        Corridor Analysis
                    </h3>
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Inception Node</label>
                            <select 
                                value={selectedOrigin}
                                onChange={(e) => setSelectedOrigin(e.target.value)}
                                className="w-full bg-slate-50 border-0 ring-1 ring-slate-200 focus:ring-2 focus:ring-primary-container rounded-lg p-3 text-sm font-bold text-slate-900 outline-none transition-all"
                            >
                                <option value="">SELECT ORIGIN</option>
                                {graph?.nodes.map(n => <option key={n} value={n}>{n}</option>)}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Target Destination</label>
                            <select 
                                value={selectedDest}
                                onChange={(e) => setSelectedDest(e.target.value)}
                                className="w-full bg-slate-50 border-0 ring-1 ring-slate-200 focus:ring-2 focus:ring-primary-container rounded-lg p-3 text-sm font-bold text-slate-900 outline-none transition-all"
                            >
                                <option value="">SELECT DESTINATION</option>
                                {graph?.nodes.map(n => <option key={n} value={n}>{n}</option>)}
                            </select>
                        </div>
                        <button 
                            onClick={handleFindRoute}
                            className="w-full py-4 rounded-xl bg-slate-900 text-white text-[11px] font-black uppercase tracking-widest shadow-xl hover:bg-primary-container transition-all active:scale-95 flex items-center justify-center gap-3"
                        >
                            <span className="material-symbols-outlined text-sm">radar</span>
                            Compute Path
                        </button>
                    </div>
                </section>

                <section className="flex-1 overflow-y-auto no-scrollbar">
                    {activeRoute.length > 0 && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6 font-mono">Telemetry: ROUTE_PATH_01</h3>
                            <div className="space-y-4 relative">
                                {activeRoute.map((node, i) => (
                                    <div key={i} className="flex flex-col">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black shadow-lg ${
                                                i === 0 ? 'bg-primary-container text-white' : 
                                                i === activeRoute.length - 1 ? 'bg-emerald-500 text-white' : 
                                                'bg-white border border-slate-200 text-slate-900'
                                            }`}>
                                                {i + 1}
                                            </div>
                                            <div>
                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">
                                                    {i === 0 ? 'START' : i === activeRoute.length - 1 ? 'OBJECTIVE' : 'WAYPOINT'}
                                                </p>
                                                <p className="text-xs font-black text-slate-900 tracking-tighter uppercase">{node}</p>
                                            </div>
                                        </div>
                                        {i < activeRoute.length - 1 && (
                                            <div className="w-[1px] h-6 bg-slate-200 ml-3 my-1 border-l border-dashed border-slate-300" />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </section>
            </aside>
        </main>
    );
}
