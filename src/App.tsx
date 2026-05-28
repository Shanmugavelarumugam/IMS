import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LandingPage } from './modules/landing/pages/LandingPage';
import { NotFoundPage } from './modules/landing/pages/NotFoundPage';
import { RootLayout } from './app/layouts/RootLayout';
import { Dashboard } from './modules/dashboard/pages/DashboardPage';
import { Inventory } from './modules/inventory/pages/InventoryPage';
import { LoginPage } from './modules/auth/pages/LoginPage';
import { SignUpPage } from './modules/auth/pages/SignUpPage';
import { OnboardingPage } from './modules/auth/pages/OnboardingPage';
import { AdminLoginPage } from './modules/auth/pages/AdminLoginPage';
import { AdminLayout } from './app/layouts/AdminLayout';
import { AdminDashboardPage } from './modules/admin/pages/AdminDashboardPage';
import { TenantsPage } from './modules/admin/pages/TenantsPage';
import { PlatformAdminsPage } from './modules/admin/pages/PlatformAdminsPage';
import { TenantUsersPage } from './modules/admin/pages/TenantUsersPage';
import { SubscriptionsPage } from './modules/admin/pages/SubscriptionsPage';
import { AuditLogsPage } from './modules/admin/pages/AuditLogsPage';
import { AdminPaymentsPage } from './modules/admin/pages/PaymentsPage';
import { BranchesPage } from './modules/branches/pages/BranchesPage';
import { TransfersPage } from './modules/inventory/pages/TransfersPage';
import { ProductsPage } from './modules/products/pages/ProductsPage';
import { CategoriesPage } from './modules/products/pages/CategoriesPage';
import { ProfilePage } from './modules/users/pages/ProfilePage';
import { SuppliersPage } from './modules/suppliers/pages/SuppliersPage';
import { PurchasesPage } from './modules/purchases/pages/PurchasesPage';
import { CustomersPage } from './modules/customers/pages/CustomersPage';
import { SalesPage } from './modules/sales/pages/SalesPage';
import { ReportsPage } from './modules/reports/pages/ReportsPage';
import { SettingsPage } from './modules/settings/pages/SettingsPage';
import './styles/App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Landing Page */}
        <Route path="/" element={<LandingPage />} />
        
        {/* Authentication */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/admin">
          <Route index element={<AdminLoginPage />} />
          <Route element={<AdminLayout />}>
            <Route path="dashboard" element={<AdminDashboardPage />} />
            <Route path="tenants" element={<TenantsPage />} />
            <Route path="tenant-users" element={<TenantUsersPage />} />
            <Route path="subscriptions" element={<SubscriptionsPage />} />
            <Route path="payments" element={<AdminPaymentsPage />} />
            <Route path="audit-logs" element={<AuditLogsPage />} />
            <Route path="platform-admins" element={<PlatformAdminsPage />} />
            <Route path="*" element={
              <div style={{ textAlign: 'center', padding: '100px 0' }}>
                <h2 style={{ fontSize: '2.5rem', opacity: 0.4, fontWeight: 700 }}>Admin Control Node</h2>
                <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>Sub-module initialized. Finalizing deployment.</p>
              </div>
            } />
          </Route>
        </Route>
        
        {/* App Dashboard and protected routing shell */}
        <Route path="/app" element={<RootLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="categories" element={<CategoriesPage />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="branches" element={<BranchesPage />} />
          <Route path="transfers" element={<TransfersPage />} />
          <Route path="purchases" element={<PurchasesPage />} />
          <Route path="suppliers" element={<SuppliersPage />} />
          <Route path="customers" element={<CustomersPage />} />
          <Route path="sales" element={<SalesPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="*" element={
            <div style={{textAlign: 'center', padding: '100px 0'}}>
              <h2 style={{fontSize: '3rem', opacity: 0.5}}>Feature Coming Soon</h2>
              <p style={{color: 'var(--text-secondary)', marginTop: '10px'}}>We're currently working on this module.</p>
            </div>
          } />
        </Route>

        {/* Fallback handler */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
