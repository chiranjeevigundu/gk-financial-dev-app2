import { useState, useEffect } from 'react';
import { useGlobal } from '../../context/GlobalContext';
import { Save, RefreshCw, Play, Square, History } from 'lucide-react';
import type { AuctionConfig } from '../../types';

export function AdminAuction() {
    const { auctionConfig, setAuctionConfig, auctionState, setAuctionState, batches, syncAuctionResults } = useGlobal();
    const [formData, setFormData] = useState<AuctionConfig>(auctionConfig);
    const [isDirty, setIsDirty] = useState(false);

    // Editable Results State
    const [editableResults, setEditableResults] = useState<{
        finalLoss: number;
        dividend: number;
        monthlyPayment: number;
    }>({ finalLoss: 0, dividend: 0, monthlyPayment: 0 });

    useEffect(() => {
        setFormData(auctionConfig);
    }, [auctionConfig]);

    useEffect(() => {
        if (auctionState.finished && auctionState.winner) {
            const { finalLoss } = auctionState.winner;
            // dividend roughly finalLoss / total active users. We don't have distinct users directly here, but we can default to chitValue / term roughly or let admin set it.
            // A simple default: 
            const defaultDividend = Math.floor(finalLoss / formData.term);
            const defaultMonthly = formData.chitValue / formData.term - defaultDividend;

            setEditableResults({
                finalLoss,
                dividend: defaultDividend,
                monthlyPayment: defaultMonthly
            });
        }
    }, [auctionState.finished, auctionState.winner, formData.term, formData.chitValue]);

    const handleChange = (key: keyof AuctionConfig, value: any) => {
        setFormData(prev => ({ ...prev, [key]: value }));
        setIsDirty(true);
    };

    const handleSave = () => {
        setAuctionConfig(formData);
        setIsDirty(false);
        alert('Auction Configuration Saved!');
    };

    const handleResetAuction = () => {
        if (confirm('Are you sure? This will reset the auction timer and state.')) {
            setAuctionConfig(formData);
            setAuctionState({
                secondsLeft: 600,
                endTime: undefined, // Clear endTime to allow re-initialization
                running: false,
                finished: false,
                currentLoss: Math.floor(formData.chitValue * (formData.commissionRate / 100)),
                bidders: [],
            });
            alert('Auction Reset Successfully!');
        }
    };

    const toggleTimer = () => {
        setAuctionState(prev => ({ ...prev, running: !prev.running }));
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Auction Configuration</h2>
                    <p className="text-slate-500 text-sm">Configure parameters for the live auction room.</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={toggleTimer}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-white transition-colors shadow-lg ${auctionState.running
                            ? 'bg-red-500 hover:bg-red-600 shadow-red-200'
                            : 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-200'
                            }`}
                    >
                        {auctionState.running ? <><Square className="w-4 h-4" /> Stop Timer</> : <><Play className="w-4 h-4" /> Start Auction</>}
                    </button>
                    <button
                        onClick={handleResetAuction}
                        className="flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-700 rounded-lg font-bold hover:bg-orange-200 transition-colors"
                    >
                        <RefreshCw className="w-4 h-4" /> Reset
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={!isDirty}
                        className={`flex items-center gap-2 px-6 py-2 rounded-lg font-bold text-white shadow-lg transition-all ${isDirty
                            ? 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200 transform hover:-translate-y-0.5'
                            : 'bg-slate-300 cursor-not-allowed'
                            }`}
                    >
                        <Save className="w-4 h-4" /> Save Changes
                    </button>
                </div>
            </div>

            {/* Live Status Banner */}
            <div className="bg-slate-900 text-white p-4 rounded-xl flex items-center justify-between shadow-lg">
                <div className="flex items-center gap-4">
                    <div className={`w-3 h-3 rounded-full ${auctionState.running ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></div>
                    <div>
                        <div className="text-xs text-slate-400 uppercase font-bold">Status</div>
                        <div className="font-mono font-bold text-lg">{auctionState.running ? 'LIVE' : 'STOPPED'}</div>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-xs text-slate-400 uppercase font-bold">Time Remaining</div>
                    <div className="font-mono font-bold text-2xl text-emerald-400">
                        {Math.floor(auctionState.secondsLeft / 60)}:{(auctionState.secondsLeft % 60).toString().padStart(2, '0')}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Settings */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                    <h3 className="font-bold text-slate-900 border-b pb-2 mb-4">Basic Settings</h3>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Active Batch</label>
                        <select
                            value={formData.activeBatchId || ''}
                            onChange={e => {
                                const bid = e.target.value;
                                const bName = batches.find(b => b.id === bid)?.name || '';
                                setFormData(prev => ({ ...prev, activeBatchId: bid, activeBatchName: bName }));
                                setIsDirty(true);
                            }}
                            className="w-full font-bold text-indigo-700 border-b border-slate-200 focus:border-indigo-500 outline-none pb-1 mb-4 bg-transparent"
                        >
                            <option value="">-- Select Batch --</option>
                            {batches.map(b => (
                                <option key={b.id} value={b.id}>{b.name} ({b.id})</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Auction Date</label>
                        <input
                            value={formData.dateMonth}
                            onChange={e => handleChange('dateMonth', e.target.value)}
                            className="w-full font-medium border-b border-slate-200 focus:border-indigo-500 outline-none py-1"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Start Month</label>
                            <input
                                value={formData.startMonth}
                                onChange={e => handleChange('startMonth', e.target.value)}
                                className="w-full font-medium border-b border-slate-200 focus:border-indigo-500 outline-none py-1"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">End Month</label>
                            <input
                                value={formData.endMonth}
                                onChange={e => handleChange('endMonth', e.target.value)}
                                className="w-full font-medium border-b border-slate-200 focus:border-indigo-500 outline-none py-1"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Running Month</label>
                        <input
                            value={formData.runningMonth}
                            onChange={e => handleChange('runningMonth', e.target.value)}
                            className="w-full font-medium border-b border-slate-200 focus:border-indigo-500 outline-none py-1"
                        />
                    </div>
                </div>

                {/* Financials */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                    <h3 className="font-bold text-slate-900 border-b pb-2 mb-4">Financial Parameters</h3>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Chit Value (₹)</label>
                        <input
                            type="number"
                            value={formData.chitValue}
                            onChange={e => handleChange('chitValue', Number(e.target.value))}
                            className="w-full font-bold text-lg text-indigo-600 border-b border-slate-200 focus:border-indigo-500 outline-none py-1"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Commission (%)</label>
                            <input
                                type="number"
                                value={formData.commissionRate}
                                onChange={e => handleChange('commissionRate', Number(e.target.value))}
                                className="w-full font-medium border-b border-slate-200 focus:border-indigo-500 outline-none py-1"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Min Loss (Calc)</label>
                            <div className="py-1 font-medium text-slate-400">
                                ₹ {Math.floor(formData.chitValue * (formData.commissionRate / 100)).toLocaleString()}
                            </div>
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Room Code</label>
                        <input
                            value={formData.roomCode}
                            onChange={e => handleChange('roomCode', e.target.value)}
                            className="w-full font-mono font-bold text-slate-700 border-b border-slate-200 focus:border-indigo-500 outline-none py-1"
                        />
                    </div>
                </div>

                {/* Ticker & Extras */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 md:col-span-2">
                    <h3 className="font-bold text-slate-900 border-b pb-2 mb-4">Display Settings</h3>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Marquee Ticker Text</label>
                        <textarea
                            value={formData.ticker}
                            onChange={e => handleChange('ticker', e.target.value)}
                            className="w-full border border-slate-200 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                            rows={2}
                        />
                    </div>
                </div>
            </div>

            {/* Auction Results / Automation Check */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="font-bold text-slate-900 border-b pb-2 mb-4 flex items-center gap-2">
                    <History className="w-5 h-5 text-indigo-600" /> Auction Results (Automation)
                </h3>
                {auctionState.finished ? (
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold">
                                ✓
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900">Auction Finalized</h4>
                                <p className="text-xs text-slate-500">Review final values before syncing to user ledgers.</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
                            <div className="bg-white p-3 rounded-lg border border-slate-200">
                                <div className="text-xs font-bold text-slate-500 uppercase mb-1">Winner</div>
                                <div className="font-bold text-slate-800">{auctionState.winner?.name || 'None'}</div>
                                <div className="text-[10px] font-mono text-slate-400">{auctionState.winner?.userId}</div>
                            </div>

                            <div className="bg-white p-3 rounded-lg border border-slate-200">
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Final Loss (₹)</label>
                                <input
                                    type="number"
                                    value={editableResults.finalLoss}
                                    onChange={e => setEditableResults({ ...editableResults, finalLoss: Number(e.target.value) })}
                                    className="w-full font-bold text-rose-500 outline-none border-b border-rose-200 focus:border-rose-500"
                                />
                            </div>

                            <div className="bg-white p-3 rounded-lg border border-slate-200">
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Dividend / User (₹)</label>
                                <input
                                    type="number"
                                    value={editableResults.dividend}
                                    onChange={e => setEditableResults({ ...editableResults, dividend: Number(e.target.value) })}
                                    className="w-full font-bold text-emerald-600 outline-none border-b border-emerald-200 focus:border-emerald-500"
                                />
                            </div>

                            <div className="bg-white p-3 rounded-lg border border-slate-200">
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">New Monthly EMI (₹)</label>
                                <input
                                    type="number"
                                    value={editableResults.monthlyPayment}
                                    onChange={e => setEditableResults({ ...editableResults, monthlyPayment: Number(e.target.value) })}
                                    className="w-full font-bold text-indigo-600 outline-none border-b border-indigo-200 focus:border-indigo-500"
                                />
                            </div>
                        </div>

                        <button
                            onClick={() => {
                                if (confirm('Are you sure you want to sync these results to all active users in this batch? This will add history rows and update ledgers.')) {
                                    syncAuctionResults(formData.activeBatchId || '', {
                                        finalLoss: editableResults.finalLoss,
                                        dividend: editableResults.dividend,
                                        monthlyPayment: editableResults.monthlyPayment,
                                        winnerId: auctionState.winner?.userId,
                                        runningMonth: formData.runningMonth
                                    });
                                    alert('Results synchronized to user ledgers successfully!');
                                }
                            }}
                            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2"
                        >
                            <Save className="w-5 h-5" /> Send to Users (Save & Sync)
                        </button>
                    </div>
                ) : (
                    <div className="text-center py-8 text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                        Auction is currently {auctionState.running ? 'running' : 'pending'}. Results will appear here after finalization.
                    </div>
                )}
            </div>
        </div>
    );
}
