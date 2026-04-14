'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { SystemStatus, ShelterSummary } from '@/lib/types';
import { useStore } from '@/lib/store';

export default function OperationsDashboard() {
    const { setIsLoading, setError } = useStore();
    const [status, setStatus] = useState<SystemStatus | null>(null);
    const [shelters, setShelters] = useState<ShelterSummary[]>([]);
    
    const fetchData = async () => {
        try {
            const [statusRes, summaryRes] = await Promise.all([
                api.getStatus(),
                api.getSummary()
            ]);
            
            if (statusRes.success) setStatus(statusRes.status);
            if (summaryRes.success) setShelters(summaryRes.shelters);
        } catch (err: any) {
            console.error('Failed to fetch dashboard data:', err);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 5000); // Poll every 5s
        return () => clearInterval(interval);
    }, []);

    const runEvacuation = async () => {
        setIsLoading(true);
        try {
            const res = await api.evacuate();
            if (res.success) {
                // Refresh data
                fetchData();
            } else {
                throw new Error(res.error || 'Evacuation failed');
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-8 space-y-8 animate-in fade-in duration-700">
            {/* Row 1: Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard 
                    label="Total Affected" 
                    value={status?.totalAffected?.toLocaleString() || '0'} 
                    trend="+12%" 
                    icon="group"
                />
                <StatCard 
                    label="Total Evacuated" 
                    value={status?.totalEvacuated?.toLocaleString() || '0'} 
                    trend={`${Math.round(((status?.totalEvacuated || 0) / (status?.totalAffected || 1)) * 100)}%`}
                    icon="directions_run"
                    primary
                />
                <StatCard 
                    label="Shelters Available" 
                    value={shelters.filter(s => s.currentCapacity < s.maxCapacity).length.toString()} 
                    status="ONLINE"
                    icon="home_work"
                    accentColor="emerald"
                />
                <StatCard 
                    label="Shelters Critical" 
                    value={shelters.filter(s => (s.currentCapacity / s.maxCapacity) > 0.9).length.toString()} 
                    status="CAPACITY REACHED"
                    icon="warning"
                    accentColor="red"
                    critical={shelters.some(s => (s.currentCapacity / s.maxCapacity) > 0.9)}
                />
            </div>

            {/* Row 2: Content Grid */}
            <div className="grid grid-cols-12 gap-8">
                {/* Recent Activity (60%) */}
                <div className="col-span-12 lg:col-span-7 bg-white rounded-lg shadow-sm border border-slate-200/50 overflow-hidden">
                    <div className="px-6 py-5 flex justify-between items-center border-b border-slate-100">
                        <h2 className="text-sm font-black uppercase tracking-widest text-slate-800">Recent Evacuation Activity</h2>
                        <span className="material-symbols-outlined text-slate-400 text-sm">history</span>
                    </div>
                    <div className="p-6">
                        <div className="space-y-4">
                            <ActivityItem 
                                zone="ZONE-DELTA-4" 
                                task="Route Alpha Verification" 
                                time="14:02:45" 
                                status="In Transit"
                                color="primary" 
                            />
                            <ActivityItem 
                                zone="ZONE-SIERRA-9" 
                                task="Secondary Sweep Complete" 
                                time="13:58:12" 
                                status="Cleared"
                                color="emerald" 
                            />
                            <ActivityItem 
                                zone="ZONE-WHISKEY-2" 
                                task="Hazard Barrier Breached" 
                                time="13:45:00" 
                                status="Emergency"
                                color="red" 
                            />
                        </div>
                    </div>
                </div>

                {/* Shelter Occupancy (40%) */}
                <div className="col-span-12 lg:col-span-5 bg-white rounded-lg shadow-sm border border-slate-200/50 overflow-hidden">
                    <div className="px-6 py-5 border-b border-slate-100">
                        <h2 className="text-sm font-black uppercase tracking-widest text-slate-800">Shelter Occupancy</h2>
                    </div>
                    <div className="p-6 space-y-6">
                        {shelters.length > 0 ? shelters.map((shelter, i) => (
                            <OccupancyRow 
                                key={shelter.id}
                                name={shelter.name}
                                percentage={Math.round((shelter.currentCapacity / shelter.maxCapacity) * 100)}
                            />
                        )) : (
                            <div className="text-slate-400 text-xs font-mono uppercase text-center py-10">
                                No shelter data available
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Row 3: Quick Action Bar */}
            <div className="bg-[#201F22] rounded-xl p-6 flex flex-wrap items-center justify-between gap-6 shadow-2xl relative overflow-hidden group">
                <div className="absolute inset-0 opacity-5 pointer-events-none hero-mesh"></div>
                <div className="flex items-center gap-4 relative z-10">
                    <div className="w-12 h-12 rounded bg-white/10 flex items-center justify-center">
                        <span className="material-symbols-outlined text-white" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
                    </div>
                    <div>
                        <h3 className="text-white font-bold text-sm tracking-tight">Tactical Quick Actions</h3>
                        <p className="text-slate-400 text-xs uppercase tracking-widest font-semibold mt-0.5">Priority Protocol Override</p>
                    </div>
                </div>
                <div className="flex gap-4 relative z-10">
                    <button className="px-6 py-3 rounded-full border border-slate-700 text-white text-xs font-black uppercase tracking-widest hover:bg-white/5 transition-all active:scale-95">
                        Mark Affected Zone
                    </button>
                    <button 
                        onClick={runEvacuation}
                        className="px-6 py-3 rounded-full tactical-gradient text-white text-xs font-black uppercase tracking-widest hover:opacity-90 transition-all active:scale-95 shadow-lg shadow-primary/20"
                    >
                        Run Evacuation
                    </button>
                    <button className="px-6 py-3 rounded-full border border-slate-700 text-white text-xs font-black uppercase tracking-widest hover:bg-white/5 transition-all active:scale-95">
                        View Road Network
                    </button>
                </div>
            </div>

            {/* Bottom Map Peek */}
            <div className="relative h-[300px] bg-slate-900 rounded-lg overflow-hidden group border border-slate-800">
                <img 
                    className="w-full h-full object-cover opacity-60 grayscale group-hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-100" 
                    src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=2000" 
                    alt="Tactical Map"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
                <div className="absolute bottom-6 left-6 flex items-center gap-4">
                    <div className="px-3 py-1.5 bg-black/50 backdrop-blur-md rounded border border-white/10 flex items-center gap-2">
                        <span className="material-symbols-outlined text-[14px] text-white">location_on</span>
                        <span className="font-mono text-[10px] text-white font-bold uppercase tracking-tight">Lat: 35.6762° N | Long: 139.6503° E</span>
                    </div>
                </div>
                <div className="absolute top-6 right-6 flex flex-col gap-2">
                    <button className="w-10 h-10 bg-black/50 backdrop-blur-md text-white rounded flex items-center justify-center hover:bg-black/70 transition-all border border-white/10">
                        <span className="material-symbols-outlined">layers</span>
                    </button>
                    <button className="w-10 h-10 bg-black/50 backdrop-blur-md text-white rounded flex items-center justify-center hover:bg-black/70 transition-all border border-white/10">
                        <span className="material-symbols-outlined">my_location</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

function StatCard({ label, value, trend, icon, primary, status, accentColor, critical }: any) {
    const isRed = accentColor === 'red' || critical;
    const isEmerald = accentColor === 'emerald';

    return (
        <div className={`bg-white rounded p-6 flex flex-col justify-between h-32 relative overflow-hidden shadow-sm border border-slate-200/50 ${isRed ? 'border-l-4 border-red-600' : isEmerald ? 'border-l-4 border-emerald-500' : ''}`}>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{label}</span>
            <div className="flex items-baseline gap-2">
                <span className={`text-3xl font-black font-mono ${primary ? 'text-primary-container' : isRed ? 'text-red-600' : 'text-slate-900'}`}>{value}</span>
                {trend && <span className={`text-xs font-mono font-bold ${primary ? 'text-primary-container' : 'text-red-500'}`}>{trend}</span>}
                {status && (
                    <span className={`text-[10px] font-bold flex items-center gap-1 ${isRed ? 'text-red-600 animate-pulse' : 'text-emerald-600'}`}>
                        <span className={`w-2 h-2 rounded-full ${isRed ? 'bg-red-600' : 'bg-emerald-500'}`}></span>
                        {status}
                    </span>
                )}
            </div>
            <div className={`absolute -right-4 -bottom-4 opacity-10 ${isRed ? 'text-red-600' : isEmerald ? 'text-emerald-500' : ''}`}>
                <span className="material-symbols-outlined text-6xl" style={{ fontVariationSettings: primary ? "'FILL' 1" : undefined }}>{icon}</span>
            </div>
        </div>
    );
}

function ActivityItem({ zone, task, time, status, color }: any) {
    const colorClass = color === 'primary' ? 'text-primary-container bg-primary-container/10' : 
                       color === 'emerald' ? 'text-emerald-600 bg-emerald-600/10' : 
                       'text-red-600 bg-red-600/10';
    
    return (
        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200">
            <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded flex items-center justify-center ${colorClass}`}>
                    <span className="material-symbols-outlined">
                        {status === 'In Transit' ? 'router' : status === 'Cleared' ? 'radio' : 'crisis_alert'}
                    </span>
                </div>
                <div>
                    <div className="text-xs font-mono font-bold text-slate-900 tracking-tight">{zone}</div>
                    <div className="text-[10px] text-slate-500 uppercase font-bold mt-0.5">{task}</div>
                </div>
            </div>
            <div className="text-right">
                <div className="text-xs font-mono font-bold text-slate-900">{time}</div>
                <div className={`text-[10px] font-bold uppercase ${color === 'primary' ? 'text-primary-container' : color === 'emerald' ? 'text-emerald-600' : 'text-red-600'}`}>
                    {status}
                </div>
            </div>
        </div>
    );
}

function OccupancyRow({ name, percentage }: any) {
    const isHigh = percentage > 90;
    return (
        <div className="space-y-2">
            <div className="flex justify-between text-[11px] font-bold uppercase tracking-wider">
                <span className="text-slate-700 truncate max-w-[200px]">{name}</span>
                <span className={isHigh ? 'text-red-600' : 'text-primary-container'}>{percentage}%</span>
            </div>
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div 
                    className={`h-full transition-all duration-1000 rounded-full ${isHigh ? 'bg-red-600' : 'bg-primary-container'}`} 
                    style={{ width: `${percentage}%` }}
                ></div>
            </div>
        </div>
    );
}
