import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Activity, BarChart3, LineChart, PieChart, ArrowUpRight, ArrowDownRight, RefreshCw, Zap } from 'lucide-react';

export function StockMarket() {
    const [selectedRange, setSelectedRange] = useState('1M');

    // Mock stock data
    const topGainers = [
        { sym: 'RELIANCE', price: '2,954.20', change: '+2.4%', up: true },
        { sym: 'TCS', price: '4,105.65', change: '+1.8%', up: true },
        { sym: 'HDFCBANK', price: '1,432.10', change: '+0.9%', up: true },
    ];

    const cryptoData = [
        { sym: 'BTC/INR', price: '54,32,100', change: '+4.2%' },
        { sym: 'ETH/INR', price: '2,45,600', change: '-1.1%' },
    ];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
            {/* Header & Market Indicators */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
                        <span className="text-4xl">📈</span> Global Markets Terminal
                    </h1>
                    <p className="text-slate-500 font-medium mt-1 flex items-center gap-2">
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                        </span>
                        Live NIFTY50 & SENSEX Feeds
                    </p>
                </div>

                <div className="flex gap-4">
                    <div className="bg-emerald-50 border border-emerald-100 px-4 py-2 rounded-xl flex items-center gap-3">
                        <div className="text-emerald-600 font-bold">NIFTY</div>
                        <div className="text-slate-900 font-black">22,453.20</div>
                        <div className="text-emerald-500 text-sm font-bold flex items-center"><ArrowUpRight className="w-4 h-4" /> 124.5 (0.5%)</div>
                    </div>
                    <div className="bg-rose-50 border border-rose-100 px-4 py-2 rounded-xl flex items-center gap-3 hidden sm:flex">
                        <div className="text-rose-600 font-bold">SENSEX</div>
                        <div className="text-slate-900 font-black">73,890.45</div>
                        <div className="text-rose-500 text-sm font-bold flex items-center"><ArrowDownRight className="w-4 h-4" /> 45.2 (0.1%)</div>
                    </div>
                </div>
            </div>

            {/* Main Dashboard Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* 3D Main Chart Panel */}
                <div className="lg:col-span-2 bg-gradient-to-b from-slate-900 to-slate-800 rounded-[2rem] p-1 shadow-2xl relative overflow-hidden group">
                    <div className="bg-[#0f172a] rounded-[1.8rem] p-6 h-full relative z-10">
                        {/* Shimmer Effect */}
                        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-tr from-transparent via-white/5 to-transparent skew-x-12 -translate-x-full group-hover:animate-shimmer pointer-events-none"></div>

                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h3 className="text-slate-400 font-bold text-sm tracking-widest uppercase mb-1">Portfolio Value</h3>
                                <div className="text-4xl font-black text-white tracking-tight flex items-center gap-4">
                                    ₹12,45,670
                                    <span className="text-emerald-400 text-sm font-bold flex items-center bg-emerald-400/10 px-2 py-1 rounded-lg">
                                        <TrendingUp className="w-4 h-4 mr-1" /> +14.2%
                                    </span>
                                </div>
                            </div>

                            {/* Time Selectors */}
                            <div className="flex bg-slate-800 rounded-xl p-1">
                                {['1D', '1W', '1M', '1Y', 'ALL'].map(range => (
                                    <button
                                        key={range}
                                        onClick={() => setSelectedRange(range)}
                                        className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${selectedRange === range ? 'bg-indigo-500 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
                                    >
                                        {range}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Awesome CSS-based Mock Line Chart Container */}
                        <div className="w-full h-64 border-b border-l border-slate-700 relative mt-10">
                            {/* Grid Lines */}
                            <div className="absolute w-full h-full flex flex-col justify-between">
                                {[1, 2, 3, 4].map(i => <div key={i} className="w-full border-b border-slate-800/50"></div>)}
                            </div>

                            {/* Glowing Chart Line (SVG styling via CSS) */}
                            <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                                <defs>
                                    <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                                        <stop offset="0%" stopColor="#818cf8" stopOpacity="0.5" />
                                        <stop offset="100%" stopColor="#818cf8" stopOpacity="0" />
                                    </linearGradient>
                                </defs>
                                <polyline
                                    points="0,200 50,180 100,210 150,150 200,160 250,90 300,110 350,50 400,70 450,20 500,40"
                                    className="stroke-indigo-400 stroke-[3] fill-none drop-shadow-[0_0_8px_rgba(129,140,248,0.8)]"
                                    vectorEffect="non-scaling-stroke"
                                />
                                <polygon
                                    points="0,250 0,200 50,180 100,210 150,150 200,160 250,90 300,110 350,50 400,70 450,20 500,40 500,250"
                                    fill="url(#chartGradient)"
                                />

                                {/* Pulse Point at end */}
                                <circle cx="500" cy="40" r="4" fill="#818cf8" className="animate-ping shadow-[0_0_10px_#818cf8]" />
                                <circle cx="500" cy="40" r="4" fill="#fff" />
                            </svg>

                            {/* Axis Labels */}
                            <div className="absolute -bottom-6 w-full flex justify-between text-xs text-slate-500 font-mono">
                                <span>10:00</span><span>11:00</span><span>12:00</span><span>13:00</span><span>14:00</span><span>15:00</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side Widgets */}
                <div className="space-y-6">
                    {/* Market Movers 3D Widget */}
                    <div className="bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col justify-between h-[50%]">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-black text-slate-800 flex items-center gap-2">
                                <Zap className="w-5 h-5 text-amber-500" /> Top Movers
                            </h3>
                            <button className="text-indigo-600 p-2 hover:bg-indigo-50 rounded-full transition-colors"><RefreshCw className="w-4 h-4" /></button>
                        </div>
                        <div className="space-y-4">
                            {topGainers.map((stock, i) => (
                                <div key={i} className="flex justify-between items-center p-3 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer group">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-slate-900 text-white font-bold flex items-center justify-center text-xs shadow-md group-hover:scale-110 transition-transform">
                                            {stock.sym.substring(0, 2)}
                                        </div>
                                        <div>
                                            <div className="font-bold text-slate-900">{stock.sym}</div>
                                            <div className="text-xs text-slate-400 font-mono">NSE EQ</div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-bold text-slate-900">₹{stock.price}</div>
                                        <div className="text-emerald-500 text-xs font-bold">{stock.change}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Crypto Pulse */}
                    <div className="bg-gradient-to-br from-indigo-900 via-purple-900 to-black rounded-3xl p-6 text-white shadow-xl shadow-purple-900/40 relative overflow-hidden h-[45%] flex flex-col justify-center">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-fuchsia-500/30 rounded-full blur-2xl"></div>
                        <h3 className="font-black text-white/90 mb-4 flex items-center gap-2 relative z-10">
                            <Activity className="w-5 h-5 text-fuchsia-400" /> Crypto Pulse
                        </h3>
                        <div className="space-y-4 relative z-10">
                            {cryptoData.map((coin, i) => (
                                <div key={i} className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 flex justify-between items-center">
                                    <span className="font-bold tracking-wider">{coin.sym}</span>
                                    <div className="text-right">
                                        <div className="font-mono text-lg font-bold">₹{coin.price}</div>
                                        <div className={`text-xs font-bold ${coin.change.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'}`}>
                                            {coin.change}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Section - Asset Allocation */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="md:col-span-1 bg-white rounded-[2rem] p-6 shadow-lg shadow-slate-200/40 flex flex-col items-center justify-center relative border border-slate-50">
                    <h3 className="font-bold text-slate-600 mb-6 w-full text-center">Asset Allocation</h3>

                    {/* Very cool CSS Pie Chart representation using conic-gradient */}
                    <div className="w-32 h-32 rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.1)] relative flex justify-center items-center"
                        style={{ background: 'conic-gradient(#8b5cf6 0% 45%, #ec4899 45% 75%, #10b981 75% 100%)' }}>
                        <div className="w-20 h-20 bg-white rounded-full absolute"></div>
                        <div className="relative z-10 flex flex-col items-center">
                            <span className="font-black text-xl text-slate-800">100%</span>
                        </div>
                    </div>
                </div>

                <div className="md:col-span-3 bg-white rounded-[2rem] p-6 shadow-lg shadow-slate-200/40 border border-slate-50">
                    <div className="grid grid-cols-3 gap-4 h-full">
                        <div className="flex flex-col justify-center p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-3 h-3 rounded-full bg-violet-500 shadow-md shadow-violet-500/50"></div>
                                <span className="font-bold text-slate-700">Equities</span>
                            </div>
                            <span className="text-3xl font-black text-violet-600">45%</span>
                            <span className="text-sm text-slate-500 font-medium mt-1">₹5,60,551</span>
                        </div>
                        <div className="flex flex-col justify-center p-4 bg-pink-50 rounded-2xl border border-pink-100">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-3 h-3 rounded-full bg-pink-500 shadow-md shadow-pink-500/50"></div>
                                <span className="font-bold text-slate-700">Mutual Funds</span>
                            </div>
                            <span className="text-3xl font-black text-pink-600">30%</span>
                            <span className="text-sm text-slate-500 font-medium mt-1">₹3,73,701</span>
                        </div>
                        <div className="flex flex-col justify-center p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-md shadow-emerald-500/50"></div>
                                <span className="font-bold text-slate-700">Digital Gold</span>
                            </div>
                            <span className="text-3xl font-black text-emerald-600">25%</span>
                            <span className="text-sm text-slate-500 font-medium mt-1">₹3,11,418</span>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}
