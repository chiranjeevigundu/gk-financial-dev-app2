import { Link } from 'react-router-dom';
import { useGlobal } from '../../context/GlobalContext';
import { formatINR } from '../../utils/helpers';
import {
    LayoutDashboard, Users, Gavel, Layers, Banknote, Percent,
    CreditCard, RefreshCcw, TrendingUp, MessageSquare, ArrowUpRight, ArrowDownRight, Activity
} from 'lucide-react';

export function AdminDashboard() {
    const { allUsers, batches, allUserFinances } = useGlobal();

    // Calculate dynamic stats
    const totalUsers = allUsers.length;
    const activeChits = batches.filter(b => b.status === 'Active').length;

    // Calculate total loans across all users
    let totalLoansPending = 0;
    Object.values(allUserFinances).forEach(finance => {
        finance.loans.forEach(loan => {
            if (loan.status === 'Active') {
                totalLoansPending += loan.totalPending;
            }
        });
    });

    // Mock Data for Charts
    const monthlyRevenue = [
        { month: 'Jan', value: 45 }, { month: 'Feb', value: 52 }, { month: 'Mar', value: 38 },
        { month: 'Apr', value: 65 }, { month: 'May', value: 58 }, { month: 'Jun', value: 85 }
    ];

    const stats = [
        { label: 'Total Registered Users', value: totalUsers.toString(), change: '+12%', isPositive: true, icon: Users, color: 'indigo' },
        { label: 'Active Chit Groups', value: activeChits.toString(), change: '+2', isPositive: true, icon: Gavel, color: 'emerald' },
        { label: 'Pending Loans Recovery', value: `₹${formatINR(totalLoansPending)}`, change: '-5%', isPositive: false, icon: Banknote, color: 'amber' },
        { label: 'Total Forex Requests', value: '14', change: '+8%', isPositive: true, icon: RefreshCcw, color: 'rose' }
    ];

    const quickLinks = [
        { name: 'Home Layout CMS', path: '/admin/cms', icon: Layers, color: 'indigo' },
        { name: 'Live Auction Room', path: '/admin/auction', icon: Gavel, color: 'emerald' },
        { name: 'Forex Conversions', path: '/admin/forex', icon: RefreshCcw, color: 'rose' },
        { name: 'Stock Markets', path: '/admin/stocks', icon: TrendingUp, color: 'sky' },
    ];

    return (
        <div className="min-h-screen bg-slate-50 p-6 md:p-8 pb-20">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Dashboard Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 bg-white p-6 rounded-[2rem] shadow-sm border border-slate-200 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl -mr-20 -mt-20"></div>
                    <div className="relative z-10">
                        <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-xs font-black tracking-widest uppercase mb-3 border border-indigo-100">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            System Online
                        </div>
                        <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Main Headquarters</h1>
                        <p className="text-slate-500 font-medium mt-1">Overview of your financial services platform.</p>
                    </div>
                </div>

                {/* Top Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, idx) => (
                        <div key={idx} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 relative overflow-hidden group hover:shadow-lg transition-all hover:-translate-y-1">
                            <div className={`absolute -right-6 -top-6 w-24 h-24 bg-${stat.color}-50 rounded-full group-hover:scale-150 transition-transform duration-500`}></div>
                            <div className="flex justify-between items-start mb-4 relative z-10">
                                <div className={`w-12 h-12 rounded-xl bg-${stat.color}-100 flex items-center justify-center text-${stat.color}-600`}>
                                    <stat.icon className="w-6 h-6" />
                                </div>
                                <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg ${stat.isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                                    {stat.isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                                    {stat.change}
                                </div>
                            </div>
                            <h3 className="text-slate-500 text-xs font-bold uppercase tracking-widest relative z-10">{stat.label}</h3>
                            <div className="text-2xl font-black text-slate-800 mt-1 relative z-10">{stat.value}</div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Main Analytics Chart (Left 2 columns) */}
                    <div className="lg:col-span-2 bg-white rounded-[2rem] shadow-sm border border-slate-200 p-8 flex flex-col">
                        <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-100">
                            <div>
                                <h2 className="text-xl font-black text-slate-800 flex items-center gap-2"><Activity className="w-5 h-5 text-indigo-500" /> Revenue Growth</h2>
                                <p className="text-sm text-slate-500 mt-1">Monthly collection analytics (in Lakhs)</p>
                            </div>
                            <select className="bg-slate-50 border border-slate-200 text-sm font-bold text-slate-600 rounded-lg px-4 py-2 outline-none">
                                <option>Last 6 Months</option>
                                <option>This Year</option>
                            </select>
                        </div>

                        {/* 3D Bar Chart Visualizer */}
                        <div className="flex-1 flex items-end gap-2 md:gap-6 pt-10 h-64 relative">
                            {/* Grid Lines */}
                            <div className="absolute inset-x-0 bottom-0 top-10 flex flex-col justify-between pointer-events-none">
                                {[100, 75, 50, 25, 0].map(val => (
                                    <div key={val} className="border-b border-slate-100 border-dashed w-full h-0 relative">
                                        <span className="absolute -left-8 -top-2.5 text-[10px] font-bold text-slate-400">{val}L</span>
                                    </div>
                                ))}
                            </div>

                            {/* Bars */}
                            {monthlyRevenue.map((data, idx) => (
                                <div key={idx} className="flex-1 flex flex-col items-center group z-10 h-full justify-end">
                                    <div className="w-full max-w-[40px] relative flex justify-center group-hover:-translate-y-2 transition-transform duration-300">
                                        {/* Tooltip */}
                                        <div className="absolute -top-10 bg-slate-800 text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                            ₹{data.value}L
                                        </div>
                                        {/* 3D Bar */}
                                        <div
                                            className="w-full bg-gradient-to-t from-indigo-500 to-indigo-400 rounded-t-sm relative shadow-[-5px_0_15px_rgba(99,102,241,0.3)]"
                                            style={{ height: `${data.value}%` }}
                                        >
                                            {/* Bar 3D Side */}
                                            <div className="absolute top-1 -right-2 w-2 bg-indigo-600 h-full skew-y-[-45deg] origin-top-left rounded-tr-sm"></div>
                                            {/* Bar 3D Top */}
                                            <div className="absolute -top-2 left-1 w-full h-2 bg-indigo-300 skew-x-[-45deg] origin-bottom-left rounded-sm"></div>
                                        </div>
                                    </div>
                                    <span className="text-xs font-bold text-slate-500 mt-4 uppercase tracking-widest">{data.month}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Column: Quick Actions & Pie Chart */}
                    <div className="space-y-8">
                        {/* Interactive UI Settings Shortcut */}
                        <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-[2rem] p-8 text-white relative overflow-hidden shadow-xl">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl -mr-10 -mt-10"></div>
                            <h3 className="text-xl font-black mb-2 relative z-10">Site CMS</h3>
                            <p className="text-indigo-200 text-sm mb-6 relative z-10">Edit global themes, homepage features, and ticker messages in real-time.</p>
                            <Link to="/admin/cms" className="inline-block w-full text-center bg-white text-indigo-900 font-bold py-3 rounded-xl hover:bg-slate-50 transition-colors shadow-lg relative z-10">
                                Open CMS Editor
                            </Link>
                        </div>

                        {/* User Distribution Pie Visual */}
                        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 p-8">
                            <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-6">Service Usage</h3>
                            <div className="flex items-center justify-center p-4">
                                <div className="w-40 h-40 rounded-full bg-slate-100 relative shadow-inner overflow-hidden border-4 border-white drop-shadow-md">
                                    {/* Mock Pie Slices using conic-gradient */}
                                    <div className="absolute inset-0 bg-[conic-gradient(at_center,_#4f46e5_0deg_140deg,_#10b981_140deg_260deg,_#f59e0b_260deg_360deg)]"></div>
                                    {/* Donut Hole */}
                                    <div className="absolute inset-3 bg-white rounded-full shadow-inner flex items-center justify-center flex-col">
                                        <div className="text-2xl font-black text-slate-800">{totalUsers}</div>
                                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Users</div>
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 mt-4">
                                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-indigo-500"></div><span className="text-xs font-bold text-slate-600">Chits (40%)</span></div>
                                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-emerald-500"></div><span className="text-xs font-bold text-slate-600">Loans (30%)</span></div>
                                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-amber-500"></div><span className="text-xs font-bold text-slate-600">Cards (30%)</span></div>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Modules Grid */}
                <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 p-8">
                    <h2 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2"><LayoutDashboard className="w-5 h-5 text-indigo-500" /> Administrative Modules</h2>

                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {[
                            { name: 'Chit Groups', path: '/admin/chits', icon: Banknote, color: 'emerald' },
                            { name: 'Users', path: '/admin/users', icon: Users, color: 'blue' },
                            { name: 'Loans', path: '/admin/loans', icon: Banknote, color: 'amber' },
                            { name: 'Cards', path: '/admin/cards', icon: CreditCard, color: 'violet' },
                            { name: 'Deposits', path: '/admin/deposits', icon: Percent, color: 'sky' },
                            { name: 'Inbox', path: '/admin/messages', icon: MessageSquare, color: 'orange' },
                            ...quickLinks
                        ].map((mod, idx) => (
                            <Link key={idx} to={mod.path} className="group border border-slate-100 rounded-2xl p-4 flex flex-col items-center justify-center text-center hover:border-indigo-200 hover:shadow-md transition-all hover:bg-slate-50 relative overflow-hidden h-32">
                                <div className={`w-12 h-12 rounded-xl bg-${mod.color}-50 text-${mod.color}-500 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                                    <mod.icon className="w-6 h-6" />
                                </div>
                                <span className="text-xs font-bold text-slate-700">{mod.name}</span>
                            </Link>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}
