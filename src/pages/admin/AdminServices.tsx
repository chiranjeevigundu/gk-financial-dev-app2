import React from 'react';
import { useGlobal } from '../../context/GlobalContext';
import { formatINR } from '../../utils/helpers';
import { ConfirmModal } from '../../components/admin/ConfirmModal';
import { CreditCard, Landmark, LineChart, Banknote, RefreshCw, Trash2 } from 'lucide-react';

export function AdminLoans() {
    const { allUserFinances, allUsers, updateUserFinance } = useGlobal();

    const allLoans = allUsers.map(u => {
        const loans = allUserFinances[u.id]?.loans || [];
        return loans.map(l => ({ user: u, loan: l }));
    }).flat();

    const [confirmConfig, setConfirmConfig] = React.useState<{ isOpen: boolean; title: string; message: string; onConfirm: () => void } | null>(null);

    const totalActiveLoans = allLoans.filter(l => l.loan.status === 'Active').length;
    const totalPendingPrincipal = allLoans.reduce((sum, l) => sum + l.loan.pendingPrincipal, 0);

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <Banknote className="w-8 h-8 text-emerald-600" />
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Loans Management</h2>
                    <p className="text-sm text-slate-500">Monitor all active personal and business loans.</p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <div className="text-xs font-bold text-slate-500 uppercase">Active Loans</div>
                    <div className="text-3xl font-black text-slate-800 mt-1">{totalActiveLoans}</div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <div className="text-xs font-bold text-slate-500 uppercase">Total Outstanding</div>
                    <div className="text-3xl font-black text-emerald-600 mt-1">₹{formatINR(totalPendingPrincipal)}</div>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
                        <tr>
                            <th className="p-4 font-bold">User</th>
                            <th className="p-4 font-bold">Loan ID / Type</th>
                            <th className="p-4 font-bold text-right">Principal</th>
                            <th className="p-4 font-bold text-right">Pending</th>
                            <th className="p-4 font-bold text-center">Status</th>
                            <th className="p-4 font-bold text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {allLoans.length === 0 ? (
                            <tr><td colSpan={5} className="p-8 text-center text-slate-400">No loans found.</td></tr>
                        ) : (
                            allLoans.map(({ user, loan }) => (
                                <tr key={loan.id} className="hover:bg-slate-50">
                                    <td className="p-4">
                                        <div className="font-bold text-slate-800">{user.name}</div>
                                        <div className="text-xs text-slate-400 font-mono">{user.id}</div>
                                    </td>
                                    <td className="p-4">
                                        <div className="font-bold text-slate-800">{loan.type}</div>
                                        <div className="text-xs text-slate-400 font-mono">{loan.id}</div>
                                    </td>
                                    <td className="p-4 text-right font-bold text-slate-600">₹{formatINR(loan.amount)}</td>
                                    <td className="p-4 text-right font-bold text-rose-500">₹{formatINR(loan.pendingPrincipal)}</td>
                                    <td className="p-4 text-center">
                                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${loan.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
                                            }`}>
                                            {loan.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-center">
                                        <button
                                            onClick={() => {
                                                setConfirmConfig({
                                                    isOpen: true,
                                                    title: 'Delete Loan',
                                                    message: 'Are you sure you want to delete this loan entirely?',
                                                    onConfirm: () => {
                                                        const newLoans = allUserFinances[user.id].loans!.filter(l => l.id !== loan.id);
                                                        updateUserFinance(user.id, { ...allUserFinances[user.id], loans: newLoans });
                                                    }
                                                });
                                            }}
                                            className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                                            title="Delete Loan"
                                        >
                                            <Trash2 className="w-4 h-4 mx-auto" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {confirmConfig && (
                <ConfirmModal
                    isOpen={confirmConfig.isOpen}
                    onClose={() => setConfirmConfig(null)}
                    title={confirmConfig.title}
                    message={confirmConfig.message}
                    onConfirm={confirmConfig.onConfirm}
                    confirmLabel="Delete"
                />
            )}
        </div>
    );
}

export function AdminDeposits() {
    const { allUserFinances, allUsers, updateUserFinance } = useGlobal();

    const allDeposits = allUsers.map(u => {
        const deps = allUserFinances[u.id]?.deposits || [];
        return deps.map(d => ({ user: u, dep: d }));
    }).flat();

    const [confirmConfig, setConfirmConfig] = React.useState<{ isOpen: boolean; title: string; message: string; onConfirm: () => void } | null>(null);

    const totalActive = allDeposits.filter(d => d.dep.status === 'Active').length;
    const totalAmount = allDeposits.reduce((sum, d) => sum + d.dep.amount, 0);

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <Landmark className="w-8 h-8 text-indigo-600" />
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Fixed Deposits</h2>
                    <p className="text-sm text-slate-500">Overview of all user fixed deposits.</p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <div className="text-xs font-bold text-slate-500 uppercase">Active Deposits</div>
                    <div className="text-3xl font-black text-slate-800 mt-1">{totalActive}</div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <div className="text-xs font-bold text-slate-500 uppercase">Total Capital</div>
                    <div className="text-3xl font-black text-indigo-600 mt-1">₹{formatINR(totalAmount)}</div>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
                        <tr>
                            <th className="p-4 font-bold">User</th>
                            <th className="p-4 font-bold">Deposit ID</th>
                            <th className="p-4 font-bold text-right">Amount</th>
                            <th className="p-4 font-bold text-right">Interest Earned</th>
                            <th className="p-4 font-bold text-center">Status</th>
                            <th className="p-4 font-bold text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {allDeposits.length === 0 ? (
                            <tr><td colSpan={5} className="p-8 text-center text-slate-400">No deposits found.</td></tr>
                        ) : (
                            allDeposits.map(({ user, dep }) => (
                                <tr key={dep.id} className="hover:bg-slate-50">
                                    <td className="p-4">
                                        <div className="font-bold text-slate-800">{user.name}</div>
                                        <div className="text-xs text-slate-400 font-mono">{user.id}</div>
                                    </td>
                                    <td className="p-4 font-mono text-xs text-slate-500">{dep.id}</td>
                                    <td className="p-4 text-right font-bold text-slate-600">₹{formatINR(dep.amount)}</td>
                                    <td className="p-4 text-right font-bold text-emerald-500">+₹{formatINR(dep.interestEarned)}</td>
                                    <td className="p-4 text-center">
                                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${dep.status === 'Active' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-500'
                                            }`}>
                                            {dep.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-center">
                                        <button
                                            onClick={() => {
                                                setConfirmConfig({
                                                    isOpen: true,
                                                    title: 'Delete Deposit',
                                                    message: 'Are you sure you want to delete this deposit entirely?',
                                                    onConfirm: () => {
                                                        const newDeps = allUserFinances[user.id].deposits!.filter(d => d.id !== dep.id);
                                                        updateUserFinance(user.id, { ...allUserFinances[user.id], deposits: newDeps });
                                                    }
                                                });
                                            }}
                                            className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                                            title="Delete Deposit"
                                        >
                                            <Trash2 className="w-4 h-4 mx-auto" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {confirmConfig && (
                <ConfirmModal
                    isOpen={confirmConfig.isOpen}
                    onClose={() => setConfirmConfig(null)}
                    title={confirmConfig.title}
                    message={confirmConfig.message}
                    onConfirm={confirmConfig.onConfirm}
                    confirmLabel="Delete"
                />
            )}
        </div>
    );
}

export function AdminForex() {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <RefreshCw className="w-8 h-8 text-rose-500" />
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Forex Conversions</h2>
                    <p className="text-sm text-slate-500">Manage forex request rates and fulfillments. Use Inbox for requests.</p>
                </div>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 text-center">
                <RefreshCw className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-slate-800 mb-2">Detailed Forex Management Coming Soon</h3>
                <p className="text-slate-500 max-w-sm mx-auto">Please use the Unified Inbox to approve or reject incoming user Forex conversion requests for now.</p>
            </div>
        </div>
    );
}

export function AdminCards() {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <CreditCard className="w-8 h-8 text-violet-500" />
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Credit Cards</h2>
                    <p className="text-sm text-slate-500">View issued cards and manage limits.</p>
                </div>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 text-center">
                <CreditCard className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-slate-800 mb-2">Card Issuance Disabled</h3>
                <p className="text-slate-500">This feature is currently under compliance review.</p>
            </div>
        </div>
    );
}

export function AdminStocks() {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <LineChart className="w-8 h-8 text-blue-500" />
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Stock Markets</h2>
                    <p className="text-sm text-slate-500">Dhan API / Brokerage Integrations.</p>
                </div>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 text-center">
                <LineChart className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-slate-800 mb-2">Broker Integration Paused</h3>
                <p className="text-slate-500">Dhan Live API webhook is disconnected.</p>
            </div>
        </div>
    );
}
