import React, { useState, useEffect } from 'react';
import { useGlobal } from '../../context/GlobalContext';
import { formatINR } from '../../utils/helpers';
import { List, CheckCircle, Clock } from 'lucide-react';

export function ChitDetails() {
    const { user, userFinance, batches, addUserRequest } = useGlobal();
    const [currentBatchIndex, setCurrentBatchIndex] = useState(0);

    // Auto-rotate batches every 10 seconds
    useEffect(() => {
        if (!batches || batches.length === 0) return;
        const interval = setInterval(() => {
            setCurrentBatchIndex((prev) => (prev + 1) % batches.length);
        }, 10000);
        return () => clearInterval(interval);
    }, [batches]);

    const myChits = userFinance?.chits || [];

    // Categorize
    const activeChits = myChits.filter(c => c.status === 'Active');
    const closedChits = myChits.filter(c => c.status === 'Completed');

    // Available batches to join
    const availableBatches = batches.filter(b => b.status === 'Active' && !myChits.some(mc => mc.batchId === b.id));

    const currentBatch = batches[currentBatchIndex];

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
            <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-lg">
                <h1 className="text-2xl font-bold flex items-center gap-3">
                    <List className="w-6 h-6 text-emerald-400" />
                    My Chit Details
                </h1>
                <p className="text-slate-400 mt-1">View your active and closed chit funds, and explore new batches to join.</p>
            </div>

            {/* Hanging Board - Live Batch Status */}
            {currentBatch && (
                <div className="bg-slate-900 rounded-[2rem] p-8 text-white relative overflow-hidden shadow-2xl border border-slate-700">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-600/20 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 relative z-10 gap-6">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center font-bold text-2xl shadow-lg ring-4 ring-emerald-500/20">
                                {currentBatch.id.split('-')[1]}
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold leading-tight">{currentBatch.name}</h3>
                                <p className="text-emerald-300 text-sm font-mono mt-1 tracking-wider">CODE: {currentBatch.id}</p>
                            </div>
                        </div>
                        <div className="text-left md:text-right bg-white/5 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/10">
                            <div className="text-xs text-emerald-300 uppercase tracking-widest font-bold mb-1">Current Month</div>
                            <div className="text-3xl font-black">{currentBatch.currentMonth}</div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 relative z-10">
                        <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50">
                            <div className="text-[10px] text-emerald-300 uppercase tracking-widest font-bold mb-2">Chit Value</div>
                            <div className="text-2xl md:text-3xl font-light text-white">₹{formatINR(currentBatch.value)}</div>
                        </div>
                        <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50">
                            <div className="text-[10px] text-emerald-300 uppercase tracking-widest font-bold mb-2">Subscription</div>
                            <div className="text-2xl md:text-3xl font-light text-white">₹{formatINR(currentBatch.subscription)}</div>
                        </div>
                        <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50">
                            <div className="text-[10px] text-emerald-300 uppercase tracking-widest font-bold mb-2">Mthly Dividend</div>
                            <div className="text-2xl md:text-3xl font-bold text-emerald-400">+₹{formatINR(currentBatch.dividend)}</div>
                        </div>
                        <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50">
                            <div className="text-[10px] text-emerald-300 uppercase tracking-widest font-bold mb-2">Next Auction</div>
                            <div className="text-lg md:text-xl font-medium flex items-center gap-2 text-white">
                                <Clock className="w-5 h-5 text-emerald-400" />
                                {currentBatch.nextAuction}
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 flex justify-center gap-2">
                        {batches.map((_, idx) => (
                            <div
                                key={idx}
                                className={`h-1.5 rounded-full transition-all duration-700 ${idx === currentBatchIndex ? 'w-10 bg-emerald-500 shadow-[0_0_10px_theme(colors.emerald.500)]' : 'w-3 bg-slate-700'}`}
                            ></div>
                        ))}
                    </div>
                </div>
            )}

            {/* Active Chits */}
            <div>
                <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-600" /> Active Chits
                </h2>
                {activeChits.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {activeChits.map(chit => (
                            <div key={chit.batchId} className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="font-bold text-slate-900">{chit.batchName}</h3>
                                        <p className="text-xs text-slate-400 font-mono">{chit.batchId}</p>
                                    </div>
                                    <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded-lg text-xs font-bold uppercase tracking-wider">Active</span>
                                </div>
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between border-b border-slate-100 pb-2">
                                        <span className="text-slate-500">Chit Value</span>
                                        <span className="font-bold text-slate-800">₹{formatINR(chit.value)}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-slate-100 pb-2">
                                        <span className="text-slate-500">Term Duration</span>
                                        <span className="font-bold text-slate-800">{chit.term} Months</span>
                                    </div>
                                    <div className="flex justify-between border-b border-slate-100 pb-2">
                                        <span className="text-slate-500">Installments Paid</span>
                                        <span className="font-bold text-slate-800">{chit.installmentsPaid} / {chit.term}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-slate-100 pb-2">
                                        <span className="text-slate-500">Total Paid</span>
                                        <span className="font-bold text-emerald-600">₹{formatINR(chit.totalPaid)}</span>
                                    </div>
                                    <div className="flex justify-between pt-1">
                                        <span className="text-slate-500">Bid Won?</span>
                                        <span className={`font-bold ${chit.bidWon ? 'text-indigo-600' : 'text-slate-400'}`}>
                                            {chit.bidWon ? `Yes (${chit.bidMonth || '-'})` : 'No'}
                                        </span>
                                    </div>
                                </div>
                                <div className="mt-6 pt-4 border-t border-slate-100">
                                    <button className="w-full text-indigo-600 font-bold text-sm bg-indigo-50 hover:bg-indigo-100 py-2 rounded-lg transition-colors">
                                        View Past Month Details
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center">
                        <p className="text-slate-500 border-b border-dashed border-slate-200 pb-4 mb-4">You do not have any active chits.</p>
                        <p className="text-sm font-bold text-slate-400">Join a batch below to get started.</p>
                    </div>
                )}
            </div>

            {/* Closed Chits */}
            {closedChits.length > 0 && (
                <div>
                    <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <Clock className="w-5 h-5 text-slate-500" /> Closed Chits
                    </h2>
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                                <tr>
                                    <th className="p-4 font-bold">Batch</th>
                                    <th className="p-4 font-bold">Value</th>
                                    <th className="p-4 font-bold">Term</th>
                                    <th className="p-4 font-bold text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {closedChits.map(chit => (
                                    <tr key={chit.batchId} className="hover:bg-slate-50">
                                        <td className="p-4">
                                            <div className="font-bold text-slate-800">{chit.batchName}</div>
                                            <div className="text-xs text-slate-400 font-mono">{chit.batchId}</div>
                                        </td>
                                        <td className="p-4 font-bold text-slate-600">₹{formatINR(chit.value)}</td>
                                        <td className="p-4 text-slate-600">{chit.term} Months</td>
                                        <td className="p-4 text-right">
                                            <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-bold uppercase">Closed</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Explore New Batches */}
            <div>
                <h2 className="text-xl font-bold text-slate-800 mb-4">Explore Available Batches</h2>
                <div className="bg-slate-50 rounded-xl border border-slate-200 p-6">
                    {availableBatches.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {availableBatches.map(b => (
                                <div key={b.id} className="bg-white border border-slate-200 p-4 rounded-xl flex flex-col items-start shadow-sm hover:shadow-md transition-shadow">
                                    <h4 className="font-bold text-slate-900">{b.name}</h4>
                                    <p className="text-xs text-slate-500 font-mono mb-3">{b.id}</p>
                                    <div className="w-full flex justify-between text-sm mb-1">
                                        <span className="text-slate-500">Value</span>
                                        <span className="font-bold text-slate-800">₹{formatINR(b.value)}</span>
                                    </div>
                                    <div className="w-full flex justify-between text-sm mb-4 border-b border-slate-100 pb-2">
                                        <span className="text-slate-500">Monthly Sub</span>
                                        <span className="font-bold text-emerald-600">₹{formatINR(b.subscription)}</span>
                                    </div>
                                    <button
                                        onClick={() => {
                                            if (!user) return alert("Please log in to join.");
                                            addUserRequest({
                                                userId: user.id,
                                                userName: user.name,
                                                type: 'Join Chit',
                                                details: {
                                                    batchId: b.id,
                                                    batchName: b.name,
                                                    value: formatINR(b.value),
                                                    subscription: formatINR(b.subscription)
                                                }
                                            });
                                            alert(`Join request for ${b.name} sent to Admin!`);
                                        }}
                                        className="w-full mt-auto py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-bold text-sm transition-colors"
                                    >
                                        Request to Join
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-slate-500 text-center py-4 font-medium">There are no new batches available at the moment.</p>
                    )}
                </div>
            </div>

            <p className="text-center text-xs text-slate-400 pb-8 mt-8">
                * All values shown are read-only and maintained securely by GK Groups Administration.
            </p>
        </div>
    );
}
