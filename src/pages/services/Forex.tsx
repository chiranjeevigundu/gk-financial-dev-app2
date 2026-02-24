import React, { useState } from 'react';
import { useGlobal } from '../../context/GlobalContext';
import { RefreshCw, Send, Clock, CheckCircle, XCircle, ArrowRight, TrendingUp } from 'lucide-react';

export function Forex() {
    const { user, userRequests, addUserRequest } = useGlobal();
    const [activeTab, setActiveTab] = useState<'new' | 'track'>('new');

    // Form State
    const [amount, setAmount] = useState('');
    const [fromCurrency, setFromCurrency] = useState('USD');
    const [toCurrency, setToCurrency] = useState('INR');
    const [successMsg, setSuccessMsg] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!amount || !user) return;

        addUserRequest({
            userId: user.id,
            userName: user.name,
            type: 'Forex',
            details: {
                amount: parseFloat(amount),
                fromCurrency,
                toCurrency
            }
        });

        setSuccessMsg('Request placed successfully! Waiting for admin approval.');
        setAmount('');
        setTimeout(() => {
            setSuccessMsg('');
            setActiveTab('track');
        }, 2000);
    };

    const myRequests = userRequests.filter(req => req.userId === user?.id && req.type === 'Forex');

    // Mock live rates for visual ticker
    const liveRates = [
        { pair: 'USD/INR', rate: '83.12', trend: 'up' },
        { pair: 'EUR/INR', rate: '90.45', trend: 'down' },
        { pair: 'GBP/INR', rate: '105.78', trend: 'up' },
        { pair: 'AED/INR', rate: '22.63', trend: 'up' },
        { pair: 'AUD/INR', rate: '54.21', trend: 'down' },
    ];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
            {/* Live Exchange Ticker */}
            <div className="w-full bg-slate-900 rounded-2xl overflow-hidden flex items-center shadow-lg border border-slate-700">
                <div className="bg-rose-500 text-white font-black px-6 py-3 shrink-0 flex items-center gap-2 z-10 shadow-[10px_0_20px_rgba(0,0,0,0.5)]">
                    <RefreshCw className="w-5 h-5 animate-spin-slow" /> LIVE RATES
                </div>
                <div className="flex-1 overflow-hidden relative">
                    <div className="flex gap-8 whitespace-nowrap animate-[marquee_20s_linear_infinite] px-4">
                        {liveRates.map((rate, i) => (
                            <div key={i} className="flex items-center gap-2 text-slate-300 font-mono">
                                <span className="font-bold text-white">{rate.pair}</span>
                                <span>{rate.rate}</span>
                                {rate.trend === 'up' ? <span className="text-emerald-400">▲</span> : <span className="text-rose-400">▼</span>}
                            </div>
                        ))}
                        {liveRates.map((rate, i) => (
                            <div key={`dup-${i}`} className="flex items-center gap-2 text-slate-300 font-mono">
                                <span className="font-bold text-white">{rate.pair}</span>
                                <span>{rate.rate}</span>
                                {rate.trend === 'up' ? <span className="text-emerald-400">▲</span> : <span className="text-rose-400">▼</span>}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-white p-6 rounded-[2rem] shadow-xl shadow-slate-200/40 border border-slate-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-rose-50 rounded-full blur-3xl -mr-20 -mt-20"></div>
                <div className="relative z-10">
                    <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
                        <span className="text-4xl">💱</span>
                        Forex Conversions
                    </h1>
                    <p className="text-slate-500 mt-2 font-medium">Global currency exchange at the best market rates.</p>
                </div>
                <div className="flex bg-slate-100 rounded-xl p-1 shadow-inner relative z-10">
                    <button
                        onClick={() => setActiveTab('new')}
                        className={`px-6 py-2.5 rounded-lg font-bold text-sm transition-all flex items-center gap-2 ${activeTab === 'new'
                            ? 'bg-rose-500 text-white shadow-lg shadow-rose-200'
                            : 'text-slate-600 hover:text-rose-600'
                            }`}
                    >
                        🔄 New Request
                    </button>
                    <button
                        onClick={() => setActiveTab('track')}
                        className={`px-6 py-2.5 rounded-lg font-bold text-sm transition-all flex items-center gap-2 ${activeTab === 'track'
                            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
                            : 'text-slate-600 hover:text-indigo-600'
                            }`}
                    >
                        📡 Track Status
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="min-h-[500px]">
                {activeTab === 'new' && (
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 animate-in fade-in slide-in-from-bottom-4">

                        {/* 3D Conversion Form */}
                        <div className="lg:col-span-3">
                            <div className="bg-white rounded-[2rem] shadow-2xl shadow-slate-200/50 border border-slate-100 p-8 relative overflow-hidden">
                                {/* Decorative elements */}
                                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-rose-400 to-orange-400 rounded-full blur-3xl opacity-20 -mr-10 -mt-10 pointer-events-none"></div>
                                <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-indigo-400 to-purple-400 rounded-full blur-3xl opacity-20 -ml-10 -mb-10 pointer-events-none"></div>

                                <h2 className="text-2xl font-black text-slate-900 mb-8 relative z-10 flex items-center gap-2">
                                    <Send className="w-6 h-6 text-rose-500" /> Send Money Internationally
                                </h2>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                                        <input
                                            type="text"
                                            value={user?.name || ''}
                                            disabled
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">Amount</label>
                                        <input
                                            type="number"
                                            value={amount}
                                            onChange={(e) => setAmount(e.target.value)}
                                            placeholder="Enter amount"
                                            required
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-rose-500 focus:ring-2 focus:ring-rose-100 outline-none transition-all"
                                        />
                                    </div>
                                    <div className="flex items-end gap-2">
                                        <div className="flex-1">
                                            <label className="block text-sm font-medium text-slate-700 mb-2">From</label>
                                            <select
                                                value={fromCurrency}
                                                onChange={(e) => setFromCurrency(e.target.value)}
                                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-rose-500 focus:ring-2 focus:ring-rose-100 outline-none transition-all"
                                            >
                                                <option value="USD">USD</option>
                                                <option value="INR">INR</option>
                                                <option value="EUR">EUR</option>
                                                <option value="GBP">GBP</option>
                                            </select>
                                        </div>
                                        <div className="pb-3 text-slate-400">
                                            <ArrowRight className="w-5 h-5" />
                                        </div>
                                        <div className="flex-1">
                                            <label className="block text-sm font-medium text-slate-700 mb-2">To</label>
                                            <select
                                                value={toCurrency}
                                                onChange={(e) => setToCurrency(e.target.value)}
                                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-rose-500 focus:ring-2 focus:ring-rose-100 outline-none transition-all"
                                            >
                                                <option value="INR">INR</option>
                                                <option value="USD">USD</option>
                                                <option value="EUR">EUR</option>
                                                <option value="GBP">GBP</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* Conversion Route Mock Visual */}
                                    <div className="flex items-center justify-center py-4 relative z-10">
                                        <div className="h-0.5 flex-1 bg-gradient-to-r from-slate-200 via-rose-300 to-indigo-300"></div>
                                        <div className="bg-white border-2 border-slate-100 px-4 py-2 rounded-full font-bold text-slate-500 text-xs tracking-widest uppercase shadow-sm mx-4 flex items-center gap-2">
                                            <span className="text-rose-500">{fromCurrency}</span>
                                            <ArrowRight className="w-4 h-4 text-slate-300" />
                                            <span className="text-indigo-500">{toCurrency}</span>
                                        </div>
                                        <div className="h-0.5 flex-1 bg-gradient-to-r from-indigo-300 via-slate-200 to-slate-200"></div>
                                    </div>

                                    {successMsg && (
                                        <div className="p-4 bg-emerald-50 text-emerald-700 rounded-xl text-sm font-bold flex items-center gap-2 border border-emerald-100 shadow-inner">
                                            <CheckCircle className="w-5 h-5" />
                                            {successMsg}
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        className="w-full py-4 bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 text-white rounded-xl font-black text-lg shadow-lg shadow-rose-500/30 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-3 relative z-10"
                                    >
                                        <Send className="w-6 h-6" />
                                        Initiate Transfer Fast
                                    </button>
                                </form>
                            </div>
                        </div>

                        {/* Market Trend Graphic Sidebar */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="bg-slate-900 rounded-[2rem] p-8 text-white shadow-2xl relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-indigo-500/20 via-transparent to-transparent opacity-50"></div>

                                <h3 className="text-xl font-black mb-6 relative z-10 flex items-center gap-2">
                                    <TrendingUp className="w-5 h-5 text-indigo-400" /> USD/INR Trend
                                </h3>

                                <div className="flex items-end gap-3 mb-8 relative z-10">
                                    <span className="text-5xl font-black tracking-tight">83.12</span>
                                    <span className="text-emerald-400 font-bold mb-1">+0.14 (0.17%)</span>
                                </div>

                                {/* Mock Mini Chart */}
                                <div className="h-32 w-full relative z-10 mt-auto border-b border-l border-slate-700 flex items-end">
                                    <svg className="w-full h-full" preserveAspectRatio="none">
                                        <defs>
                                            <linearGradient id="forexChartGradient" x1="0" x2="0" y1="0" y2="1">
                                                <stop offset="0%" stopColor="#818cf8" stopOpacity="0.5" />
                                                <stop offset="100%" stopColor="#818cf8" stopOpacity="0" />
                                            </linearGradient>
                                        </defs>
                                        <polyline
                                            points="0,100 20,90 40,95 60,70 80,80 100,50 120,60 140,20 160,30 180,10 200,5"
                                            className="stroke-indigo-400 stroke-[2] fill-none"
                                            vectorEffect="non-scaling-stroke"
                                        />
                                        <polygon
                                            points="0,150 0,100 20,90 40,95 60,70 80,80 100,50 120,60 140,20 160,30 180,10 200,5 200,150"
                                            fill="url(#forexChartGradient)"
                                        />
                                        <circle cx="200" cy="5" r="3" fill="#818cf8" className="animate-ping" />
                                    </svg>
                                </div>
                            </div>

                            <div className="bg-indigo-50 rounded-[2rem] p-6 border border-indigo-100 flex items-start gap-4">
                                <div className="bg-white p-3 rounded-xl shadow-sm text-indigo-600">
                                    <Clock className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-800">Processing Time</h4>
                                    <p className="text-sm text-slate-500 mt-1">Most transfers are completed within <span className="font-bold text-indigo-600">24-48 hours</span> depending on the destination country.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )
                }

                {
                    activeTab === 'track' && (
                        <div className="animate-in fade-in slide-in-from-bottom-4">
                            <h2 className="text-xl font-bold text-slate-900 mb-6">Your Requests</h2>

                            {myRequests.length > 0 ? (
                                <div className="grid gap-4">
                                    {myRequests.map((req) => (
                                        <div key={req.id} className="bg-white rounded-2xl shadow-sm hover:shadow-md border border-slate-100 hover:border-indigo-100 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all group overflow-hidden relative">
                                            {/* Status background hint */}
                                            <div className={`absolute left-0 top-0 bottom-0 w-1 ${req.status === 'Pending' ? 'bg-amber-400' :
                                                req.status === 'Approved' ? 'bg-emerald-400' : 'bg-red-400'
                                                }`}></div>

                                            <div className="flex items-center gap-6 pl-2">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner ${req.status === 'Pending' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                                                        req.status === 'Approved' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                                                            'bg-red-50 text-red-600 border border-red-100'
                                                        }`}>
                                                        {req.status === 'Pending' && <Clock className="w-7 h-7" />}
                                                        {req.status === 'Approved' && <CheckCircle className="w-7 h-7" />}
                                                        {req.status === 'Rejected' && <XCircle className="w-7 h-7" />}
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="font-bold text-slate-800 text-lg">{req.fromCurrency}</span>
                                                        <ArrowRight className="w-4 h-4 text-slate-300" />
                                                        <span className="font-bold text-slate-800 text-lg">{req.toCurrency}</span>
                                                    </div>
                                                    <div className="font-black text-2xl text-slate-900 tracking-tight">
                                                        {req.amount.toLocaleString()} <span className="text-sm font-bold text-slate-400">{req.fromCurrency}</span>
                                                    </div>
                                                    <p className="text-xs text-slate-400 font-mono mt-1">ID: {req.id} • {req.date}</p>
                                                </div>
                                            </div>

                                            <div className="flex flex-col items-start md:items-end gap-3 mt-4 md:mt-0 w-full md:w-auto p-4 md:p-0 bg-slate-50 md:bg-transparent rounded-xl border border-slate-100 md:border-none">
                                                <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest shadow-sm ${req.status === 'Pending' ? 'bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 border border-amber-200' :
                                                    req.status === 'Approved' ? 'bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 border border-emerald-200' :
                                                        'bg-gradient-to-r from-red-100 to-rose-100 text-red-700 border border-red-200'
                                                    }`}>
                                                    {req.status}
                                                </span>
                                                {req.adminComment && (
                                                    <div className="text-xs text-slate-600 bg-white md:bg-slate-50 p-2 text-left md:text-right rounded-lg w-full md:max-w-[250px] border border-slate-200">
                                                        <span className="font-bold text-slate-800 block mb-0.5">Admin Note:</span>
                                                        {req.adminComment}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-200">
                                    <p className="text-slate-500">No requests found. Start a new conversion request.</p>
                                </div>
                            )}
                        </div>
                    )
                }
            </div >
        </div >
    );
}
