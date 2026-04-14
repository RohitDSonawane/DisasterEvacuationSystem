'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { useStore } from '@/lib/store';
import { ShelterStatus as TShelterStatus } from '@/lib/types';

export default function ShelterStatusPage() {
    const { setIsLoading, setError } = useStore();
    const [shelters, setShelters] = useState<TShelterStatus[]>([]);
    const [lastSync, setLastSync] = useState(new Date().toLocaleTimeString());

    const fetchShelters = async () => {
        try {
            const data = await api.getSummary();
            if (Array.isArray(data)) {
                setShelters(data);
                setLastSync(new Date().toLocaleTimeString());
            }
        } catch (err: any) {
            console.error('Failed to sync shelters:', err);
        }
    };

    useEffect(() => {
        fetchShelters();
        const interval = setInterval(fetchShelters, 5000);
        return () => clearInterval(interval);
    }, []);

    const totalCapacity = shelters.reduce((acc, s) => acc + s.capacity, 0);
    const totalOccupancy = shelters.reduce((acc, s) => acc + s.occupancy, 0);
    const availableCapacity = totalCapacity - totalOccupancy;
    const criticalShelters = shelters.filter(s => (s.occupancy / s.capacity) >= 0.9).length;

    return (
        <main className="p-8 animate-in fade-in duration-700">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-end mb-10">
                    <div>
                        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2 uppercase">Shelter Monitoring</h1>
                        <p className="text-slate-500 font-medium max-w-2xl">
                            Real-time facility occupancy tracking and capacity alerting system. Linked directly to evacuation tactical relays.
                        </p>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400 font-mono text-[10px] bg-white px-4 py-2 rounded-lg border border-slate-100 shadow-sm">
                        <span className="material-symbols-outlined text-sm">schedule</span>
                        <span className="font-bold uppercase tracking-widest leading-none">LAST SYNC: {lastSync}</span>
                    </div>
                </div>

                {/* Summary Row */}
                <div className="flex flex-wrap gap-4 mb-10">
                    <div className="bg-white px-8 py-5 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-1 min-w-[200px]">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Total Capacity</span>
                        <span className="font-mono text-3xl font-black text-slate-900">{totalCapacity.toLocaleString()}</span>
                    </div>
                    <div className="bg-white px-8 py-5 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-1 min-w-[200px]">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Available Space</span>
                        <span className="font-mono text-3xl font-black text-emerald-600">{availableCapacity.toLocaleString()}</span>
                    </div>
                    <div className="bg-white px-8 py-5 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-1 min-w-[200px]">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Critical Alerts</span>
                        <span className="font-mono text-3xl font-black text-primary-container">{criticalShelters}</span>
                    </div>
                </div>

                {/* Shelter Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {shelters.map((shelter, idx) => {
                        const occupancyRate = shelter.capacity > 0 ? (shelter.occupancy / shelter.capacity) : 0;
                        const isFull = occupancyRate >= 1.0;
                        const isCritical = occupancyRate >= 0.9 && !isFull;
                        
                        return (
                            <div 
                                key={idx} 
                                className={`bg-white p-8 rounded-xl border transition-all duration-300 group hover:shadow-xl hover:-translate-y-1 ${
                                    isFull ? 'border-red-200 shadow-red-50/50' : 
                                    isCritical ? 'border-orange-200 shadow-orange-50/50' : 
                                    'border-slate-100'
                                }`}
                            >
                                <div className="flex justify-between items-start mb-8">
                                    <div className="flex items-center gap-3">
                                        <div className={`h-4 w-4 rounded-full shadow-lg ${
                                            isFull ? 'bg-red-500 animate-pulse' : 
                                            isCritical ? 'bg-orange-500' : 
                                            'bg-emerald-500'
                                        }`} />
                                        <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter">{shelter.name}</h3>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                        isFull ? 'bg-red-100 text-red-700' : 
                                        isCritical ? 'bg-orange-100 text-orange-700' : 
                                        'bg-emerald-100 text-emerald-700'
                                    }`}>
                                        {shelter.status}
                                    </span>
                                </div>

                                <div className="space-y-6">
                                    <div className="flex justify-between items-end">
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Occupancy Metrics</p>
                                            <div className="flex items-baseline gap-1">
                                                <span className={`font-mono text-4xl font-black ${isFull ? 'text-red-600' : isCritical ? 'text-orange-600' : 'text-slate-900'}`}>
                                                    {shelter.occupancy}
                                                </span>
                                                <span className="font-mono text-xl text-slate-300">/ {shelter.capacity}</span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className={`text-xs font-black uppercase ${isFull ? 'text-red-500' : isCritical ? 'text-orange-500' : 'text-emerald-500'}`}>
                                                {isFull ? 'NO CAPACITY' : `${shelter.capacity - shelter.occupancy} FREE`}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="relative w-full h-4 bg-slate-50 rounded-full overflow-hidden border border-slate-100 shadow-inner">
                                        <div 
                                            className={`h-full rounded-full transition-all duration-1000 ${
                                                isFull ? 'bg-red-600' : 
                                                isCritical ? 'bg-orange-500' : 
                                                'bg-primary-container'
                                            }`}
                                            style={{ width: `${Math.min(100, occupancyRate * 100)}%` }}
                                        />
                                    </div>

                                    <div className="pt-6 border-t border-slate-50 flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                        <div className="flex items-center gap-2">
                                            <span className="material-symbols-outlined text-sm">location_on</span>
                                            <span>Active Zone Relay</span>
                                        </div>
                                        <button className="text-primary-container hover:text-primary transition-colors hover:underline">
                                            View Logs
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </main>
    );
}
