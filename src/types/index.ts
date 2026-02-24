// ======= Types =======
export type AdminRoute = 'login' | 'dashboard' | 'users' | 'chits' | 'loans' | 'credits' | 'audit';

export type UserLite = {
    id: string;
    name: string;
    services: string[];
    // Expanded Profile
    phone?: string;
    altPhone?: string;
    email?: string;
    address?: string;
    govtIdUrls?: string[]; // URLs or text placeholders
    bankDetails?: {
        accountNumber: string;
        ifsc: string;
        bankName: string;
        branch?: string;
    };
    surity?: {
        name: string;
        phone: string;
        address: string;
        relation?: string;
    };
};

export type AdminUser = { id: string; name: string; email: string; role: 'Owner' | 'Manager' };

export type Bidder = { userId: string; name: string; loss: number };

export type AuctionConfig = {
    dateMonth: string;         // e.g., "21 Sep 2025"
    startMonth: string;        // e.g., "Jan"
    endMonth: string;          // e.g., "Dec"
    runningMonth: string;      // admin-set, e.g., "Nov"
    term: number;              // months
    chitValue: number;         // ₹
    lastBid: number;           // previous month loss (admin-set)
    commissionRate: number;    // % (admin input)
    minLoss: number;           // = floor(chitValue * commissionRate/100)
    monthlyPayment: number;    // set by admin AFTER finalize (0 allowed)
    ticker: string;            // marquee text
    roomCode: string;          // required to join & bid
    joinedUsers: number;       // derived
    joinedUsersList: Array<{ id: string; name: string }>;
    activeBatchId?: string;    // ID of the batch currently being auctioned
    activeBatchName?: string;  // Name of the batch currently being auctioned
};

export type AuctionState = {
    secondsLeft: number;       // DEPRECATED: Use endTime instead for sync
    endTime?: number;          // Timestamp (ms) when auction ends
    running: boolean;
    finished: boolean;
    currentLoss: number;       // minLoss + Σ(increments)
    bidders: Bidder[];         // top-3 distinct users
    winner?: { userId: string; name: string; winnerLoss: number; finalLoss: number; monthInHand: number };
};

export type PFMonthRow = {
    name: string;
    chitValue: number;
    monthLoss: number;      // commission + winnerLoss
    monthInHand: number;    // chitValue − monthLoss
    monthlyPayment: number; // admin-set
    runningMonth: string;
};

export type ChitBatch = {
    id: string;
    name: string;
    value: number;
    currentMonth: string;
    subscription: number;
    dividend: number;
    status: 'Active' | 'Completed';
    nextAuction: string;
};

export type UserChit = {
    batchId: string;
    batchName: string;
    value: number;
    term: number;
    status: 'Active' | 'Completed';
    startDate?: string;
    endDate?: string;
    bidWon: boolean;
    bidMonth?: string;
    bidAmount?: number;
    totalPaid: number;
    pendingAmount: number;
    installmentsPaid: number;
    currentMonthPayment?: number;
    currentMonthDividend?: number;
    bidsInHand?: number;
    totalLoss?: number;
    totalProfit?: number;
    history: Array<{ month: string; amount: number; paidOn?: string; status: 'Paid' | 'Pending' | 'Overdue'; invoiceUrl?: string; receiptUrl?: string }>;
};

export type UserLoan = {
    id: string;
    type: 'Personal' | 'Business';
    amount: number;
    date: string;
    endDate?: string;
    interestRate: number; // % per month
    status: 'Active' | 'Closed';
    pendingPrincipal: number;
    interestPaid: number;
    principalPaid: number;
    totalPending: number;
    monthlyInterest?: number;
    nextDueDate?: string;
};

export type UserDeposit = {
    id: string;
    amount: number;
    date: string;
    interestRate: number;
    interestEarned: number;
    maturityDate?: string;
    status: 'Active' | 'Withdrawn';
    monthlyPayout?: number;
};

export type UserFinance = {
    chits: UserChit[];
    loans: UserLoan[];
    deposits: UserDeposit[];
};

export type UserRequest = {
    id: string;
    userId?: string; // Optional for new user registrations
    userName: string;
    type: 'Join Chit' | 'New Loan' | 'New Deposit' | 'Forex' | 'Portfolio Update' | 'Registration' | 'Password Reset';
    details: any; // Flexible object holding request-specific info
    status: 'Pending' | 'Approved' | 'Rejected' | 'Completed';
    date: string;
    adminComment?: string;
};

// Kept for backward compatibility if needed, though we can migrate Forex to UserRequest.
export type ForexRequest = {
    id: string;
    userId: string;
    type?: 'Buy' | 'Sell';
    currency?: string;
    fromCurrency?: string;
    toCurrency?: string;
    name?: string;
    amount: number;
    status: 'Pending' | 'Completed' | 'Approved' | 'Rejected';
    date: string;
    adminComment?: string;
};

export type FeatureButton = {
    id: string;
    label: string;
    icon: string; // Lucide icon name
    path: string;
    color: string; // Tailwind class
};

export type SidebarContent = {
    ads: string; // HTML or Markdown content
    announcements: string; // HTML or Markdown content
    adMediaUrl?: string; // Optional image/video URL for ads
};

export type ContactDetails = {
    address: string;
    phone: string;
    secondaryPhone?: string;
    email: string;
    about?: string; // About Company & Founder
    mapUrl?: string;
};

export type CMSTheme = {
    primaryColor: 'indigo' | 'emerald' | 'amber' | 'rose' | 'sky' | 'violet';
    style: 'glassmorphic' | 'minimal' | '3d';
};

export type CMSConfig = {
    features: FeatureButton[];
    sidebar: SidebarContent;
    contact: ContactDetails;
    ticker: string; // Scroll/Marquee text
    theme: CMSTheme; // Global styling preferences
};
