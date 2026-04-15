'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { useStore } from '@/lib/store';
import { TreeNode } from '@/lib/types';

function NodeRow({ node, level }: { node: TreeNode; level: number }) {
    const [isExpanded, setIsExpanded] = useState(level < 1);
    const hasChildren = node.children && node.children.length > 0;

    const occupancyRate = node.capacity > 0 ? (node.occupancy / node.capacity) : 0;
    const isCrisis = node.affectedPeople > 0;

    return (
        <div className="animate-in fade-in slide-in-from-left-2 duration-300">
            <div className={`grid grid-cols-12 items-center gap-4 px-6 py-4 border-b border-slate-100 hover:bg-slate-50 transition-colors ${level > 0 ? 'bg-white/40' : 'bg-white'}`}>
                <div className="col-span-6 flex items-center gap-3" style={{ paddingLeft: `${level * 24}px` }}>
                    {hasChildren ? (
                        <button onClick={() => setIsExpanded(!isExpanded)} className="focus:outline-none">
                            <span className="material-symbols-outlined text-slate-400 select-none">
                                {isExpanded ? 'expand_more' : 'chevron_right'}
                            </span>
                        </button>
                    ) : (
                        <span className="w-6" />
                    )}
                    <div className="flex flex-col">
                        <span className={`text-sm tracking-tight ${level === 0 ? 'font-black text-slate-900 text-lg uppercase' : 'font-bold text-slate-700'}`}>
                            {node.name}
                        </span>
                        {isCrisis && (
                            <span className="inline-flex items-center gap-1 text-[9px] font-black text-primary-container uppercase tracking-widest mt-0.5">
                                <span className="w-1 h-1 bg-primary-container rounded-full animate-pulse" />
                                {node.affectedPeople} IMPACTED
                            </span>
                        )}
                    </div>
                </div>
                <div className="col-span-2">
                    <span className={`text-[9px] font-black uppercase tracking-tighter px-2 py-0.5 rounded ${
                        node.type === 'RELIEFCENTER' ? 'bg-emerald-50 text-emerald-700' :
                        node.type === 'ZONE' ? 'bg-orange-50 text-orange-600' :
                        'bg-orange-50 text-orange-600'
                    }`}>
                        {node.type}
                    </span>
                </div>
                <div className="col-span-2">
                    {node.type === 'RELIEFCENTER' ? (
                        <div className="w-full max-w-[120px]">
                            <div className="flex justify-between items-center mb-1 font-mono text-[9px] font-bold">
                                <span className={occupancyRate >= 0.9 ? 'text-orange-600' : 'text-slate-400'}>
                                    {Math.round(occupancyRate * 100)}%
                                </span>
                                <span className="text-slate-500">{node.occupancy}/{node.capacity}</span>
                            </div>
                            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner">
                                <div 
                                    className={`h-full rounded-full transition-all duration-1000 ${
                                        occupancyRate >= 0.9 ? 'bg-orange-500' : 'bg-emerald-500'
                                    }`} 
                                    style={{ width: `${Math.min(100, occupancyRate * 100)}%` }}
                                />
                            </div>
                        </div>
                    ) : (
                        <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">-</span>
                    )}
                </div>
                <div className="col-span-2 text-right font-mono text-xs font-bold text-slate-400">
                    ID-{node.name.slice(0, 3).toUpperCase()}-{node.type[0]}
                </div>
            </div>
            {isExpanded && hasChildren && (
                <div className="border-l-2 border-slate-100">
                    {node.children!.map((child, i) => (
                        <NodeRow key={i} node={child} level={level + 1} />
                    ))}
                </div>
            )}
        </div>
    );
}

export default function ZoneHierarchy() {
    const { setError } = useStore();
    const [root, setRoot] = useState<TreeNode | null>(null);

    const fetchData = async () => {
        try {
            const data = await api.getStatus();
            if (data.success && data.data?.tree) {
                setRoot(data.data.tree);
            }
        } catch (err: any) {
            setError(err.message);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 10000);
        return () => clearInterval(interval);
    }, []);

    return (
        <main className="p-8 animate-in fade-in duration-700">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-end mb-10">
                    <div>
                        <span className="font-mono text-xs uppercase tracking-[0.2em] text-primary-container font-black">Data Overview</span>
                        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tighter mt-1 uppercase">Zone Hierarchy</h1>
                        <p className="text-slate-500 font-medium max-w-2xl mt-2 leading-relaxed">
                            Complete overview of the regions. Monitor population distribution across districts, cities, and zones in real-time.
                        </p>
                    </div>
                </div>

                <div className="bg-white rounded-xl overflow-hidden border border-slate-200 shadow-sm shadow-slate-200/50">
                    {/* Header Row */}
                    <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-slate-900 border-b border-slate-800">
                        <div className="col-span-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Entity</div>
                        <div className="col-span-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Classification</div>
                        <div className="col-span-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Status / Capacity</div>
                        <div className="col-span-2 text-right text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">ID</div>
                    </div>

                    {/* Tree Root */}
                    <div className="no-scrollbar">
                        {root ? (
                            <NodeRow node={root} level={0} />
                        ) : (
                            <div className="p-20 text-center">
                                <span className="material-symbols-outlined text-4xl text-slate-200 animate-spin">sync</span>
                                <p className="text-slate-400 font-bold uppercase tracking-widest mt-4 text-xs">Syncing Registry...</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}
