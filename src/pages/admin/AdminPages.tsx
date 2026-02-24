import { useState } from 'react';
import { useGlobal } from '../../context/GlobalContext';
import { AdminTable } from '../../components/admin/AdminTable';
import { AdminModal } from '../../components/admin/AdminModal';
import { ConfirmModal } from '../../components/admin/ConfirmModal';
import { Plus, Users, ArrowLeft, Clock, Key, FileText, Trash2, Save, X } from 'lucide-react';
import type { UserLite, ChitBatch, UserFinance, UserLoan, UserChit } from '../../types';

export function AdminUsers() {
    const { allUsers, addUser, updateUser, deleteUser, allUserFinances, updateUserFinance, batches } = useGlobal();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<UserLite | null>(null);
    const [formData, setFormData] = useState<UserLite>({ id: '', name: '', services: [] });
    const [financeData, setFinanceData] = useState<UserFinance>({ chits: [], loans: [], deposits: [] });
    const [activeTab, setActiveTab] = useState<'Profile' | 'Chits' | 'Loans' | 'Deposits'>('Profile');

    const [confirmConfig, setConfirmConfig] = useState<{ isOpen: boolean; title: string; message: string; onConfirm: () => void } | null>(null);

    const [assignBatchId, setAssignBatchId] = useState('');
    const [assignChitCount, setAssignChitCount] = useState(1);
    const [assignRunningMonth, setAssignRunningMonth] = useState('');

    const availableServices = ['Chits', 'Loans', 'Cards', 'Stocks', 'Forex'];

    const handleEdit = (user: UserLite) => {
        setEditingUser(user);
        setFormData(user);
        // Load finance data or default
        setFinanceData(allUserFinances[user.id] || { chits: [], loans: [], deposits: [] });
        setIsModalOpen(true);
        setActiveTab('Profile');
    };

    const handleDelete = (user: UserLite) => {
        setConfirmConfig({
            isOpen: true,
            title: 'Delete User',
            message: `Are you sure you want to delete ${user.name}? This action cannot be undone.`,
            onConfirm: () => deleteUser(user.id)
        });
    };

    const handleSubmit = () => {
        if (!formData.id || !formData.name) {
            alert("User ID and Name are required!");
            return;
        }

        if (editingUser) {
            updateUser(editingUser.id, formData);
            updateUserFinance(editingUser.id, financeData);
        } else {
            // Check if ID exists
            if (allUsers.find(u => u.id === formData.id)) {
                alert("User ID already exists!");
                return;
            }
            addUser(formData);
            updateUserFinance(formData.id, financeData);
        }
        setIsModalOpen(false);
        setEditingUser(null);
        setFormData({ id: '', name: '', services: [] });
    };

    const openAdd = () => {
        setEditingUser(null);
        setFormData({ id: '', name: '', services: [] });
        setFinanceData({ chits: [], loans: [], deposits: [] });
        setIsModalOpen(true);
        setActiveTab('Profile');
        setAssignBatchId('');
        setAssignChitCount(1);
        setAssignRunningMonth('');
    };

    const toggleService = (service: string) => {
        setFormData(prev => {
            const services = prev.services || [];
            if (services.includes(service)) {
                return { ...prev, services: services.filter(s => s !== service) };
            } else {
                return { ...prev, services: [...services, service] };
            }
        });
    };

    // Helper to update a loan in the list
    const updateLoan = (idx: number, field: string, val: any) => {
        const newLoans = [...financeData.loans];
        newLoans[idx] = { ...newLoans[idx], [field]: val };
        setFinanceData({ ...financeData, loans: newLoans });
    };

    const deleteLoan = (idx: number) => {
        const newLoans = financeData.loans.filter((_, i) => i !== idx);
        setFinanceData({ ...financeData, loans: newLoans });
    };

    // Helper to add a mock loan
    const addMockLoan = () => {
        const newLoan: UserLoan = {
            id: `LN-${Date.now()}`,
            type: 'Personal',
            amount: 100000,
            date: new Date().toLocaleDateString(),
            interestRate: 2, // 2% per month default
            status: 'Active',
            pendingPrincipal: 100000,
            interestPaid: 0,
            principalPaid: 0,
            totalPending: 100000,
            monthlyInterest: 2000,
            nextDueDate: new Date().toLocaleDateString()
        };
        setFinanceData({ ...financeData, loans: [...financeData.loans, newLoan] });
    };

    // --- CHITS HELPERS ---
    const handleAssignBatch = () => {
        const batch = batches.find(b => b.id === assignBatchId);
        if (!batch) return;

        const newChits: import('../../types').UserChit[] = [];
        for (let i = 0; i < assignChitCount; i++) {
            newChits.push({
                batchId: batch.id,
                batchName: batch.name,
                value: batch.value,
                term: 20, // Default term
                status: 'Active',
                bidWon: false,
                totalPaid: 0,
                pendingAmount: batch.value,
                installmentsPaid: parseInt(assignRunningMonth) || 0,
                history: [],
                currentMonthPayment: batch.subscription,
                currentMonthDividend: batch.dividend
            });
        }
        setFinanceData({ ...financeData, chits: [...financeData.chits, ...newChits] });

        // Reset sub-form
        setAssignBatchId('');
        setAssignChitCount(1);
        setAssignRunningMonth('');
    };

    const updateChit = (idx: number, field: string, val: any) => {
        const newChits = [...financeData.chits];
        newChits[idx] = { ...newChits[idx], [field]: val };
        setFinanceData({ ...financeData, chits: newChits });
    };

    const deleteChit = (idx: number) => {
        const newChits = financeData.chits.filter((_, i) => i !== idx);
        setFinanceData({ ...financeData, chits: newChits });
    };

    // --- DEPOSITS HELPERS ---
    const addDeposit = () => {
        const newDep: import('../../types').UserDeposit = {
            id: `FD-${Date.now()}`,
            amount: 50000,
            interestRate: 1.5, // 1.5% per month
            date: new Date().toLocaleDateString(),
            interestEarned: 0,
            maturityDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toLocaleDateString(),
            status: 'Active',
            monthlyPayout: 750
        };
        setFinanceData({ ...financeData, deposits: [...financeData.deposits, newDep] });
    };

    const updateDeposit = (idx: number, field: string, val: any) => {
        const newDeps = [...financeData.deposits];
        newDeps[idx] = { ...newDeps[idx], [field]: val };
        setFinanceData({ ...financeData, deposits: newDeps });
    };

    const deleteDeposit = (idx: number) => {
        const newDeps = financeData.deposits.filter((_, i) => i !== idx);
        setFinanceData({ ...financeData, deposits: newDeps });
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-800">User Management</h2>
                <button
                    onClick={openAdd}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
                >
                    <Plus className="w-4 h-4" /> Add User
                </button>
            </div>

            <AdminTable
                data={allUsers}
                keyField="id"
                columns={[
                    { header: 'User ID', accessor: 'id', className: 'font-mono text-xs' },
                    { header: 'Name', accessor: 'name', className: 'font-bold' },
                    {
                        header: 'Services', accessor: (u) => (
                            <div className="flex gap-1 flex-wrap">
                                {u.services?.map(s => (
                                    <span key={s} className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-xs font-medium border border-slate-200">
                                        {s}
                                    </span>
                                ))}
                            </div>
                        )
                    },
                ]}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            <AdminModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingUser ? `Edit User: ${editingUser.name}` : 'Add New User'}
                onSubmit={handleSubmit}
            >
                <div className="flex gap-2 mb-4 border-b border-slate-200 pb-2">
                    {['Profile', 'Chits', 'Loans', 'Deposits'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab as any)}
                            className={`px-3 py-1 rounded-md text-sm font-bold transition-colors ${activeTab === tab ? 'bg-indigo-100 text-indigo-700' : 'text-slate-500 hover:bg-slate-50'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                <div className="space-y-4 h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                    {activeTab === 'Profile' && (
                        <div className="space-y-6">
                            {/* Personal Details */}
                            <div className="space-y-3">
                                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider border-b pb-1">Personal Details</h3>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 mb-1">User ID *</label>
                                        <input
                                            value={formData.id}
                                            onChange={e => setFormData({ ...formData, id: e.target.value })}
                                            className="w-full border border-slate-300 rounded px-2 py-1.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                            placeholder="e.g. GK-001"
                                            disabled={!!editingUser}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 mb-1">Name *</label>
                                        <input
                                            value={formData.name}
                                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full border border-slate-300 rounded px-2 py-1.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                            placeholder="Full Name"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 mb-1">Phone</label>
                                        <input
                                            value={formData.phone || ''}
                                            onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                            className="w-full border border-slate-300 rounded px-2 py-1.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                            placeholder="Phone Number"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 mb-1">Alt Phone</label>
                                        <input
                                            value={formData.altPhone || ''}
                                            onChange={e => setFormData({ ...formData, altPhone: e.target.value })}
                                            className="w-full border border-slate-300 rounded px-2 py-1.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                            placeholder="Alternative Phone"
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block text-xs font-bold text-slate-500 mb-1">Email</label>
                                        <input
                                            value={formData.email || ''}
                                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full border border-slate-300 rounded px-2 py-1.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                            placeholder="Email Address"
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block text-xs font-bold text-slate-500 mb-1">Address</label>
                                        <textarea
                                            value={formData.address || ''}
                                            onChange={e => setFormData({ ...formData, address: e.target.value })}
                                            className="w-full border border-slate-300 rounded px-2 py-1.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                            placeholder="Full Home Address"
                                            rows={2}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Bank Details */}
                            <div className="space-y-3">
                                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider border-b pb-1">Bank Details</h3>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 mb-1">Account Number</label>
                                        <input
                                            value={formData.bankDetails?.accountNumber || ''}
                                            onChange={e => setFormData({ ...formData, bankDetails: { ...(formData.bankDetails || { accountNumber: '', ifsc: '', bankName: '' }), accountNumber: e.target.value } })}
                                            className="w-full border border-slate-300 rounded px-2 py-1.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                            placeholder="Account Number"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 mb-1">IFSC Code</label>
                                        <input
                                            value={formData.bankDetails?.ifsc || ''}
                                            onChange={e => setFormData({ ...formData, bankDetails: { ...(formData.bankDetails || { accountNumber: '', ifsc: '', bankName: '' }), ifsc: e.target.value } })}
                                            className="w-full border border-slate-300 rounded px-2 py-1.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                            placeholder="IFSC Code"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 mb-1">Bank Name</label>
                                        <input
                                            value={formData.bankDetails?.bankName || ''}
                                            onChange={e => setFormData({ ...formData, bankDetails: { ...(formData.bankDetails || { accountNumber: '', ifsc: '', bankName: '' }), bankName: e.target.value } })}
                                            className="w-full border border-slate-300 rounded px-2 py-1.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                            placeholder="Bank Name"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 mb-1">Branch</label>
                                        <input
                                            value={formData.bankDetails?.branch || ''}
                                            onChange={e => setFormData({ ...formData, bankDetails: { ...(formData.bankDetails || { accountNumber: '', ifsc: '', bankName: '' }), branch: e.target.value } })}
                                            className="w-full border border-slate-300 rounded px-2 py-1.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                            placeholder="Branch Name"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Surity Details */}
                            <div className="space-y-3">
                                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider border-b pb-1">Surity Details</h3>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 mb-1">Surity Name</label>
                                        <input
                                            value={formData.surity?.name || ''}
                                            onChange={e => setFormData({ ...formData, surity: { ...(formData.surity || { name: '', phone: '', address: '' }), name: e.target.value } })}
                                            className="w-full border border-slate-300 rounded px-2 py-1.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                            placeholder="Surity Name"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 mb-1">Surity Phone</label>
                                        <input
                                            value={formData.surity?.phone || ''}
                                            onChange={e => setFormData({ ...formData, surity: { ...(formData.surity || { name: '', phone: '', address: '' }), phone: e.target.value } })}
                                            className="w-full border border-slate-300 rounded px-2 py-1.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                            placeholder="Surity Phone"
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block text-xs font-bold text-slate-500 mb-1">Surity Address</label>
                                        <input
                                            value={formData.surity?.address || ''}
                                            onChange={e => setFormData({ ...formData, surity: { ...(formData.surity || { name: '', phone: '', address: '' }), address: e.target.value } })}
                                            className="w-full border border-slate-300 rounded px-2 py-1.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                            placeholder="Surity Address"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Access Permissions */}
                            <div className="space-y-3">
                                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider border-b pb-1">Access Permissions</h3>
                                <div className="grid grid-cols-2 gap-2">
                                    {availableServices.map(service => (
                                        <label key={service} className="flex items-center gap-2 p-2 border rounded-lg hover:bg-slate-50 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={formData.services?.includes(service) || false}
                                                onChange={() => toggleService(service)}
                                                className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                                            />
                                            <span className="text-sm font-medium text-slate-700">{service}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Security Actions */}
                            {editingUser && (
                                <div className="space-y-3">
                                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider border-b pb-1">Security Actions</h3>
                                    <div className="bg-rose-50 border border-rose-100 p-4 rounded-xl flex items-center justify-between">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-rose-800 text-sm">Force Password Reset</span>
                                            <span className="text-xs text-rose-600">Send an email link for the user to reset their password.</span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => alert(`Password reset link sent to ${formData.email || formData.name}'s email / phone.`)}
                                            className="px-4 py-2 bg-white text-rose-600 text-sm font-bold rounded-lg border border-rose-200 hover:bg-rose-100 transition-colors flex items-center gap-2"
                                        >
                                            <Key className="w-4 h-4" /> Reset Password
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'Loans' && (
                        <div className="space-y-4">
                            {financeData.loans.map((loan, idx) => (
                                <div key={idx} className="p-4 border rounded-xl bg-slate-50 space-y-3 relative group">
                                    <div className="flex justify-between items-center">
                                        <span className="font-bold text-xs text-slate-500 uppercase tracking-wider">{loan.id}</span>
                                        <div className="flex items-center gap-2">
                                            <select
                                                value={loan.status}
                                                onChange={e => updateLoan(idx, 'status', e.target.value)}
                                                className="text-xs bg-white border border-slate-200 px-2 py-1 rounded font-bold text-slate-700"
                                            >
                                                <option value="Active">Active</option>
                                                <option value="Closed">Closed</option>
                                            </select>
                                            <button
                                                onClick={() => {
                                                    setConfirmConfig({
                                                        isOpen: true,
                                                        title: 'Remove Loan',
                                                        message: 'Are you sure you want to remove this loan from the user?',
                                                        onConfirm: () => deleteLoan(idx)
                                                    });
                                                }}
                                                type="button"
                                                className="text-red-500 hover:text-red-700 text-xs flex items-center gap-1 font-bold ml-2"
                                            >
                                                <X className="w-4 h-4" /> Remove
                                            </button>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-3 gap-3">
                                        <div>
                                            <label className="text-[10px] font-bold text-slate-400 uppercase">Amount</label>
                                            <input
                                                type="number"
                                                value={loan.amount}
                                                onChange={e => updateLoan(idx, 'amount', Number(e.target.value))}
                                                className="w-full border rounded px-2 py-1 text-sm font-bold text-slate-700"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-bold text-slate-400 uppercase">Int. Rate (%)</label>
                                            <input
                                                type="number"
                                                value={loan.interestRate}
                                                onChange={e => updateLoan(idx, 'interestRate', Number(e.target.value))}
                                                className="w-full border rounded px-2 py-1 text-sm font-bold text-slate-700"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-bold text-slate-400 uppercase">Monthly Int.</label>
                                            <input
                                                type="number"
                                                value={loan.monthlyInterest || 0}
                                                onChange={e => updateLoan(idx, 'monthlyInterest', Number(e.target.value))}
                                                className="w-full border rounded px-2 py-1 text-sm font-bold text-slate-700"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-bold text-slate-400 uppercase">Start Date</label>
                                            <input
                                                type="text"
                                                value={loan.date}
                                                onChange={e => updateLoan(idx, 'date', e.target.value)}
                                                className="w-full border rounded px-2 py-1 text-sm"
                                                placeholder="DD/MM/YYYY"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-bold text-slate-400 uppercase">Next Due</label>
                                            <input
                                                type="text"
                                                value={loan.nextDueDate || ''}
                                                onChange={e => updateLoan(idx, 'nextDueDate', e.target.value)}
                                                className="w-full border rounded px-2 py-1 text-sm"
                                                placeholder="DD/MM/YYYY"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-bold text-slate-400 uppercase">Total Pending</label>
                                            <input
                                                type="number"
                                                value={loan.totalPending}
                                                onChange={e => updateLoan(idx, 'totalPending', Number(e.target.value))}
                                                className="w-full border rounded px-2 py-1 text-sm font-bold text-red-600"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {financeData.loans.length === 0 && <div className="text-center text-slate-400 py-4">No active loans</div>}
                            <button
                                onClick={addMockLoan}
                                className="w-full py-2 border border-dashed border-indigo-300 text-indigo-600 rounded-lg text-sm font-bold hover:bg-indigo-50"
                            >
                                + Add Loan
                            </button>
                        </div>
                    )}

                    {activeTab === 'Chits' && (
                        <div className="space-y-4">
                            {financeData.chits.map((chit, idx) => (
                                <div key={idx} className="p-4 border rounded-xl bg-slate-50 space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="font-bold text-sm text-slate-700">{chit.batchName}</span>
                                        <div className="flex items-center gap-3">
                                            <span className={`text-xs px-2 py-0.5 rounded font-bold ${chit.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100'}`}>{chit.status}</span>
                                            <button
                                                onClick={() => {
                                                    setConfirmConfig({
                                                        isOpen: true,
                                                        title: 'Remove Chit',
                                                        message: 'Are you sure you want to remove this chit from the user?',
                                                        onConfirm: () => deleteChit(idx)
                                                    });
                                                }}
                                                type="button"
                                                className="text-red-500 hover:text-red-700 text-xs flex items-center gap-1 font-bold"
                                            >
                                                <X className="w-4 h-4" /> Remove
                                            </button>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-3 gap-3">
                                        <div>
                                            <label className="text-[10px] font-bold text-slate-400 uppercase">Paid (₹)</label>
                                            <input
                                                type="number"
                                                value={chit.totalPaid}
                                                onChange={e => updateChit(idx, 'totalPaid', Number(e.target.value))}
                                                className="w-full border rounded px-2 py-1 text-sm font-bold text-emerald-600"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-bold text-slate-400 uppercase">Pending (₹)</label>
                                            <input
                                                type="number"
                                                value={chit.pendingAmount}
                                                onChange={e => updateChit(idx, 'pendingAmount', Number(e.target.value))}
                                                className="w-full border rounded px-2 py-1 text-sm font-bold text-red-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-bold text-slate-400 uppercase">Installments</label>
                                            <input
                                                type="number"
                                                value={chit.installmentsPaid}
                                                onChange={e => updateChit(idx, 'installmentsPaid', Number(e.target.value))}
                                                className="w-full border rounded px-2 py-1 text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-bold text-slate-400 uppercase">This Month (₹)</label>
                                            <input
                                                type="number"
                                                value={chit.currentMonthPayment || 0}
                                                onChange={e => updateChit(idx, 'currentMonthPayment', Number(e.target.value))}
                                                className="w-full border rounded px-2 py-1 text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-bold text-slate-400 uppercase">Dividend (₹)</label>
                                            <input
                                                type="number"
                                                value={chit.currentMonthDividend || 0}
                                                onChange={e => updateChit(idx, 'currentMonthDividend', Number(e.target.value))}
                                                className="w-full border rounded px-2 py-1 text-sm"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {financeData.chits.length === 0 && <div className="text-center text-slate-400 py-4">No active chits</div>}

                            <div className="pt-2 border-t border-slate-100 bg-slate-50 p-4 rounded-xl space-y-3">
                                <h4 className="text-sm font-bold text-slate-700">Assign to New Batch</h4>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="col-span-2">
                                        <label className="block text-xs font-bold text-slate-500 mb-1">Select Batch</label>
                                        <select
                                            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                                            value={assignBatchId}
                                            onChange={(e) => setAssignBatchId(e.target.value)}
                                        >
                                            <option value="">-- Choose a Batch --</option>
                                            {batches.map(b => (
                                                <option key={b.id} value={b.id}>{b.name} ({b.currentMonth})</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 mb-1">No. of Chits</label>
                                        <input
                                            type="number"
                                            min="1"
                                            value={assignChitCount}
                                            onChange={(e) => setAssignChitCount(Number(e.target.value))}
                                            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none bg-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 mb-1">Running Month</label>
                                        <input
                                            type="text"
                                            value={assignRunningMonth}
                                            onChange={(e) => setAssignRunningMonth(e.target.value)}
                                            placeholder="e.g. 5"
                                            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none bg-white"
                                        />
                                    </div>
                                    <div className="col-span-2 mt-1">
                                        <button
                                            onClick={handleAssignBatch}
                                            disabled={!assignBatchId}
                                            className="w-full py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 disabled:opacity-50 transition-colors shadow-lg shadow-indigo-200 text-sm"
                                        >
                                            Assign to Batch
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'Deposits' && (
                        <div className="space-y-4">
                            {financeData.deposits.map((dep, idx) => (
                                <div key={idx} className="p-4 border rounded-xl bg-slate-50 space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="font-bold text-xs text-slate-500">{dep.id}</span>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-bold">{dep.status}</span>
                                            <button
                                                onClick={() => {
                                                    setConfirmConfig({
                                                        isOpen: true,
                                                        title: 'Remove Deposit',
                                                        message: 'Are you sure you want to remove this deposit from the user?',
                                                        onConfirm: () => deleteDeposit(idx)
                                                    });
                                                }}
                                                type="button"
                                                className="text-red-500 hover:text-red-700 text-xs flex items-center gap-1 font-bold ml-2"
                                            >
                                                <X className="w-4 h-4" /> Remove
                                            </button>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-3 gap-3">
                                        <div>
                                            <label className="text-[10px] font-bold text-slate-400 uppercase">Amount</label>
                                            <input
                                                type="number"
                                                value={dep.amount}
                                                onChange={e => updateDeposit(idx, 'amount', Number(e.target.value))}
                                                className="w-full border rounded px-2 py-1 text-sm font-bold text-slate-700"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-bold text-slate-400 uppercase">Int. Rate (%)</label>
                                            <input
                                                type="number"
                                                value={dep.interestRate}
                                                onChange={e => updateDeposit(idx, 'interestRate', Number(e.target.value))}
                                                className="w-full border rounded px-2 py-1 text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-bold text-slate-400 uppercase">Monthly Payout</label>
                                            <input
                                                type="number"
                                                value={dep.monthlyPayout || 0}
                                                onChange={e => updateDeposit(idx, 'monthlyPayout', Number(e.target.value))}
                                                className="w-full border rounded px-2 py-1 text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-bold text-slate-400 uppercase">Start Date</label>
                                            <input
                                                type="text"
                                                value={dep.date}
                                                onChange={e => updateDeposit(idx, 'date', e.target.value)}
                                                className="w-full border rounded px-2 py-1 text-sm"
                                                placeholder="DD/MM/YYYY"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-bold text-slate-400 uppercase">Maturity Date</label>
                                            <input
                                                type="text"
                                                value={dep.maturityDate || ''}
                                                onChange={e => updateDeposit(idx, 'maturityDate', e.target.value)}
                                                className="w-full border rounded px-2 py-1 text-sm"
                                                placeholder="DD/MM/YYYY"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {financeData.deposits.length === 0 && <div className="text-center text-slate-400 py-4">No active deposits</div>}
                            <button
                                onClick={addDeposit}
                                className="w-full py-2 border border-dashed border-indigo-300 text-indigo-600 rounded-lg text-sm font-bold hover:bg-indigo-50"
                            >
                                + Add Deposit
                            </button>
                        </div>
                    )}
                </div>
            </AdminModal>

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

function AdminUserChitDetail({ user, batchId, onBack }: { user: UserLite, batchId: string, onBack: () => void }) {
    const { allUserFinances, updateUserFinance } = useGlobal();
    const [financeData, setFinanceData] = useState<UserFinance>(() => JSON.parse(JSON.stringify(allUserFinances[user.id] || { chits: [], loans: [], deposits: [] })));
    const chitIndex = financeData.chits.findIndex((c: UserChit) => c.batchId === batchId);

    if (chitIndex === -1) {
        return <div className="p-4 text-rose-500 font-bold">User is not in this batch anymore.</div>;
    }

    const chit = financeData.chits[chitIndex];

    const updateField = (field: keyof UserChit, value: any) => {
        const newChits = [...financeData.chits];
        newChits[chitIndex] = { ...newChits[chitIndex], [field]: value };
        setFinanceData({ ...financeData, chits: newChits });
    };

    const addHistoryRow = () => {
        const newRow = { month: 'New Month', amount: chit.currentMonthPayment || 0, status: 'Pending' as const };
        updateField('history', [...chit.history, newRow]);
    };

    const updateHistoryRow = (idx: number, field: string, value: any) => {
        const newHistory = [...chit.history];
        newHistory[idx] = { ...newHistory[idx], [field]: value };
        updateField('history', newHistory);
    };

    const deleteHistoryRow = (idx: number) => {
        const newHistory = chit.history.filter((_, i) => i !== idx);
        updateField('history', newHistory);
    };

    const handleSave = () => {
        updateUserFinance(user.id, financeData);
        alert('User chit details saved successfully!');
        onBack();
    };

    const [confirmConfig, setConfirmConfig] = useState<{ isOpen: boolean; title: string; message: string; onConfirm: () => void } | null>(null);

    const handleDeleteUserFromBatch = () => {
        setConfirmConfig({
            isOpen: true,
            title: 'Remove User from Batch',
            message: `Are you sure you want to remove ${user.name} from this batch? All payment history will be deleted.`,
            onConfirm: () => {
                const newChits = financeData.chits.filter((_, i) => i !== chitIndex);
                updateUserFinance(user.id, { ...financeData, chits: newChits });
                alert('User removed from batch.');
                onBack();
            }
        });
    };

    return (
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-bottom-4">
            <div className="bg-slate-800 p-6 text-white flex justify-between items-center">
                <div>
                    <h3 className="text-xl font-bold">{user.name}'s Chit Details</h3>
                    <p className="text-indigo-200 text-sm font-mono">ID: {user.id} | Batch: {chit.batchName}</p>
                </div>
                <button onClick={onBack} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X className="w-6 h-6" /></button>
            </div>

            <div className="p-6 space-y-8">
                {/* Overview Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase">Installments Paid</label>
                        <input type="number" className="w-full text-xl font-black text-slate-800 border-b border-slate-200 focus:border-indigo-500 outline-none pb-1" value={chit.installmentsPaid} onChange={e => updateField('installmentsPaid', Number(e.target.value))} />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase">Total Paid (₹)</label>
                        <input type="number" className="w-full text-xl font-black text-emerald-600 border-b border-slate-200 focus:border-emerald-500 outline-none pb-1" value={chit.totalPaid} onChange={e => updateField('totalPaid', Number(e.target.value))} />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase">Pending Amount (₹)</label>
                        <input type="number" className="w-full text-xl font-black text-rose-500 border-b border-slate-200 focus:border-rose-500 outline-none pb-1" value={chit.pendingAmount} onChange={e => updateField('pendingAmount', Number(e.target.value))} />
                    </div>
                    <div className="flex items-end gap-2">
                        <label className="flex items-center gap-2 cursor-pointer bg-slate-50 p-2 rounded-lg border border-slate-200 w-full mb-1">
                            <input type="checkbox" checked={chit.bidWon} onChange={e => updateField('bidWon', e.target.checked)} className="w-5 h-5 accent-indigo-600" />
                            <span className="font-bold text-slate-700">Has Won Bid?</span>
                        </label>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase">Bids in Hand</label>
                        <input type="number" className="w-full text-xl font-black text-slate-800 border-b border-slate-200 focus:border-indigo-500 outline-none pb-1" value={chit.bidsInHand !== undefined ? chit.bidsInHand : (!chit.bidWon ? 1 : 0)} onChange={e => updateField('bidsInHand', Number(e.target.value))} />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase">Total Profit (Divs) (₹)</label>
                        <input type="number" className="w-full text-xl font-black text-emerald-600 border-b border-slate-200 focus:border-emerald-500 outline-none pb-1" value={chit.totalProfit || 0} onChange={e => updateField('totalProfit', Number(e.target.value))} />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase">Total Loss / Bid (₹)</label>
                        <input type="number" className="w-full text-xl font-black text-rose-500 border-b border-slate-200 focus:border-rose-500 outline-none pb-1" value={chit.totalLoss !== undefined ? chit.totalLoss : (chit.bidAmount || 0)} onChange={e => updateField('totalLoss', Number(e.target.value))} />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase">Bid Won Month</label>
                        <input type="text" className="w-full text-lg font-black text-indigo-600 border-b border-slate-200 focus:border-indigo-500 outline-none pb-1" value={chit.bidMonth || ''} onChange={e => updateField('bidMonth', e.target.value)} placeholder="e.g. Mar 2024" disabled={!chit.bidWon} />
                    </div>
                </div>

                {/* Payment History & Invoices */}
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h4 className="text-lg font-bold text-slate-800 flex items-center gap-2"><FileText className="w-5 h-5 text-slate-400" /> Payment History & Invoices</h4>
                        <button onClick={addHistoryRow} className="px-3 py-1.5 bg-indigo-50 text-indigo-600 font-bold text-sm rounded-lg hover:bg-indigo-100 flex items-center gap-1">
                            <Plus className="w-4 h-4" /> Add Record
                        </button>
                    </div>

                    <div className="overflow-x-auto border border-slate-200 rounded-xl">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 uppercase text-xs font-bold">
                                <tr>
                                    <th className="p-3">Month</th>
                                    <th className="p-3">Amount Paid</th>
                                    <th className="p-3">Paid On</th>
                                    <th className="p-3">Status</th>
                                    <th className="p-3">Docs (URL)</th>
                                    <th className="p-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {chit.history.map((row, idx) => (
                                    <tr key={idx} className="hover:bg-slate-50">
                                        <td className="p-2"><input type="text" className="w-full border rounded px-2 py-1" value={row.month} onChange={e => updateHistoryRow(idx, 'month', e.target.value)} /></td>
                                        <td className="p-2"><input type="number" className="w-full border rounded px-2 py-1 text-emerald-600 font-bold" value={row.amount} onChange={e => updateHistoryRow(idx, 'amount', Number(e.target.value))} /></td>
                                        <td className="p-2"><input type="text" className="w-full border rounded px-2 py-1" value={row.paidOn || ''} onChange={e => updateHistoryRow(idx, 'paidOn', e.target.value)} placeholder="DD/MM/YYYY" /></td>
                                        <td className="p-2">
                                            <select className="w-full border rounded px-2 py-1 font-bold" value={row.status} onChange={e => updateHistoryRow(idx, 'status', e.target.value)}>
                                                <option value="Paid">Paid</option>
                                                <option value="Pending">Pending</option>
                                                <option value="Overdue">Overdue</option>
                                            </select>
                                        </td>
                                        <td className="p-2 space-y-1">
                                            <div className="flex items-center gap-1">
                                                <span className="text-[10px] uppercase font-bold text-slate-400 w-8">Inv</span>
                                                <input type="text" className="w-full border rounded px-1 text-xs py-0.5" value={row.invoiceUrl || ''} onChange={e => updateHistoryRow(idx, 'invoiceUrl', e.target.value)} placeholder="URL..." />
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <span className="text-[10px] uppercase font-bold text-slate-400 w-8">Rec</span>
                                                <input type="text" className="w-full border rounded px-1 text-xs py-0.5" value={row.receiptUrl || ''} onChange={e => updateHistoryRow(idx, 'receiptUrl', e.target.value)} placeholder="URL..." />
                                            </div>
                                        </td>
                                        <td className="p-2 text-right">
                                            <button onClick={() => deleteHistoryRow(idx)} className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                                        </td>
                                    </tr>
                                ))}
                                {chit.history.length === 0 && <tr><td colSpan={6} className="p-4 text-center text-slate-400">No payment history recorded.</td></tr>}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Actions at the end of User Details */}
                <div className="flex items-center justify-between pt-6 border-t border-slate-200 mt-8">
                    <button onClick={handleDeleteUserFromBatch} className="px-6 py-2.5 bg-rose-50 text-rose-600 font-bold rounded-xl hover:bg-rose-100 flex items-center gap-2 transition-colors">
                        <Trash2 className="w-5 h-5" /> Delete User from Batch
                    </button>
                    <div className="flex items-center gap-3">
                        <button onClick={onBack} className="px-6 py-2.5 text-slate-600 font-bold hover:bg-slate-100 rounded-xl transition-colors">Cancel</button>
                        <button onClick={handleSave} className="px-8 py-2.5 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 flex items-center gap-2 shadow-lg shadow-emerald-200 transition-colors">
                            <Save className="w-5 h-5" /> Save Changes
                        </button>
                    </div>
                </div>
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

export function AdminChits() {
    const { batches, addBatch, updateBatch, deleteBatch, allUserFinances, allUsers, updateUserFinance, updateUser } = useGlobal();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBatch, setEditingBatch] = useState<ChitBatch | null>(null);
    const [formData, setFormData] = useState<Partial<ChitBatch>>({});

    const [confirmConfig, setConfirmConfig] = useState<{ isOpen: boolean; title: string; message: string; onConfirm: () => void } | null>(null);

    // Detailed View State
    const [selectedBatchId, setSelectedBatchId] = useState<string | null>(null);
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
    const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
    const [newUserToAssign, setNewUserToAssign] = useState<string>('');

    const handleEdit = (batch: ChitBatch) => {
        setEditingBatch(batch);
        setFormData(batch);
        setIsModalOpen(true);
    };

    const handleDelete = (batch: ChitBatch) => {
        setConfirmConfig({
            isOpen: true,
            title: 'Delete Batch',
            message: `Are you sure you want to delete batch ${batch.name}?`,
            onConfirm: () => deleteBatch(batch.id)
        });
    };

    const handleSubmit = () => {
        const batchData = formData as ChitBatch;
        if (editingBatch) {
            updateBatch(editingBatch.id, batchData);
        } else {
            addBatch({ ...batchData, id: batchData.id || `GK-${Date.now()}` });
        }
        setIsModalOpen(false);
        setEditingBatch(null);
        setFormData({});
    };

    const openAdd = () => {
        setEditingBatch(null);
        setFormData({
            status: 'Active',
            currentMonth: 'Jan',
            value: 100000,
            subscription: 5000,
            dividend: 0,
            nextAuction: 'TBD'
        });
        setIsModalOpen(true);
    };

    if (selectedBatchId) {
        const batch = batches.find(b => b.id === selectedBatchId);
        if (!batch) return <div onClick={() => setSelectedBatchId(null)}>Batch not found. Go back.</div>;

        if (selectedUserId) {
            const user = allUsers.find(u => u.id === selectedUserId);
            if (!user) return <div onClick={() => setSelectedUserId(null)}>User not found.</div>;
            return <AdminUserChitDetail user={user} batchId={batch.id} onBack={() => setSelectedUserId(null)} />;
        }

        // Find users in this batch
        const batchMembers = allUsers.map(user => {
            const finance = allUserFinances[user.id];
            const chit = finance?.chits.find(c => c.batchId === batch.id);
            return chit ? { user, chit } : null;
        }).filter(Boolean) as Array<{ user: UserLite, chit: UserChit }>;

        const handleAddMember = () => {
            if (!newUserToAssign) return;
            const user = allUsers.find(u => u.id === newUserToAssign);
            if (!user) return alert("User not found");

            // Check if already in batch
            if (batchMembers.some(m => m.user.id === user.id)) return alert("User is already in this batch.");

            const finance = allUserFinances[user.id] || { chits: [], loans: [], deposits: [] };
            const newChit: import('../../types').UserChit = {
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

            updateUserFinance(user.id, { ...finance, chits: [...(finance.chits || []), newChit] });

            // Add 'Chits' to services if not present
            if (!user.services?.includes('Chits')) {
                updateUser(user.id, { ...user, services: [...(user.services || []), 'Chits'] });
            }

            setIsAddMemberModalOpen(false);
            setNewUserToAssign('');
        };

        return (
            <div className="space-y-6">
                <div className="flex items-center gap-4 border-b border-slate-200 pb-4">
                    <button
                        onClick={() => setSelectedBatchId(null)}
                        className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800">{batch.name}</h2>
                        <p className="text-xs text-slate-500 font-mono">ID: {batch.id} • Value: ₹{batch.value.toLocaleString('en-IN')}</p>
                    </div>
                    <div className="ml-auto flex items-center gap-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${batch.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                            {batch.status}
                        </span>
                        <button
                            onClick={() => setIsAddMemberModalOpen(true)}
                            className="flex items-center gap-1 bg-indigo-50 text-indigo-600 px-4 py-2 rounded-lg font-bold text-sm hover:bg-indigo-100"
                        >
                            <Plus className="w-4 h-4" /> Add Member
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                        <div className="text-xs text-slate-500 font-bold uppercase mb-1">Members</div>
                        <div className="text-2xl font-black text-slate-800 flex items-center gap-2">
                            <Users className="w-5 h-5 text-indigo-400" /> {batchMembers.length}
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                        <div className="text-xs text-slate-500 font-bold uppercase mb-1">Current Month</div>
                        <div className="text-2xl font-black text-slate-800">{batch.currentMonth}</div>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                        <div className="text-xs text-slate-500 font-bold uppercase mb-1">Subscription</div>
                        <div className="text-2xl font-black text-slate-800">₹{batch.subscription.toLocaleString('en-IN')}</div>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                        <div className="text-xs text-slate-500 font-bold uppercase mb-1">Next Auction</div>
                        <div className="text-lg font-bold text-slate-800 flex items-center gap-2">
                            <Clock className="w-4 h-4 text-emerald-400" /> {batch.nextAuction}
                        </div>
                    </div>
                </div>

                <div>
                    <h3 className="text-lg font-bold text-slate-800 mb-4">Batch Members</h3>
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                                <tr>
                                    <th className="p-4 font-bold">Member</th>
                                    <th className="p-4 font-bold text-center">Installments Paid</th>
                                    <th className="p-4 font-bold text-right">Total Paid</th>
                                    <th className="p-4 font-bold text-center">Bid Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {batchMembers.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="p-8 text-center text-slate-400 font-medium">No members in this batch yet.</td>
                                    </tr>
                                ) : (
                                    batchMembers.map(({ user, chit }) => (
                                        <tr key={user.id} className="hover:bg-slate-50 cursor-pointer" onClick={() => setSelectedUserId(user.id)}>
                                            <td className="p-4">
                                                <div className="font-bold text-indigo-600 hover:underline">{user.name}</div>
                                                <div className="text-xs text-slate-400 font-mono">{user.id}</div>
                                            </td>
                                            <td className="p-4 text-center font-bold text-slate-600">
                                                {chit.installmentsPaid} / {chit.term}
                                            </td>
                                            <td className="p-4 text-right font-bold text-emerald-600">
                                                ₹{chit.totalPaid.toLocaleString('en-IN')}
                                            </td>
                                            <td className="p-4 text-center">
                                                {chit.bidWon ? (
                                                    <span className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider">
                                                        Won ({chit.bidMonth || '-'})
                                                    </span>
                                                ) : (
                                                    <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Pending</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Add Member Modal */}
                <AdminModal
                    isOpen={isAddMemberModalOpen}
                    onClose={() => setIsAddMemberModalOpen(false)}
                    title="Add Member to Batch"
                    onSubmit={handleAddMember}
                >
                    <div className="space-y-4">
                        <p className="text-sm text-slate-500">Select a registered user to assign them to {batch.name}.</p>
                        <select
                            className="w-full border border-slate-300 p-2 rounded-lg"
                            value={newUserToAssign}
                            onChange={(e) => setNewUserToAssign(e.target.value)}
                        >
                            <option value="">-- Select User --</option>
                            {allUsers.map(u => (
                                <option key={u.id} value={u.id}>{u.name} ({u.id})</option>
                            ))}
                        </select>
                    </div>
                </AdminModal>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-800">Chit Batches</h2>
                <button
                    onClick={openAdd}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200"
                >
                    <Plus className="w-4 h-4" /> Add Batch
                </button>
            </div>

            <AdminTable
                data={batches}
                keyField="id"
                columns={[
                    { header: 'ID', accessor: 'id', className: 'font-mono text-xs' },
                    {
                        header: 'Batch Name',
                        accessor: (b) => (
                            <span
                                className="font-bold text-indigo-600 cursor-pointer hover:underline"
                                onClick={() => setSelectedBatchId(b.id)}
                            >
                                {b.name}
                            </span>
                        ),
                        className: 'font-bold'
                    },
                    { header: 'Value (₹)', accessor: (b) => b.value.toLocaleString('en-IN') },
                    { header: 'Month', accessor: 'currentMonth' },
                    {
                        header: 'Status', accessor: (b) => (
                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${b.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                                {b.status}
                            </span>
                        )
                    },
                    { header: 'Next Auction', accessor: 'nextAuction', className: 'text-xs text-slate-500' },
                ]}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            <AdminModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingBatch ? 'Edit Batch' : 'New Chit Batch'}
                onSubmit={handleSubmit}
            >
                <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                        <label className="block text-sm font-bold text-slate-700 mb-1">Batch Name</label>
                        <input
                            value={formData.name || ''}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Chit Value (₹)</label>
                        <input
                            type="number"
                            value={formData.value || ''}
                            onChange={e => setFormData({ ...formData, value: Number(e.target.value) })}
                            className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Subscription (₹)</label>
                        <input
                            type="number"
                            value={formData.subscription || ''}
                            onChange={e => setFormData({ ...formData, subscription: Number(e.target.value) })}
                            className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Current Month</label>
                        <input
                            value={formData.currentMonth || ''}
                            onChange={e => setFormData({ ...formData, currentMonth: e.target.value })}
                            className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Next Auction</label>
                        <input
                            value={formData.nextAuction || ''}
                            onChange={e => setFormData({ ...formData, nextAuction: e.target.value })}
                            className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 outline-none"
                        />
                    </div>
                    <div className="col-span-2">
                        <label className="block text-sm font-bold text-slate-700 mb-1">Status</label>
                        <select
                            value={formData.status || 'Active'}
                            onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                            className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 outline-none"
                        >
                            <option value="Active">Active</option>
                            <option value="Completed">Completed</option>
                        </select>
                    </div>
                </div>
            </AdminModal>

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
