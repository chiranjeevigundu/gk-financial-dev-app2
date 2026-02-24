import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { UserLite, AdminUser, AuctionConfig, AuctionState, PFMonthRow, ChitBatch, UserFinance, ForexRequest, CMSConfig, UserRequest } from '../types';

interface GlobalContextType {
    // User state
    user: UserLite | null;
    setUser: React.Dispatch<React.SetStateAction<UserLite | null>>;
    // Admin state
    adminUser: AdminUser | null;
    setAdminUser: React.Dispatch<React.SetStateAction<AdminUser | null>>;
    // Auction config
    auctionConfig: AuctionConfig;
    setAuctionConfig: React.Dispatch<React.SetStateAction<AuctionConfig>>;
    // Auction state
    auctionState: AuctionState;
    setAuctionState: React.Dispatch<React.SetStateAction<AuctionState>>;
    // Personal Finance live data
    pfLive: Record<string, PFMonthRow>;
    setPfLive: React.Dispatch<React.SetStateAction<Record<string, PFMonthRow>>>;
    // Dashboard Data
    batches: ChitBatch[];
    setBatches: React.Dispatch<React.SetStateAction<ChitBatch[]>>;

    // Admin: Users
    allUsers: UserLite[];
    addUser: (user: UserLite) => void;
    updateUser: (id: string, data: Partial<UserLite>) => void;
    deleteUser: (id: string) => void;

    // Admin: Batches CRUD
    addBatch: (batch: ChitBatch) => void;
    updateBatch: (id: string, data: Partial<ChitBatch>) => void;
    deleteBatch: (id: string) => void;

    // Finance Data
    userFinance: UserFinance | null; // Derived for current user
    allUserFinances: Record<string, UserFinance>; // Master record
    updateUserFinance: (userId: string, data: UserFinance) => void;

    // Requests
    forexRequests: ForexRequest[];
    addForexRequest: (req: Omit<ForexRequest, 'id' | 'status' | 'date' | 'userId'>) => void;
    userRequests: UserRequest[];
    addUserRequest: (req: Omit<UserRequest, 'id' | 'status' | 'date'>) => void;
    updateUserRequest: (id: string, data: Partial<UserRequest>) => void;
    // Login Modal State
    showLoginModal: boolean;
    setShowLoginModal: React.Dispatch<React.SetStateAction<boolean>>;

    // Misc
    finalizeAuction: () => void;
    canBid: (userId: string, batchId: string) => boolean;
    syncAuctionResults: (batchId: string, resultData: { finalLoss: number, dividend: number, monthlyPayment: number, winnerId?: string, runningMonth: string }) => void;
    // CMS Config
    cmsConfig: CMSConfig;
    setCmsConfig: React.Dispatch<React.SetStateAction<CMSConfig>>;
}


const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

// Initial Mock Data
const INITIAL_USERS: UserLite[] = [
    {
        id: 'GK2025-0012', name: 'Ravi Kumar', services: ['Chits', 'Loans'],
        phone: '9876543210', altPhone: '9988776655', email: 'ravi.kumar@example.com', address: '123, Gandhi Nagar, Bangalore',
        bankDetails: { accountNumber: '1234567890', ifsc: 'SBIN0001234', bankName: 'SBI', branch: 'MG Road' },
        surity: { name: 'Suresh Kumar', phone: '9123456780', address: '456, Indiranagar, Bangalore', relation: 'Brother' }
    },
    { id: 'U-2', name: 'Anita', services: ['Chits'], phone: '9876500001', address: '789, Jayanagar, Bangalore' },
    { id: 'U-3', name: 'Kiran', services: ['Chits', 'Forex'], phone: '9876500002' },
    { id: 'U-4', name: 'Suresh', services: ['Chits', 'Stocks'], phone: '9876500003' },
];

