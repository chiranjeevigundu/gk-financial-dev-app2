import React from 'react';
import { useGlobal } from '../context/GlobalContext';
import { Link } from 'react-router-dom';
import * as Icons from 'lucide-react';

export function Home() {
    const { cmsConfig } = useGlobal();

    // Helper to dynamically render Lucide icons
    const DynamicIcon = ({ name, className }: { name: string; className?: string }) => {
        const IconComponent = (Icons as any)[name];
        return IconComponent ? <IconComponent className={className} /> : <Icons.Circle className={className} />;
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            {/* Ticker Section */}
            {cmsConfig.ticker && (
                <div className="bg-slate-900 text-white py-2 overflow-hidden relative">
                    <div className="animate-marquee whitespace-nowrap inline-block">
                        <span className="mx-4 font-medium text-sm tracking-wide">{cmsConfig.ticker}</span>
                        <span className="mx-4 font-medium text-sm tracking-wide">•</span>
                        <span className="mx-4 font-medium text-sm tracking-wide">{cmsConfig.ticker}</span>
                        <span className="mx-4 font-medium text-sm tracking-wide">•</span>
                        <span className="mx-4 font-medium text-sm tracking-wide">{cmsConfig.ticker}</span>
                    </div>
                </div>
            )}

            <div className="max-w-5xl mx-auto px-4 py-16 flex items-center justify-center min-h-[80vh]">
                {/* Center: Dashboard Features Container (Half Screen width) */}
                <div className="w-full bg-white rounded-[2rem] p-8 md:p-12 shadow-2xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden">
                    {/* Decorative Background Elements */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl -mr-32 -mt-32 opacity-50 pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-50 rounded-full blur-3xl -ml-32 -mb-32 opacity-50 pointer-events-none"></div>

                    <h2 className="text-3xl font-black text-slate-800 text-center mb-12 relative z-10 tracking-wide">Access Your Services</h2>

                    {/* 4 options in one row, 4 in the next (Grid cols 4) */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12 relative z-10 place-items-center">
                        {cmsConfig.features.map((feat) => {
                            // Full classes so Tailwind JIT compiles them correctly
                            const colorGradMap: Record<string, string> = {
                                'bg-indigo-600': 'from-indigo-400 to-indigo-600 shadow-indigo-500/40 border-indigo-300/30',
                                'bg-emerald-600': 'from-emerald-400 to-emerald-600 shadow-emerald-500/40 border-emerald-300/30',
                                'bg-purple-600': 'from-purple-400 to-purple-600 shadow-purple-500/40 border-purple-300/30',
                                'bg-amber-600': 'from-amber-400 to-amber-600 shadow-amber-500/40 border-amber-300/30',
                                'bg-rose-600': 'from-rose-400 to-rose-600 shadow-rose-500/40 border-rose-300/30',
                                'bg-sky-600': 'from-sky-400 to-sky-600 shadow-sky-500/40 border-sky-300/30',
                                'bg-teal-600': 'from-teal-400 to-teal-600 shadow-teal-500/40 border-teal-300/30',
                                'bg-blue-600': 'from-blue-400 to-blue-600 shadow-blue-500/40 border-blue-300/30',
                            };
                            const gradientClasses = colorGradMap[feat.color] || 'from-slate-400 to-slate-600 shadow-slate-500/40 border-slate-300/30';

                            return (
                                <Link
                                    key={feat.id}
                                    to={feat.path}
                                    className="group flex flex-col items-center gap-5 w-full outline-none"
                                >
                                    {/* Colorful Graphic Circle */}
                                    <div className={`w-28 h-28 md:w-32 md:h-32 rounded-full shadow-lg ${gradientClasses} bg-gradient-to-br flex flex-col items-center justify-center relative overflow-hidden transition-all duration-300 transform group-hover:-translate-y-2 group-hover:scale-105 group-hover:shadow-2xl cursor-pointer ring-4 ring-transparent group-focus:ring-indigo-300 border`}>

                                        {/* Abstract Graphic Overlays (Gloss & depth) */}
                                        <div className="absolute top-0 right-0 w-24 h-24 bg-white/30 rounded-full blur-2xl -mr-6 -mt-6 transition-transform duration-500 group-hover:scale-150"></div>
                                        <div className="absolute bottom-0 left-0 w-16 h-16 bg-black/10 rounded-full blur-xl -ml-4 -mb-4 transition-transform duration-500 group-hover:scale-150"></div>

                                        {/* Icon */}
                                        <DynamicIcon name={feat.icon} className="w-12 h-12 md:w-14 md:h-14 text-white relative z-10 drop-shadow-md transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110" />

                                        {/* Shimmer Effect */}
                                        <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 pointer-events-none z-20"></div>
                                    </div>

                                    {/* Label Text */}
                                    <span className="text-center font-bold text-slate-700 text-sm md:text-base leading-tight tracking-wide group-hover:text-indigo-600 transition-colors">
                                        {feat.label}
                                    </span>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
