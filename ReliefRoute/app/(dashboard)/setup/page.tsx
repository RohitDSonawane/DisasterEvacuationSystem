'use client';

import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import { useStore } from '@/lib/store';
import Cookies from 'js-cookie';

export default function DataSetupPage() {
    const { logout, setError } = useStore();
    const [adminText, setAdminText] = useState('');
    const [graphText, setGraphText] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [isLoadingData, setIsLoadingData] = useState(true);

    const loadCurrentConfig = useCallback(async () => {
        setIsLoadingData(true);
        try {
            const [adminRes, graphRes] = await Promise.all([
                api.getAdminConfig(),
                api.getGraphConfig()
            ]);
            if (adminRes.success) setAdminText(adminRes.data.content);
            if (graphRes.success) setGraphText(graphRes.data.content);
        } catch (err: any) {
            setError('Failed to load current configuration');
        } finally {
            setIsLoadingData(false);
        }
    }, [setError]);

    useEffect(() => {
        loadCurrentConfig();
    }, [loadCurrentConfig]);

    const handleReset = async () => {
        if (window.confirm('CRITICAL WARNING: This will permanently wipe all simulation data, activity logs, and reset the engine state on the server. Do you want to proceed?')) {
            setIsSaving(true);
            try {
                await api.reset();
                logout(); 
                Cookies.remove('rr_token');
                window.location.href = '/login?reset=success'; 
            } catch (err: any) {
                setError(err.message);
                setSaveStatus('error');
            } finally {
                setIsSaving(false);
            }
        }
    };

    const handleLoadTemplate = () => {
        const defaultAdmin = `# type name parentName [capacity]
ENTITY STATE Maharashtra null
ENTITY DISTRICT Mumbai Maharashtra
ENTITY DISTRICT Pune Maharashtra
ENTITY DISTRICT Thane Maharashtra
ENTITY CITY SouthMumbai Mumbai
ENTITY CITY Andheri Mumbai
ENTITY CITY PuneCity Pune
ENTITY CITY Pimpri Pune
ENTITY CITY NaviMumbai Thane
ENTITY ZONE Colaba SouthMumbai
ENTITY ZONE Worli SouthMumbai
ENTITY ZONE Juhu Andheri
ENTITY ZONE Powai Andheri
ENTITY ZONE Shivajinagar PuneCity
ENTITY ZONE Kothrud PuneCity
ENTITY ZONE Hinjewadi Pimpri
ENTITY ZONE Vashi NaviMumbai
ENTITY RELIEFCENTER Wankhede_Stadium Colaba 15000
ENTITY RELIEFCENTER BKC_Complex Worli 25000
ENTITY RELIEFCENTER Andheri_Sports_Complex Juhu 10000
ENTITY RELIEFCENTER Balewadi_Stadium Hinjewadi 30000
ENTITY RELIEFCENTER SPPU_Grounds Shivajinagar 12000
ENTITY RELIEFCENTER CIDCO_Exhibition Vashi 20000
ENTITY RELIEFCENTER Expressway_Evac_Hub Maharashtra 50000`;

        const defaultGraph = `# node1 node2 weight
ROAD Maharashtra Mumbai 100
ROAD Maharashtra Pune 100
ROAD Maharashtra Thane 100
ROAD Mumbai SouthMumbai 10
ROAD Mumbai Andheri 10
ROAD Pune PuneCity 10
ROAD Pune Pimpri 10
ROAD Thane NaviMumbai 10
ROAD SouthMumbai Colaba 5
ROAD SouthMumbai Worli 5
ROAD Andheri Juhu 5
ROAD Andheri Powai 5
ROAD PuneCity Shivajinagar 5
ROAD PuneCity Kothrud 5
ROAD Pimpri Hinjewadi 5
ROAD NaviMumbai Vashi 5
ROAD Colaba Wankhede_Stadium 1
ROAD Worli BKC_Complex 2
ROAD Juhu Andheri_Sports_Complex 2
ROAD Hinjewadi Balewadi_Stadium 3
ROAD Shivajinagar SPPU_Grounds 2
ROAD Vashi CIDCO_Exhibition 2
ROAD Maharashtra Expressway_Evac_Hub 10
ROAD Vashi Expressway_Evac_Hub 70
ROAD Hinjewadi Expressway_Evac_Hub 40
ROAD Powai Expressway_Evac_Hub 90
ROAD Colaba Worli 10
ROAD Worli Juhu 15
ROAD Juhu Powai 10
ROAD Worli Vashi 20
ROAD Powai Vashi 15
ROAD Vashi Hinjewadi 110
ROAD Hinjewadi Shivajinagar 15
ROAD Shivajinagar Kothrud 5`;

        setAdminText(defaultAdmin);
        setGraphText(defaultGraph);
    };

    const handleSync = async () => {
        setIsSaving(true);
        setSaveStatus('idle');
        try {
            const result = await api.setup({ adminData: adminText, graphData: graphText });
            if (!result.success) {
                throw new Error(result.error || 'Failed to sync configuration');
            }
            setSaveStatus('success');
            setTimeout(() => setSaveStatus('idle'), 3000);
        } catch (err: any) {
            setSaveStatus('error');
            setError(err.message);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <main className="p-8 animate-in fade-in duration-700">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-end mb-10">
                    <div>
                        <span className="font-mono text-xs uppercase tracking-[0.2em] text-primary-container font-black">System Configuration</span>
                        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tighter mt-1 uppercase">Data Setup</h1>
                        <p className="text-slate-500 font-medium max-w-2xl mt-2 leading-relaxed">
                            Configure the region hierarchy and road network. Changes made here will update the entire evacuation system.
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
                        {isSaving ? 'SAVING...' : saveStatus === 'success' ? 'SAVING COMPLETE' : 'SAVE CONFIGURATION'}
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Admin Hierarchy Input */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                        <div className="px-6 py-4 bg-slate-900 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-primary-container text-xl">layers</span>
                                <h3 className="text-[11px] font-black text-white uppercase tracking-widest">Region Hierarchy (admin.txt)</h3>
                            </div>
                            <span className="text-[10px] font-mono text-slate-500 uppercase">Input Format: ENTITY TYPE NAME PARENT [CAPACITY]</span>
                        </div>
                        <div className="p-6 flex-1 flex flex-col gap-4">
                            <div className="bg-slate-50 border-l-4 border-slate-200 p-4">
                                <p className="text-[10px] text-slate-500 font-bold uppercase leading-relaxed tracking-wider">
                                    ENTITY TYPE NAME PARENT [CAPACITY]<br/>
                                    Example: ENTITY ZONE Zone_A Pune_City
                                </p>
                            </div>
                            <textarea 
                                value={adminText}
                                onChange={(e) => setAdminText(e.target.value)}
                                placeholder="ENTITY STATE Maharashtra NULL"
                                className="flex-1 w-full min-h-[400px] p-6 bg-slate-50 border-0 ring-1 ring-slate-200 focus:ring-2 focus:ring-primary-container rounded-lg font-mono text-sm resize-none focus:bg-white transition-all"
                            />
                        </div>
                    </div>

                    {/* Road Network Input */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                        <div className="px-6 py-4 bg-slate-900 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-primary-container text-xl">hub</span>
                                <h3 className="text-[11px] font-black text-white uppercase tracking-widest">Road Network (graph.txt)</h3>
                            </div>
                            <span className="text-[10px] font-mono text-slate-500 uppercase">Input Format: ROAD SOURCE DESTINATION WEIGHT</span>
                        </div>
                        <div className="p-6 flex-1 flex flex-col gap-4">
                            <div className="bg-slate-50 border-l-4 border-slate-200 p-4">
                                <p className="text-[10px] text-slate-500 font-bold uppercase leading-relaxed tracking-wider">
                                    ROAD SOURCE DESTINATION WEIGHT<br/>
                                    Example: ROAD Zone_A Shelter_1 5
                                </p>
                            </div>
                            <textarea 
                                value={graphText}
                                onChange={(e) => setGraphText(e.target.value)}
                                placeholder="ROAD Zone_A Zone_B 3"
                                className="flex-1 w-full min-h-[400px] p-6 bg-slate-50 border-0 ring-1 ring-slate-200 focus:ring-2 focus:ring-primary-container rounded-lg font-mono text-sm resize-none focus:bg-white transition-all"
                            />
                        </div>
                    </div>
                </div>

                {/* Tactical Warning */}
                <div className="mt-8 flex flex-col md:flex-row gap-6">
                    <div className="flex-1 bg-orange-50 border border-orange-200 p-6 rounded-xl flex items-start gap-5">
                        <div className="bg-orange-600 p-2 rounded-lg shadow-lg shadow-orange-200">
                            <span className="material-symbols-outlined text-white">warning</span>
                        </div>
                        <div>
                            <h4 className="text-sm font-black text-orange-900 tracking-tight uppercase mb-1">Critical Operations Alert</h4>
                            <p className="text-xs text-orange-800 font-medium leading-relaxed max-w-lg">
                                Deploying new configuration data will reset all active evacuation paths and reset shelter occupancy to baseline settings.
                            </p>
                        </div>
                    </div>

                    <div className="bg-red-50 border border-red-200 p-6 rounded-xl flex items-center justify-between gap-5 transition-all hover:bg-red-100/50">
                        <div className="flex items-start gap-4">
                            <div className="bg-red-600 p-2 rounded-lg shadow-lg shadow-red-200">
                                <span className="material-symbols-outlined text-white text-xl">delete_forever</span>
                            </div>
                            <div>
                                <h4 className="text-sm font-black text-red-900 tracking-tight uppercase mb-1">Danger Zone</h4>
                                <p className="text-[10px] text-red-800/70 font-bold uppercase tracking-widest leading-none">Emergency System Recovery</p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button 
                                onClick={handleLoadTemplate}
                                className="px-6 py-3 bg-white border border-slate-200 text-slate-600 rounded-lg text-[10px] font-black uppercase tracking-[0.2em] hover:bg-slate-600 hover:text-white transition-all active:scale-95 shadow-sm"
                            >
                                Load Template
                            </button>
                            <button 
                                onClick={handleReset}
                                className="px-6 py-3 bg-white border border-red-200 text-red-600 rounded-lg text-[10px] font-black uppercase tracking-[0.2em] hover:bg-red-600 hover:text-white transition-all active:scale-95 shadow-sm"
                            >
                                Reset Fields
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
