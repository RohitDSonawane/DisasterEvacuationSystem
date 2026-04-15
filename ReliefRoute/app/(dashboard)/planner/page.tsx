'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { useStore } from '@/lib/store';
import { EvacuationResult } from '@/lib/types';

export default function EvacuationPlanner() {
    const { setIsLoading, setError } = useStore();
    const [zones, setZones] = useState<string[]>([]);
    const [selectedZone, setSelectedZone] = useState('');
    const [headcount, setHeadcount] = useState<number>(100);
    const [plan, setPlan] = useState<EvacuationResult | null>(null);

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const statusRes = await api.getStatus();
                if (statusRes.success && statusRes.data?.tree) {
                    // Extract flat list of nodes from tree
                    const allNodes: string[] = [];
                    const traverse = (node: any) => {
                        allNodes.push(node.name);
                        node.children?.forEach(traverse);
                    };
                    traverse(statusRes.data.tree);
                    setZones(allNodes);
                }
            } catch (err) {
                console.error('Failed to fetch zones:', err);
            }
        };
        fetchInitialData();
    }, []);

    const handleExecute = async () => {
        if (!selectedZone) {
            setError('Please select a source zone');
            return;
        }
        setIsLoading(true);
        setPlan(null);
        try {
            const res = await api.evacuate({ zone: selectedZone, count: headcount });
            if (res.success && res.data) {
                setPlan(res.data);
            } else {
                throw new Error(res.error || 'Evacuation execution failed');
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="p-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="max-w-[1400px] mx-auto">
                <div className="mb-10">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-primary-container/10 rounded-full flex items-center justify-center">
                            <span className="material-symbols-outlined text-3xl text-primary-container">crisis_alert</span>
                        </div>
                        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Evacuation Planner</h1>
                    </div>
                    <p className="text-slate-500 max-w-2xl leading-relaxed font-medium ml-[60px]">
                        Plan and execute safe evacuation routes. Choose a source zone and the number of people to efficiently route them to the nearest available shelters.
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left Column: Controls (40%) */}
                    <div className="w-full lg:w-[40%] space-y-6">
                        {/* Configure Evacuation Card */}
                        <section className="bg-white rounded-xl p-8 shadow-sm border border-slate-200/50 border-l-4 border-l-primary-container">
                            <div className="flex items-center gap-3 mb-8">
                                <span className="material-symbols-outlined text-primary-container">settings_input_component</span>
                                <h3 className="text-xs font-black uppercase tracking-[0.15em] text-slate-800">Configure Evacuation</h3>
                            </div>
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-2">Source Zone</label>
                                    <select 
                                        className="w-full bg-slate-50 border border-slate-100 rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary-container outline-none transition-all font-mono"
                                        value={selectedZone}
                                        onChange={(e) => setSelectedZone(e.target.value)}
                                    >
                                        <option value="">Select Zone Hierarchy...</option>
                                        {zones.map(z => (
                                            <option key={z} value={z}>{z}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-2">Number of People</label>
                                    <div className="relative">
                                        <input 
                                            className="w-full bg-slate-50 border border-slate-100 rounded-lg p-3 pl-10 text-sm focus:ring-2 focus:ring-primary-container outline-none transition-all font-mono" 
                                            placeholder="Enter headcount" 
                                            type="number"
                                            value={headcount}
                                            onChange={(e) => setHeadcount(parseInt(e.target.value))}
                                        />
                                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">groups</span>
                                    </div>
                                </div>
                                <button 
                                    onClick={handleExecute}
                                    className="w-full bg-gradient-to-br from-primary-container to-primary text-white rounded-full py-4 text-xs font-black uppercase tracking-[0.2em] shadow-lg hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                                >
                                    Execute Evacuation
                                    <span className="material-symbols-outlined text-base">warning</span>
                                </button>
                            </div>
                        </section>

                        <section className="bg-slate-900 rounded-xl p-8 text-white shadow-xl relative overflow-hidden group">
                            <div className="absolute inset-0 opacity-10 hero-mesh transition-transform duration-1000 group-hover:scale-110"></div>
                            
                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-8 h-8 rounded-full bg-primary-container/20 flex items-center justify-center">
                                        <span className="material-symbols-outlined text-primary-container text-sm">memory</span>
                                    </div>
                                    <h3 className="text-xs font-black uppercase tracking-[0.15em] text-slate-300">System Configuration</h3>
                                </div>
                                
                                <div className="space-y-4 font-mono">
                                    <div className="flex justify-between items-center bg-black/40 p-3 rounded-lg border border-white/5">
                                        <span className="text-[10px] text-slate-500 uppercase tracking-widest">Routing Method</span>
                                        <span className="text-xs font-bold text-emerald-400">Optimized Routing</span>
                                    </div>
                                    <div className="flex justify-between items-center bg-black/40 p-3 rounded-lg border border-white/5">
                                        <span className="text-[10px] text-slate-500 uppercase tracking-widest">Coverage</span>
                                        <span className="text-xs font-bold text-emerald-400">Regional</span>
                                    </div>
                                    <div className="flex justify-between items-center bg-black/40 p-3 rounded-lg border border-white/5">
                                        <span className="text-[10px] text-slate-500 uppercase tracking-widest">Routing Fallback</span>
                                        <span className="text-[10px] font-black tracking-widest bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded">ACTIVE</span>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Right Column: Results (60%) */}
                    <div className="w-full lg:w-[60%] flex flex-col">
                        <div className="bg-white rounded-xl flex-1 flex flex-col overflow-hidden relative border border-slate-200 shadow-sm min-h-[600px]">
                            {plan ? (
                                <>
                                    <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                                        <div className="flex items-center gap-4">
                                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-800">Evacuation Plan Result</h3>
                                            <div className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                                                <span className="material-symbols-outlined text-[12px] filled-icon">check_circle</span>
                                                Success
                                            </div>
                                        </div>
                                        <div className="text-[10px] font-mono font-bold text-slate-400">ID: RR-EVAC-{Date.now().toString().slice(-6)}</div>
                                    </div>
                                    
                                    <div className="p-8 space-y-4 overflow-y-auto no-scrollbar">
                                        {plan.assignments.map((asgn, i) => (
                                            <div key={i} className="group flex items-start gap-6 bg-white p-6 rounded-xl transition-all hover:shadow-md border border-slate-100 border-l-4 border-l-transparent hover:border-l-primary-container">
                                                <div className="w-10 h-10 flex-shrink-0 bg-primary-container/10 rounded-lg flex items-center justify-center">
                                                    <span className="font-mono text-primary-container font-black text-lg">{i + 1}</span>
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <h4 className="font-bold text-lg text-slate-900 uppercase tracking-tight">{asgn.shelterName}</h4>
                                                        <span className="px-3 py-1 bg-primary/5 text-[10px] font-mono text-primary font-black uppercase rounded">Allocated: {asgn.peopleAllocated}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-on-surface-variant font-mono text-[10px] mb-4">
                                                        <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600 font-bold uppercase">{selectedZone}</span>
                                                        <span className="material-symbols-outlined text-[14px]">trending_flat</span>
                                                        <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600 font-bold uppercase">{asgn.shelterName}</span>
                                                        <span className="ml-2 text-slate-400">[{asgn.distance} KM]</span>
                                                    </div>
                                                    <div className="p-4 bg-slate-900 rounded-lg font-mono text-[11px] text-emerald-400 leading-relaxed overflow-x-auto shadow-inner">
                                                        <span className="text-slate-500 mr-2 uppercase text-[9px]">Calculated Route:</span> 
                                                        <div className="mt-1">{asgn.route.join(' → ')}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}

                                        {plan.errorMessage && (
                                            <div className="p-4 bg-red-50 border border-red-100 rounded-lg text-red-600 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                                                <span className="material-symbols-outlined">warning</span>
                                                {plan.errorMessage}
                                            </div>
                                        )}
                                    </div>
                                </>
                            ) : (
                                <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center bg-white z-10 hero-mesh">
                                    <div className="w-24 h-24 mb-6 rounded-full bg-slate-50 flex items-center justify-center">
                                        <span className="material-symbols-outlined text-5xl text-slate-200">route</span>
                                    </div>
                                    <h4 className="text-xl font-bold mb-2 text-slate-800 uppercase tracking-tighter">No Active Evacuation Plan</h4>
                                    <p className="text-on-surface-variant max-w-sm text-sm font-medium">
                                        Configure the source zone and headcount on the left to generate a high-precision evacuation route.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
