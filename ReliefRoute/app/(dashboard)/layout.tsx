'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import Cookies from 'js-cookie';

const navItems = [
    { icon: 'dashboard', label: 'Dashboard', href: '/dashboard', active: true },
    { icon: 'emergency_share', label: 'Evacuation Planner', href: '/planner' },
    { icon: 'roofing', label: 'Shelters', href: '/shelters' },
    { icon: 'layers', label: 'Region Hierarchy', href: '/hierarchy' },
    { icon: 'hub', label: 'Road Network', href: '/network' },
    { icon: 'settings', label: 'Data Setup', href: '/setup' },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const { token, setToken } = useStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (mounted && !token) {
            const storedToken = Cookies.get('rr_token');
            if (storedToken) {
                setToken(storedToken);
            } else {
                router.replace('/login');
            }
        }
    }, [mounted, token, setToken, router]);

    if (!mounted) {
        return <div className="min-h-screen bg-[#F3F2F2]" />; 
    }

    // Only allow rendering if we have a token (either in state or just found in cookie)
    if (!token && !Cookies.get('rr_token')) {
        return null;
    }

    const handleLogout = () => {
        setToken(null);
        Cookies.remove('rr_token');
        router.push('/');
    };

    return (
        <div className="flex min-h-screen bg-[#F3F2F2]">
            {/* SideNavBar (Authority: Stitch Design) */}
            <aside className="fixed inset-y-0 left-0 w-[240px] bg-[#201F22] flex flex-col py-6 px-4 z-50">
                <div className="mb-10 px-4">
                    <div className="text-lg font-black text-white uppercase tracking-widest">ReliefRoute</div>
                    <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold mt-1">Management Dashboard</div>
                </div>

                <nav className="flex-1 space-y-2">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link 
                                key={item.href}
                                href={item.href}
                                className={`px-4 py-3 flex items-center gap-3 font-semibold tracking-tight text-sm transition-all active:translate-x-1 rounded-lg ${
                                    isActive 
                                    ? 'bg-white/10 text-white' 
                                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                                }`}
                            >
                                <span 
                                    className="material-symbols-outlined text-xl"
                                    style={{ 
                                        fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0",
                                        color: isActive ? '#ff6101' : undefined
                                    }}
                                >
                                    {item.icon}
                                </span>
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="mt-auto pt-6 px-4">
                    <button 
                        onClick={handleLogout}
                        className="text-slate-400 hover:text-white flex items-center gap-3 font-semibold tracking-tight text-sm uppercase tracking-widest transition-colors w-full text-left"
                    >
                        <span className="material-symbols-outlined">logout</span>
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content Canvas */}
            <main className="ml-[240px] flex-1 flex flex-col min-h-screen">
                {/* TopNavBar */}
                <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md flex justify-between items-center w-full px-8 py-4 border-b border-surface-container-highest/20">
                    <div className="flex items-center gap-4">
                        <h1 className="text-xl font-extrabold text-slate-900 uppercase tracking-tight">Operations Dashboard</h1>
                        <div className="flex items-center gap-2 px-3 py-1 bg-primary-container/10 rounded-full">
                            <span className="w-2 h-2 rounded-full bg-primary-container animate-pulse"></span>
                            <span className="font-mono text-[10px] font-bold text-primary-container tracking-tighter uppercase">System Active</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <button className="relative text-slate-600 hover:text-primary transition-colors">
                            <span className="material-symbols-outlined">notifications</span>
                            <span className="absolute top-0 right-0 block w-2 h-2 bg-red-600 rounded-full ring-2 ring-white"></span>
                        </button>
                        
                        <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
                            <div className="text-right">
                                <div className="text-xs font-bold text-slate-900 uppercase">Cmd. Miller</div>
                                <div className="text-[10px] text-slate-500 font-mono uppercase">Sector-7G</div>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden border border-slate-300">
                                <img 
                                    alt="User Avatar" 
                                    className="w-full h-full object-cover" 
                                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=Miller" 
                                />
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <div className="flex-1">
                    {children}
                </div>

                {/* Dashboard Footer */}
                <footer className="mt-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-12 py-16 w-full bg-[#201F22] text-slate-500 text-xs uppercase tracking-widest">
                    <div className="flex flex-col gap-4">
                        <span className="text-white font-black">ReliefRoute</span>
                        <p className="max-w-xs leading-relaxed opacity-60">© 2024 ReliefRoute. Evacuation Management System v1.0.</p>
                    </div>
                    <div className="flex flex-col gap-4">
                        <span className="text-white font-bold mb-2">Systems</span>
                        <a className="hover:text-primary transition-colors" href="#">Command Interface</a>
                        <a className="hover:text-primary transition-colors" href="#">Field Deployment</a>
                        <a className="hover:text-primary transition-colors" href="#">API Access</a>
                    </div>
                    <div className="flex flex-col gap-4">
                        <span className="text-white font-bold mb-2">Academic Credits</span>
                        <p className="opacity-60 leading-relaxed normal-case">Developed as a Senior Design Capstone Project for the Department of Civil & Systems Engineering.</p>
                    </div>
                </footer>
            </main>
        </div>
    );
}