const INITIAL_FINANCE: Record<string, UserFinance> = {
    'GK2025-0012': {
        chits: [
            {
                batchId: 'GK-A1', batchName: 'Alpha Batch', value: 500000, term: 25, status: 'Active', bidWon: false, totalPaid: 220000, pendingAmount: 280000, installmentsPaid: 11,
                history: [{ month: 'Jan', amount: 20000, paidOn: '10 Jan', status: 'Paid' }]
            }
        ],
        loans: [
            { id: 'LN-01', type: 'Personal', amount: 200000, date: '15 Aug 2024', interestRate: 12, status: 'Active', pendingPrincipal: 180000, interestPaid: 12000, principalPaid: 20000, totalPending: 182000 }
        ],
        deposits: []
    }
};

const INITIAL_CMS_CONFIG: CMSConfig = {
    features: [
        { id: '1', label: 'Live Auction', icon: 'Gavel', path: '/chits', color: 'bg-indigo-600' },
        { id: '2', label: 'Chit Details', icon: 'List', path: '/chit-details', color: 'bg-emerald-600' },
        { id: '3', label: 'Monthly Payments', icon: 'Calendar', path: '/payments', color: 'bg-teal-600' },
        { id: '4', label: 'Personal Loans', icon: 'Banknotes', path: '/loans', color: 'bg-amber-600' },
        { id: '5', label: 'Credit Cards', icon: 'CreditCard', path: '/credit-cards', color: 'bg-purple-600' },
        { id: '6', label: 'Stock Market', icon: 'TrendingUp', path: '/stocks', color: 'bg-sky-600' },
        { id: '7', label: 'Forex', icon: 'RefreshCw', path: '/forex', color: 'bg-rose-600' },
        { id: '8', label: 'Personal Portfolio', icon: 'PieChart', path: '/portfolio', color: 'bg-blue-600' },
    ],
    sidebar: {
        ads: '### Special Offer!\nGet 50% off on processing fees for new personal loans this month only.',
        announcements: '### System Maintenance\nScheduled maintenance on Sunday 2 AM - 4 AM.\n\n### New Feature\nWe have added Forex services!',
        adMediaUrl: ''
    },
    contact: {
        address: '123 Financial District, Main Road, Hyderabad, Telangana 500001',
        phone: '+91 93936 36060',
        secondaryPhone: '+91 88888 88888',
        email: 'support@gkgroups.com',
        about: 'GK Groups has been a trusted financial partner since 1993. Founded by Visionary Leader, we are committed to providing secure and reliable financial services to help you grow your wealth.'
    },
    ticker: 'Welcome to GK Groups - Your Trusted Financial Partner Since 1993',
    theme: {
        primaryColor: 'indigo',
        style: 'glassmorphic'
    }
};

