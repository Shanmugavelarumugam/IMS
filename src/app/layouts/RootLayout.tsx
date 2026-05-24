import { useState, useEffect } from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { Menu, LayoutDashboard, Package, Tags, Boxes, ShoppingCart, TrendingUp, UserRound, Truck, BarChart3, LogOut, Building2, Search, AlertCircle, Settings } from 'lucide-react';
import viyanLogo from '../../assets/viyan_logo.png';
import { authApi } from '../../core/api/auth';

const Sidebar = ({ onClose, onResizeMouseDown }: { onClose?: () => void, onResizeMouseDown?: (e: React.MouseEvent) => void }) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const links = [
    { path: '/app', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/app/products', icon: Package, label: 'Products' },
    { path: '/app/categories', icon: Tags, label: 'Categories' },
    { path: '/app/inventory', icon: Boxes, label: 'Inventory' },
    { path: '/app/purchases', icon: ShoppingCart, label: 'Purchases' },
    { path: '/app/sales', icon: TrendingUp, label: 'Sales' },
    { path: '/app/customers', icon: UserRound, label: 'Customers' },
    { path: '/app/suppliers', icon: Truck, label: 'Suppliers' },
    { path: '/app/reports', icon: BarChart3, label: 'Reports' },
    { path: '/app/settings', icon: Settings, label: 'Settings' },
  ];

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    (window as typeof window & { isLoggingOut?: boolean }).isLoggingOut = true;
    await authApi.logout();
    navigate('/login');
  };

  return (
    <aside className="sidebar">
      <div className="logo" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <img src={viyanLogo} alt="Viyan" style={{ height: '32px', width: '32px', borderRadius: '8px' }} />
        <span style={{ background: 'var(--primary-glow)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Viyan
        </span>
      </div>
      <nav className="nav-links" style={{ flex: 1 }}>
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname === link.path;
          return (
            <Link
              key={link.path}
              to={link.path}
              onClick={onClose}
              className={`nav-item ${isActive ? 'active' : ''}`}
            >
              <Icon size={20} strokeWidth={2.4} />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="nav-links" style={{ marginTop: 'auto', borderTop: '1px solid var(--border-color)', paddingTop: '16px', marginBottom: '16px' }}>
        <Link to="/login" onClick={(e) => { if (onClose) onClose(); handleLogout(e); }} className="nav-item" style={{ color: '#ef4444' }}>
          <LogOut size={20} strokeWidth={2.4} />
          Sign Out
        </Link>
      </div>
      <div 
        className={`sidebar-resizer`}
        onMouseDown={onResizeMouseDown} 
        onClick={(e) => e.stopPropagation()}
      />
    </aside>
  );
};

const TopBar = ({ onMenuClick }: { onMenuClick: () => void }) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [user, setUser] = useState<any>(null);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    authApi.getProfile()
      .then(res => setUser(res))
      .catch(() => {}); 
  }, []);

  const handleLogout = async () => {
    try {
      (window as typeof window & { isLoggingOut?: boolean }).isLoggingOut = true;
      await authApi.logout();
      navigate('/login');
    } catch (e) {
      console.error(e);
      (window as typeof window & { isLoggingOut?: boolean }).isLoggingOut = true;
      navigate('/login'); // Force cleanup anyway
    }
  };

  // Close dropdown if clicked outside anywhere on doc
  useEffect(() => {
    const handleOut = () => setIsOpen(false);
    if (isOpen) {
      document.addEventListener('click', handleOut);
    }
    return () => document.removeEventListener('click', handleOut);
  }, [isOpen]);

  const getBreadcrumbs = () => {
    const path = location.pathname;
    if (path === '/app') return { category: 'Dashboard', active: 'System Command Center' };
    if (path.startsWith('/app/products')) return { category: 'Inventory', active: 'Products Catalog' };
    if (path.startsWith('/app/categories')) return { category: 'Inventory', active: 'Categories' };
    if (path.startsWith('/app/inventory')) return { category: 'Warehouse', active: 'Stock Balance' };
    if (path.startsWith('/app/branches')) return { category: 'Logistics', active: 'Warehouse Branches' };
    if (path.startsWith('/app/transfers')) return { category: 'Logistics', active: 'Stock Transfers' };
    if (path.startsWith('/app/purchases')) return { category: 'Procurement', active: 'Purchase Invoices' };
    if (path.startsWith('/app/suppliers')) return { category: 'Procurement', active: 'Supplier Management' };
    if (path.startsWith('/app/sales')) return { category: 'Operations', active: 'Sales & Invoicing' };
    if (path.startsWith('/app/customers')) return { category: 'Relationships', active: 'Customers Directory' };
    if (path.startsWith('/app/reports')) return { category: 'Analytics', active: 'Business Intelligence' };
    if (path.startsWith('/app/settings')) return { category: 'Administration', active: 'System Settings' };
    if (path.startsWith('/app/profile')) return { category: 'User Management', active: 'Profile Settings' };
    return { category: 'IMS Node', active: 'Operations Portal' };
  };

  const breadcrumb = getBreadcrumbs();

  const hideBreadcrumbsAndSearch = location.pathname === '/app/suppliers' || location.pathname === '/app/customers' || location.pathname === '/app/products';

  return (
    <header className="top-bar-header" style={{
      display: 'flex', 
      justifyContent: 'space-between', 
      padding: '12px 32px 8px', 
      background: 'transparent',
      alignItems: 'center',
      position: 'relative',
      zIndex: 999
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button 
          className="mobile-menu-btn"
          onClick={onMenuClick}
        >
          <Menu size={20} />
        </button>
        {/* 1. Dynamic Breadcrumbs (left side) */}
        {!hideBreadcrumbsAndSearch && (
          <div className="hide-on-mobile" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.74rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              <span>{breadcrumb.category}</span>
              <span style={{ color: '#cbd5e1' }}>/</span>
            </div>
            <div style={{ fontSize: '0.96rem', fontWeight: 850, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px', letterSpacing: '-0.01em' }}>
              {breadcrumb.active}
            </div>
          </div>
        )}
      </div>
      {/* 2. Global Search Input with beautiful keyboard shortcut (center) */}
      {!hideBreadcrumbsAndSearch && (
        <div className="top-search-container" style={{ position: 'relative', maxWidth: '360px', width: '100%', marginLeft: '48px', marginRight: 'auto' }}>
          <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
          <input 
            type="text" 
            placeholder="Search catalog, invoices, orders... (⌘K)" 
            style={{
              width: '100%',
              padding: '10px 16px 10px 44px',
              borderRadius: '12px',
              border: '1.5px solid #E2E8F0',
              background: '#F8FAFC',
              fontSize: '0.85rem',
              fontWeight: 650,
              color: '#1e293b',
              outline: 'none',
              transition: 'all 0.2s ease',
              boxSizing: 'border-box'
            }}
            className="global-search-input"
          />
          <div style={{ 
            position: 'absolute', 
            right: '12px', 
            top: '50%', 
            transform: 'translateY(-50%)',
            background: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '6px',
            padding: '2px 6px',
            fontSize: '0.7rem',
            fontWeight: 800,
            color: '#94a3b8',
            boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
            pointerEvents: 'none'
          }} className="global-search-shortcut">
            ⌘K
          </div>
        </div>
      )}

      {/* 3. User Dropdown Menu (fixed on the right side) */}
      <div className="profile-dropdown-container" style={{ position: 'fixed', top: '20px', right: '32px', zIndex: 1000 }}>
        {/* Interactive Presence Pill */}
        <button 
          onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }}
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '14px', 
            padding: '6px 6px 6px 20px',
            borderRadius: '30px',
            background: '#FFFFFF',
            border: '1.5px solid #F3F4F6',
            cursor: 'pointer',
            boxShadow: isOpen ? '0 10px 25px rgba(0,0,0,0.08)' : '0 4px 12px rgba(0,0,0,0.03)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            outline: 'none'
          }}
          onMouseOver={e => { if(!isOpen) e.currentTarget.style.transform = 'translateY(-1px)'; }}
          onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <div className="profile-text" style={{ textAlign: 'right' }}>
            <div style={{ fontWeight: 800, color: '#111827', fontSize: '0.85rem', letterSpacing: '-0.01em' }}>
              {user?.name || 'Enterprise Agent'}
            </div>
            <div style={{ fontSize: '0.7rem', color: '#6B7280', fontWeight: 600, textTransform: 'uppercase', marginTop: '2px' }}>
              {user?.role || 'Standard Tier'}
            </div>
          </div>

          <div style={{ 
            height: '40px', 
            width: '40px', 
            borderRadius: '50%', 
            background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', 
            color: 'white',
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: '1rem',
            boxShadow: '0 4px 10px rgba(99, 102, 241, 0.3)'
          }}>
            {user?.name?.charAt(0).toUpperCase() || <UserRound size={20} />}
          </div>
        </button>

        {/* Sleek Glass Dropdown Menu */}
        {isOpen && (
          <div style={{
            position: 'absolute',
            top: 'calc(100% + 12px)',
            right: 0,
            width: '260px',
            background: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid #F3F4F6',
            boxShadow: '0 20px 50px rgba(0,0,0,0.15)',
            padding: '12px',
            zIndex: 1000,
            animation: 'slideDown 0.2s ease-out forwards'
          }}>
            <style>{`
              @keyframes slideDown {
                from { opacity: 0; transform: translateY(-10px) scale(0.98); }
                to { opacity: 1; transform: translateY(0) scale(1); }
              }
              .dd-item {
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 12px 16px;
                border-radius: 10px;
                color: #4B5563;
                font-size: 0.9rem;
                font-weight: 600;
                text-decoration: none;
                transition: all 0.2s;
                cursor: pointer;
                border: none;
                background: transparent;
                width: 100%;
                text-align: left;
              }
              .dd-item:hover {
                background: #F3F4F6;
                color: #111827;
              }
              .dd-item.danger:hover {
                background: #FEF2F2;
                color: #B91C1C;
              }
            `}</style>
            
            <div style={{ padding: '8px 16px 16px', borderBottom: '1px solid #F3F4F6', marginBottom: '8px' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em' }}>SIGNED IN AS</div>
              <div style={{ fontSize: '0.85rem', color: '#111827', fontWeight: 600, wordBreak: 'break-all', marginTop: '4px' }}>{user?.email}</div>
            </div>

            <Link to="/app/profile" className="dd-item">
              <UserRound size={18} color="#6366f1" />
              My Profile
            </Link>
            
            <button className="dd-item">
              <Building2 size={18} color="#6366f1" />
              Organizations
            </button>

            <div style={{ height: '1px', background: '#F3F4F6', margin: '8px 0' }} />
            
            <button onClick={handleLogout} className="dd-item danger">
              <LogOut size={18} color="#EF4444" />
              Sign Out
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export const RootLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const navigate = useNavigate();

  // Sidebar resizing state
  const [sidebarWidth, setSidebarWidth] = useState(() => {
    const saved = localStorage.getItem('sidebarWidth');
    return saved ? parseInt(saved, 10) : 260;
  });
  const [isResizing, setIsResizing] = useState(false);

  useEffect(() => {
    document.documentElement.style.setProperty('--sidebar-width', `${sidebarWidth}px`);
    localStorage.setItem('sidebarWidth', sidebarWidth.toString());
  }, [sidebarWidth]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      let newWidth = e.clientX;
      if (newWidth < 200) newWidth = 200;
      if (newWidth > 450) newWidth = 450;
      setSidebarWidth(newWidth);
    };

    const handleMouseUp = () => {
      if (isResizing) {
        setIsResizing(false);
        document.body.style.cursor = '';
        document.documentElement.style.userSelect = '';
      }
    };

    if (isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.documentElement.style.userSelect = 'none'; // Prevent text selection while dragging
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.documentElement.style.userSelect = '';
    };
  }, [isResizing]);

  const handleResizeMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  };

  useEffect(() => {
    // Keep a state in history so that we can detect popstate
    window.history.pushState(null, '', window.location.href);

    const handlePopState = () => {
      if ((window as typeof window & { isLoggingOut?: boolean }).isLoggingOut) {
        return;
      }

      // Check if the route they tried to go back to starts with '/app'
      const nextPath = window.location.pathname;
      if (!nextPath.startsWith('/app')) {
        // Intercept: restore app URL and show confirmation
        window.history.pushState(null, '', '/app');
        setShowExitModal(true);
      }
    };

    window.addEventListener('popstate', handlePopState);

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if ((window as typeof window & { isLoggingOut?: boolean }).isLoggingOut) return;
      e.preventDefault();
      e.returnValue = '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  const handleConfirmExit = () => {
    (window as typeof window & { isLoggingOut?: boolean }).isLoggingOut = true;
    setShowExitModal(false);
    navigate('/login');
  };

  const handleCancelExit = () => {
    setShowExitModal(false);
  };

  return (
    <div className={`app-layout ${isResizing ? 'is-resizing' : ''}`}>
      {isMobileMenuOpen && (
        <div className="mobile-sidebar-overlay" onClick={() => setIsMobileMenuOpen(false)}></div>
      )}
      <div className={`sidebar-container ${isMobileMenuOpen ? 'open' : ''}`}>
        <Sidebar onClose={() => setIsMobileMenuOpen(false)} onResizeMouseDown={handleResizeMouseDown} />
      </div>
      <main className="main-content">
        <TopBar onMenuClick={() => setIsMobileMenuOpen(true)} />
        <div style={{ paddingBottom: '32px' }}>
           <Outlet />
        </div>
      </main>

      {/* Beautiful Glassmorphic Confirmation Modal */}
      {showExitModal && (
        <div className="nav-confirm-overlay">
          <div className="nav-confirm-container">
            <div className="nav-confirm-icon-wrapper">
              <AlertCircle size={32} color="#6366f1" style={{ position: 'relative', zIndex: 1 }} />
            </div>
            <h3 className="nav-confirm-title">Exit Session?</h3>
            <p className="nav-confirm-desc">
              You are about to exit the Viyan Management Hub. Any unsaved changes on this page will be lost. Are you sure you want to proceed?
            </p>
            <div className="nav-confirm-buttons">
              <button 
                className="btn-nav-cancel"
                onClick={handleCancelExit}
              >
                Cancel
              </button>
              <button 
                className="btn-nav-confirm"
                onClick={handleConfirmExit}
              >
                Confirm Exit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
