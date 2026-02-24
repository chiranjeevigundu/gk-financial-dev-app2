import React from 'react';
import { useGlobal } from '../../context/GlobalContext';
import { formatINR } from '../../utils/helpers';
import { Calendar, ReceiptText, Download, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';

export function MonthlyPayments() {
    const { userFinance, auctionConfig } = useGlobal();

    const currentMonth = auctionConfig.runningMonth || "Current Month";

    const chits = userFinance?.chits || [];
    const loans = userFinance?.loans || [];

    // Calculate dues
    const chitDues = chits.filter(c => c.status === 'Active').map(c => ({
        id: c.batchId,
        desc: `Chit Installment: ${c.batchName}`,
        amount: c.currentMonthPayment || 20000,
        type: 'Chit',
        color: 'bg-emerald-500'
    }));

    const loanDues = loans.filter(l => l.status === 'Active').map(l => ({
        id: l.id,
        desc: `${l.type} Loan EMI`,
        amount: l.monthlyInterest || 2100,
        type: 'Loan',
        color: 'bg-amber-500'
    }));

    const allDues = [...chitDues, ...loanDues];
    const totalDues = allDues.reduce((acc, curr) => acc + curr.amount, 0);

    const chitTotal = chitDues.reduce((acc, curr) => acc + curr.amount, 0);
    const loanTotal = loanDues.reduce((acc, curr) => acc + curr.amount, 0);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
            <h1 className="text-3xl font-black text-slate-900 mb-6 flex items-center gap-3">
                <span className="text-4xl">🧾</span> Monthly Dues Workspace
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* 3D Calendar Widget */}
                <div className="lg:col-span-1 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-[2rem] p-8 text-white shadow-xl shadow-indigo-500/30 relative overflow-hidden flex flex-col items-center text-center justify-center">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/20 rounded-full blur-2xl -ml-10 -mb-10"></div>

                    <div className="relative z-10">
                        {/* 3D Calendar Icon */}
                        <div className="w-32 h-32 mx-auto mb-6 relative preserve-3d group cursor-pointer">
                            <div className="absolute inset-0 bg-white rounded-2xl shadow-[0_20px_0_#94a3b8] transform rotate-x-12 transition-transform duration-500 group-hover:rotate-x-0 group-hover:translate-y-2 border-t-8 border-rose-500 flex flex-col overflow-hidden">
                                <div className="bg-rose-500 w-full h-8 flex items-center justify-center">
                                    <div className="flex gap-4">
                                        <div className="w-2 h-4 bg-slate-200 rounded-full shadow-inner"></div>
                                        <div className="w-2 h-4 bg-slate-200 rounded-full shadow-inner"></div>
                                    </div>
                                </div>
                                <div className="flex-1 flex flex-col items-center justify-center bg-slate-50">
                                    <span className="text-xs uppercase font-extrabold text-slate-400 tracking-widest">Due Date</span>
                                    <span className="text-4xl font-black text-slate-800">10TH</span>
                                </div>
                            </div>
                        </div>

                        <h3 className="text-2xl font-black tracking-tight mb-2 uppercase text-white drop-shadow-md">
                            {currentMonth}
                        </h3>
                        <p className="text-indigo-200 text-sm font-medium bg-black/20 px-4 py-2 rounded-full inline-block backdrop-blur-sm border border-white/10">
                            Clear dues before 10th to avoid penalties.
                        </p>
                    </div>
                </div>

                {/* Total Payment Banner & Visual Breakdown */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white rounded-[2rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>

                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10 mb-8 border-b border-slate-100 pb-8">
                            <div>
                                <h2 className="text-slate-500 font-bold uppercase tracking-widest text-sm mb-2">Total Amount Payable</h2>
                                <div className="text-5xl font-black text-slate-900 tracking-tight flex items-baseline gap-2">
                                    <span className="text-3xl text-rose-500">₹</span>
                                    {totalDues > 0 ? formatINR(totalDues) : '0'}
                                </div>
                            </div>
                            <button disabled={totalDues === 0} className="px-8 py-4 bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-2xl font-bold transition-all shadow-lg hover:shadow-xl hover:shadow-slate-900/40 hover:-translate-y-1 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-3 text-lg">
                                {totalDues === 0 ? 'No Dues 😎' : 'Pay Entire Amount'}
                                {totalDues > 0 && <ArrowRight className="w-6 h-6" />}
                            </button>
                        </div>

                        {/* Breakdown Visual Bar */}
                        {totalDues > 0 && (
                            <div className="relative z-10">
                                <h3 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4 text-indigo-500" /> Graphic Dues Breakdown
                                </h3>
                                <div className="h-6 w-full bg-slate-100 rounded-full overflow-hidden flex shadow-inner mb-4">
                                    <div className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 transition-all duration-1000" style={{ width: `${(chitTotal / totalDues) * 100}%` }}></div>
                                    <div className="h-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-1000" style={{ width: `${(loanTotal / totalDues) * 100}%` }}></div>
                                </div>
                                <div className="flex gap-6">
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 rounded bg-emerald-500 shadow-md shadow-emerald-500/30"></div>
                                        <span className="text-sm font-bold text-slate-600">Chit Dues <span className="text-slate-900 ml-1">₹{formatINR(chitTotal)}</span></span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 rounded bg-amber-500 shadow-md shadow-amber-500/30"></div>
                                        <span className="text-sm font-bold text-slate-600">Loan EMIs <span className="text-slate-900 ml-1">₹{formatINR(loanTotal)}</span></span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Individual Invoices */}
            <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <h3 className="text-xl font-black text-slate-900 flex items-center gap-3">
                        <ReceiptText className="w-6 h-6 text-indigo-500" /> Detailed Invoice Items
                    </h3>
                    <button className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl font-bold transition-all shadow-sm">
                        <Download className="w-4 h-4" /> Download PDF
                    </button>
                </div>

                <div className="p-8">
                    {allDues.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {allDues.map((item, i) => (
                                <div key={i} className="flex relative bg-white p-6 rounded-2xl border border-slate-100 hover:border-indigo-200 hover:shadow-lg transition-all group overflow-hidden">
                                    {/* Left colored border accent */}
                                    <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${item.color} group-hover:w-2 transition-all`}></div>

                                    <div className="flex-1 pl-2">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded text-white ${item.color} shadow-sm`}>
                                                    {item.type}
                                                </span>
                                                <h4 className="font-bold text-slate-800 mt-2 text-lg leading-tight">{item.desc}</h4>
                                                <span className="text-xs font-mono text-slate-400 mt-1 block">ID: {item.id}</span>
                                            </div>
                                            <div className="font-black text-rose-500 text-2xl tracking-tight">
                                                ₹{formatINR(item.amount)}
                                            </div>
                                        </div>
                                        <button className="w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-lg text-sm font-bold transition-colors border border-slate-200 group-hover:bg-slate-900 group-hover:text-white group-hover:border-slate-900">
                                            Pay Partially
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16 text-slate-500 bg-slate-50 rounded-2xl flex flex-col items-center justify-center border-2 border-dashed border-slate-200">
                            <CheckCircle2 className="w-16 h-16 text-emerald-400 mb-6 drop-shadow-lg" />
                            <p className="font-black text-2xl text-slate-800 mb-2">You're All Caught Up!</p>
                            <p className="text-slate-500">No pending payments for {currentMonth}. Enjoy your day!</p>
                        </div>
                    )}
                </div>
            </div>

            <p className="text-center text-xs text-slate-400 font-medium">
                * Payments are processed securely via GK Payment Gateway. Allow 24 hours for reflection.
            </p>
        </div>
    );
}
