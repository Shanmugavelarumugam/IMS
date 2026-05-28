import React, { useEffect, useState } from 'react';
import { 
  Plus, Search, Tags, Folder, CheckSquare, 
  X, Info, Edit3, Trash2, Grid, Table, Download, Settings, BookOpen
} from 'lucide-react';

interface Category {
  id: string;
  name: string;
  code: string;
  description: string;
  totalProducts: number;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  taxRate: number; // e.g. 18 for 18% GST
  notes?: string;
}

interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  text: string;
}

const DEFAULT_CATEGORIES: Category[] = [
  {
    id: 'cat-1',
    name: 'Hardware & Devices',
    code: 'CAT-HW-01',
    description: 'High-end computation nodes, portable laptops, corporate devices, and internal servers.',
    totalProducts: 45,
    status: 'ACTIVE',
    createdAt: '2026-01-10',
    taxRate: 18,
    notes: 'Primary hardware storage group. Subject to standard asset depreciation rules.'
  },
  {
    id: 'cat-2',
    name: 'Office Peripherals',
    code: 'CAT-OP-02',
    description: 'Professional displays, high-fidelity input setups, and workstation accessories.',
    totalProducts: 22,
    status: 'ACTIVE',
    createdAt: '2026-02-15',
    taxRate: 18,
    notes: 'Secondary group. Replenishments routed through local logistics branches.'
  },
  {
    id: 'cat-3',
    name: 'Cloud & Infrastructure',
    code: 'CAT-CLD-03',
    description: 'Provisioned dynamic virtual servers, reserved computation slots, and load balancers.',
    totalProducts: 80,
    status: 'ACTIVE',
    createdAt: '2026-01-05',
    taxRate: 18,
    notes: 'SaaS and IaaS operational catalogs. Handled under direct cloud expenditure audits.'
  },
  {
    id: 'cat-4',
    name: 'Corporate Workspace',
    code: 'CAT-CW-04',
    description: 'Ergonomic posture-corrective seating solutions and motorized standing desks.',
    totalProducts: 15,
    status: 'ACTIVE',
    createdAt: '2026-03-01',
    taxRate: 12,
    notes: 'Physical facilities equipment.'
  },
  {
    id: 'cat-5',
    name: 'Enterprise Software',
    code: 'CAT-SFT-05',
    description: 'Annual corporate operating system credentials and cloud security licensing.',
    totalProducts: 5,
    status: 'ACTIVE',
    createdAt: '2026-04-12',
    taxRate: 18,
    notes: 'Licensed digital properties catalog.'
  }
];

