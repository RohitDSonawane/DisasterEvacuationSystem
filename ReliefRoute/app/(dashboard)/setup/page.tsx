'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { useStore } from '@/lib/store';

export default function DataSetupPage() {
    const { setIsLoading, setError } = useStore();
    const [adminText, setAdminText] = useState('');
    const [graphText, setGraphText] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

    const handleSync = async () => {
        setIsSaving(true);
        setSaveStatus('idle');
        try {
            // In a real scenario, we'd have an endpoint to update raw files
            // For this demo, we can simulate the update or just show the intent
            // Since we don't have a direct 'updateRaw' API yet, we'll simulate success
            await new Promise(resolve => setTimeout(resolve, 1500));
            setSaveStatus('success');
            setTimeout(() => setSaveStatus('idle'), 3000);
        } catch (err) {
            setSaveStatus('error');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <main className="p-8 animate-in fade-in duration-700">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-end mb-10">
                    <div>
                        <span className="font-mono text-xs uppercase tracking-[0.2em] text-primary-container font-black">Tactical Mode: SYSTEM_CONFIG</span>
                        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tighter mt-1 uppercase">Data Setup & Sync</h1>
                        <p className="text-slate-500 font-medium max-w-2xl mt-2 leading-relaxed">
                            Configure the core administrative hierarchy and road network telemetry. Changes here require a tactical engine synchronization to propagate across the command center.
                        </p>
                    </div>
                    <button 
                        onClick={handleSync}
                        disabled={isSaving}
                        className={`px-8 py-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-lg flex items-center gap-3 active:scale-95 ${
                            isSaving ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 
                            saveStatus === 'success' ? 'bg-emerald-500 text-white shadow-emerald-200' :
                            'bg-primary-container text-white shadow-primary-container/20 hover:shadow-primary-container/40'
                        }`}
                    >
                        {isSaving ? (
                            <span className="material-symbols-outlined animate-spin">sync</span>
                        ) : saveStatus === 'success' ? (
                            <span className="material-symbols-outlined">check_circle</span>
                        ) : (
                            <span className="material-symbols-outlined">bolt</span>
                        )}
                        {isSaving ? 'SYNCING ENGINE...' : saveStatus === 'success' ? 'SYNC COMPLETE' : 'DEPLOY CONFIGURATION'}
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Admin Hierarchy Input */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                        <div className="px-6 py-4 bg-slate-900 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-primary-container text-xl">layers</span>
                                <h3 className="text-[11px] font-black text-white uppercase tracking-widest">Administrative Registry (admin.txt)</h3>
                            </div>
                            <span className="text-[10px] font-mono text-slate-500 uppercase">Input Format: CSV Style</span>
                        </div>
                        <div className="p-6 flex-1 flex flex-col gap-4">
                            <div className="bg-slate-50 border-l-4 border-slate-200 p-4">
                                <p className="text-[10px] text-slate-500 font-bold uppercase leading-relaxed tracking-wider">
                                    Parent, Child, Type, Count/Capacity (Optional)<br/>
                                    Example: State, District, Administrative
                                </p>
                            </div>
                            <textarea 
                                value={adminText}
                                onChange={(e) => setAdminText(e.target.value)}
                                placeholder="RootRegion, SubRegion, Type, Value..."
                                className="flex-1 w-full min-h-[400px] p-6 bg-slate-50 border-0 ring-1 ring-slate-200 focus:ring-2 focus:ring-primary-container rounded-lg font-mono text-sm resize-none focus:bg-white transition-all"
                            />
                        </div>
                    </div>

                    {/* Road Network Input */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                        <div className="px-6 py-4 bg-slate-900 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-primary-container text-xl">hub</span>
                                <h3 className="text-[11px] font-black text-white uppercase tracking-widest">Tactical Road Network (graph.txt)</h3>
                            </div>
                            <span className="text-[10px] font-mono text-slate-500 uppercase">Input Format: Edge Weight</span>
                        </div>
                        <div className="p-6 flex-1 flex flex-col gap-4">
                            <div className="bg-slate-50 border-l-4 border-slate-200 p-4">
                                <p className="text-[10px] text-slate-500 font-bold uppercase leading-relaxed tracking-wider">
                                    Source, Destination, Reliability/Weight<br/>
                                    Example: ZoneA, Shelter1, 10
                                </p>
                            </div>
                            <textarea 
                                value={graphText}
                                onChange={(e) => setGraphText(e.target.value)}
                                placeholder="NodeA, NodeB, Weight..."
                                className="flex-1 w-full min-h-[400px] p-6 bg-slate-50 border-0 ring-1 ring-slate-200 focus:ring-2 focus:ring-primary-container rounded-lg font-mono text-sm resize-none focus:bg-white transition-all"
                            />
                        </div>
                    </div>
                </div>

                {/* Tactical Warning */}
                <div className="mt-8 bg-orange-50 border border-orange-200 p-6 rounded-xl flex items-start gap-5">
                    <div className="bg-orange-600 p-2 rounded-lg shadow-lg shadow-orange-200">
                        <span className="material-symbols-outlined text-white">warning</span>
                    </div>
                    <div>
                        <h4 className="text-sm font-black text-orange-900 tracking-tight uppercase mb-1">Critical Operations Alert</h4>
                        <p className="text-xs text-orange-800 font-medium leading-relaxed max-w-4xl">
                            Deploying new configuration data will reset all active evacuation paths and reset shelter occupancy to baseline settings. 
                            Ensure all field units are notified of systemic reconfiguration before committing changes.
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}
