import Link from 'next/link';
import Image from 'next/image';

export default function LandingPage() {
    return (
        <div className="bg-surface text-on-surface font-sans selection:bg-primary-container selection:text-white">
            {/* Global Navigation */}
            <nav className="bg-white/80 backdrop-blur-md fixed top-0 w-full z-50 flex justify-between items-center px-8 py-4 border-b border-surface-container-highest">
                <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-primary-container"></span>
                    <span className="text-xl font-extrabold text-slate-900">
                        ReliefRoute<span className="text-primary">.</span>
                    </span>
                </div>
                <div className="hidden md:flex items-center gap-8">
                    <a className="font-sans font-bold uppercase tracking-wider text-[10px] text-primary border-b-2 border-primary pb-1 transition-colors" href="#features">Features</a>
                    <a className="font-sans font-bold uppercase tracking-wider text-[10px] text-slate-600 hover:text-primary transition-colors" href="#workflow">How it Works</a>
                    <a className="font-sans font-bold uppercase tracking-wider text-[10px] text-slate-600 hover:text-primary transition-colors" href="#credits">About</a>
                </div>
                <div>
                    <Link href="/login">
                        <button className="font-sans font-bold uppercase tracking-wider text-[10px] px-5 py-2 border border-outline/20 rounded-full hover:bg-slate-50 transition-all active:scale-95 duration-150">
                            Log In
                        </button>
                    </Link>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-24 pb-32 text-white overflow-hidden min-h-[85vh] flex items-center">
                {/* Background Image with Overlay */}
                <div className="absolute inset-0 z-0 bg-slate-950">
                    <Image 
                        src="/hero-tactical.png" 
                        alt="Background" 
                        fill 
                        className="object-cover object-center opacity-40 select-none pointer-events-none"
                        quality={100}
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/20 to-transparent"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/40"></div>
                </div>

                <div className="max-w-7xl mx-auto px-8 relative z-10 w-full">
                    <div className="max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-container/20 backdrop-blur-md rounded-full border border-primary-container/30 mb-8">
                            <span className="w-2 h-2 rounded-full bg-primary-container"></span>
                            <span className="text-[10px] font-mono font-black text-primary-container uppercase tracking-[0.2em]">Ready for Action</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black leading-tight mb-6 tracking-tight">
                            Smart Planning. <br />
                            <span className="text-primary-container text-6xl">Faster Rescue.</span> <br />
                            Saving Every Life.
                        </h1>
                        <p className="text-lg text-slate-400 mb-10 max-w-lg font-medium leading-relaxed">
                            A powerful and easy-to-use tool for emergency teams. Find the quickest paths to safety, track shelter space instantly, and manage evacuations with confidence when every second counts.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Link href="/login">
                                <button className="tactical-gradient text-white px-10 py-5 rounded-full font-black uppercase tracking-widest text-sm hover:brightness-110 active:scale-95 transition-all shadow-xl shadow-primary/20">
                                    Launch Dashboard
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Capabilities Section */}
            <section id="features" className="py-24 bg-surface">
                <div className="max-w-7xl mx-auto px-8">
                    <div className="mb-16">
                        <span className="text-primary font-mono text-xs font-bold tracking-[0.3em] uppercase block mb-4">What it does</span>
                        <h2 className="text-4xl md:text-5xl font-black text-on-surface tracking-tighter text-balance">Built for Real Emergencies.<br />Designed for People.</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { icon: 'route', title: 'Fastest Safe Routes', desc: 'Instantly find the best paths to safety, avoiding road blocks and traffic jams in real-time.' },
                            { icon: 'roofing', title: 'Smart Shelter Planning', desc: 'Automatically send people to the nearest shelters that still have available space.' },
                            { icon: 'monitoring', title: 'Live Updates', desc: 'See exactly how much room is left in every shelter as people arrive, so no one is turned away.' },
                            { icon: 'hub', title: 'Clear Road Maps', desc: 'Get a perfect view of all accessible roads to ensure your teams stay moving in the right direction.' },
                        ].map((cap, i) => (
                            <div key={i} className="bg-surface-container-low p-8 rounded-xl border border-transparent hover:border-primary/10 hover:bg-white transition-all group">
                                <div className="mb-6">
                                    <span className="material-symbols-outlined text-primary text-4xl">{cap.icon}</span>
                                </div>
                                <h3 className="text-lg font-bold mb-3 uppercase tracking-tight">{cap.title}</h3>
                                <p className="text-sm text-on-surface-variant leading-relaxed font-medium">{cap.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Workflow Section */}
            <section id="workflow" className="py-24 bg-slate-50 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-8">
                    <div className="mb-16 text-center">
                        <span className="text-primary font-mono text-xs font-bold tracking-[0.3em] uppercase block mb-4">How it works</span>
                        <h2 className="text-4xl font-black text-on-surface tracking-tighter italic">Simple Three-Step Response</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                        <div className="hidden md:block absolute top-12 left-1/4 right-1/4 h-[2px] bg-primary/10 z-0"></div>
                        {[
                            { num: '01', title: 'Setup Your Area', desc: 'Quickly upload your local maps and shelter info to the system.' },
                            { num: '02', title: 'Spot the Danger', desc: 'Mark which areas are at risk so the system can plan routes for everyone.' },
                            { num: '03', title: 'Start Evacuation', desc: 'Get clear directions instantly and monitor the rescue progress live.' },
                        ].map((step, i) => (
                            <div key={i} className="relative z-10 text-center">
                                <div className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-sm border border-slate-100 transform -rotate-3 hover:rotate-0 transition-transform">
                                    <span className="text-4xl font-mono font-black text-primary-container">{step.num}</span>
                                </div>
                                <h3 className="text-xl font-bold mb-4 uppercase tracking-tight">{step.title}</h3>
                                <p className="text-on-surface-variant text-sm px-4 font-medium">{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-8">
                <div className="max-w-7xl mx-auto rounded-3xl tactical-gradient p-12 md:p-20 text-center text-white relative shadow-2xl overflow-hidden group">
                    <div className="absolute inset-0 opacity-10 pointer-events-none group-hover:scale-110 transition-transform duration-1000">
                        <Image src="/hero-tactical.png" alt="Overlay" fill className="object-cover" />
                    </div>
                    <h2 className="text-5xl md:text-6xl font-black mb-8 tracking-tighter">Ready to Save Lives?</h2>
                    <p className="text-xl mb-12 max-w-2xl mx-auto font-medium opacity-90">
                        Secure access for authorized emergency personnel. Logging in requires verified credentials.
                    </p>
                    <Link href="/login">
                        <button className="bg-white text-primary font-black uppercase gap-3 tracking-widest text-sm px-10 py-5 rounded-full hover:bg-slate-100 transition-all active:scale-95 shadow-2xl flex items-center mx-auto group">
                            Log In
                            <span className="material-symbols-outlined font-black group-hover:translate-x-1 transition-transform">arrow_forward</span>
                        </button>
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer id="credits" className="bg-slate-950 text-white py-24">
                <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
                    <div>
                        <div className="flex items-center gap-2 mb-8">
                            <span className="w-3 h-3 rounded-full bg-primary-container"></span>
                            <span className="text-lg font-black uppercase tracking-widest">ReliefRoute</span>
                        </div>
                        <p className="text-slate-500 text-[10px] uppercase tracking-[0.2em] leading-relaxed max-w-xs">
                            © 2026 ReliefRoute Project. <br />
                            Helping Emergency Teams Save Lives with Better Data.
                        </p>
                    </div>
                    
                    <div className="md:justify-self-end">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6 font-mono">Project Credits</h4>
                        <div className="p-6 bg-white/5 rounded-2xl border border-white/10 hover:border-primary/30 transition-all max-w-md">
                            <p className="text-[10px] font-medium text-slate-400 leading-relaxed uppercase tracking-wider">
                                Developed as the Advanced Data Structure course project for real-world applications of data structures. All algorithms are optimized for high-speed response in mission-critical scenarios.
                            </p>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