export const CategoriesPage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'high' | 'low' | 'empty'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  
  // Selected Detail Drawer
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  // Modals
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showConfigureCards, setShowConfigureCards] = useState(false);

  // Form Fields
  const [formName, setFormName] = useState('');
  const [formCode, setFormCode] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formTax, setFormTax] = useState('18');
  const [formStatus, setFormStatus] = useState<'ACTIVE' | 'INACTIVE'>('ACTIVE');
  const [formNotes, setFormNotes] = useState('');

  // Card Configurations
  const [visibleCards, setVisibleCards] = useState({
    total_categories: true,
    total_skus: true,
    avg_skus: true,
    active_tax: true
  });

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: 'success' | 'info' | 'warning' | 'error', text: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, text }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Load cache
  useEffect(() => {
    setLoading(true);
    try {
      const cached = localStorage.getItem('ims_dummy_categories');
      if (cached) {
        setCategories(JSON.parse(cached));
      } else {
        localStorage.setItem('ims_dummy_categories', JSON.stringify(DEFAULT_CATEGORIES));
        setCategories(DEFAULT_CATEGORIES);
      }
    } catch {
      setCategories(DEFAULT_CATEGORIES);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateCachedCategories = (updated: Category[]) => {
    setCategories(updated);
    try {
      localStorage.setItem('ims_dummy_categories', JSON.stringify(updated));
    } catch (e) {
      console.error('Storage failed', e);
    }
  };

  // Prepare form
  const openAddModal = () => {
    setEditingCategory(null);
    setFormName('');
    setFormCode(`CAT-${Math.random().toString(36).substring(2, 6).toUpperCase()}`);
    setFormDesc('');
    setFormTax('18');
    setFormStatus('ACTIVE');
    setFormNotes('');
    setShowFormModal(true);
  };

  const openEditModal = (cat: Category, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setEditingCategory(cat);
    setFormName(cat.name);
    setFormCode(cat.code);
    setFormDesc(cat.description);
    setFormTax(cat.taxRate.toString());
    setFormStatus(cat.status);
    setFormNotes(cat.notes || '');
    setShowFormModal(true);
  };

  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      addToast('error', 'Category Name is required');
      return;
    }

    if (editingCategory) {
      // Edit mode
      const updated = categories.map((c) => {
        if (c.id === editingCategory.id) {
          return {
            ...c,
            name: formName.trim(),
            code: formCode.trim(),
            description: formDesc.trim(),
            taxRate: parseFloat(formTax) || 0,
            status: formStatus,
            notes: formNotes.trim()
          };
        }
        return c;
      });
      updateCachedCategories(updated);
      const found = updated.find(x => x.id === editingCategory.id);
      if (found && selectedCategory?.id === found.id) {
        setSelectedCategory(found);
      }
      addToast('success', `Category "${formName}" updated successfully`);
    } else {
      // Add mode
      const newCat: Category = {
        id: `cat-${Math.random().toString(36).substring(2, 9)}`,
        name: formName.trim(),
        code: formCode.trim(),
        description: formDesc.trim(),
        totalProducts: 0,
        status: formStatus,
        createdAt: new Date().toISOString().split('T')[0],
        taxRate: parseFloat(formTax) || 0,
        notes: formNotes.trim()
      };
      updateCachedCategories([newCat, ...categories]);
      addToast('success', `Category "${formName}" added successfully`);
    }
    setShowFormModal(false);
  };

  const handleDeleteCategory = () => {
    if (!selectedCategory) return;
    const name = selectedCategory.name;
    const updated = categories.filter((c) => c.id !== selectedCategory.id);
    updateCachedCategories(updated);
    addToast('warning', `Removed Category "${name}" from system catalog`);
    setSelectedCategory(null);
    setShowDeleteConfirm(false);
  };

  // CSV Export
  const handleExportCSV = () => {
    if (categories.length === 0) {
      addToast('error', 'No categories to export');
      return;
    }
    const headers = ['ID', 'Name', 'Code', 'Description', 'SKU Count', 'Tax Rate (%)', 'Status', 'Date Created'];
    const rows = categories.map(c => [
      c.id,
      `"${c.name.replace(/"/g, '""')}"`,
      c.code,
      `"${c.description.replace(/"/g, '""')}"`,
      c.totalProducts,
      `${c.taxRate}%`,
      c.status,
      c.createdAt
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `viyan_categories_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast('success', 'Categories catalog exported successfully as CSV');
  };

  // Calculations
  const totalSKUs = categories.reduce((sum, c) => sum + c.totalProducts, 0);
  const avgSKUs = categories.length > 0 ? Math.round(totalSKUs / categories.length) : 0;
  const activeTax = categories.filter(c => c.status === 'ACTIVE').length;

  const cardDefinitions = [
    {
      id: 'total_categories',
      label: 'Total Categories',
      value: categories.length,
      subtext: 'Primary asset groups',
      icon: Tags,
      className: 'blue',
      color: '#6366f1'
    },
    {
      id: 'total_skus',
      label: 'Linked Inventory SKUs',
      value: totalSKUs,
      subtext: 'Total catalog products',
      icon: CheckSquare,
      className: 'emerald',
      color: '#059669'
    },
    {
      id: 'avg_skus',
      label: 'Avg Products/Category',
      value: avgSKUs,
      subtext: 'Catalog load density',
      icon: BookOpen,
      className: 'purple',
      color: '#8b5cf6'
    },
    {
      id: 'active_tax',
      label: 'Active Categories',
      value: activeTax,
      subtext: 'Operational taxonomy nodes',
      icon: Folder,
      className: 'rose',
      color: '#e11d48'
    }
  ];

  // Filters
  const filteredCategories = categories.filter((cat) => {
    const matchesSearch = 
      cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.description.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (activeTab === 'high') return cat.totalProducts >= 20;
    if (activeTab === 'low') return cat.totalProducts > 0 && cat.totalProducts < 20;
    if (activeTab === 'empty') return cat.totalProducts === 0;

    return true;
  });

  return (
    <div className="fade-in" style={{ animation: 'fadeIn 0.5s cubic-bezier(0.4, 0, 0.2, 1)', padding: '24px' }}>
      <style>{`
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          margin-bottom: 32px;
        }
        @media (max-width: 1024px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 580px) {
          .stats-grid { grid-template-columns: 1fr; }
        }
        .stat-card-premium {
          background: #ffffff;
          border: 1.5px solid #f1f5f9;
          border-radius: 24px;
          padding: 24px;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.01);
        }
        .stat-card-premium:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 36px rgba(99, 102, 241, 0.06);
          border-color: rgba(99, 102, 241, 0.2);
        }
        .stat-card-label {
          font-size: 0.74rem;
          color: #64748b;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 8px;
        }
        .stat-card-value {
          font-size: 2.0rem;
          font-weight: 900;
          color: #0f172a;
          line-height: 1.1;
          margin-bottom: 6px;
        }
        .stat-card-subtext {
          font-size: 0.78rem;
          color: #94a3b8;
          font-weight: 600;
        }
        .stat-card-icon-wrapper {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .stat-card-icon-wrapper.blue { background: #f0f3ff; color: #6366f1; }
        .stat-card-icon-wrapper.emerald { background: #ecfdf5; color: #059669; }
        .stat-card-icon-wrapper.purple { background: #f5f3ff; color: #8b5cf6; }
        .stat-card-icon-wrapper.rose { background: #fff1f2; color: #e11d48; }

        .search-container {
          background: #ffffff;
          padding: 14px;
          border-radius: 20px;
          border: 1.5px solid #f1f5f9;
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
          align-items: center;
          box-shadow: 0 4px 15px rgba(0,0,0,0.01);
          margin-bottom: 24px;
        }
        .filter-tab {
          border: none;
          background: transparent;
          padding: 10px 18px;
          font-size: 0.85rem;
          font-weight: 700;
          color: #64748b;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .filter-tab.active {
          background: #6366f1;
          color: #ffffff;
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.25);
        }
        .filter-tab:not(.active):hover {
          background: #f8fafc;
          color: #1e293b;
        }

        .category-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 24px;
          margin-top: 24px;
        }
        .category-card-premium {
          background: #ffffff;
          border: 1.5px solid #f1f5f9;
          border-radius: 24px;
          padding: 26px;
          transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(15, 23, 42, 0.015);
        }
        .category-card-premium:hover {
          transform: translateY(-5px) scale(1.01);
          box-shadow: 0 22px 40px rgba(15, 23, 42, 0.06);
          border-color: rgba(99, 102, 241, 0.25);
        }
        
        .status-badge {
          padding: 4px 10px;
          border-radius: 6px;
          font-size: 0.74rem;
          font-weight: 800;
          letter-spacing: 0.03em;
          display: inline-flex;
          align-items: center;
          gap: 5px;
        }
        .status-badge.active { background: #ECFDF5; color: #059669; }
        .status-badge.inactive { background: #FFF7ED; color: #EA580C; }

        .premium-table-container {
          background: #ffffff;
          border-radius: 24px;
          border: 1.5px solid #f1f5f9;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0,0,0,0.01);
        }
        .premium-table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0;
        }
        .premium-table th {
          background: #f8fafc;
          padding: 18px 24px;
          font-size: 0.72rem;
          font-weight: 800;
          color: #475569;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          border-bottom: 1.5px solid #e2e8f0;
          text-align: left;
        }
        .premium-table td {
          padding: 20px 24px;
          border-bottom: 1px solid #f1f5f9;
          font-size: 0.88rem;
          color: #334155;
          font-weight: 600;
          vertical-align: middle;
        }
        .premium-table tr:last-child td {
          border-bottom: none;
        }
        .premium-table tr {
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .premium-table tr:hover td {
          background: #f8fafc;
        }

        .drawer-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(15, 23, 42, 0.4);
          backdrop-filter: blur(4px);
          z-index: 1001;
          display: flex;
          justify-content: flex-end;
          animation: fadeIn 0.25s ease-out;
        }
        .drawer-sheet {
          width: 480px;
          max-width: 100%;
          background: #ffffff;
          height: 100%;
          box-shadow: -10px 0 40px rgba(15, 23, 42, 0.1);
          padding: 36px;
          box-sizing: border-box;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          animation: slideLeft 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .premium-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(15, 23, 42, 0.5);
          backdrop-filter: blur(6px);
          z-index: 1002;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: fadeIn 0.2s ease-out;
        }
        .premium-modal-content {
          background: #ffffff;
          border-radius: 28px;
          padding: 36px;
          width: 500px;
          max-width: 90%;
          box-shadow: 0 25px 50px -12px rgba(15, 23, 42, 0.15);
          animation: scaleUp 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .toast-container {
          position: fixed;
          bottom: 32px;
          right: 32px;
          z-index: 9999;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .toast-card {
          padding: 16px 20px;
          border-radius: 16px;
          background: #ffffff;
          box-shadow: 0 10px 30px rgba(15, 23, 42, 0.08);
          border-left: 5px solid #6366f1;
          display: flex;
          align-items: center;
          gap: 12px;
          min-width: 300px;
          font-weight: 700;
          font-size: 0.88rem;
          color: #1e293b;
          animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideLeft { from { transform: translateX(100%); } to { transform: translateX(0); } }
        @keyframes scaleUp { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      {/* TOP HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6366f1', marginBottom: '6px' }}>
            <Tags size={16} />
            <span style={{ fontWeight: 800, fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Catalog Taxonomy</span>
          </div>
          <h1 style={{ fontSize: '2.1rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em', margin: 0 }}>Category Organization</h1>
          <p style={{ color: '#64748b', marginTop: '4px', fontWeight: 600, fontSize: '0.94rem' }}>Group inventory products, regulate taxonomy groups, and direct localized tax parameters.</p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            onClick={() => setShowConfigureCards(true)}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px', 
              borderRadius: '16px', border: '1.5px solid #e2e8f0', background: '#ffffff',
              color: '#475569', fontWeight: 700, fontSize: '0.86rem', cursor: 'pointer', outline: 'none'
            }}
          >
            <Settings size={18} /> Configure Cards
          </button>
          
          <button 
            onClick={openAddModal}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', 
              borderRadius: '16px', border: 'none', background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
              color: '#ffffff', fontWeight: 800, fontSize: '0.86rem', cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(99, 102, 241, 0.25)', outline: 'none'
            }}
          >
            <Plus size={20} /> Add Category
          </button>
        </div>
      </div>

      {/* DYNAMIC METRIC CARDS */}
      <div className="stats-grid">
        {cardDefinitions.map((c) => {
          if (!visibleCards[c.id as keyof typeof visibleCards]) return null;
          const Icon = c.icon;
          return (
            <div key={c.id} className="stat-card-premium">
              <div>
                <div className="stat-card-label">{c.label}</div>
                <div className="stat-card-value">{c.value}</div>
                <div className="stat-card-subtext">{c.subtext}</div>
              </div>
              <div className={`stat-card-icon-wrapper ${c.className}`}>
                <Icon size={22} />
              </div>
            </div>
          );
        })}
      </div>

      {/* FILTER AND CONTROLS BLOCK */}
      <div className="search-container">
        <div style={{ position: 'relative', flex: 1, minWidth: '260px' }}>
          <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
          <input 
            type="text" 
            placeholder="Search categories by name, code or description..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%', padding: '12px 16px 12px 48px', borderRadius: '14px',
              border: '1.5px solid #e2e8f0', background: '#f8fafc', fontSize: '0.88rem',
              fontWeight: 650, color: '#1e293b', outline: 'none', boxSizing: 'border-box'
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button onClick={() => setActiveTab('all')} className={`filter-tab ${activeTab === 'all' ? 'active' : ''}`}>All</button>
          <button onClick={() => setActiveTab('high')} className={`filter-tab ${activeTab === 'high' ? 'active' : ''}`}>High Density (≥20)</button>
          <button onClick={() => setActiveTab('low')} className={`filter-tab ${activeTab === 'low' ? 'active' : ''}`}>Low Density</button>
          <button onClick={() => setActiveTab('empty')} className={`filter-tab ${activeTab === 'empty' ? 'active' : ''}`}>Empty</button>
        </div>

        <div style={{ display: 'flex', gap: '8px', marginLeft: 'auto' }}>
          <div style={{ display: 'flex', background: '#f1f5f9', padding: '4px', borderRadius: '12px' }}>
            <button 
              onClick={() => setViewMode('grid')}
              style={{ 
                padding: '6px 10px', borderRadius: '8px', border: 'none', 
                background: viewMode === 'grid' ? '#ffffff' : 'transparent',
                color: viewMode === 'grid' ? '#6366f1' : '#64748b', cursor: 'pointer', outline: 'none'
              }}
            >
              <Grid size={16} />
            </button>
            <button 
              onClick={() => setViewMode('table')}
              style={{ 
                padding: '6px 10px', borderRadius: '8px', border: 'none', 
                background: viewMode === 'table' ? '#ffffff' : 'transparent',
                color: viewMode === 'table' ? '#6366f1' : '#64748b', cursor: 'pointer', outline: 'none'
              }}
            >
              <Table size={16} />
            </button>
          </div>

          <button 
            onClick={handleExportCSV}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', 
              borderRadius: '12px', border: '1.5px solid #e2e8f0', background: '#ffffff',
              color: '#475569', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', outline: 'none'
            }}
          >
            <Download size={16} /> Export
          </button>
        </div>
      </div>

      {/* CORE CONTENT BLOCK */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#64748b', fontWeight: 700 }}>
          Analyzing classifications...
        </div>
      ) : filteredCategories.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 24px', background: '#ffffff', border: '1.5px solid #f1f5f9', borderRadius: '24px' }}>
          <Folder size={48} color="#cbd5e1" style={{ margin: '0 auto 16px' }} />
          <h3 style={{ fontWeight: 800, color: '#334155', fontSize: '1.1rem', margin: 0 }}>No Taxonomy Match</h3>
          <p style={{ color: '#94a3b8', fontSize: '0.88rem', marginTop: '6px', fontWeight: 600 }}>We couldn't locate any catalog category mapping your constraints.</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="category-grid">
          {filteredCategories.map((cat) => (
            <div 
              key={cat.id} 
              className="category-card-premium"
              onClick={() => setSelectedCategory(cat)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div style={{ background: '#f5f3ff', padding: '10px', borderRadius: '12px', color: '#8b5cf6' }}>
                  <Folder size={20} />
                </div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <span className={`status-badge ${cat.status === 'ACTIVE' ? 'active' : 'inactive'}`}>
                    {cat.status}
                  </span>
                </div>
              </div>

              <h3 style={{ fontSize: '1.15rem', fontWeight: 900, color: '#0f172a', margin: '0 0 6px 0', letterSpacing: '-0.01em' }}>
                {cat.name}
              </h3>
              <div style={{ fontFamily: 'monospace', fontSize: '0.74rem', color: '#94a3b8', fontWeight: 700, marginBottom: '12px' }}>
                {cat.code}
              </div>

              <p style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 600, minHeight: '44px', lineHeight: 1.5, margin: '0 0 16px 0' }}>
                {cat.description}
              </p>

              <div style={{ height: '1.5px', background: '#f1f5f9', margin: '16px 0' }}></div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.84rem', fontWeight: 850, color: '#334155' }}>
                  {cat.totalProducts} linked SKUs
                </span>
                <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#64748b', background: '#f8fafc', padding: '4px 8px', borderRadius: '6px' }}>
                  {cat.taxRate}% GST
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="premium-table-container">
          <table className="premium-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Category Name</th>
                <th>Description</th>
                <th>Linked SKUs</th>
                <th>Tax Rate</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCategories.map((cat) => (
                <tr key={cat.id} onClick={() => setSelectedCategory(cat)}>
                  <td style={{ fontFamily: 'monospace', color: '#6366f1', fontWeight: 800, fontSize: '0.8rem' }}>{cat.code}</td>
                  <td>{cat.name}</td>
                  <td style={{ color: '#64748b', fontWeight: 500, maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {cat.description}
                  </td>
                  <td style={{ fontWeight: 800 }}>{cat.totalProducts} SKUs</td>
                  <td style={{ color: '#0f172a', fontWeight: 750 }}>{cat.taxRate}% GST</td>
                  <td>
                    <span className={`status-badge ${cat.status === 'ACTIVE' ? 'active' : 'inactive'}`}>
                      {cat.status}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }} onClick={(e) => e.stopPropagation()}>
                    <button 
                      onClick={(e) => openEditModal(cat, e)}
                      style={{ 
                        background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', 
                        padding: '6px', borderRadius: '6px', outline: 'none'
                      }}
                      onMouseOver={e => e.currentTarget.style.color = '#6366f1'}
                      onMouseOut={e => e.currentTarget.style.color = '#64748b'}
                    >
                      <Edit3 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* DETAIL DRAWER */}
      {selectedCategory && (
        <div className="drawer-overlay" onClick={() => setSelectedCategory(null)}>
          <div className="drawer-sheet" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <span className={`status-badge ${selectedCategory.status === 'ACTIVE' ? 'active' : 'inactive'}`}>
                {selectedCategory.status} Group
              </span>
              <button 
                onClick={() => setSelectedCategory(null)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', outline: 'none' }}
              >
                <X size={24} />
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <div style={{ background: '#f5f3ff', padding: '12px', borderRadius: '14px', color: '#8b5cf6' }}>
                <Folder size={24} />
              </div>
              <div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>{selectedCategory.name}</h2>
                <div style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: '#94a3b8', fontWeight: 700, marginTop: '2px' }}>
                  {selectedCategory.code}
                </div>
              </div>
            </div>

            <div style={{ height: '1.5px', background: '#f1f5f9', margin: '24px 0' }}></div>

            <h3 style={{ fontSize: '0.84rem', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 800, marginBottom: '12px' }}>
              Group Specifications
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
              <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '16px', border: '1.5px solid #f1f5f9' }}>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase' }}>Linked SKUs</div>
                <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#0f172a', marginTop: '6px' }}>{selectedCategory.totalProducts}</div>
              </div>
              
              <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '16px', border: '1.5px solid #f1f5f9' }}>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase' }}>GST Tax Bracket</div>
                <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#0f172a', marginTop: '6px' }}>{selectedCategory.taxRate}%</div>
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <div style={{ fontSize: '0.74rem', color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase', marginBottom: '8px' }}>Description</div>
              <div style={{ fontSize: '0.88rem', color: '#475569', fontWeight: 600, lineHeight: 1.5 }}>{selectedCategory.description}</div>
            </div>

            {selectedCategory.notes && (
              <div style={{ background: '#fef3c7', padding: '16px', borderRadius: '16px', border: '1px solid #fde68a', marginBottom: '24px' }}>
                <div style={{ display: 'flex', gap: '8px', color: '#b45309' }}>
                  <Info size={18} style={{ flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase' }}>Internal Classification Note</div>
                    <p style={{ fontSize: '0.82rem', margin: '4px 0 0 0', fontWeight: 650, lineHeight: 1.4 }}>{selectedCategory.notes}</p>
                  </div>
                </div>
              </div>
            )}

            <div style={{ marginTop: 'auto', display: 'flex', gap: '12px' }}>
              <button 
                onClick={(e) => openEditModal(selectedCategory, e)}
                style={{ 
                  flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', 
                  padding: '12px', borderRadius: '14px', border: '1.5px solid #e2e8f0', background: '#ffffff',
                  color: '#475569', fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer', outline: 'none'
                }}
              >
                <Edit3 size={18} /> Edit Category
              </button>
              
              <button 
                onClick={() => setShowDeleteConfirm(true)}
                style={{ 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '12px', 
                  borderRadius: '14px', border: 'none', background: '#ffe4e6', color: '#be123c',
                  cursor: 'pointer', outline: 'none'
                }}
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FORM MODAL (ADD / EDIT) */}
      {showFormModal && (
        <div className="premium-modal-overlay">
          <div className="premium-modal-content">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>
                {editingCategory ? 'Modify Category' : 'Register New Category'}
              </h2>
              <button 
                onClick={() => setShowFormModal(false)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', outline: 'none' }}
              >
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleSaveCategory}>
              <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                <div style={{ flex: 2 }}>
                  <label style={{ display: 'block', fontSize: '0.74rem', color: '#64748b', fontWeight: 800, textTransform: 'uppercase', marginBottom: '6px' }}>Category Name</label>
                  <input 
                    type="text" 
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. Storage Inbound Nodes"
                    style={{
                      width: '100%', padding: '12px 14px', borderRadius: '12px', border: '1.5px solid #e2e8f0',
                      fontSize: '0.88rem', fontWeight: 650, color: '#1e293b', outline: 'none', boxSizing: 'border-box'
                    }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '0.74rem', color: '#64748b', fontWeight: 800, textTransform: 'uppercase', marginBottom: '6px' }}>Code</label>
                  <input 
                    type="text" 
                    value={formCode}
                    onChange={(e) => setFormCode(e.target.value)}
                    style={{
                      width: '100%', padding: '12px 14px', borderRadius: '12px', border: '1.5px solid #e2e8f0',
                      fontSize: '0.88rem', fontWeight: 700, color: '#475569', outline: 'none', boxSizing: 'border-box',
                      fontFamily: 'monospace'
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.74rem', color: '#64748b', fontWeight: 800, textTransform: 'uppercase', marginBottom: '6px' }}>Tax Rate Bracket</label>
                <select 
                  value={formTax} 
                  onChange={(e) => setFormTax(e.target.value)}
                  style={{
                    width: '100%', padding: '12px 14px', borderRadius: '12px', border: '1.5px solid #e2e8f0',
                    fontSize: '0.88rem', fontWeight: 700, color: '#1e293b', outline: 'none', boxSizing: 'border-box'
                  }}
                >
                  <option value="0">0% (Exempt)</option>
                  <option value="5">5% GST (Essential Goods)</option>
                  <option value="12">12% GST (Physical Utilities)</option>
                  <option value="18">18% GST (Standard Services/HW)</option>
                  <option value="28">28% GST (Luxury Items)</option>
                </select>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.74rem', color: '#64748b', fontWeight: 800, textTransform: 'uppercase', marginBottom: '6px' }}>Description</label>
                <textarea 
                  rows={3}
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  placeholder="Summarize taxonomy scope..."
                  style={{
                    width: '100%', padding: '12px 14px', borderRadius: '12px', border: '1.5px solid #e2e8f0',
                    fontSize: '0.88rem', fontWeight: 600, color: '#1e293b', outline: 'none', boxSizing: 'border-box',
                    fontFamily: 'inherit', resize: 'none'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '0.74rem', color: '#64748b', fontWeight: 800, textTransform: 'uppercase', marginBottom: '6px' }}>Status</label>
                  <select 
                    value={formStatus} 
                    onChange={(e) => setFormStatus(e.target.value as 'ACTIVE' | 'INACTIVE')}
                    style={{
                      width: '100%', padding: '12px 14px', borderRadius: '12px', border: '1.5px solid #e2e8f0',
                      fontSize: '0.88rem', fontWeight: 700, color: '#1e293b', outline: 'none', boxSizing: 'border-box'
                    }}
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="INACTIVE">INACTIVE</option>
                  </select>
                </div>
                <div style={{ flex: 2 }}>
                  <label style={{ display: 'block', fontSize: '0.74rem', color: '#64748b', fontWeight: 800, textTransform: 'uppercase', marginBottom: '6px' }}>Internal Note</label>
                  <input 
                    type="text" 
                    value={formNotes}
                    onChange={(e) => setFormNotes(e.target.value)}
                    placeholder="Internal tags/warnings..."
                    style={{
                      width: '100%', padding: '12px 14px', borderRadius: '12px', border: '1.5px solid #e2e8f0',
                      fontSize: '0.88rem', fontWeight: 650, color: '#1e293b', outline: 'none', boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button 
                  type="button" 
                  onClick={() => setShowFormModal(false)}
                  style={{
                    flex: 1, padding: '14px', borderRadius: '14px', border: '1.5px solid #e2e8f0',
                    background: '#ffffff', color: '#475569', fontWeight: 700, fontSize: '0.88rem',
                    cursor: 'pointer', outline: 'none'
                  }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  style={{
                    flex: 2, padding: '14px', borderRadius: '14px', border: 'none',
                    background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', color: '#ffffff',
                    fontWeight: 800, fontSize: '0.88rem', cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(99, 102, 241, 0.2)', outline: 'none'
                  }}
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE MODAL */}
      {showDeleteConfirm && (
        <div className="premium-modal-overlay">
          <div className="premium-modal-content" style={{ textAlign: 'center', width: '400px' }}>
            <div style={{ 
              width: '56px', height: '56px', borderRadius: '18px', background: '#ffe4e6',
              color: '#be123c', display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 16px'
            }}>
              <Trash2 size={24} />
            </div>

            <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#0f172a', margin: '0 0 8px 0' }}>Remove Category?</h3>
            <p style={{ fontSize: '0.86rem', color: '#64748b', fontWeight: 650, lineHeight: 1.4, margin: '0 0 24px 0' }}>
              Are you sure you want to delete category "{selectedCategory?.name}"? All associated taxonomy links will be dissolved. This action is irreversible.
            </p>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button 
                onClick={() => setShowDeleteConfirm(false)}
                style={{
                  flex: 1, padding: '12px', borderRadius: '12px', border: '1.5px solid #e2e8f0',
                  background: '#ffffff', color: '#475569', fontWeight: 700, fontSize: '0.86rem',
                  cursor: 'pointer', outline: 'none'
                }}
              >
                Cancel
              </button>
              
              <button 
                onClick={handleDeleteCategory}
                style={{
                  flex: 1, padding: '12px', borderRadius: '12px', border: 'none',
                  background: '#e11d48', color: '#ffffff', fontWeight: 800, fontSize: '0.86rem',
                  cursor: 'pointer', outline: 'none'
                }}
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIGURE CARDS MODAL */}
      {showConfigureCards && (
        <div className="premium-modal-overlay">
          <div className="premium-modal-content" style={{ width: '400px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>Configure Cards</h3>
              <button 
                onClick={() => setShowConfigureCards(false)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', outline: 'none' }}
              >
                <X size={20} />
              </button>
            </div>

            <p style={{ fontSize: '0.84rem', color: '#64748b', fontWeight: 600, marginBottom: 16 }}>Select which KPI metric cards to display on top of the Category hub.</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
              {Object.keys(visibleCards).map((key) => {
                const label = key === 'total_categories' ? 'Total Categories' :
                              key === 'total_skus' ? 'Linked Inventory SKUs' :
                              key === 'avg_skus' ? 'Avg Products/Category' : 'Active Categories';
                return (
                  <label key={key} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.88rem', fontWeight: 700, color: '#334155', cursor: 'pointer' }}>
                    <input 
                      type="checkbox"
                      checked={visibleCards[key as keyof typeof visibleCards]}
                      onChange={(e) => setVisibleCards(prev => ({ ...prev, [key]: e.target.checked }))}
                      style={{ width: '16px', height: '16px', accentColor: '#6366f1' }}
                    />
                    {label}
                  </label>
                );
              })}
            </div>

            <button 
              onClick={() => setShowConfigureCards(false)}
              style={{
                width: '100%', padding: '12px', borderRadius: '12px', border: 'none',
                background: '#6366f1', color: '#ffffff', fontWeight: 800, fontSize: '0.86rem',
                cursor: 'pointer', outline: 'none'
              }}
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* TOAST CONTAINER */}
      <div className="toast-container">
        {toasts.map((t) => (
          <div key={t.id} className="toast-card" style={{ borderLeftColor: t.type === 'success' ? '#059669' : t.type === 'warning' ? '#ea580c' : t.type === 'error' ? '#e11d48' : '#6366f1' }}>
            <span style={{ flex: 1 }}>{t.text}</span>
            <button 
              onClick={() => removeToast(t.id)}
              style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 0, outline: 'none' }}
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
