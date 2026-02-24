import React, { useState } from 'react';
import { useGlobal } from '../../context/GlobalContext';
import { formatINR } from '../../utils/helpers';
import { PieChart, Landmark, CreditCard, Edit3, TrendingUp, TrendingDown, Briefcase, Activity, CheckCircle2, X } from 'lucide-react';

export function PersonalPortfolio() {
    const { userFinance, user } = useGlobal();
    const [showEditModal, setShowEditModal] = useState(false);
    const [requestSent, setRequestSent] = useState(false);

    // Active real data
    const chits = userFinance?.chits || [];
    const loans = userFinance?.loans || [];
    const activeChitsValue = chits.filter(c => c.status === 'Active').reduce((acc, c) => acc + c.value, 0);
    const totalLoansPending = loans.filter(l => l.status === 'Active').reduce((acc, l) => acc + l.totalPending, 0);

    // Mock generic external financial data mapped to the user's requirements
    const mockData = {
        creditCardsDue: 45000,
        otherLoans: {
            gold: 120000,
            house: 3500000,
            vehicle: 450000,
        },
        emis: 25000,
        insurances: {
            life: 15000,
            health: 8000,
        },
        investments: {
            mutualFunds: 250000,
            stocks: 420000,
            fixedDeposits: 500000,
        },
        cashflow: {
            salaries: 120000,
            returns: 15000,
            expenses: 65000,
        }
    };

    const handleRequestEdit = (e: React.FormEvent) => {
        e.preventDefault();
        setRequestSent(true);
        setTimeout(() => {
            setShowEditModal(false);
            setRequestSent(false);
        }, 2500);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 animate-fade-in relative">
            {/* Header Area - Premium 3D Glassmorphic */}
            <div className="bg-gradient-to-tr from-slate-900 via-indigo-950 to-slate-900 text-white rounded-[2.5rem] p-8 md:p-12 shadow-[0_20px_50px_rgba(30,27,75,0.5)] flex flex-col md:flex-row justify-between items-center gap-8 relative overflow-hidden border border-white/10">
                {/* 3D Orbs / Lighting */}
                <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/30 rounded-full blur-[80px] pointer-events-none -mr-20 -mt-20"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/20 rounded-full blur-[60px] pointer-events-none -ml-10 -mb-10"></div>

                {/* Abstract Pattern overlay */}
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMjAwIDIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZmlsdGVyIGlkPSJuIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjY1IiBudW1PY3RhdmVzPSIzIiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idHJhbnNwYXJlbnQiIGZpbHRlcj0idXJsKCNuKSIgb3BhY2l0eT0iMC4wNSIvPjwvc3ZnPg==')] mix-blend-overlay opacity-20"></div>

                <div className="relative z-10 text-center md:text-left flex-1">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-indigo-200 text-xs font-bold mb-6 shadow-xl uppercase tracking-widest">
                        <Activity className="w-3.5 h-3.5" /> Live Snapshot
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black flex flex-col md:flex-row items-center md:items-start md:justify-start gap-4 tracking-tight mb-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(99,102,241,0.5)] border border-white/30 transform -rotate-6">
                            <PieChart className="w-8 h-8 text-white drop-shadow-md" />
                        </div>
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-indigo-200 leading-tight">
                            Smart Wealth <br />Overview
                        </span>
                    </h1>
                    <p className="text-indigo-200/80 text-lg font-medium max-w-xl mx-auto md:mx-0">
                        {user?.name}'s complete financial fingerprint. Monitor your assets, liabilities, and core GK holdings in real-time.
                    </p>
                </div>

                <div className="relative z-10 shrink-0">
                    <button
                        onClick={() => setShowEditModal(true)}
                        className="bg-white/10 backdrop-blur-xl text-white border border-white/20 hover:bg-white/20 px-8 py-5 rounded-2xl font-black transition-all shadow-[0_10px_30px_rgba(0,0,0,0.3)] hover:shadow-[0_15px_40px_rgba(99,102,241,0.4)] hover:-translate-y-2 flex flex-col items-center gap-2 group cursor-pointer relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer skew-x-12"></div>
                        <Edit3 className="w-8 h-8 text-indigo-300 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300" />
                        <span className="uppercase tracking-widest text-xs">Request Update</span>
                    </button>
                </div>
            </div>

            {/* Top Cards: GK Core Holdings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* 3D Chit Card */}
                <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-xl shadow-indigo-100/50 relative overflow-hidden group hover:-translate-y-1 transition-transform">
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-50 rounded-full pointer-events-none group-hover:scale-150 transition-transform duration-700"></div>
                    <div className="absolute top-6 right-6 p-4 bg-indigo-50 rounded-2xl shadow-inner group-hover:rotate-12 transition-transform">
                        <Landmark className="w-10 h-10 text-indigo-600" />
                    </div>

                    <div className="text-xs font-black text-indigo-600 uppercase tracking-widest mb-2 relative z-10 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                        GK Chit Funds (Active)
                    </div>
                    <div className="text-5xl font-black text-slate-900 relative z-10 tracking-tight mb-8">₹{formatINR(activeChitsValue)}</div>

                    <div className="flex flex-col gap-3 relative z-10 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                        <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">Active Batches</h4>
                        {chits.length > 0 ? chits.map(c => (
                            <div key={c.batchId} className="flex justify-between items-center text-sm border-b border-slate-200/50 pb-2 last:border-0 last:pb-0">
                                <span className="font-bold text-slate-800">{c.batchName}</span>
                                <span className="font-black text-indigo-600 bg-white px-3 py-1 rounded-lg shadow-sm border border-slate-100">₹{formatINR(c.value)}</span>
                            </div>
                        )) : <span className="text-slate-400 italic text-sm text-center block">No active chits</span>}
                    </div>
                </div>

                {/* 3D Loan Card */}
                <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-xl shadow-rose-100/50 relative overflow-hidden group hover:-translate-y-1 transition-transform">
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-rose-50 rounded-full pointer-events-none group-hover:scale-150 transition-transform duration-700"></div>
                    <div className="absolute top-6 right-6 p-4 bg-rose-50 rounded-2xl shadow-inner group-hover:rotate-12 transition-transform">
                        <CreditCard className="w-10 h-10 text-rose-600" />
                    </div>

                    <div className="text-xs font-black text-rose-600 uppercase tracking-widest mb-2 relative z-10 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></div>
                        GK Loans Outstanding
                    </div>
                    <div className="text-5xl font-black text-slate-900 relative z-10 tracking-tight mb-8">₹{formatINR(totalLoansPending)}</div>

                    <div className="flex flex-col gap-3 relative z-10 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                        <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">Active Liabilities</h4>
                        {loans.length > 0 ? loans.map(l => (
                            <div key={l.id} className="flex justify-between items-center text-sm border-b border-slate-200/50 pb-2 last:border-0 last:pb-0">
                                <span className="font-bold text-slate-800">{l.type} Loan</span>
                                <span className="font-black text-rose-600 bg-white px-3 py-1 rounded-lg shadow-sm border border-slate-100">₹{formatINR(l.totalPending)}</span>
                            </div>
                        )) : <span className="text-slate-400 italic text-sm text-center block">No active loans</span>}
                    </div>
                </div>
            </div>

            {/* Massive Grid: Extraneous Financial Data */}
            <h2 className="text-2xl font-bold text-slate-800 border-b border-slate-200 pb-2 mt-8 flex items-center gap-2">
                <Activity className="w-6 h-6 text-emerald-500" /> Complete Financial Tracking
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                {/* Income & Cashflow */}
                <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-lg shadow-slate-200/50 hover:shadow-xl transition-all group overflow-hidden relative">
                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-50 rounded-full blur-2xl group-hover:scale-150 transition-transform"></div>
                    <div className="flex flex-col gap-4 mb-8">
                        <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 shadow-inner group-hover:-translate-y-1 transition-transform">
                            <Briefcase className="w-7 h-7" />
                        </div>
                        <h3 className="font-black text-slate-900 text-xl tracking-tight">Income Flow</h3>
                    </div>
                    <div className="space-y-4 relative z-10">
                        <div className="flex flex-col bg-slate-50 p-3 rounded-xl border border-slate-100">
                            <span className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Monthly Salary</span>
                            <span className="font-black text-emerald-600 text-lg">+₹{formatINR(mockData.cashflow.salaries)}</span>
                        </div>
                        <div className="flex flex-col bg-slate-50 p-3 rounded-xl border border-slate-100">
                            <span className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Invest Returns</span>
                            <span className="font-black text-emerald-600 text-lg">+₹{formatINR(mockData.cashflow.returns)}</span>
                        </div>
                        <div className="flex flex-col bg-rose-50/50 p-3 rounded-xl border border-rose-100/50">
                            <span className="text-xs text-rose-400 font-bold uppercase tracking-wider mb-1">Est. Expenses</span>
                            <span className="font-black text-rose-600 text-lg">-₹{formatINR(mockData.cashflow.expenses)}</span>
                        </div>
                    </div>
                </div>

                {/* Investments */}
                <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-lg shadow-slate-200/50 hover:shadow-xl transition-all group overflow-hidden relative">
                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-indigo-50 rounded-full blur-2xl group-hover:scale-150 transition-transform"></div>
                    <div className="flex flex-col gap-4 mb-8">
                        <div className="w-14 h-14 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 shadow-inner group-hover:-translate-y-1 transition-transform">
                            <TrendingUp className="w-7 h-7" />
                        </div>
                        <h3 className="font-black text-slate-900 text-xl tracking-tight">Investments</h3>
                    </div>
                    <div className="space-y-4 relative z-10">
                        <div className="flex justify-between items-center bg-slate-50 p-4 rounded-xl border border-slate-100 group-hover:border-indigo-100 transition-colors">
                            <span className="text-sm font-bold text-slate-600">Mutual Funds</span>
                            <span className="font-black text-slate-900">₹{formatINR(mockData.investments.mutualFunds)}</span>
                        </div>
                        <div className="flex justify-between items-center bg-slate-50 p-4 rounded-xl border border-slate-100 group-hover:border-indigo-100 transition-colors">
                            <span className="text-sm font-bold text-slate-600">Stock Market</span>
                            <span className="font-black text-slate-900">₹{formatINR(mockData.investments.stocks)}</span>
                        </div>
                        <div className="flex justify-between items-center bg-slate-50 p-4 rounded-xl border border-slate-100 group-hover:border-indigo-100 transition-colors">
                            <span className="text-sm font-bold text-slate-600">Fixed Deposits</span>
                            <span className="font-black text-slate-900">₹{formatINR(mockData.investments.fixedDeposits)}</span>
                        </div>
                    </div>
                </div>

                {/* Other Loans & EMIs */}
                <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-lg shadow-slate-200/50 hover:shadow-xl transition-all group overflow-hidden relative">
                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-rose-50 rounded-full blur-2xl group-hover:scale-150 transition-transform"></div>
                    <div className="flex flex-col gap-4 mb-8">
                        <div className="w-14 h-14 bg-rose-100 rounded-2xl flex items-center justify-center text-rose-600 shadow-inner group-hover:-translate-y-1 transition-transform">
                            <TrendingDown className="w-7 h-7" />
                        </div>
                        <h3 className="font-black text-slate-900 text-xl tracking-tight">Loans & Dues</h3>
                    </div>
                    <div className="space-y-4 relative z-10">
                        <div className="flex justify-between items-center bg-slate-50 p-4 rounded-xl border border-slate-100 group-hover:border-rose-100 transition-colors">
                            <span className="text-sm font-bold text-slate-600">Home Loan</span>
                            <span className="font-black text-rose-600">₹{formatINR(mockData.otherLoans.house)}</span>
                        </div>
                        <div className="flex justify-between items-center bg-slate-50 p-4 rounded-xl border border-slate-100 group-hover:border-rose-100 transition-colors">
                            <span className="text-sm font-bold text-slate-600">Vehicle Loan</span>
                            <span className="font-black text-rose-600">₹{formatINR(mockData.otherLoans.vehicle)}</span>
                        </div>
                        <div className="flex justify-between items-center bg-slate-50 p-4 rounded-xl border border-slate-100 group-hover:border-rose-100 transition-colors">
                            <span className="text-sm font-bold text-slate-600">Gold Loan</span>
                            <span className="font-black text-rose-600">₹{formatINR(mockData.otherLoans.gold)}</span>
                        </div>
                    </div>
                </div>

                {/* Cards & Risk */}
                <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-[2rem] p-8 border border-white/10 shadow-lg hover:shadow-xl transition-all group overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/20 rounded-full blur-3xl group-hover:scale-150 transition-transform -mr-10 -mt-10"></div>
                    <div className="flex flex-col gap-4 mb-6 relative z-10">
                        <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-amber-400 shadow-lg border border-white/20 group-hover:rotate-12 transition-transform">
                            <CreditCard className="w-7 h-7 drop-shadow-md" />
                        </div>
                        <h3 className="font-black text-xl tracking-tight text-white drop-shadow-sm">Cards & Risk</h3>
                    </div>
                    <div className="space-y-3 relative z-10">
                        <div className="flex flex-col bg-white/5 p-3 rounded-xl border border-white/10 backdrop-blur-sm">
                            <span className="text-[10px] text-slate-300 font-bold uppercase tracking-wider mb-1">CC Usages Due</span>
                            <span className="font-black text-amber-400">₹{formatINR(mockData.creditCardsDue)}</span>
                        </div>
                        <div className="flex flex-col bg-white/5 p-3 rounded-xl border border-white/10 backdrop-blur-sm">
                            <span className="text-[10px] text-slate-300 font-bold uppercase tracking-wider mb-1">Monthly EMIs</span>
                            <span className="font-black text-rose-400">₹{formatINR(mockData.emis)}</span>
                        </div>
                        <div className="flex justify-between items-center mt-4 border-t border-white/10 pt-4">
                            <span className="text-xs font-bold text-slate-300">Life Premium</span>
                            <span className="font-bold text-white text-sm">₹{formatINR(mockData.insurances.life)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-xs font-bold text-slate-300">Health Policy</span>
                            <span className="font-bold text-white text-sm">₹{formatINR(mockData.insurances.health)}</span>
                        </div>
                    </div>
                </div>

            </div>

            <p className="text-center text-sm font-medium text-slate-400 pb-12 mt-8 max-w-2xl mx-auto">
                All values reflect your position as of your most recent monthly calculation. GK Admin tracks your auctions and automatically feeds active Chit Fund and Loan values into this unified view.
            </p>

            {/* Edit Request Modal */}
            {showEditModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in">
                    <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg overflow-hidden relative" onClick={e => e.stopPropagation()}>

                        {/* Header */}
                        <div className="bg-indigo-600 text-white p-6 relative">
                            <button onClick={() => setShowEditModal(false)} className="absolute top-6 right-6 text-indigo-200 hover:text-white transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                            <h2 className="text-2xl font-black mb-1">Request Portfolio Update</h2>
                            <p className="text-indigo-100 text-sm">Submit your external financial changes for admin review.</p>
                        </div>

                        {/* Body */}
                        <div className="p-8">
                            {requestSent ? (
                                <div className="flex flex-col items-center justify-center text-center py-8 animate-fade-in">
                                    <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
                                        <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-slate-800 mb-2">Request Submitted!</h3>
                                    <p className="text-slate-500">Your portfolio update request has been sent to our admins. It will be verified and reflected here shortly.</p>
                                </div>
                            ) : (
                                <form onSubmit={handleRequestEdit} className="space-y-6">
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-1">Category to Update</label>
                                            <select className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 font-medium text-slate-700">
                                                <option>Credit Card Dues</option>
                                                <option>External Loan Modification</option>
                                                <option>Mutual Fund Additions</option>
                                                <option>Income / Salary Increase</option>
                                                <option>New Insurance Policy</option>
                                                <option>Other / Multiple</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-1">Current/New Value (₹)</label>
                                            <input type="number" placeholder="e.g. 50000" required className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 font-medium text-slate-700" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-1">Additional Details</label>
                                            <textarea rows={3} placeholder="Please provide proof/details of this change..." required className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 font-medium text-slate-700 resize-none"></textarea>
                                        </div>
                                    </div>
                                    <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-500/30 transition-all hover:-translate-y-1">
                                        Send Request to Admin
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
