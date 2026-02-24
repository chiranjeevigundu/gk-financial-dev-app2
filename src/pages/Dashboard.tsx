
import { useGlobal } from '../context/GlobalContext';
import {
    Wallet,
    TrendingUp,
    CreditCard,
    Bell,
    ArrowUpRight,
    ArrowDownRight,
    Clock,
    Shield,
    PieChart
} from 'lucide-react';

export function Dashboard() {
    const { user } = useGlobal();

    // Mock Data for Dashboard
    const stats = [
        {
            label: 'Total Chit Value',
            value: '₹ 5,00,000',
            change: '+12%',
            isPositive: true,
            icon: PieChart,
            color: 'bg-blue-500'
        },
        {
            label: 'Outstanding Loans',
            value: '₹ 1,20,000',
            change: '-5%',
            isPositive: true,
            icon: CreditCard,
            color: 'bg-orange-500'
        },
        {
            label: 'Wallet Balance',
            value: '₹ 25,400',
            change: '+2.5%',
            isPositive: true,
            icon: Wallet,
            color: 'bg-green-500'
        },
        {
            label: 'Investment Growth',
            value: '₹ 85,000',
            change: '+18%',
            isPositive: true,
            icon: TrendingUp,
            color: 'bg-purple-500'
        },
    ];

    const recentActivity = [
        { id: 1, title: 'Chit Payment', date: 'Today, 10:30 AM', amount: '- ₹ 5,000', type: 'debit', status: 'Success' },
        { id: 2, title: 'Loan Disbursement', date: 'Yesterday, 2:15 PM', amount: '+ ₹ 50,000', type: 'credit', status: 'Success' },
        { id: 3, title: 'Dividend Received', date: 'Nov 26, 2025', amount: '+ ₹ 1,200', type: 'credit', status: 'Success' },
        { id: 4, title: 'Insurance Premium', date: 'Nov 24, 2025', amount: '- ₹ 2,500', type: 'debit', status: 'Pending' },
    ];

    const notifications = [
        { id: 1, title: 'Auction Alert', message: 'Chit Group A1 Auction starts in 2 hours.', time: '2h ago', isNew: true },
        { id: 2, title: 'Payment Due', message: 'Your personal loan EMI is due on Dec 5th.', time: '5h ago', isNew: true },
        { id: 3, title: 'New Offer', message: 'Pre-approved for Gold Loan up to ₹ 2 Lakhs.', time: '1d ago', isNew: false },
    ];

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4">
            {/* Welcome Section - 3D Glassmorphic Banner */}
            <div className="relative bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-[2.5rem] p-8 md:p-12 overflow-hidden shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8 border border-slate-800">
                {/* Abstract Background Shapes */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-[100px] -mr-20 -mt-20"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-rose-500/20 rounded-full blur-[80px] -ml-20 -mb-20"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMjAwIDIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZmlsdGVyIGlkPSJuIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjY1IiBudW1PY3RhdmVzPSIzIiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idHJhbnNwYXJlbnQiIGZpbHRlcj0idXJsKCNuKSIgb3BhY2l0eT0iMC4wNSIvPjwvc3ZnPg==')] opacity-30 mix-blend-overlay"></div>

                <div className="relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-bold mb-6 shadow-xl">
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                        </span>
                        Market is Open
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-white leading-tight">
                        Good Morning, <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-rose-400">
                            {user?.name || 'Guest'}
                        </span>
                        <span className="text-4xl ml-2 animate-bounce inline-block">👋</span>
                    </h1>
                    <p className="text-slate-300 font-medium mt-4 text-lg">Here's what's happening with your finances today.</p>
                </div>

                <div className="relative z-10 flex flex-col items-center md:items-end gap-6">
                    <div className="flex items-center gap-4">
                        <button className="p-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl text-white hover:bg-white/20 transition-all shadow-[0_10px_30px_rgba(0,0,0,0.3)] relative group cursor-pointer">
                            <Bell className="w-6 h-6 group-hover:animate-wiggle" />
                            <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-rose-500 rounded-full shadow-[0_0_10px_rgba(244,63,94,0.8)] border border-slate-900"></span>
                        </button>
                        <button className="px-8 py-4 bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 text-white rounded-2xl font-black text-lg shadow-[0_10px_30px_rgba(244,63,94,0.4)] transition-all transform hover:-translate-y-1 border border-white/10">
                            Add Funds
                        </button>
                    </div>

                    {/* Quick Portfolio Mini Chart inside Header */}
                    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex items-center gap-4 hidden md:flex shadow-xl">
                        <div>
                            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Portfolio Day Change</p>
                            <div className="text-xl font-black text-white flex items-center gap-2">
                                +₹4,520 <TrendingUp className="w-5 h-5 text-emerald-400" />
                            </div>
                        </div>
                        <div className="h-10 w-24 ml-4">
                            <svg className="w-full h-full" preserveAspectRatio="none">
                                <polyline
                                    points="0,40 20,30 40,35 60,10 80,15 100,0"
                                    className="stroke-emerald-400 stroke-[3] fill-none drop-shadow-[0_2px_4px_rgba(52,211,153,0.5)]"
                                    vectorEffect="non-scaling-stroke"
                                />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Grid - 3D Modern Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-white p-6 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 hover:border-indigo-100 transition-all hover:-translate-y-2 group relative overflow-hidden cursor-pointer">
                        {/* Shimmer Background */}
                        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-tr from-transparent via-white/50 to-transparent skew-x-12 -translate-x-full group-hover:animate-shimmer pointer-events-none"></div>

                        <div className="flex items-start justify-between mb-6 relative z-10">
                            <div className={`w-14 h-14 ${stat.color} bg-opacity-10 rounded-2xl flex items-center justify-center text-${stat.color.replace('bg-', '')} shadow-inner group-hover:rotate-12 transition-transform`}>
                                <stat.icon className={`w-7 h-7 text-${stat.color.replace('bg-', '')}-600 drop-shadow-md`} />
                            </div>
                            <span className={`flex items-center gap-1 text-sm font-black px-3 py-1.5 rounded-xl shadow-sm border ${stat.isPositive ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
                                {stat.isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                                {stat.change}
                            </span>
                        </div>
                        <h3 className="text-slate-500 text-sm font-bold uppercase tracking-widest mb-2 relative z-10">{stat.label}</h3>
                        <p className="text-3xl font-black text-slate-900 tracking-tight relative z-10">{stat.value}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Activity */}
                <div className="lg:col-span-2 bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 p-8">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                            <div className="p-2 bg-indigo-50 rounded-xl">
                                <Clock className="w-6 h-6 text-indigo-500" />
                            </div>
                            Recent Transactions
                        </h2>
                        <button className="text-sm font-black text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-4 py-2 rounded-lg hover:bg-indigo-100 transition-colors">View History</button>
                    </div>
                    <div className="space-y-4">
                        {recentActivity.map((activity) => (
                            <div key={activity.id} className="flex flex-col sm:flex-row items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-white hover:border-indigo-100 hover:shadow-md transition-all group gap-4">
                                <div className="flex items-center gap-5 w-full sm:w-auto">
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-inner ${activity.type === 'credit' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                                        {activity.type === 'credit' ? <ArrowDownRight className="w-6 h-6" /> : <ArrowUpRight className="w-6 h-6" />}
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-lg text-slate-900 group-hover:text-indigo-600 transition-colors">{activity.title}</h4>
                                        <p className="text-sm text-slate-500 font-medium font-mono mt-1">{activity.date}</p>
                                    </div>
                                </div>
                                <div className="text-left sm:text-right w-full sm:w-auto flex justify-between sm:block pl-19 sm:pl-0">
                                    <p className={`font-black text-xl tracking-tight ${activity.type === 'credit' ? 'text-emerald-600' : 'text-slate-900'}`}>{activity.amount}</p>
                                    <span className={`text-xs font-bold px-3 py-1 rounded-full shadow-sm mt-2 inline-block ${activity.status === 'Success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-amber-50 text-amber-700 border border-amber-100'}`}>
                                        {activity.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Notifications / Quick Actions */}
                <div className="space-y-8">
                    {/* Notifications Widget */}
                    <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 p-8">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                                <Bell className="w-6 h-6 text-orange-500" />
                                Action Alerts
                            </h2>
                            <button className="text-xs font-bold text-slate-400 hover:text-indigo-600 transition-colors bg-slate-50 rounded-lg px-3 py-1">Mark all read</button>
                        </div>
                        <div className="space-y-6">
                            {notifications.map((notif) => (
                                <div key={notif.id} className="relative pl-6 border-l-4 border-slate-100 hover:border-indigo-500 transition-colors group">
                                    {notif.isNew && <span className="absolute -left-[6px] top-1 w-3 h-3 bg-rose-500 rounded-full shadow-[0_0_8px_rgba(244,63,94,0.6)] animate-pulse"></span>}
                                    <h4 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{notif.title}</h4>
                                    <p className="text-sm text-slate-500 mt-1.5 leading-relaxed">{notif.message}</p>
                                    <span className="text-xs text-slate-400 font-bold mt-3 block flex items-center gap-1">
                                        <Clock className="w-3 h-3" /> {notif.time}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Security Tip 3D Widget */}
                    <div className="bg-gradient-to-tr from-emerald-900 via-teal-900 to-slate-900 rounded-[2rem] p-8 text-white relative overflow-hidden shadow-xl shadow-emerald-900/30">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-400/20 rounded-full -mr-10 -mt-10 blur-3xl"></div>
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-teal-400/20 rounded-full -ml-10 -mb-10 blur-2xl"></div>
                        <div className="relative z-10">
                            <div className="bg-white/10 backdrop-blur-md w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-lg border border-white/20">
                                <Shield className="w-8 h-8 text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse" />
                            </div>
                            <h3 className="font-black text-xl mb-2 text-white drop-shadow-sm">Security Tip</h3>
                            <p className="text-emerald-100/80 text-sm mt-3 leading-relaxed font-medium">
                                Never share your OTP, PIN, or password with anyone. Our staff will never request these details. Stay alert against fraud.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
