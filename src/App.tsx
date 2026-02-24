import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { GlobalProvider } from './context/GlobalContext';
import { MainLayout } from './layouts/MainLayout';
import { Home } from './pages/Home';
import { ChitFunds } from './pages/services/ChitFunds';
import { ChitDetails } from './pages/services/ChitDetails';
import { PersonalPortfolio } from './pages/services/PersonalPortfolio';
import { MonthlyPayments } from './pages/services/MonthlyPayments';
import { PersonalLoans } from './pages/services/PersonalLoans';
import { CreditCards } from './pages/services/CreditCards';
import { StockMarket } from './pages/services/StockMarket';
import { Forex } from './pages/services/Forex';
import { Contact } from './pages/Contact';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { RequireAuth } from './components/auth/RequireAuth';

// Admin imports
import { AdminLayout } from './pages/admin/AdminLayout';
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminUsers, AdminChits } from './pages/admin/AdminPages';
import { AdminAuction } from './pages/admin/AdminAuction';
import { AdminCMS } from './pages/admin/AdminCMS';
import { AdminRequests } from './pages/admin/AdminRequests';
import { AdminLoans, AdminDeposits, AdminCards, AdminForex, AdminStocks } from './pages/admin/AdminServices';
import { useGlobal } from './context/GlobalContext';
import { getTailwindColorScale } from './utils/themeHelpers'; // We will create this

function ThemeSetter() {
  const { cmsConfig } = useGlobal();

  if (!cmsConfig?.theme) return null;

  const scale = getTailwindColorScale(cmsConfig.theme.primaryColor);

  // Override multiple common colors so the entire site universally changes
  // to the chosen primary color without changing hardcoded tailwind classes.
  const cssVars = ['primary', 'indigo', 'emerald', 'sky', 'rose', 'violet', 'amber']
    .map((colorName: string) => scale.map((val: string, i: number) => `--color-${colorName}-${i === 0 ? 50 : i * 100}: ${val};`).join('\n      '))
    .join('\n      ');

  const colorStyle = `
    @theme {
      ${cssVars}
    }

    :root {
      ${cssVars}
    }

    body {
      ${cmsConfig.theme.style === 'glassmorphic' ? 'background: #f8fafc;' : 'background: #f1f5f9;'}
    }
  `;

  return <style>{colorStyle}</style>;
}

function AdminRoutes() {
  const { setAdminUser } = useGlobal();

  return (
    <Routes>
      <Route path="/" element={<AdminLogin onSuccess={setAdminUser} />} />
      <Route element={<AdminLayout />}>
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="cms" element={<AdminCMS />} />
        <Route path="auction" element={<AdminAuction />} />
        <Route path="chits" element={<AdminChits />} />
        <Route path="loans" element={<AdminLoans />} />
        <Route path="deposits" element={<AdminDeposits />} />
        <Route path="cards" element={<AdminCards />} />
        <Route path="forex" element={<AdminForex />} />
        <Route path="stocks" element={<AdminStocks />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="messages" element={<AdminRequests />} />
      </Route>
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <GlobalProvider>
      <ThemeSetter />
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />

          {/* Main Site Routes */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />

            {/* Protected Service Routes */}
            <Route path="/chits" element={<RequireAuth><ChitFunds /></RequireAuth>} />
            <Route path="/chit-details" element={<RequireAuth><ChitDetails /></RequireAuth>} />
            <Route path="/portfolio" element={<RequireAuth><PersonalPortfolio /></RequireAuth>} />
            <Route path="/payments" element={<RequireAuth><MonthlyPayments /></RequireAuth>} />

            {/* Legacy/Other Routes */}
            <Route path="/loans" element={<RequireAuth><PersonalLoans /></RequireAuth>} />
            <Route path="/credit-cards" element={<RequireAuth><CreditCards /></RequireAuth>} />
            <Route path="/stocks" element={<RequireAuth><StockMarket /></RequireAuth>} />
            <Route path="/forex" element={<RequireAuth><Forex /></RequireAuth>} />
            <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />

            <Route path="/contact" element={<Contact />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin/*" element={<AdminRoutes />} />

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </GlobalProvider>
  );
}

export default App;
