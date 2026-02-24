import React, { useState } from 'react';
import { CreditCard, ShoppingBag, Coffee, Car, Smartphone, Activity } from 'lucide-react';

export function CreditCards() {
    const [isFlipped, setIsFlipped] = useState(false);

    const spendData = [
        { category: 'Shopping', amount: 15400, color: 'bg-rose-500', icon: ShoppingBag },
        { category: 'Dining', amount: 8200, color: 'bg-amber-500', icon: Coffee },
        { category: 'Transport', amount: 4500, color: 'bg-sky-500', icon: Car },
        { category: 'Utilities', amount: 3100, color: 'bg-emerald-500', icon: Smartphone },
    ];

    const totalSpend = spendData.reduce((acc, curr) => acc + curr.amount, 0);
    const creditLimit = 150000;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
            <h1 className="text-3xl font-black text-slate-900 mb-6 flex items-center gap-3">
                <span className="text-4xl">💳</span> Premium Credit Services
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* 3D Interactive Card Section */}
                <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl flex flex-col items-center justify-center min-h-[400px]">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl -mr-20 -mt-20"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl -ml-20 -mb-20"></div>

                    <h3 className="relative z-10 text-xl font-bold mb-8 text-slate-300 w-full text-center">GK Signature Card</h3>

                    {/* 3D Flip Card Container */}
                    <div
                        className="relative w-80 md:w-96 h-52 md:h-60 rounded-2xl cursor-pointer perspective-1000 group z-10"
                        onClick={() => setIsFlipped(!isFlipped)}
                    >
                        <div className={`w-full h-full duration-700 preserve-3d relative transition-transform ${isFlipped ? 'rotate-y-180' : ''}`}>

                            {/* Front of Card */}
                            <div className="absolute w-full h-full backface-hidden rounded-2xl bg-gradient-to-tr from-slate-800 via-indigo-900 to-purple-800 p-6 shadow-[0_20px_50px_rgba(79,70,229,0.5)] border border-white/20 flex flex-col justify-between overflow-hidden">
                                {/* Glass shine effect */}
                                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-white/0 via-white/10 to-white/0 transform -skew-x-12 -translate-x-full group-hover:animate-[shimmer_2s_infinite]"></div>

                                <div className="flex justify-between items-start">
                                    <div className="text-2xl font-black italic tracking-tighter self-end bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-yellow-600">GK GROUPS</div>
                                    <CreditCard className="w-8 h-8 text-slate-300 opacity-50" />
                                </div>

                                <div>
                                    <div className="flex gap-4 mb-2">
                                        <div className="w-12 h-8 bg-yellow-600/50 rounded flex items-center justify-center border border-yellow-400/30">
                                            <div className="w-8 h-4 border border-yellow-400/50 rounded-sm"></div>
                                        </div>
                                    </div>
                                    <div className="font-mono text-xl md:text-2xl tracking-[0.2em] text-slate-200 drop-shadow-md">
                                        4532 9981 7730 2024
                                    </div>
                                    <div className="flex justify-between items-end mt-4">
                                        <div className="text-xs uppercase tracking-widest text-slate-400 font-bold">
                                            Cardholder Name<br />
                                            <span className="text-sm md:text-base text-slate-200">JOHN DOE</span>
                                        </div>
                                        <div className="text-xs uppercase tracking-widest text-slate-400 font-bold text-right">
                                            Valid Thru<br />
                                            <span className="text-sm md:text-base text-slate-200">12/28</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Back of Card */}
                            <div className="absolute w-full h-full backface-hidden rounded-2xl bg-gradient-to-bl from-slate-900 via-slate-800 to-indigo-950 p-6 shadow-2xl border border-white/10 rotate-y-180 flex flex-col justify-center gap-6">
                                <div className="absolute top-8 left-0 w-full h-12 bg-black"></div>
                                <div className="mt-8 bg-slate-200 h-10 w-3/4 mx-auto rounded flex justify-end items-center px-4">
                                    <span className="font-mono text-black font-bold italic">732</span>
                                </div>
                                <div className="text-[8px] text-slate-500 text-center px-4">
                                    This card is property of GK Groups. If found, please return to any GK branch. Use of this card is governed by the Cardholder Agreement.
                                </div>
                            </div>

                        </div>
                    </div>
                    <p className="mt-8 text-slate-400 text-sm animate-pulse z-10 flex items-center gap-2">👆 Click card to flip</p>
                </div>

                {/* Spends and Charts Section */}
                <div className="bg-white rounded-[2rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col justify-between">
                    <div>
                        <div className="flex justify-between items-end mb-6">
                            <div>
                                <h3 className="text-xl font-black text-slate-900">Current Spends</h3>
                                <p className="text-slate-500 text-sm">Statement cycle: Nov 1 - Nov 30</p>
                            </div>
                            <div className="text-right">
                                <div className="text-3xl font-black text-rose-500">₹{formatINR(totalSpend)}</div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Outstanding</p>
                            </div>
                        </div>

                        {/* Visual Progress Bar limits */}
                        <div className="mb-8 bg-slate-50 p-5 rounded-2xl border border-slate-100">
                            <div className="flex justify-between text-sm mb-2 font-bold">
                                <span className="text-slate-600 flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-indigo-500"></div> Used</span>
                                <span className="text-emerald-600 flex items-center gap-2">Available <div className="w-3 h-3 rounded-full bg-emerald-400"></div></span>
                            </div>
                            <div className="h-4 w-full bg-emerald-100 rounded-full overflow-hidden flex shadow-inner">
                                <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-r-full shadow-lg relative" style={{ width: `${(totalSpend / creditLimit) * 100}%` }}>
                                    <div className="absolute inset-0 bg-white/20 w-full h-1"></div>
                                </div>
                            </div>
                            <div className="flex justify-between text-xs text-slate-500 mt-2 font-mono">
                                <span>₹0</span>
                                <span>Limit: ₹{formatINR(creditLimit)}</span>
                            </div>
                        </div>

                        {/* Spend Categories - Rich Graphics */}
                        <h4 className="font-bold text-slate-700 mb-4 px-2">Top Spend Categories</h4>
                        <div className="space-y-4">
                            {spendData.map((item, idx) => {
                                const Icon = item.icon;
                                const percent = Math.round((item.amount / totalSpend) * 100);
                                return (
                                    <div key={idx} className="flex items-center gap-4 bg-white hover:bg-slate-50 p-3 rounded-2xl transition-colors border border-transparent hover:border-slate-100 cursor-pointer group">
                                        <div className={`w-12 h-12 rounded-xl text-white flex items-center justify-center shadow-lg ${item.color} shadow-${item.color.replace('bg-', '')}/30 group-hover:scale-110 transition-transform`}>
                                            <Icon className="w-6 h-6" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between mb-1">
                                                <span className="font-bold text-slate-800">{item.category}</span>
                                                <span className="font-black text-slate-900">₹{formatINR(item.amount)}</span>
                                            </div>
                                            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                <div className={`h-full ${item.color}`} style={{ width: `${percent}%` }}></div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
                <button className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all flex flex-col items-center justify-center gap-3 text-indigo-600 group">
                    <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                        <Activity className="w-6 h-6" />
                    </div>
                    <span className="font-bold text-sm text-slate-700">Pay Bill</span>
                </button>
                <button className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all flex flex-col items-center justify-center gap-3 text-emerald-600 group">
                    <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                        <ShoppingBag className="w-6 h-6" />
                    </div>
                    <span className="font-bold text-sm text-slate-700">Rewards (12K)</span>
                </button>
                <button className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all flex flex-col items-center justify-center gap-3 text-sky-600 group">
                    <div className="w-12 h-12 rounded-full bg-sky-50 flex items-center justify-center group-hover:bg-sky-600 group-hover:text-white transition-colors">
                        <Car className="w-6 h-6" />
                    </div>
                    <span className="font-bold text-sm text-slate-700">Manage Limits</span>
                </button>
                <button className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all flex flex-col items-center justify-center gap-3 text-rose-600 group">
                    <div className="w-12 h-12 rounded-full bg-rose-50 flex items-center justify-center group-hover:bg-rose-600 group-hover:text-white transition-colors">
                        <Coffee className="w-6 h-6" />
                    </div>
                    <span className="font-bold text-sm text-slate-700">Block Card</span>
                </button>
            </div>
        </div>
    );
}
