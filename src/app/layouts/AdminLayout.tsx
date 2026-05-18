import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Building2, 
  Users, 
  ShieldCheck, 
  CreditCard, 
  Wallet, 
  History, 
  PieChart, 
  LifeBuoy,
  LogOut
} from 'lucide-react';
import viyanLogo from '../../assets/viyan_logo.png';
import { authApi } from '../../core/api/auth';

const AdminSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const links = [
    { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/admin/tenants', icon: Building2, label: 'Tenants' },
    { path: '/admin/tenant-users', icon: Users, label: 'Tenant Users' },
    { path: '/admin/platform-admins', icon: ShieldCheck, label: 'Platform Admins' },
    { path: '/admin/subscriptions', icon: CreditCard, label: 'Subscriptions' },
    { path: '/admin/payments', icon: Wallet, label: 'Payments' },
    { path: '/admin/audit-logs', icon: History, label: 'Audit Logs' },
    { path: '/admin/reports', icon: PieChart, label: 'Reports' },
    { path: '/admin/support', icon: LifeBuoy, label: 'Support' },
  ];

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    await authApi.logout();
    navigate('/admin');
  };

  return (
    <aside className="sidebar" style={{ borderRightColor: 'rgba(99, 102, 241, 0.15)' }}>
      <div className="logo" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '40px' }}>
        <div style={{ 
          background: 'linear-gradient(135deg, #4f46e5 0%, #9333ea 100%)', 
          padding: '2px', 
          borderRadius: '10px', 
          display: 'flex' 
        }}>
          <img src={viyanLogo} alt="Viyan Admin" style={{ height: '28px', width: '28px', background: 'white', borderRadius: '8px' }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-primary)', lineHeight: 1 }}>Viyan</span>
          <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#6366f1', letterSpacing: '0.05em', textTransform: 'uppercase', marginTop: '2px' }}>Admin Hub</span>
        </div>
      </div>
      
      <nav className="nav-links" style={{ flex: 1 }}>
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname === link.path;
          return (
            <Link
              key={link.path}
              to={link.path}
              className={`nav-item ${isActive ? 'active' : ''}`}
              style={isActive ? {
                background: 'rgba(99, 102, 241, 0.06)',
                color: '#4f46e5',
                borderColor: 'rgba(99, 102, 241, 0.2)'
              } : {}}
            >
              <Icon size={20} color={isActive ? '#4f46e5' : 'inherit'} />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="nav-links" style={{ marginTop: 'auto', borderTop: '1px solid var(--border-color)', paddingTop: '16px', marginBottom: '16px' }}>
        <Link to="/admin" onClick={handleLogout} className="nav-item" style={{ color: '#ef4444' }}>
          <LogOut size={20} />
          Sign Out
        </Link>
      </div>
    </aside>
  );
};

export const AdminLayout = () => {
  return (
    <div className="app-layout">
      <AdminSidebar />
      <main className="main-content">
        <div style={{ 
          background: 'linear-gradient(to right, rgba(99, 102, 241, 0.05), transparent)', 
          position: 'fixed', 
          top: 0, 
          left: '260px', 
          right: 0, 
          height: '4px', 
          zIndex: 100 
        }} />
        <Outlet />
      </main>
    </div>
  );
};