export function GlobalProvider({ children }: { children: ReactNode }) {
    // --- PERSISTENCE HELPERS ---
    const getStored = <T,>(key: string, def: T): T => {
        try {
            const s = localStorage.getItem(key);
            if (!s || s === 'undefined' || s === 'null') return def;
            return JSON.parse(s);
        } catch (e) {
            console.error(`Error parsing ${key}`, e);
            return def;
        }
    };

    const setStored = (key: string, val: any) => {
        localStorage.setItem(key, JSON.stringify(val));
    };

    const [user, setUser] = useState<UserLite | null>(null);
    const [adminUser, setAdminUser] = useState<AdminUser | null>(() => getStored('gk_adminUser', null));
    const [showLoginModal, setShowLoginModal] = useState(false);

    // --- STATE ---
    const [auctionConfig, setAuctionConfig] = useState<AuctionConfig>(() => getStored('gk_auctionConfig', {
        dateMonth: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
        startMonth: 'Jan', endMonth: 'Dec', runningMonth: 'Nov', term: 24, chitValue: 600000, lastBid: 0, commissionRate: 5, minLoss: 30000, monthlyPayment: 0,
        ticker: 'Welcome to GK Groups Chit Auction • Next batch opens at 4:30 PM', roomCode: 'GK-123456', joinedUsers: 0, joinedUsersList: INITIAL_USERS,
        activeBatchId: 'GK-A1', activeBatchName: 'Alpha Batch'
    }));

    const [auctionState, setAuctionState] = useState<AuctionState>(() => getStored('gk_auctionState', {
        secondsLeft: 600, running: false, finished: false, currentLoss: 30000, bidders: []
    }));

    const [allUsers, setAllUsers] = useState<UserLite[]>(() => getStored('gk_allUsers', INITIAL_USERS) || INITIAL_USERS);
    const [allUserFinances, setAllUserFinances] = useState<Record<string, UserFinance>>(() => getStored('gk_allUserFinances', INITIAL_FINANCE) || INITIAL_FINANCE);
    const [batches, setBatches] = useState<ChitBatch[]>(() => getStored('gk_batches', [
        { id: 'GK-A1', name: 'Alpha Batch', value: 500000, currentMonth: 'Nov', subscription: 20000, dividend: 500, status: 'Active', nextAuction: '10 Dec, 4:00 PM' }
    ]));

    const [pfLive, setPfLive] = useState<Record<string, PFMonthRow>>({});
    const [forexRequests, setForexRequests] = useState<ForexRequest[]>([]);
    const [userRequests, setUserRequests] = useState<UserRequest[]>(() => getStored('gk_userRequests', []));
    const [cmsConfig, setCmsConfig] = useState<CMSConfig>(() => {
        // Always force reset features array to ensure the user gets the updated layout pipeline
        const stored = getStored('gk_cmsConfig', INITIAL_CMS_CONFIG);
        return {
            ...stored,
            features: INITIAL_CMS_CONFIG.features,
            theme: stored.theme || INITIAL_CMS_CONFIG.theme
        };
    });

    // --- SYNC EFFECTS ---
    useEffect(() => { setStored('gk_adminUser', adminUser); }, [adminUser]);
    useEffect(() => { setStored('gk_auctionConfig', auctionConfig); }, [auctionConfig]);
    useEffect(() => { setStored('gk_auctionState', auctionState); }, [auctionState]);
    useEffect(() => { setStored('gk_allUsers', allUsers); }, [allUsers]);
    useEffect(() => { setStored('gk_allUserFinances', allUserFinances); }, [allUserFinances]);
    useEffect(() => { setStored('gk_batches', batches); }, [batches]);
    useEffect(() => { setStored('gk_cmsConfig', cmsConfig); }, [cmsConfig]);
    useEffect(() => { setStored('gk_userRequests', userRequests); }, [userRequests]);

    // Listen for storage events (Cross-Tab Sync)
    useEffect(() => {
        const handleStorage = (e: StorageEvent) => {
            if (e.key === 'gk_auctionState' && e.newValue) setAuctionState(JSON.parse(e.newValue));
            if (e.key === 'gk_auctionConfig' && e.newValue) setAuctionConfig(JSON.parse(e.newValue));
            if (e.key === 'gk_allUsers' && e.newValue) setAllUsers(JSON.parse(e.newValue));
            if (e.key === 'gk_allUserFinances' && e.newValue) setAllUserFinances(JSON.parse(e.newValue));
            if (e.key === 'gk_cmsConfig' && e.newValue) setCmsConfig(JSON.parse(e.newValue));
            if (e.key === 'gk_userRequests' && e.newValue) setUserRequests(JSON.parse(e.newValue));
        };
        window.addEventListener('storage', handleStorage);
        return () => window.removeEventListener('storage', handleStorage);
    }, []);

    // Timer Logic (Timestamp based for Sync)
    useEffect(() => {
        if (!auctionState.running || auctionState.finished) return;

        // If running but no endTime (e.g. just started), set it to exactly 10 minutes from now
        if (!auctionState.endTime) {
            const TEN_MINUTES_MS = 10 * 60 * 1000;
            const end = Date.now() + TEN_MINUTES_MS;
            setAuctionState(prev => ({ ...prev, endTime: end, secondsLeft: 600 }));
            return;
        }

        const t = setInterval(() => {
            const now = Date.now();
            const left = Math.max(0, Math.ceil((auctionState.endTime! - now) / 1000));

            setAuctionState(prev => {
                if (left === 0) {
                    return { ...prev, secondsLeft: 0, running: false, finished: true };
                }
                return { ...prev, secondsLeft: left };
            });
        }, 1000);

        return () => clearInterval(t);
    }, [auctionState.running, auctionState.finished, auctionState.endTime]);

    // Sync joinedUsersList with allUsers for auction config
    useEffect(() => {
        setAuctionConfig(prev => ({ ...prev, joinedUsersList: allUsers }));
    }, [allUsers]);

    // Derived: joined users count
    useEffect(() => {
        setAuctionConfig(p => ({ ...p, joinedUsers: p.joinedUsersList.length }));
    }, [auctionConfig.joinedUsersList.length]);

    // Derived: minLoss from chitValue & commission
    useEffect(() => {
        setAuctionConfig(p => ({ ...p, minLoss: Math.floor(p.chitValue * (p.commissionRate / 100)) }));
        setAuctionState(s => ({
            ...s,
            currentLoss: s.running ? s.currentLoss : Math.max(s.currentLoss, Math.floor(auctionConfig.chitValue * (auctionConfig.commissionRate / 100)))
        }));
    }, [auctionConfig.chitValue, auctionConfig.commissionRate]);

    // Derived User Finance
    const userFinance = user ? (allUserFinances[user.id] || { chits: [], loans: [], deposits: [] }) : null;

    // --- ACTIONS ---
    const addForexRequest = (req: Omit<ForexRequest, 'id' | 'status' | 'date' | 'userId'>) => {
        if (!user) return;
        const newReq: ForexRequest = { ...req, id: `FX-${Date.now()}`, userId: user.id, status: 'Pending', date: new Date().toLocaleDateString() };
        setForexRequests(prev => [newReq, ...prev]);
    };

    const addUserRequest = (req: Omit<UserRequest, 'id' | 'status' | 'date'>) => {
        const newReq: UserRequest = {
            ...req,
            id: `REQ-${Date.now()}`,
            status: 'Pending',
            date: new Date().toLocaleDateString()
        };
        setUserRequests(prev => [newReq, ...prev]);
    };

    const updateUserRequest = (id: string, data: Partial<UserRequest>) => {
        setUserRequests(prev => prev.map(r => r.id === id ? { ...r, ...data } : r));
    };

    const addUser = (u: UserLite) => setAllUsers(prev => [...prev, u]);
    const updateUser = (id: string, data: Partial<UserLite>) => setAllUsers(prev => prev.map(u => u.id === id ? { ...u, ...data } : u));
    const deleteUser = (id: string) => setAllUsers(prev => prev.filter(u => u.id !== id));

    const addBatch = (b: ChitBatch) => setBatches(prev => [...prev, b]);
    const updateBatch = (id: string, data: Partial<ChitBatch>) => setBatches(prev => prev.map(b => b.id === id ? { ...b, ...data } : b));
    const deleteBatch = (id: string) => setBatches(prev => prev.filter(b => b.id !== id));

    const updateUserFinance = (userId: string, data: UserFinance) => setAllUserFinances(prev => ({ ...prev, [userId]: data }));

    function finalizeAuction() {
        setAuctionState(prev => {
            if (prev.finished) return prev;
            const top = prev.bidders[0];
            const commission = auctionConfig.minLoss;
            const winnerLoss = top ? top.loss : 0;
            const finalLoss = commission + winnerLoss;
            const monthInHand = Math.max(auctionConfig.chitValue - finalLoss, 0);
            const winner = top ? { userId: top.userId, name: top.name, winnerLoss, finalLoss, monthInHand } : undefined;
            return { ...prev, running: false, finished: true, winner };
        });
    }

    const syncAuctionResults = (batchId: string, resultData: { finalLoss: number, dividend: number, monthlyPayment: number, winnerId?: string, runningMonth: string }) => {
        // 1. Advance the batch month (optional simple implementation, relying on the admin to set the new 'currentMonth' in batch if needed)
        // Here we can just record it in the history of the chits.

        // 2. Update all users participating in this batch
        setAllUserFinances(prevStore => {
            const nextStore = { ...prevStore };

            Object.keys(nextStore).forEach(userId => {
                const userFin = nextStore[userId];
                const chitIndex = userFin.chits.findIndex(c => c.batchId === batchId && c.status === 'Active');

                if (chitIndex !== -1) {
                    const chit = { ...userFin.chits[chitIndex] };

                    // Add history row
                    const newHistoryRow = {
                        month: resultData.runningMonth,
                        amount: resultData.monthlyPayment,
                        status: 'Pending' as const
                    };
                    chit.history = [...chit.history, newHistoryRow];

                    // Add dividend to total profit
                    chit.totalProfit = (chit.totalProfit || 0) + resultData.dividend;

                    // Update current stats based on the new sync
                    chit.currentMonthPayment = resultData.monthlyPayment;
                    chit.currentMonthDividend = resultData.dividend;
                    chit.pendingAmount = (chit.pendingAmount || 0) + resultData.monthlyPayment;

                    // If this user is the winner
                    if (userId === resultData.winnerId) {
                        chit.bidWon = true;
                        chit.bidMonth = resultData.runningMonth;
                        chit.bidAmount = resultData.finalLoss;
                        chit.bidsInHand = (chit.bidsInHand || 1) - 1;
                        chit.totalLoss = resultData.finalLoss;
                    } else if (!chit.bidWon) {
                        // Everyone else who hasn't won still has a bid in hand
                        chit.bidsInHand = 1;
                    }

                    // Save chit back to user
                    const updatedChits = [...userFin.chits];
                    updatedChits[chitIndex] = chit;
                    nextStore[userId] = { ...userFin, chits: updatedChits };
                }
            });

            return nextStore;
        });

        // 3. Reset Auction State
        setAuctionState({
            secondsLeft: 600,
            endTime: undefined,
            running: false,
            finished: false,
            currentLoss: Math.floor(auctionConfig.chitValue * (auctionConfig.commissionRate / 100)),
            bidders: [],
        });
    };

    // Auto finalize
    useEffect(() => {
        if (auctionState.secondsLeft === 0 && !auctionState.finished) finalizeAuction();
    }, [auctionState.secondsLeft, auctionState.finished]);

    // Validation: Can user bid?
    const canBid = (userId: string, batchId: string): boolean => {
        if (adminUser || userId.startsWith('ADMIN')) return true;
        const userFin = allUserFinances[userId];
        if (!userFin) return false;
        // Check if user has a chit in this batch and it's active
        const chit = userFin.chits.find(c => c.batchId === batchId && c.status === 'Active');
        if (!chit) return false;
        // Check if user has already won a bid in this batch
        if (chit.bidWon) return false;
        return true;
    };

    return (
        <GlobalContext.Provider value={{
            user, setUser, adminUser, setAdminUser, showLoginModal, setShowLoginModal,
            auctionConfig, setAuctionConfig, auctionState, setAuctionState,
            pfLive, setPfLive, batches, setBatches,
            allUsers, addUser, updateUser, deleteUser,
            addBatch, updateBatch, deleteBatch,
            userFinance, allUserFinances, updateUserFinance,
            forexRequests, addForexRequest, finalizeAuction, syncAuctionResults, canBid,
            cmsConfig, setCmsConfig,
            userRequests, addUserRequest, updateUserRequest
        }}>
            {children}
        </GlobalContext.Provider>
    );
}

export function useGlobal() {
    const context = useContext(GlobalContext);
    if (context === undefined) throw new Error('useGlobal must be used within a GlobalProvider');
    return context;
}
