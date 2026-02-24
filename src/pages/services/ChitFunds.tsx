import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGlobal } from '../../context/GlobalContext';
import { formatINR, isTop1Bidder } from '../../utils/helpers';
import { TimerDigits } from '../../components/TimerDigits';
import type { Bidder } from '../../types';
import { Users, AlertCircle, Info, Calendar, Landmark, ArrowDownRight, TrendingDown, Key, Clock, Activity } from 'lucide-react';

export function ChitFunds() {
    const navigate = useNavigate();
    const { user, adminUser, auctionConfig, auctionState, setAuctionState, canBid, batches } = useGlobal();

    const { dateMonth, chitValue, ticker, roomCode, activeBatchId, activeBatchName, minLoss, lastBid, joinedUsers, joinedUsersList } = auctionConfig;
    const { bidders, currentLoss, running, finished } = auctionState;

    const [roomInput, setRoomInput] = useState("");
    const [joined, setJoined] = useState(false);
    const [err, setErr] = useState<string | null>(null);

    // Bidding percentage buttons: 0.1%, 0.2%, 0.3%, 0.4%, 0.5%, 1%
    const bidPercentages = [0.1, 0.2, 0.3, 0.4, 0.5, 1.0];

    const showErr = (m: string) => {
        setErr(m);
        setTimeout(() => setErr(null), 4000);
    };

    const tryJoin = () => {
        if (roomInput.trim() === roomCode) {
            setJoined(true);
            showErr('Joined auction room ✅');
        } else {
            showErr('Invalid room code');
        }
    };

    const placeBid = (percentage: number) => {
        if (!user && !adminUser) return;

        // Admin user override check
        const activeId = adminUser ? 'ADMIN' : (user?.id || '');
        const activeName = adminUser ? 'Admin' : (user?.name || '');

        if (!joined) {
            showErr('Enter room code to join the auction');
            return;
        }

        // Logic check: Can they bid in this batch?
        if (!canBid(activeId, activeBatchId || '')) {
            showErr("Cannot place bid. Wait for your batch to participate.");
            return;
        }

        if (!running) {
            showErr('Bidding opens only when timer is running');
            return;
        }
        if (isTop1Bidder(bidders, activeId)) {
            showErr("You're currently the highest bidder");
            return;
        }

        // Fixed increment purely based on Chit Value * percentage
        const inc = Math.floor(chitValue * (percentage / 100));

        setAuctionState(prev => {
            const nextCurrentLoss = prev.currentLoss + inc;
            const me: Bidder = { userId: activeId, name: activeName, loss: nextCurrentLoss };
            const others = prev.bidders.filter(b => b.userId !== activeId);
            const updated = [me, ...others].sort((a, b) => b.loss - a.loss).slice(0, 3);
            return { ...prev, bidders: updated, currentLoss: nextCurrentLoss };
        });
    };

    if (!joined) {
        return (
            <div className="max-w-md mx-auto mt-10">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 text-center">
                    <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6 text-indigo-600">
                        <Users className="w-8 h-8" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Enter Auction Room</h2>
                    <p className="text-slate-500 mb-8">Please enter the room code provided by the admin to join the live auction.</p>
                    <div className="space-y-4">
                        <input
                            type="text"
                            value={roomInput}
                            onChange={(e) => setRoomInput(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-center text-lg tracking-widest font-mono uppercase"
                            placeholder="GK-XXXXXX"
                        />
                        <button onClick={tryJoin} className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-colors shadow-lg shadow-indigo-200">
                            Join Room
                        </button>
                        {err && <div className="flex items-center justify-center gap-2 text-red-500 text-sm bg-red-50 py-2 rounded-lg"><AlertCircle className="w-4 h-4" />{err}</div>}
                    </div>
                </div>
            </div>
        );
    }

    const highestBidder = bidders[0];
    const inHandCalculated = highestBidder ? Math.max(chitValue - highestBidder.loss, 0) : Math.max(chitValue - minLoss, 0);
    const highestInterest = highestBidder ? ((highestBidder.loss / chitValue) * 100).toFixed(2) : ((minLoss / chitValue) * 100).toFixed(2);

    // Check if the current user is locked out
    const currentId = adminUser ? 'ADMIN' : (user?.id || '');
    const isLockedOut = !canBid(currentId, activeBatchId || '');

    // Get completed batches to show in results
    const completedBatches = batches.filter(b => b.status === 'Completed');

    return (
        <div className="bg-slate-50 min-h-[90vh] pb-10">
            {/* Top Header - Premium 3D Glassmorphic */}
            <div className="bg-gradient-to-tr from-slate-900 via-indigo-950 to-slate-900 text-white py-8 md:py-12 border-b-4 border-indigo-500 relative overflow-hidden shadow-2xl">
                {/* 3D glow effects */}
                <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-[100px] pointer-events-none -mt-20"></div>
                <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-rose-500/20 rounded-full blur-[100px] pointer-events-none -mb-20"></div>

                {/* Abstract Pattern overlay */}
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMjAwIDIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZmlsdGVyIGlkPSJuIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjY1IiBudW1PY3RhdmVzPSIzIiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idHJhbnNwYXJlbnQiIGZpbHRlcj0idXJsKCNuKSIgb3BhY2l0eT0iMC4wNSIvPjwvc3ZnPg==')] mix-blend-overlay opacity-20"></div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 text-center flex flex-col items-center gap-4">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-indigo-200 text-xs font-bold shadow-xl uppercase tracking-widest">
                        <span className="relative flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                        </span>
                        Live Session Active
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-100 to-indigo-300 drop-shadow-sm uppercase">
                        GK Groups Live Auction
                    </h1>
                </div>
            </div>

            {/* Auction Stats Bar */}
            <div className="max-w-7xl mx-auto px-4 mt-6">
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6 mt-8">
                    {/* 3D Stat Cards */}
                    <div className="bg-white rounded-2xl shadow-xl shadow-indigo-100/50 border border-slate-100 p-5 relative overflow-hidden group hover:-translate-y-1 transition-transform">
                        <div className="absolute -right-4 -top-4 w-16 h-16 bg-slate-50 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 relative z-10 flex items-center justify-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> DATE</div>
                        <div className="text-lg md:text-xl font-bold text-slate-800 relative z-10 text-center">{dateMonth}</div>
                    </div>

                    <div className="bg-gradient-to-b from-white to-emerald-50/30 rounded-2xl shadow-xl shadow-emerald-100/50 border border-emerald-100 p-5 relative overflow-hidden group hover:-translate-y-1 transition-transform">
                        <div className="absolute -right-4 -top-4 w-16 h-16 bg-emerald-50 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
                        <div className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-2 relative z-10 flex items-center justify-center gap-1.5"><Landmark className="w-3.5 h-3.5" /> CHIT VALUE</div>
                        <div className="text-xl md:text-2xl font-black text-emerald-600 relative z-10 text-center drop-shadow-sm">₹{formatINR(chitValue)}</div>
                    </div>

                    <div className="bg-gradient-to-b from-white to-amber-50/30 rounded-2xl shadow-xl shadow-amber-100/50 border border-amber-100 p-5 relative overflow-hidden group hover:-translate-y-1 transition-transform">
                        <div className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-2 relative z-10 flex items-center justify-center gap-1.5"><ArrowDownRight className="w-3.5 h-3.5" /> MINIMUM LOSS</div>
                        <div className="text-xl md:text-2xl font-black text-amber-600 relative z-10 text-center drop-shadow-sm">₹{formatINR(minLoss)}</div>
                    </div>

                    <div className="bg-gradient-to-b from-white to-rose-50/30 rounded-2xl shadow-xl shadow-rose-100/50 border border-rose-100 p-5 relative overflow-hidden group hover:-translate-y-1 transition-transform">
                        <div className="text-[10px] font-black text-rose-600 uppercase tracking-widest mb-2 relative z-10 flex items-center justify-center gap-1.5"><TrendingDown className="w-3.5 h-3.5" /> LAST LOSS</div>
                        <div className="text-xl md:text-2xl font-black text-rose-600 relative z-10 text-center drop-shadow-sm">₹{formatINR(lastBid)}</div>
                    </div>

                    <div className="bg-gradient-to-b from-indigo-600 to-indigo-800 rounded-2xl shadow-xl shadow-indigo-200 border border-indigo-500 p-5 relative overflow-hidden group hover:-translate-y-1 transition-transform text-white border-b-4 border-indigo-900">
                        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.1)_50%,transparent_75%)] bg-[length:10px_10px] opacity-20"></div>
                        <div className="text-[10px] font-black text-indigo-300 uppercase tracking-widest mb-2 relative z-10 flex items-center justify-center gap-1.5"><Key className="w-3.5 h-3.5" /> ROOM CODE</div>
                        <div className="font-mono text-xl md:text-2xl font-black text-white tracking-widest relative z-10 text-center">{roomCode}</div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-6">
                    {/* Left Column (Results & Joined Users) */}
                    <div className="space-y-6">
                        {/* Results Box */}
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-64">
                            <h3 className="bg-indigo-50 border-b border-indigo-100 p-3 text-[10px] font-black text-indigo-800 tracking-wider">BID WINNERS & RESULTS</h3>
                            <div className="p-0 overflow-y-auto flex-1">
                                <table className="w-full text-xs text-left">
                                    <thead className="bg-slate-50 border-b sticky top-0 text-slate-500">
                                        <tr>
                                            <th className="p-2 font-bold tracking-wider">BATCH</th>
                                            <th className="p-2 font-bold tracking-wider">NAME</th>
                                            <th className="p-2 font-bold tracking-wider">LOSS</th>
                                            <th className="p-2 font-bold tracking-wider">INHAND</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {completedBatches.length > 0 ? completedBatches.map(b => (
                                            <tr key={b.id} className="hover:bg-slate-50">
                                                <td className="p-2 font-mono text-slate-500">{b.name}</td>
                                                <td className="p-2 font-bold text-slate-700">Winner</td>
                                                <td className="p-2 text-rose-600 font-bold">₹{formatINR(b.subscription)}</td>
                                                <td className="p-2 text-emerald-600 font-bold">₹{formatINR(b.value)}</td>
                                            </tr>
                                        )) : (
                                            <tr><td colSpan={4} className="p-4 text-center text-slate-400 italic">No recent actuals</td></tr>
                                        )}
                                        {/* Fallback Mock Data */}
                                        <tr className="border-b py-1 hover:bg-slate-50">
                                            <td className="p-2 font-mono text-slate-500">GK-A1</td>
                                            <td className="p-2 font-bold text-slate-700">Ravi K.</td>
                                            <td className="p-2 text-rose-600 font-bold">₹1.2L</td>
                                            <td className="p-2 text-emerald-600 font-bold">₹3.8L</td>
                                        </tr>
                                        <tr className="border-b py-1 hover:bg-slate-50">
                                            <td className="p-2 font-mono text-slate-500">GK-B2</td>
                                            <td className="p-2 font-bold text-slate-700">Anita</td>
                                            <td className="p-2 text-rose-600 font-bold">₹90k</td>
                                            <td className="p-2 text-emerald-600 font-bold">₹4.1L</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Joined Users */}
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-64">
                            <h3 className="bg-indigo-50 border-b border-indigo-100 p-3 text-[10px] font-black text-indigo-800 tracking-wider flex justify-between">
                                JOINED USERS: <span className="bg-indigo-200 text-indigo-800 px-2 rounded-full border border-indigo-300">{joinedUsers}</span>
                            </h3>
                            <div className="p-0 overflow-y-auto flex-1">
                                <table className="w-full text-xs text-left">
                                    <thead className="bg-slate-50 border-b sticky top-0 text-slate-500">
                                        <tr>
                                            <th className="p-2 font-bold tracking-wider">UID</th>
                                            <th className="p-2 font-bold tracking-wider">NAME</th>
                                            <th className="p-2 font-bold tracking-wider">ACTION</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {joinedUsersList.map((u, i) => (
                                            <tr key={i} className="hover:bg-slate-50">
                                                <td className="p-2 font-mono text-slate-400">{u.id}</td>
                                                <td className="p-2 font-bold text-slate-700">{u.name}</td>
                                                <td className="p-2"><span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded uppercase font-bold tracking-widest whitespace-nowrap">Watching</span></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Center Column (Timer & Info) */}
                    <div className="lg:col-span-2 flex flex-col gap-6 h-full">
                        <div className="flex-1 bg-gradient-to-b from-white to-slate-50 border border-slate-100 rounded-[2rem] shadow-xl shadow-slate-200/50 p-8 flex flex-col items-center relative overflow-hidden">
                            <div className="absolute top-0 w-full h-1.5 bg-gradient-to-r from-indigo-300 via-indigo-600 to-indigo-300"></div>
                            <div className="absolute top-0 w-[50%] left-[25%] h-full bg-indigo-100/30 blur-3xl pointer-events-none rounded-full -mt-20"></div>

                            <div className="inline-flex items-center gap-2 bg-white px-4 py-1.5 rounded-full shadow-sm border border-slate-100 text-xs font-black text-indigo-600 tracking-[0.2em] mb-8 relative z-10">
                                <Clock className="w-4 h-4" /> AUCTION TIMER
                            </div>

                            <div className="mb-10 scale-[1.7] transform origin-top shrink-0 drop-shadow-md relative z-10 w-full max-w-[200px]">
                                <TimerDigits />
                            </div>

                            <div className="w-full bg-white rounded-2xl shadow-lg border border-slate-100 p-6 relative z-10 mt-auto overflow-hidden">
                                <div className="absolute -right-4 -top-4 w-24 h-24 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full blur-xl pointer-events-none opacity-50"></div>

                                <h3 className="text-center text-xs font-black text-slate-400 uppercase tracking-widest mb-6 border-b border-slate-100 pb-4">
                                    CURRENT HIGHEST BIDDER <div className="animate-pulse inline-block w-2 h-2 rounded-full bg-rose-500 ml-2"></div>
                                </h3>

                                {highestBidder ? (
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between bg-indigo-50/50 p-4 rounded-xl border border-indigo-50">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-black">{highestBidder.name.charAt(0)}</div>
                                                <div className="font-black text-xl text-indigo-900">{highestBidder.name}</div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">Loss Amount</div>
                                                <div className="font-black text-2xl text-rose-600 drop-shadow-sm">₹{formatINR(highestBidder.loss)}</div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-50 flex flex-col justify-center text-center py-4">
                                                <div className="text-[10px] font-bold text-slate-400 tracking-widest uppercase mb-1">In Hand Amount</div>
                                                <div className="font-black text-xl text-emerald-600 drop-shadow-sm">₹{formatINR(inHandCalculated)}</div>
                                            </div>
                                            <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-50 flex flex-col justify-center text-center py-4">
                                                <div className="text-[10px] font-bold text-slate-400 tracking-widest uppercase mb-1">Interest Rate</div>
                                                <div className="font-black text-xl text-amber-500 drop-shadow-sm">{highestInterest}%</div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="py-12 flex flex-col items-center justify-center text-slate-400">
                                        <Activity className="w-12 h-12 mb-3 opacity-20" />
                                        <div className="font-bold uppercase tracking-widest text-sm text-center">Waiting for bids...</div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column (Live Bids / Ranks) */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 relative overflow-hidden h-full flex flex-col">
                        <div className="absolute top-0 left-0 w-full h-1 bg-rose-500"></div>

                        <div className="bg-rose-600 text-white text-center py-2 rounded-lg font-black tracking-[0.15em] text-xs animate-pulse mb-6 flex justify-center items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                            BIDS- LIVE AUCTION
                            <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                        </div>

                        <table className="w-full text-sm">
                            <thead className="text-xs text-slate-400 tracking-widest border-b border-slate-100">
                                <tr>
                                    <th className="text-left font-bold pb-2">RANK</th>
                                    <th className="text-left font-bold pb-2">NAME</th>
                                    <th className="text-right font-bold pb-2 whitespace-nowrap">LOSS AMOUNT</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {[1, 2, 3].map((pos, i) => {
                                    const b = bidders[i];
                                    return (
                                        <tr key={pos} className={!b ? "opacity-30" : ""}>
                                            <td className="py-4 font-black text-slate-400">{pos}.</td>
                                            <td className="py-4 font-bold text-slate-800">{b ? b.name : '---'}</td>
                                            <td className="py-4 text-right font-black text-rose-600">{b ? `₹${formatINR(b.loss)}` : '---'}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Marquee Bottom Ticker */}
                <div className="mt-6 bg-slate-900 border-2 border-slate-800 rounded-lg overflow-hidden shadow-lg">
                    <div className="whitespace-nowrap animate-[marquee_20s_linear_infinite] py-3 px-4 flex items-center gap-4">
                        <span className="bg-white/10 text-white/50 px-2 py-0.5 rounded text-[10px] font-black tracking-widest">SCROLLING</span>
                        <span className="text-amber-400 font-bold tracking-widest text-sm uppercase">GK FINSERV XX AUCTION DATE {dateMonth} - BATCH {activeBatchName || 'N/A'} - {ticker}</span>
                    </div>
                </div>

                {/* Number Pad for Bidding */}
                <div className="mt-8 relative z-20">
                    {/* The Lock Overlay */}
                    {isLockedOut && (
                        <div className="absolute inset-0 z-30 bg-slate-900/60 backdrop-blur-md rounded-[2rem] flex flex-col items-center justify-center border border-white/10 shadow-2xl">
                            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-4">
                                <AlertCircle className="w-8 h-8 text-rose-400" />
                            </div>
                            <h3 className="font-black text-white text-xl md:text-2xl tracking-widest">LOCKED OUT PORTAL</h3>
                            <p className="font-bold text-slate-300 mt-2 tracking-wide text-center max-w-sm px-4">Cannot bid in this auction. Wait for your batch's designated schedule.</p>
                        </div>
                    )}

                    <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-[2rem] p-8 md:p-10 shadow-2xl border border-white/10 overflow-hidden relative border-b-[6px]">
                        {/* 3D background elements */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-[80px] pointer-events-none -mt-20"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-rose-500/20 rounded-full blur-[80px] pointer-events-none -mb-20"></div>

                        <div className="flex items-center gap-3 mb-8 relative z-10 border-b border-white/10 pb-6">
                            <div className="w-2 h-6 md:h-8 bg-gradient-to-b from-indigo-400 to-purple-500 rounded-full"></div>
                            <div>
                                <h3 className="text-2xl md:text-3xl font-black text-white tracking-tight drop-shadow-sm">Quick Bid Terminal</h3>
                                <p className="text-indigo-200/60 font-medium text-xs md:text-sm mt-1">Select an increment to instantly submit your bid.</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 relative z-10">
                            {bidPercentages.map((pct) => {
                                const bidValue = Math.floor(chitValue * (pct / 100));
                                return (
                                    <button
                                        key={pct}
                                        onClick={() => placeBid(pct)}
                                        disabled={!running}
                                        className={`relative group py-6 px-4 rounded-2xl flex flex-col items-center justify-center transition-all duration-300 shadow-lg overflow-hidden border ${running ? 'bg-gradient-to-t from-white to-slate-50 border-white hover:border-indigo-200 hover:shadow-indigo-500/30 hover:-translate-y-2 cursor-pointer border-b-4 hover:border-b-indigo-400' : 'bg-white/5 border-white/5 opacity-50 cursor-not-allowed backdrop-blur-sm shadow-none'
                                            }`}
                                    >
                                        {running && <div className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-50/50 to-transparent -translate-x-full group-hover:animate-shimmer skew-x-12"></div>}
                                        {running && <div className="absolute bottom-0 w-full h-1.5 bg-indigo-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>}

                                        <span className={`font-black text-3xl md:text-4xl transition-transform drop-shadow-sm shadow-indigo-200 tracking-tight ${running ? 'text-indigo-950 group-hover:scale-[1.05]' : 'text-slate-300'}`}>+₹{formatINR(bidValue)}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {/* Error Notifications */}
            {err && (
                <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-slate-900 text-white px-8 py-3 rounded-full shadow-2xl flex items-center gap-3 z-50 animate-in fade-in slide-in-from-bottom-6 border border-slate-700">
                    <Info className="w-5 h-5 text-amber-500" />
                    <span className="font-bold tracking-widest text-[10px] md:text-sm uppercase">{err}</span>
                </div>
            )}
        </div>
    );
}
