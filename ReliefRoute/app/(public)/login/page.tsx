'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import { api } from '@/lib/api';
import Cookies from 'js-cookie';


export default function LoginPage() {
    const router = useRouter();
    const { setToken, setIsLoading, setError, error } = useStore();
    
    const [username, setUsername] = useState('admin');
    const [password, setPassword] = useState('admin123');
    const [showPassword, setShowPassword] = useState(false);
    const [isShaking, setIsShaking] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const res = await api.login({ username, password });
            if (res.success && res.token) {
                setToken(res.token);
                Cookies.set('rr_token', res.token, { expires: 1 });
                router.push('/dashboard');
            } else {

                throw new Error(res.message || 'Invalid credentials');
            }
        } catch (err: any) {
            setError(err.message);
            setIsShaking(true);
            setTimeout(() => setIsShaking(false), 500);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="flex h-screen w-full overflow-hidden bg-white dark:bg-slate-950">
            {/* Left Panel: Tactical Visual (55%) */}
            <section className="hidden lg:relative lg:flex w-[55%] h-full bg-slate-900 overflow-hidden">
                <Image 
                    src="/hero-tactical.png" 
                    alt="Tactical Command" 
                    fill 
                    className="object-cover opacity-60"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
                
                <div className="absolute top-8 left-10 z-20">
                    <span className="text-2xl font-black text-white uppercase tracking-widest flex items-center gap-2">
                        ReliefRoute
                        <span className="w-2 h-2 bg-primary-container rounded-full animate-pulse"></span>
                    </span>
                </div>

                <div className="absolute bottom-12 left-10 z-20 max-w-sm">
                    <blockquote className="space-y-3">
                        <p className="text-xl font-black text-white tracking-tight leading-tight italic uppercase">
                            &quot;Operational control when every second counts.&quot;
                        </p>
                        <div className="h-1 w-16 bg-primary-container"></div>
                    </blockquote>
                </div>
            </section>

            {/* Right Panel: Login Form (45%) */}
            <section className="w-full lg:w-[45%] h-full flex flex-col justify-center items-center px-8 md:px-12 lg:px-20 bg-slate-50 dark:bg-slate-950 border-l border-slate-100 dark:border-slate-800">
                <div className={`w-full max-w-sm ${isShaking ? 'animate-[shake_0.5s_ease-in-out]' : ''}`}>
                    <header className="mb-8 text-center lg:text-left">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-white dark:bg-slate-900 shadow-sm border border-slate-100 dark:border-slate-800 rounded-full mb-4">
                            <span className="w-1 h-1 bg-primary-container rounded-full"></span>
                            <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Officer Access Only</span>
                        </div>
                        <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">
                            Sign In to <br />
                            <span className="text-primary-container">Dashboard</span>
                        </h2>
                    </header>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1" htmlFor="username">Username</label>
                            <div className="relative group">
                                <input 
                                    className="w-full h-11 bg-white dark:bg-slate-900 shadow-sm border-[1.5px] border-slate-100 dark:border-slate-800 focus:border-primary-container focus:ring-0 text-slate-900 dark:text-white font-mono text-sm px-4 rounded-lg transition-all" 
                                    id="username" 
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="OFFICER_ID"
                                    required 
                                />
                                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-300 text-lg group-focus-within:text-primary-container">badge</span>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1" htmlFor="password">Secure Password</label>
                            <div className="relative group">
                                <input 
                                    className="w-full h-11 bg-white dark:bg-slate-900 shadow-sm border-[1.5px] border-slate-100 dark:border-slate-800 focus:border-primary-container focus:ring-0 text-slate-900 dark:text-white text-sm px-4 rounded-lg transition-all" 
                                    id="password" 
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••••••"
                                    required 
                                />
                                <button 
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-300 text-lg hover:text-primary-container transition-colors"
                                >
                                    {showPassword ? 'visibility' : 'lock'}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <p className="text-primary text-[9px] font-black uppercase tracking-widest ml-1 bg-primary/5 p-1.5 rounded border border-primary/20">
                                ⚠️ Authentication Error: {error}
                            </p>
                        )}

                        <div className="flex items-center justify-between pt-1">
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <input className="w-3.5 h-3.5 rounded-sm border-slate-300 text-primary-container focus:ring-primary-container/20" type="checkbox" />
                                <span className="text-[10px] font-bold text-slate-400 group-hover:text-slate-600 transition-colors">Remember Station</span>
                            </label>
                            <a className="text-[10px] font-black text-primary-container hover:underline tracking-tight" href="#">Forgot Credentials?</a>
                        </div>

                        <button 
                            className="w-full h-13 mt-2 tactical-gradient hover:brightness-110 active:scale-[0.98] transition-all rounded-full flex items-center justify-center gap-2.5 group disabled:opacity-50 shadow-lg shadow-primary/10" 
                            type="submit"
                        >
                            <span className="text-white font-black uppercase tracking-widest text-[11px]">
                                Enter Command Center
                            </span>
                            <span className="material-symbols-outlined text-white text-lg group-hover:translate-x-1 transition-transform font-black">login</span>
                        </button>
                    </form>

                    <Link href="/" className="mt-6 flex items-center justify-center gap-1.5 text-slate-400 hover:text-primary transition-colors text-[9px] font-black uppercase tracking-widest">
                        <span className="material-symbols-outlined text-xs">arrow_back</span>
                        Back to Life Line
                    </Link>
                </div>
            </section>
        </main>
    );
}
