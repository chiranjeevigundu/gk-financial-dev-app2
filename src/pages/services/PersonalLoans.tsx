import React, { useState } from 'react';
import { useGlobal } from '../../context/GlobalContext';
import { formatINR } from '../../utils/helpers';
import { Wallet, TrendingUp, CheckCircle, Calculator, Percent, ArrowRight } from 'lucide-react';

export function PersonalLoans() {
    const { user, userFinance, addUserRequest } = useGlobal();
    const [activeTab, setActiveTab] = useState<'loans' | 'interest' | 'calculator'>('loans');

    // Calculator State
    const [calcAmount, setCalcAmount] = useState(100000);
    const [calcRate, setCalcRate] = useState(11);
    const [calcMonths, setCalcMonths] = useState(24);

    const monthlyInterestRate = calcRate / 12 / 100;
    const emi = calcAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, calcMonths) / (Math.pow(1 + monthlyInterestRate, calcMonths) - 1);
    const totalPayment = emi * calcMonths;
    const totalInterest = totalPayment - calcAmount;

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Personal Finance Dashboard</h1>
                    <p className="text-slate-500 mt-2">Manage your chits, loans, and investments in one place.</p>
                </div>
                <div className="flex bg-white rounded-xl p-1 shadow-sm border border-slate-100">
                    <button
                        onClick={() => setActiveTab('loans')}
                        className={`px - 6 py - 2 rounded - lg font - medium text - sm transition - all flex items - center gap - 2 ${activeTab === 'loans'
                            ? 'bg-indigo-600 text-white shadow-md'
                            : 'text-slate-600 hover:bg-slate-50'
                            } `}
                    >
                        🏦 Active Loans Dashboard
                    </button>
                    <button
                        onClick={() => setActiveTab('interest')}
                        className={`px - 6 py - 2 rounded - lg font - medium text - sm transition - all flex items - center gap - 2 ${activeTab === 'interest'
                            ? 'bg-indigo-600 text-white shadow-md'
                            : 'text-slate-600 hover:bg-slate-50'
                            } `}
                    >
                        📈 Interest Services
                    </button>
                    <button
                        onClick={() => setActiveTab('calculator')}
                        className={`px - 6 py - 2 rounded - lg font - medium text - sm transition - all flex items - center gap - 2 ${activeTab === 'calculator'
                            ? 'bg-indigo-600 text-white shadow-md'
                            : 'text-slate-600 hover:bg-slate-50'
                            } `}
                    >
                        🧮 EMI Calculator
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className="min-h-[500px]">
                {activeTab === 'loans' && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                        <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
                            <span className="text-3xl">🏦</span> Active Loans Dashboard
                        </h2>

                        {userFinance?.loans && userFinance.loans.length > 0 ? (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {userFinance.loans.map((loan) => {
                                    const progressPercent = Math.min(100, Math.round(((loan.amount - loan.pendingPrincipal) / loan.amount) * 100));

                                    return (
                                        <div key={loan.id} className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/40 border border-slate-100 p-8 relative overflow-hidden group">
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-100 rounded-full blur-3xl opacity-60 -mr-10 -mt-10 pointer-events-none transition-transform group-hover:scale-150 duration-500"></div>

                                            <div className="flex items-start justify-between mb-8 relative z-10">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-amber-500/30">
                                                        <Wallet className="w-7 h-7" />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bold text-xl text-slate-900">{loan.type} Loan</h3>
                                                        <p className="text-sm text-slate-500 font-mono mt-0.5">ID: {loan.id}</p>
                                                    </div>
                                                </div>
                                                <div className="px-4 py-1.5 bg-gradient-to-r from-emerald-400 to-emerald-500 text-white rounded-full text-xs font-black tracking-wider uppercase shadow-md shadow-emerald-500/20">
                                                    {loan.status}
                                                </div>
                                            </div>

                                            <div className="space-y-6 relative z-10">
                                                {/* Progress Bar 3D */}
                                                <div>
                                                    <div className="flex justify-between text-sm mb-2">
                                                        <span className="font-bold text-slate-700">Repayment Progress</span>
                                                        <span className="font-black text-amber-600">{progressPercent}%</span>
                                                    </div>
                                                    <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden shadow-inner border border-slate-200/60">
                                                        <div className="h-full bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 rounded-full relative" style={{ width: `${progressPercent}% ` }}>
                                                            <div className="absolute inset-0 bg-white/20 w-full h-1"></div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                                        <span className="text-slate-500 text-xs font-bold uppercase tracking-wider block mb-1">Loan Amount</span>
                                                        <span className="font-black text-slate-900 text-xl">₹{formatINR(loan.amount)}</span>
                                                    </div>
                                                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                                        <span className="text-slate-500 text-xs font-bold uppercase tracking-wider block mb-1">Interest Rate</span>
                                                        <span className="font-black text-slate-900 text-xl flex items-center gap-1">
                                                            {loan.interestRate}% <span className="text-xs text-slate-400 font-medium lowercase">p.a.</span>
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-5 text-white shadow-lg relative overflow-hidden">
                                                    <div className="absolute right-0 bottom-0 text-6xl opacity-10">💸</div>
                                                    <div className="flex justify-between items-center mb-3">
                                                        <span className="text-slate-300 text-sm font-medium">Total Pending Due</span>
                                                        <span className="font-black text-2xl text-rose-400">₹{formatINR(loan.totalPending)}</span>
                                                    </div>
                                                    <div className="text-xs text-slate-400 flex justify-between bg-black/20 p-2 rounded-lg">
                                                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400 block"></span> Principal: ₹{formatINR(loan.pendingPrincipal)}</span>
                                                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-400 block"></span> Int. Paid: ₹{formatINR(loan.interestPaid)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-200">
                                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <CheckCircle className="w-8 h-8 text-slate-300" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 mb-2">No Open Loans</h3>
                                <p className="text-slate-500">You don't have any active loans at the moment.</p>
                                <button
                                    onClick={() => {
                                        if (!user) return alert('Please log in first.');
                                        addUserRequest({
                                            userId: user.id,
                                            userName: user.name,
                                            type: 'New Loan',
                                            details: { note: 'User expressed interest in a new loan.' }
                                        });
                                        alert('Loan request sent to Admin!');
                                    }}
                                    className="mt-6 px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                                >
                                    Apply for Loan
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'interest' && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                        <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-indigo-600" />
                            Interest Services
                        </h2>

                        {userFinance?.deposits && userFinance.deposits.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {userFinance.deposits.map((deposit) => (
                                    <div key={deposit.id} className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-lg p-6 text-white">
                                        <div className="flex items-center justify-between mb-6">
                                            <div>
                                                <h3 className="font-bold text-lg">Fixed Deposit</h3>
                                                <p className="text-emerald-100 text-sm">ID: {deposit.id}</p>
                                            </div>
                                            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                                                <TrendingUp className="w-5 h-5 text-white" />
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center pb-4 border-b border-white/10">
                                                <span className="text-emerald-100 text-sm">Principal Amount</span>
                                                <span className="font-bold text-white text-xl">₹{formatINR(deposit.amount)}</span>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="bg-white/10 p-3 rounded-xl backdrop-blur-md border border-white/5">
                                                    <span className="text-emerald-100 text-[10px] uppercase font-bold tracking-widest block mb-1">Interest Rate</span>
                                                    <span className="font-black text-xl">{deposit.interestRate}% <span className="text-xs font-medium">p.a.</span></span>
                                                </div>
                                                <div className="bg-white/10 p-3 rounded-xl backdrop-blur-md border border-white/5">
                                                    <span className="text-emerald-100 text-[10px] uppercase font-bold tracking-widest block mb-1">Interest Earned</span>
                                                    <span className="font-black text-xl text-emerald-200">+₹{formatINR(deposit.interestEarned)}</span>
                                                </div>
                                                <div className="bg-white/10 p-3 rounded-xl backdrop-blur-md border border-white/5 col-span-2 flex justify-between items-center">
                                                    <div>
                                                        <span className="text-emerald-100 text-[10px] uppercase font-bold tracking-widest block mb-1">Invested On</span>
                                                        <span className="font-black">{deposit.date}</span>
                                                    </div>
                                                    <div className="text-right">
                                                        <span className="text-emerald-100 text-[10px] uppercase font-bold tracking-widest block mb-1">Status</span>
                                                        <span className="font-bold text-xs bg-white text-emerald-700 px-3 py-1 rounded-full shadow-md">{deposit.status}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-200">
                                <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <TrendingUp className="w-8 h-8 text-indigo-400" />
                                </div>
                                <h3 className="text-2xl font-black text-slate-900 mb-2">Grow Your Wealth 🌱</h3>
                                <p className="text-slate-500 max-w-md mx-auto mb-8 leading-relaxed">
                                    "Deposit your money, start investing, and watch your wealth grow in silence."
                                </p>
                                <button
                                    onClick={() => {
                                        if (!user) return alert('Please log in first.');
                                        addUserRequest({
                                            userId: user.id,
                                            userName: user.name,
                                            type: 'New Deposit',
                                            details: { note: 'User wants to open a new Fixed Deposit.' }
                                        });
                                        alert('Deposit request sent to Admin!');
                                    }}
                                    className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-emerald-500/30 transition-all transform hover:-translate-y-1"
                                >
                                    Start Investment Now 🚀
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'calculator' && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                        <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
                            <span className="text-3xl">🧮</span> Visual EMI Calculator
                        </h2>

                        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                            <div className="lg:col-span-3 bg-white rounded-[2rem] p-8 shadow-xl shadow-slate-200/40 border border-slate-100">
                                <div className="space-y-8">
                                    <div>
                                        <div className="flex justify-between mb-2">
                                            <label className="font-bold text-slate-700">Loan Amount</label>
                                            <span className="font-black text-indigo-600 text-xl">₹{formatINR(calcAmount)}</span>
                                        </div>
                                        <input
                                            type="range"
                                            min="10000" max="5000000" step="10000"
                                            value={calcAmount}
                                            onChange={(e) => setCalcAmount(Number(e.target.value))}
                                            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                        />
                                        <div className="flex justify-between text-xs font-bold text-slate-400 mt-2 uppercase tracking-widest">
                                            <span>10K</span>
                                            <span>50L</span>
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex justify-between mb-2">
                                            <label className="font-bold text-slate-700">Interest Rate (p.a.)</label>
                                            <span className="font-black text-rose-500 text-xl">{calcRate}%</span>
                                        </div>
                                        <input
                                            type="range"
                                            min="1" max="30" step="0.5"
                                            value={calcRate}
                                            onChange={(e) => setCalcRate(Number(e.target.value))}
                                            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-rose-500"
                                        />
                                    </div>

                                    <div>
                                        <div className="flex justify-between mb-2">
                                            <label className="font-bold text-slate-700">Loan Tenure</label>
                                            <span className="font-black text-amber-500 text-xl">{calcMonths} <span className="text-sm">Months</span></span>
                                        </div>
                                        <input
                                            type="range"
                                            min="6" max="120" step="1"
                                            value={calcMonths}
                                            onChange={(e) => setCalcMonths(Number(e.target.value))}
                                            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="lg:col-span-2">
                                <div className="bg-slate-900 rounded-[2rem] p-8 text-white shadow-2xl relative overflow-hidden h-full flex flex-col justify-center">
                                    <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl"></div>

                                    <div className="relative z-10 space-y-8">
                                        <div className="text-center">
                                            <p className="text-indigo-300 font-bold uppercase tracking-widest text-xs mb-2">Equated Monthly Installment</p>
                                            <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-indigo-300 to-purple-400 mb-2">
                                                ₹{formatINR(Math.round(emi))}
                                            </div>
                                            <p className="text-slate-400 text-sm">per month</p>
                                        </div>

                                        <div className="space-y-4 pt-6 border-t border-slate-700/50">
                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                                                    <span className="text-slate-300">Principal Amount</span>
                                                </div>
                                                <span className="font-bold">₹{formatINR(calcAmount)}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                                                    <span className="text-slate-300">Total Interest</span>
                                                </div>
                                                <span className="font-bold">₹{formatINR(Math.round(totalInterest))}</span>
                                            </div>
                                            <div className="flex justify-between items-center border-t border-slate-700/50 pt-4">
                                                <span className="text-slate-200 font-bold">Total Payment</span>
                                                <span className="font-black text-xl text-white">₹{formatINR(Math.round(totalPayment))}</span>
                                            </div>
                                        </div>

                                        {/* Beautiful CSS Donut Chart */}
                                        <div className="pt-6 flex justify-center">
                                            <div className="w-32 h-32 rounded-full border-[12px] border-rose-500 relative flex items-center justify-center shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]">
                                                <div className="absolute inset-[-12px] rounded-full border-[12px] border-indigo-500 shadow-lg"
                                                    style={{ clipPath: `polygon(0 0, 100 % 0, 100 % ${100 - (totalInterest / totalPayment) * 100} %, 0 ${100 - (totalInterest / totalPayment) * 100} %)` }}></div>
                                                <div className="text-center leading-tight">
                                                    <span className="block text-2xl font-black">{(calcAmount / totalPayment * 100).toFixed(0)}%</span>
                                                    <span className="text-[10px] text-indigo-300 font-bold uppercase">Principal</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
