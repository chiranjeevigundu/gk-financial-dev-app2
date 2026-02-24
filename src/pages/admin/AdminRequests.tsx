import { useState } from 'react';
import { useGlobal } from '../../context/GlobalContext';
import { AdminModal } from '../../components/admin/AdminModal';
import { Check, X, MessageSquare, Briefcase, DollarSign, RefreshCw, UserCheck } from 'lucide-react';
import type { UserRequest, UserChit } from '../../types';

export function AdminRequests() {
    const { userRequests, updateUserRequest, allUserFinances, updateUserFinance, batches, addUser } = useGlobal();
    const [filter, setFilter] = useState<'All' | 'Pending' | 'Approved' | 'Rejected'>('Pending');
    const [selectedReq, setSelectedReq] = useState<UserRequest | null>(null);
    const [adminNotes, setAdminNotes] = useState('');

    const filteredReqs = userRequests.filter(req => filter === 'All' ? true : req.status === filter);

    const getIcon = (type: string) => {
        switch (type) {
            case 'Join Chit': return <Briefcase className="w-5 h-5 text-indigo-500" />;
            case 'New Loan': return <DollarSign className="w-5 h-5 text-emerald-500" />;
            case 'New Deposit': return <DollarSign className="w-5 h-5 text-blue-500" />;
            case 'Forex': return <RefreshCw className="w-5 h-5 text-amber-500" />;
            case 'Registration': return <UserCheck className="w-5 h-5 text-rose-500" />;
            default: return <MessageSquare className="w-5 h-5 text-slate-500" />;
        }
    };

    const handleAction = (status: 'Approved' | 'Rejected') => {
        if (!selectedReq) return;
        updateUserRequest(selectedReq.id, { status, adminComment: adminNotes });

        if (status === 'Approved') {
            if (selectedReq.type === 'Join Chit') {
                const batchId = selectedReq.details?.batchId;
                const uid = selectedReq.userId;
                if (batchId && uid) {
                    const finance = allUserFinances[uid] || { chits: [], loans: [], deposits: [] };
                    if (!finance.chits?.some(c => c.batchId === batchId)) {
                        const batch = batches.find(b => b.id === batchId);
                        if (batch) {
                            const newChit: UserChit = {
                                batchId: batch.id,
                                batchName: batch.name,
                                value: batch.value,
                                term: 20,
                                status: 'Active',
                                bidWon: false,
                                totalPaid: 0,
                                pendingAmount: batch.value,
                                installmentsPaid: 0,
                                history: [],
                                currentMonthPayment: batch.subscription,
                                currentMonthDividend: batch.dividend
                            };
                            updateUserFinance(uid, { ...finance, chits: [...(finance.chits || []), newChit] });
                        }
                    }
                }
            } else if (selectedReq.type === 'New Loan') {
                const uid = selectedReq.userId;
                if (uid) {
                    const amt = Number(selectedReq.details?.amount) || 100000;
                    const finance = allUserFinances[uid] || { chits: [], loans: [], deposits: [] };
                    const newLoan = {
                        id: `LN-${Date.now()}`,
                        type: 'Personal' as const,
                        amount: amt,
                        date: new Date().toLocaleDateString(),
                        interestRate: 2,
                        status: 'Active' as const,
                        pendingPrincipal: amt,
                        interestPaid: 0,
                        principalPaid: 0,
                        totalPending: amt,
                        monthlyInterest: (amt * 2) / 100,
                        nextDueDate: new Date().toLocaleDateString()
                    };
                    updateUserFinance(uid, { ...finance, loans: [...(finance.loans || []), newLoan] });
                }
            } else if (selectedReq.type === 'Registration') {
                const newUserId = `USR-${Date.now().toString().slice(-4)}`;
                const newUser = {
                    id: newUserId,
                    name: selectedReq.userName,
                    email: selectedReq.details?.email,
                    phone: selectedReq.details?.phone,
                    services: [],
                    status: 'Active',
                    joinDate: new Date().toLocaleDateString()
                };
                addUser(newUser);
                // Attach the generated ID back to the request for records
                updateUserRequest(selectedReq.id, { status, adminComment: adminNotes, userId: newUserId });
            } else if (selectedReq.type === 'New Deposit') {
                const uid = selectedReq.userId;
                if (uid) {
                    const amt = Number(selectedReq.details?.amount) || 50000;
                    const finance = allUserFinances[uid] || { chits: [], loans: [], deposits: [] };
                    const newDep = {
                        id: `FD-${Date.now()}`,
                        amount: amt,
                        interestRate: 1.5,
                        date: new Date().toLocaleDateString(),
                        interestEarned: 0,
                        maturityDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toLocaleDateString(),
                        status: 'Active' as const,
                        monthlyPayout: (amt * 1.5) / 100
                    };
                    updateUserFinance(uid, { ...finance, deposits: [...(finance.deposits || []), newDep] });
                }
            }
        }

        setSelectedReq(null);
        setAdminNotes('');
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-black text-slate-800">Unified Inbox</h2>
                    <p className="text-sm text-slate-500 font-medium">Manage all incoming user requests and applications.</p>
                </div>

                <div className="flex items-center gap-2 bg-white p-1 rounded-xl shadow-sm border border-slate-200">
                    {['Pending', 'Approved', 'Rejected', 'All'].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f as any)}
                            className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-colors ${filter === f ? 'bg-indigo-50 text-indigo-700' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                                }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                {filteredReqs.length === 0 ? (
                    <div className="p-12 text-center text-slate-400">
                        <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <h3 className="text-lg font-bold">No {filter} Requests</h3>
                        <p className="text-sm mt-1">Check back later or change the filter.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-100">
                        {filteredReqs.map(req => (
                            <div
                                key={req.id}
                                className={`p-6 hover:bg-slate-50 transition-colors cursor-pointer flex flex-col md:flex-row md:items-center gap-4 ${req.status === 'Pending' ? 'bg-white' : 'bg-slate-50/50 opacity-75'}`}
                                onClick={() => {
                                    setSelectedReq(req);
                                    setAdminNotes(req.adminComment || '');
                                }}
                            >
                                <div className="p-3 bg-white rounded-xl shadow-sm border border-slate-200 shrink-0">
                                    {getIcon(req.type)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-3 mb-1">
                                        <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">{req.type}</h3>
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${req.status === 'Pending' ? 'bg-amber-100 text-amber-700' :
                                            req.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' :
                                                'bg-rose-100 text-rose-700'
                                            }`}>
                                            {req.status}
                                        </span>
                                    </div>
                                    <p className="text-sm font-bold text-slate-600 truncate">
                                        From: {req.userName} {req.userId ? `(${req.userId})` : ''} • {req.date}
                                    </p>
                                </div>
                                <div className="shrink-0 text-right hidden md:block">
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Req ID</span>
                                    <div className="text-sm font-mono text-slate-600">{req.id}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <AdminModal
                isOpen={!!selectedReq}
                onClose={() => setSelectedReq(null)}
                title={`Request Details: ${selectedReq?.type}`}
            >
                {selectedReq && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                            <div>
                                <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">User</span>
                                <span className="text-sm font-bold text-slate-800">{selectedReq.userName}</span>
                            </div>
                            <div>
                                <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">User ID</span>
                                <span className="text-sm font-mono text-slate-800">{selectedReq.userId || 'New Guest'}</span>
                            </div>
                            <div>
                                <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Date</span>
                                <span className="text-sm text-slate-800">{selectedReq.date}</span>
                            </div>
                            <div>
                                <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Status</span>
                                <span className={`text-xs font-bold px-2 py-1 rounded inline-block ${selectedReq.status === 'Pending' ? 'bg-amber-100 text-amber-700' :
                                    selectedReq.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' :
                                        'bg-rose-100 text-rose-700'
                                    }`}>
                                    {selectedReq.status}
                                </span>
                            </div>
                        </div>

                        <div>
                            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 border-b pb-2">Provided Details</h4>
                            <div className="bg-white border rounded-xl p-4 space-y-3">
                                {Object.entries(selectedReq.details || {}).map(([key, val]) => (
                                    <div key={key} className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 border-b border-slate-50 last:border-0 pb-2 last:pb-0">
                                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider w-1/3 shrink-0">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                                        <span className="text-sm font-medium text-slate-800 break-words">{String(val)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {selectedReq.status !== 'Pending' && selectedReq.adminComment && (
                            <div>
                                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Admin Remarks</h4>
                                <div className="bg-slate-50 border rounded-lg p-3 text-sm text-slate-700 italic">
                                    "{selectedReq.adminComment}"
                                </div>
                            </div>
                        )}

                        {selectedReq.status === 'Pending' && (
                            <div className="pt-4 border-t border-slate-200">
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Action Notes/Remarks (Optional)</label>
                                <textarea
                                    value={adminNotes}
                                    onChange={e => setAdminNotes(e.target.value)}
                                    className="w-full border border-slate-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none mb-4"
                                    rows={3}
                                    placeholder="Add reason for rejection or approval notes..."
                                />
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => handleAction('Approved')}
                                        className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold py-3 rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition-all"
                                    >
                                        <Check className="w-5 h-5" /> Approve Request
                                    </button>
                                    <button
                                        onClick={() => handleAction('Rejected')}
                                        className="flex-1 flex items-center justify-center gap-2 bg-white border-2 border-rose-500 text-rose-600 font-bold py-3 rounded-xl hover:bg-rose-50 transition-colors"
                                    >
                                        <X className="w-5 h-5" /> Reject
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </AdminModal>
        </div>
    );
}
