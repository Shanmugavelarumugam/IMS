import React, { useEffect, useState } from 'react';
import { Folder } from 'lucide-react';
import type { Category, ToastMessage } from '../types';

import { CategoriesHeader }             from '../components/CategoriesHeader';
import { CategoriesStatsGrid }          from '../components/CategoriesStatsGrid';
import { CategoriesSearchFilterBar }    from '../components/CategoriesSearchFilterBar';
import { CategoriesGrid }               from '../components/CategoriesGrid';
import { CategoriesTable }              from '../components/CategoriesTable';
import { CategoriesDrawer }             from '../components/CategoriesDrawer';
import { CategoriesFormModal }          from '../components/CategoriesFormModal';
import { CategoriesDeleteConfirmModal } from '../components/CategoriesDeleteConfirmModal';
import { CategoriesMetricsConfigModal } from '../components/CategoriesMetricsConfigModal';
import { CategoriesToastContainer }     from '../components/CategoriesToastContainer';

import '../styles/categories.css';
import '../styles/categories-metrics.css';
import '../styles/categories-table.css';
import '../styles/categories-modal.css';
import '../styles/categories-responsive.css';

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

type VisibleCards = {
  total_categories: boolean;
  total_skus: boolean;
  avg_skus: boolean;
  active_tax: boolean;
};

export const CategoriesPage = () => {
  const [categories, setCategories]       = useState<Category[]>([]);
  const [loading, setLoading]             = useState(true);
  const [searchQuery, setSearchQuery]     = useState('');
  const [activeTab, setActiveTab]         = useState<'all' | 'high' | 'low' | 'empty'>('all');
  const [viewMode, setViewMode]           = useState<'grid' | 'table'>('grid');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  // Modals
  const [showFormModal, setShowFormModal]         = useState(false);
  const [editingCategory, setEditingCategory]     = useState<Category | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showConfigureCards, setShowConfigureCards] = useState(false);

  // Form fields
  const [formName, setFormName]     = useState('');
  const [formCode, setFormCode]     = useState('');
  const [formDesc, setFormDesc]     = useState('');
  const [formTax, setFormTax]       = useState('18');
  const [formStatus, setFormStatus] = useState<'ACTIVE' | 'INACTIVE'>('ACTIVE');
  const [formNotes, setFormNotes]   = useState('');

  // Card visibility config
  const [visibleCards, setVisibleCards] = useState<VisibleCards>({
    total_categories: true,
    total_skus: true,
    avg_skus: true,
    active_tax: true
  });

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: ToastMessage['type'], text: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, text }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Load / persist
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

  // Modal openers
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
    setFormNotes(cat.notes ?? '');
    setShowFormModal(true);
  };

  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      addToast('error', 'Category Name is required');
      return;
    }
    if (editingCategory) {
      const updated = categories.map((c) =>
        c.id === editingCategory.id
          ? { ...c, name: formName.trim(), code: formCode.trim(), description: formDesc.trim(), taxRate: parseFloat(formTax) || 0, status: formStatus, notes: formNotes.trim() }
          : c
      );
      updateCachedCategories(updated);
      const found = updated.find((x) => x.id === editingCategory.id);
      if (found && selectedCategory?.id === found.id) setSelectedCategory(found);
      addToast('success', `Category "${formName}" updated successfully`);
    } else {
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
    updateCachedCategories(categories.filter((c) => c.id !== selectedCategory.id));
    addToast('warning', `Removed Category "${name}" from system catalog`);
    setSelectedCategory(null);
    setShowDeleteConfirm(false);
  };

  const handleExportCSV = () => {
    if (categories.length === 0) { addToast('error', 'No categories to export'); return; }
    const headers = ['ID', 'Name', 'Code', 'Description', 'SKU Count', 'Tax Rate (%)', 'Status', 'Date Created'];
    const rows = categories.map((c) => [
      c.id,
      `"${c.name.replace(/"/g, '""')}"`,
      c.code,
      `"${c.description.replace(/"/g, '""')}"`,
      c.totalProducts,
      `${c.taxRate}%`,
      c.status,
      c.createdAt
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csvContent));
    link.setAttribute('download', `viyan_categories_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast('success', 'Categories catalog exported successfully as CSV');
  };

  // Filtered list
  const filteredCategories = categories.filter((cat) => {
    const matchesSearch =
      cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.description.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    if (activeTab === 'high')  return cat.totalProducts >= 20;
    if (activeTab === 'low')   return cat.totalProducts > 0 && cat.totalProducts < 20;
    if (activeTab === 'empty') return cat.totalProducts === 0;
    return true;
  });

  return (
    <div className="categories-page-wrapper">
      <CategoriesHeader
        onConfigureCards={() => setShowConfigureCards(true)}
        onAddCategory={openAddModal}
      />

      <CategoriesStatsGrid
        categories={categories}
        visibleCards={visibleCards}
      />

      <CategoriesSearchFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onExportCSV={handleExportCSV}
      />

      {/* Core content */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#64748b', fontWeight: 700 }}>
          Analyzing classifications...
        </div>
      ) : filteredCategories.length === 0 ? (
        <div className="cat-empty-state">
          <Folder size={48} color="#cbd5e1" style={{ margin: '0 auto 16px' }} />
          <h3 style={{ fontWeight: 800, color: '#334155', fontSize: '1.1rem', margin: 0 }}>No Taxonomy Match</h3>
          <p style={{ color: '#94a3b8', fontSize: '0.88rem', marginTop: '6px', fontWeight: 600 }}>
            We couldn&apos;t locate any catalog category mapping your constraints.
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        <CategoriesGrid
          categories={filteredCategories}
          onSelectCategory={setSelectedCategory}
        />
      ) : (
        <CategoriesTable
          categories={filteredCategories}
          onSelectCategory={setSelectedCategory}
          onEditCategory={openEditModal}
        />
      )}

      {/* Detail drawer */}
      {selectedCategory && (
        <CategoriesDrawer
          category={selectedCategory}
          onClose={() => setSelectedCategory(null)}
          onEdit={openEditModal}
          onDelete={() => setShowDeleteConfirm(true)}
        />
      )}

      {/* Form modal */}
      {showFormModal && (
        <CategoriesFormModal
          editingCategory={editingCategory}
          formName={formName}
          formCode={formCode}
          formDesc={formDesc}
          formTax={formTax}
          formStatus={formStatus}
          formNotes={formNotes}
          onFormNameChange={setFormName}
          onFormCodeChange={setFormCode}
          onFormDescChange={setFormDesc}
          onFormTaxChange={setFormTax}
          onFormStatusChange={setFormStatus}
          onFormNotesChange={setFormNotes}
          onSubmit={handleSaveCategory}
          onClose={() => setShowFormModal(false)}
        />
      )}

      {/* Delete confirm */}
      {showDeleteConfirm && selectedCategory && (
        <CategoriesDeleteConfirmModal
          categoryName={selectedCategory.name}
          onConfirm={handleDeleteCategory}
          onCancel={() => setShowDeleteConfirm(false)}
        />
      )}

      {/* Metrics config */}
      {showConfigureCards && (
        <CategoriesMetricsConfigModal
          visibleCards={visibleCards}
          onToggle={(key, checked) => setVisibleCards((prev) => ({ ...prev, [key]: checked }))}
          onClose={() => setShowConfigureCards(false)}
        />
      )}

      <CategoriesToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
};
