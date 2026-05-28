import { useState, useEffect } from 'react';
import { 
  FileText, Download, X, Search, RefreshCw, Plus, Calendar, 
  ChevronLeft, ChevronRight, ShieldCheck, Star, Clock, 
  Sparkles
} from 'lucide-react';

interface ReportItem {
  id: string;
  name: string;
  category: 'Inventory' | 'Sales' | 'Supplier' | 'Customer' | 'Financial' | 'Tax';
  generatedBy: string;
  dateGenerated: string;
  description: string;
  frequency: 'Real-time' | 'Daily' | 'Monthly' | 'Quarterly' | 'Custom';
  fileSize: string;
  status?: 'Processing' | 'Ready';
  favorite?: boolean;
}

interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  text: string;
}

const DEFAULT_REPORTS: ReportItem[] = [
  {
    id: 'rep-1',
    name: 'Monthly Inventory Summary',
    category: 'Inventory',
    generatedBy: 'Admin Smith',
    dateGenerated: 'Oct 24, 2023',
    frequency: 'Monthly',
    fileSize: '4.2 MB',
    status: 'Ready',
    favorite: true,
    description: 'Aggregated audit balance of current physical warehouse stock locations and depreciation yields.'
  },
  {
    id: 'rep-2',
    name: 'Sales Performance Report',
    category: 'Sales',
    generatedBy: 'System Bot',
    dateGenerated: 'Oct 25, 2023',
    frequency: 'Real-time',
    fileSize: '12.8 MB',
    status: 'Ready',
    favorite: false,
    description: 'Detailed metrics of net corporate revenues, average ticket sizes, and customer renewal indices.'
  },
  {
    id: 'rep-3',
    name: 'Outstanding Supplier Payments',
    category: 'Supplier',
    generatedBy: 'Jane Doe',
    dateGenerated: 'Oct 23, 2023',
    frequency: 'Daily',
    fileSize: '2.5 MB',
    status: 'Ready',
    favorite: true,
    description: 'Outstanding procurement payable balances and supplier timeline fulfillment parameters.'
  },
  {
    id: 'rep-4',
    name: 'Product Movement Analysis',
    category: 'Inventory',
    generatedBy: 'Automated',
    dateGenerated: 'Scheduled',
    frequency: 'Daily',
    fileSize: '1.2 MB',
    status: 'Ready',
    favorite: false,
    description: 'Depot-wise stock velocity turn rates and internal logistics transfers auditable timeline.'
  },
  {
    id: 'rep-5',
    name: 'Customer Credit Balance Report',
    category: 'Customer',
    generatedBy: 'Finance Dept',
    dateGenerated: 'Oct 22, 2023',
    frequency: 'Quarterly',
    fileSize: '3.1 MB',
    status: 'Ready',
    favorite: false,
    description: 'Receivables balances, customer credit lines status, and outstanding invoices summaries.'
  }
];

export const ReportsPage = () => {
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'sales' | 'inventory' | 'inventory-val' | 'receivables' | 'payments' | 'payables' | 'purchases' | 'activity' | 'automation'>('all');
  const [activeViewGroup, setActiveViewGroup] = useState<'all' | 'favorites' | 'shared' | 'scheduled'>('all');

  // Filter Dropdowns
  const [reportType, setReportType] = useState('all');
  const [dateRange, setDateRange] = useState('all');

  // Selected for drawer
  const [selectedReport, setSelectedReport] = useState<ReportItem | null>(null);

  // Modals
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [showCustomModal, setShowCustomModal] = useState(false);

  // Generate Report Form States
  const [genName, setGenName] = useState('');
  const [genCategory, setGenCategory] = useState<'Inventory' | 'Sales' | 'Supplier' | 'Customer' | 'Financial' | 'Tax'>('Inventory');
  const [genType, setGenType] = useState('Summary Report');
  const [genDesc, setGenDesc] = useState('');
  const [genTimeframe, setGenTimeframe] = useState('today');
  const [genStartDate, setGenStartDate] = useState('');
  const [genEndDate, setGenEndDate] = useState('');
  const [genFormat, setGenFormat] = useState<'pdf' | 'xlsx' | 'csv'>('pdf');
  const [genIncludeDetails, setGenIncludeDetails] = useState(true);
  const [genSchedule, setGenSchedule] = useState(false);
  const [genNotes, setGenNotes] = useState('');

  // Processing state
  const [isGenerating, setIsGenerating] = useState(false);

  // Create Custom Report Form States
  const [custName, setCustName] = useState('');
  const [custCategory, setCustCategory] = useState<'Inventory' | 'Sales' | 'Supplier' | 'Customer' | 'Financial' | 'Tax'>('Inventory');
  const [includeGst, setIncludeGst] = useState(true);
  const [includeLedger, setIncludeLedger] = useState(true);
  const [custTimeframe, setCustTimeframe] = useState('today');
  const [custStartDate, setCustStartDate] = useState('');
  const [custEndDate, setCustEndDate] = useState('');
  const [exportFormat, setExportFormat] = useState<'pdf' | 'xlsx'>('pdf');

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

  // Loading reports
  useEffect(() => {
    setLoading(true);
    try {
      const cached = localStorage.getItem('ims_dummy_reports');
      if (cached) {
        setReports(JSON.parse(cached));
      } else {
        localStorage.setItem('ims_dummy_reports', JSON.stringify(DEFAULT_REPORTS));
        setReports(DEFAULT_REPORTS);
      }
    } catch {
      setReports(DEFAULT_REPORTS);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateCachedReports = (updated: ReportItem[]) => {
    setReports(updated);
    try {
      localStorage.setItem('ims_dummy_reports', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  // Toggle Favorite Action
  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = reports.map(r => {
      if (r.id === id) {
        const nextFav = !r.favorite;
        addToast('success', nextFav ? `Starred "${r.name}" as favorite` : `Removed "${r.name}" from favorites`);
        return { ...r, favorite: nextFav };
      }
      return r;
    });
    updateCachedReports(updated);
  };

  const handleExportAll = () => {
    if (reports.length === 0) {
      addToast('error', 'No reports to export');
      return;
    }
    const headers = ['Report ID', 'Name', 'Category', 'Generated By', 'Date', 'Format/Size', 'Description'];
    const rows = reports.map(r => [
      r.id,
      `"${r.name.replace(/"/g, '""')}"`,
      r.category,
      r.generatedBy,
      r.dateGenerated,
      r.fileSize,
      `"${r.description.replace(/"/g, '""')}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `viyan_reports_catalog_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast('success', 'Reports directory exported successfully as CSV');
  };

  const getTimeframeLabel = (tf: string, start: string, end: string) => {
    if (tf === 'today') return 'Today';
    if (tf === 'yesterday') return 'Yesterday';
    if (tf === 'last7') return 'Last 7 Days';
    if (tf === 'last30') return 'Last 30 Days';
    if (tf === 'custom') {
      if (start && end) return `${start} to ${end}`;
      if (start) return `Since ${start}`;
      if (end) return `Until ${end}`;
      return 'Custom Range';
    }
    return 'Real-time';
  };

  const handleSubmitGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!genName.trim()) {
      addToast('error', 'Report Name is required');
      return;
    }

    if (genTimeframe === 'custom' && !genStartDate && !genEndDate) {
      addToast('error', 'Please specify at least one date limit');
      return;
    }

    setIsGenerating(true);
    addToast('info', 'Starting background report extraction...');

    const formatExt = genFormat;
    const tfLabel = getTimeframeLabel(genTimeframe, genStartDate, genEndDate);
    const reportTitle = `${genName.trim()} (${genFormat.toUpperCase()})`;
    const reportId = `rep-${Math.random().toString(36).substring(2, 9)}`;

    const newReport: ReportItem = {
      id: reportId,
      name: reportTitle,
      category: genCategory,
      generatedBy: 'Self Admin',
      dateGenerated: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      frequency: genTimeframe === 'custom' ? 'Custom' : 'Daily',
      fileSize: `${(1.5 + Math.random() * 4).toFixed(1)} MB`,
      status: 'Processing',
      favorite: false,
      description: `${genDesc.trim() || 'Custom operational summary ledger extraction.'} [Type: ${genType}] [Detailed: ${genIncludeDetails ? 'Yes' : 'No'}] [Scheduled: ${genSchedule ? 'Yes' : 'No'}] Range: ${tfLabel}. format: ${formatExt.toUpperCase()}. ${genNotes ? 'Notes: ' + genNotes : ''}`
    };

    const processingReports = [newReport, ...reports];
    updateCachedReports(processingReports);

    // Close modal instantly
    setShowGenerateModal(false);

    // Complete background extraction in 3s
    setTimeout(() => {
      setIsGenerating(false);

      const updatedReports = processingReports.map(r => {
        if (r.id === reportId) {
          return { ...r, status: 'Ready' as const };
        }
        return r;
      });

      updateCachedReports(updatedReports);
      addToast('success', `"${reportTitle}" generated successfully & added to list`);

      // Reset
      setGenName('');
      setGenDesc('');
      setGenStartDate('');
      setGenEndDate('');
      setGenTimeframe('today');
      setGenNotes('');
    }, 3000);
  };

  const handleSubmitCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!custName.trim()) {
      addToast('error', 'Report Name is required');
      return;
    }

    const tfLabel = getTimeframeLabel(custTimeframe, custStartDate, custEndDate);
    const reportTitle = `${custName.trim()} (${exportFormat.toUpperCase()})`;

    const newReport: ReportItem = {
      id: `rep-${Math.random().toString(36).substring(2, 9)}`,
      name: reportTitle,
      category: custCategory,
      generatedBy: 'Advanced Builder',
      dateGenerated: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      frequency: 'Custom',
      fileSize: `${(2.2 + Math.random() * 8).toFixed(1)} MB`,
      status: 'Ready',
      favorite: false,
      description: `Custom data extraction parameters: Include GST: ${includeGst ? 'Yes' : 'No'} | Detailed Ledger: ${includeLedger ? 'Yes' : 'No'} | Period: ${tfLabel}.`
    };

    updateCachedReports([newReport, ...reports]);
    addToast('success', `Custom report "${custName}" created`);
    setShowCustomModal(false);
    setCustName('');
    setCustStartDate('');
    setCustEndDate('');
    setCustTimeframe('today');
  };

  const handleDownload = (name: string) => {
    addToast('success', `Downloading report asset "${name}"...`);
  };

  // Filter Logic
  const filteredReports = reports.filter((rep) => {
    const matchesSearch = 
      rep.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rep.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rep.generatedBy.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    // View filter group
    if (activeViewGroup === 'favorites') return rep.favorite === true;
    if (activeViewGroup === 'shared') return rep.generatedBy === 'System Bot' || rep.generatedBy === 'Automated';
    if (activeViewGroup === 'scheduled') return rep.frequency === 'Daily' || rep.frequency === 'Monthly';

    // Tabs filter category
    if (activeTab === 'sales') return rep.category === 'Sales';
    if (activeTab === 'inventory') return rep.category === 'Inventory';
    if (activeTab === 'inventory-val') return rep.category === 'Inventory' && rep.name.toLowerCase().includes('val');
    if (activeTab === 'receivables') return rep.category === 'Customer' || rep.name.toLowerCase().includes('receiv') || rep.name.toLowerCase().includes('credit');
    if (activeTab === 'payments') return rep.category === 'Financial' || rep.name.toLowerCase().includes('paym');
    if (activeTab === 'payables') return rep.category === 'Supplier' && rep.name.toLowerCase().includes('payab');
    if (activeTab === 'purchases') return rep.category === 'Supplier';
    if (activeTab === 'activity') return rep.category === 'Tax';
    if (activeTab === 'automation') return rep.frequency === 'Custom';

    // Selector filters
    if (reportType === 'audit' && rep.category !== 'Financial' && rep.category !== 'Tax') return false;
    if (reportType === 'analytics' && rep.category !== 'Inventory' && rep.category !== 'Sales') return false;

    return true;
  });

  return (
    <div className="fade-in" style={{ animation: 'fadeIn 0.5s cubic-bezier(0.4, 0, 0.2, 1)', padding: '24px' }}>
      <style>{`
        /* Global CSS Overrides & Custom Premium Classes */
        .reports-grid-split {
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: 24px;
          margin-top: 24px;
        }
        @media (max-width: 1024px) {
          .reports-grid-split { grid-template-columns: 1fr; }
        }

        /* Side Navigation Card */
        .premium-nav-card {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(124, 58, 237, 0.08);
          border-radius: 20px;
          padding: 20px;
          box-shadow: 0 4px 20px rgba(124, 58, 237, 0.02);
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .premium-nav-title {
          font-size: 0.74rem;
          font-weight: 800;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-bottom: 8px;
          padding-left: 8px;
        }

        .premium-nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 14px;
          border-radius: 12px;
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-secondary);
          width: 100%;
          text-align: left;
          background: transparent;
          border: none;
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .premium-nav-item:hover {
          background: #f5f3ff;
          color: #7c3aed;
          transform: translateX(4px);
        }

        .premium-nav-item.active {
          background: var(--primary-glow);
          color: #ffffff;
          font-weight: 700;
          box-shadow: 0 4px 12px rgba(124, 58, 237, 0.2);
        }

        /* Buttons styling */
        .btn-outline-violet {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 18px;
          border-radius: 12px;
          border: 1.5px solid rgba(124, 58, 237, 0.15);
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(8px);
          color: #475569;
          font-weight: 650;
          font-size: 0.84rem;
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .btn-outline-violet:hover {
          border-color: #7c3aed;
          color: #7c3aed;
          background: #ffffff;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(124, 58, 237, 0.08);
        }

        .btn-primary-glow {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 18px;
          border-radius: 12px;
          border: none;
          background: var(--primary-glow);
          color: #ffffff;
          font-weight: 700;
          font-size: 0.84rem;
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 14px rgba(124, 58, 237, 0.25);
        }
        .btn-primary-glow:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 18px rgba(124, 58, 237, 0.35);
        }

        /* Feed container */
        .feed-container-premium {
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(124, 58, 237, 0.08);
          border-radius: 20px;
          padding: 18px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.01);
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        /* Exquisite Table structure */
        .exquisite-table-wrapper {
          border-radius: 16px;
          overflow: hidden;
          border: 1px solid #e8ecf4;
        }
        .exquisite-table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0;
        }
        .exquisite-table th {
          background: #f8fafc;
          padding: 14px 18px;
          font-size: 0.74rem;
          font-weight: 800;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          border-bottom: 1.5px solid #e8ecf4;
          text-align: left;
        }
        .exquisite-table td {
          padding: 16px 18px;
          border-bottom: 1px solid #f1f5f9;
          font-size: 0.86rem;
          color: var(--text-primary);
          font-weight: 500;
          vertical-align: middle;
        }
        .exquisite-table tr:last-child td { border-bottom: none; }
        .exquisite-table tr { cursor: pointer; transition: all 0.25s ease; }
        .exquisite-table tr:hover td {
          background: #fcfbfe;
        }

        .icon-pill-violet {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: #f5f3ff;
          color: #7c3aed;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.25s;
        }
        .exquisite-table tr:hover .icon-pill-violet {
          background: var(--primary-glow);
          color: #ffffff;
          transform: scale(1.06) rotate(3deg);
        }

        /* Glass Modal Styles */
        .glass-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(15, 23, 42, 0.35);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          z-index: 1002;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: fadeIn 0.25s ease-out;
        }
        .glass-modal-box {
          background: #ffffff;
          border: 1px solid rgba(124, 58, 237, 0.1);
          border-radius: 24px;
          width: 720px;
          max-width: 95%;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 24px 48px -12px rgba(124, 58, 237, 0.12);
          animation: scaleUp 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          display: flex;
          flex-direction: column;
        }

        /* Format custom chip choices */
        .format-selection-group {
          display: flex;
          gap: 10px;
        }
        .format-selection-chip {
          flex: 1;
          border: 1.5px solid #e8ecf4;
          background: #ffffff;
          border-radius: 10px;
          padding: 10px;
          text-align: center;
          cursor: pointer;
          font-weight: 700;
          font-size: 0.84rem;
          color: var(--text-secondary);
          transition: all 0.2s;
          user-select: none;
        }
        .format-selection-chip.active {
          border-color: #7c3aed;
          background: #f5f3ff;
          color: #7c3aed;
        }

        /* Slider switch */
        .custom-toggle-box {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 14px;
          background: #f8fafc;
          border: 1.5px solid #e8ecf4;
          border-radius: 12px;
        }
        .toggle-switch-el {
          position: relative;
          display: inline-block;
          width: 40px;
          height: 22px;
        }
        .toggle-switch-el input { opacity: 0; width: 0; height: 0; }
        .toggle-slider-el {
          position: absolute;
          cursor: pointer;
          top: 0; left: 0; right: 0; bottom: 0;
          background-color: #cbd5e1;
          transition: .3s;
          border-radius: 20px;
        }
        .toggle-slider-el:before {
          position: absolute;
          content: "";
          height: 16px; width: 16px;
          left: 3px; bottom: 3px;
          background-color: white;
          transition: .3s;
          border-radius: 50%;
        }
        input:checked + .toggle-slider-el { background-color: #7c3aed; }
        input:checked + .toggle-slider-el:before { transform: translateX(18px); }

        /* Premium sliding right drawer */
        .drawer-backdrop {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(15, 23, 42, 0.3);
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
          z-index: 1001;
          display: flex;
          justify-content: flex-end;
          animation: fadeIn 0.25s ease-out;
        }
        .drawer-slide-content {
          width: 460px;
          max-width: 100%;
          background: #ffffff;
          height: 100%;
          box-shadow: -10px 0 35px rgba(124, 58, 237, 0.05);
          padding: 32px;
          box-sizing: border-box;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          animation: slideLeft 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        /* Toasts alert block */
        .alert-toasts-box {
          position: fixed;
          bottom: 24px;
          right: 24px;
          z-index: 9999;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .alert-toast-item {
          padding: 14px 18px;
          border-radius: 12px;
          background: #ffffff;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.06);
          border-left: 4px solid #7c3aed;
          display: flex;
          align-items: center;
          gap: 10px;
          min-width: 280px;
          font-weight: 600;
          font-size: 0.85rem;
          color: var(--text-primary);
          animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideLeft { from { transform: translateX(100%); } to { transform: translateX(0); } }
        @keyframes scaleUp { from { opacity: 0; transform: scale(0.96); } to { opacity: 1; transform: scale(1); } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      {/* HEADER SECTION */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(124, 58, 237, 0.1)', color: '#7c3aed' }}>
            <Sparkles size={20} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              Reports Center
            </h1>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 500, margin: 0 }}>Configure, export, and extract analytical records.</p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={handleExportAll} className="btn-outline-violet">
            <Download size={14} /> Export Directory
          </button>
          
          <button onClick={() => setShowCustomModal(true)} className="btn-outline-violet">
            Custom Report
          </button>

          <button onClick={() => setShowGenerateModal(true)} className="btn-primary-glow">
            <Plus size={15} /> Generate Report
          </button>
        </div>
      </div>

      {/* 3-COLUMN ZOHO SPLIT LAYOUT */}
      <div className="reports-grid-split">
        
        {/* Left column: Zoho navigation groups */}
        <div className="premium-nav-card">
          <div>
            <div className="premium-nav-title">Views</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <button 
                onClick={() => { setActiveTab('all'); setActiveViewGroup('all'); }} 
                className={`premium-nav-item ${(activeTab === 'all' && activeViewGroup === 'all') ? 'active' : ''}`}
              >
                <FileText size={15} />
                <span>All Reports</span>
              </button>
              <button 
                onClick={() => { setActiveViewGroup('favorites'); setActiveTab('all'); }} 
                className={`premium-nav-item ${activeViewGroup === 'favorites' ? 'active' : ''}`}
              >
                <Star size={15} />
                <span>Favorites</span>
              </button>
              <button 
                onClick={() => { setActiveViewGroup('shared'); setActiveTab('all'); }} 
                className={`premium-nav-item ${activeViewGroup === 'shared' ? 'active' : ''}`}
              >
                <Clock size={15} />
                <span>Shared Reports</span>
              </button>
              <button 
                onClick={() => { setActiveViewGroup('scheduled'); setActiveTab('all'); }} 
                className={`premium-nav-item ${activeViewGroup === 'scheduled' ? 'active' : ''}`}
              >
                <Calendar size={15} />
                <span>Scheduled</span>
              </button>
            </div>
          </div>

          <div>
            <div className="premium-nav-title">Folders & Categories</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <button onClick={() => { setActiveTab('sales'); setActiveViewGroup('all'); }} className={`premium-nav-item ${activeTab === 'sales' ? 'active' : ''}`}>Sales</button>
              <button onClick={() => { setActiveTab('inventory'); setActiveViewGroup('all'); }} className={`premium-nav-item ${activeTab === 'inventory' ? 'active' : ''}`}>Inventory</button>
              <button onClick={() => { setActiveTab('inventory-val'); setActiveViewGroup('all'); }} className={`premium-nav-item ${activeTab === 'inventory-val' ? 'active' : ''}`}>Inventory Valuation</button>
              <button onClick={() => { setActiveTab('receivables'); setActiveViewGroup('all'); }} className={`premium-nav-item ${activeTab === 'receivables' ? 'active' : ''}`}>Receivables</button>
              <button onClick={() => { setActiveTab('payments'); setActiveViewGroup('all'); }} className={`premium-nav-item ${activeTab === 'payments' ? 'active' : ''}`}>Payments Received</button>
              <button onClick={() => { setActiveTab('payables'); setActiveViewGroup('all'); }} className={`premium-nav-item ${activeTab === 'payables' ? 'active' : ''}`}>Payables</button>
              <button onClick={() => { setActiveTab('purchases'); setActiveViewGroup('all'); }} className={`premium-nav-item ${activeTab === 'purchases' ? 'active' : ''}`}>Purchases</button>
              <button onClick={() => { setActiveTab('activity'); setActiveViewGroup('all'); }} className={`premium-nav-item ${activeTab === 'activity' ? 'active' : ''}`}>Activity</button>
              <button onClick={() => { setActiveTab('automation'); setActiveViewGroup('all'); }} className={`premium-nav-item ${activeTab === 'automation' ? 'active' : ''}`}>Automation</button>
            </div>
          </div>
        </div>

        {/* Right side: Central list feed & filter controls */}
        <div className="feed-container-premium">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                {activeTab === 'all' 
                  ? activeViewGroup === 'favorites' 
                    ? 'Favorite Reports' 
                    : activeViewGroup === 'shared'
                      ? 'Shared Records'
                      : activeViewGroup === 'scheduled'
                        ? 'Scheduled Ledgers'
                        : 'All Reports'
                  : activeTab.charAt(0).toUpperCase() + activeTab.slice(1) + ' Reports'}
              </span>
              <span style={{ background: '#f5f3ff', color: '#7c3aed', padding: '2px 8px', borderRadius: '12px', fontSize: '0.72rem', fontWeight: 700 }}>
                {filteredReports.length}
              </span>
            </div>

            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              {/* Search */}
              <div style={{ position: 'relative', width: '180px' }}>
                <Search size={13} color="var(--text-secondary)" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
                <input 
                  type="text" 
                  placeholder="Search ledger..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%', padding: '6px 10px 6px 28px', borderRadius: '8px',
                    border: '1px solid #e8ecf4', background: '#ffffff', fontSize: '0.78rem',
                    fontWeight: 500, color: 'var(--text-primary)', outline: 'none', boxSizing: 'border-box'
                  }}
                />
              </div>

              {/* Class Dropdown */}
              <select 
                value={reportType} 
                onChange={(e) => setReportType(e.target.value)} 
                style={{
                  padding: '6px 10px', borderRadius: '8px', border: '1px solid #e8ecf4',
                  fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', background: '#ffffff', outline: 'none', cursor: 'pointer'
                }}
              >
                <option value="all">Category</option>
                <option value="audit">Audit</option>
                <option value="analytics">Analytics</option>
              </select>

              {/* Date Filter */}
              <select 
                value={dateRange} 
                onChange={(e) => setDateRange(e.target.value)}
                style={{
                  padding: '6px 10px', borderRadius: '8px', border: '1px solid #e8ecf4',
                  fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', background: '#ffffff', outline: 'none', cursor: 'pointer'
                }}
              >
                <option value="all">Timeframe</option>
                <option value="30">Last 30 Days</option>
                <option value="90">Last 90 Days</option>
              </select>

              <button 
                onClick={() => { addToast('success', 'Synchronized reports index'); }}
                style={{
                  border: '1px solid #e8ecf4', background: '#ffffff', color: 'var(--text-secondary)',
                  width: '30px', height: '30px', borderRadius: '8px', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', outline: 'none'
                }}
              >
                <RefreshCw size={13} />
              </button>
            </div>
          </div>

          {/* Table display */}
          <div className="exquisite-table-wrapper">
            {loading ? (
              <div style={{ textAlign: 'center', padding: '48px', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.85rem' }}>
                <RefreshCw size={20} className="animate-spin" style={{ animation: 'spin 1.5s linear infinite', margin: '0 auto 12px', color: '#7c3aed' }} />
                Accessing files directory...
              </div>
            ) : filteredReports.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '64px 20px', background: '#ffffff' }}>
                <FileText size={40} color="#cbd5e1" style={{ margin: '0 auto 12px' }} />
                <h3 style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '1rem', margin: 0 }}>No matching records found</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '4px', fontWeight: 500 }}>Adjust parameters or generate a new analytical report.</p>
              </div>
            ) : (
              <table className="exquisite-table">
                <thead>
                  <tr>
                    <th style={{ width: '40px' }}></th>
                    <th>Report Details</th>
                    <th>Class</th>
                    <th>Created By</th>
                    <th>Date Created</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReports.map((rep) => {
                    const isProcessing = rep.status === 'Processing';
                    return (
                      <tr 
                        key={rep.id} 
                        onClick={() => !isProcessing && setSelectedReport(rep)}
                        style={{ opacity: isProcessing ? 0.75 : 1, cursor: isProcessing ? 'not-allowed' : 'pointer' }}
                      >
                        <td>
                          <div className="icon-pill-violet" style={{ color: isProcessing ? '#cbd5e1' : '#7c3aed', background: isProcessing ? '#f8fafc' : '#f5f3ff' }}>
                            <FileText size={13} />
                          </div>
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <button
                              onClick={(e) => toggleFavorite(rep.id, e)}
                              style={{ border: 'none', background: 'none', padding: 0, cursor: 'pointer', outline: 'none' }}
                            >
                              <Star 
                                size={15} 
                                fill={rep.favorite ? '#eab308' : 'none'} 
                                color={rep.favorite ? '#eab308' : '#cbd5e1'} 
                                style={{ transition: 'all 0.2s', transform: rep.favorite ? 'scale(1.1)' : 'none' }}
                              />
                            </button>
                            <span style={{ fontWeight: 600, color: '#7c3aed' }}>{rep.name}</span>
                          </div>
                        </td>
                        <td>
                          <span style={{ background: '#f8fafc', padding: '3px 8px', borderRadius: '6px', fontSize: '0.74rem', color: 'var(--text-secondary)', border: '1px solid #e8ecf4', fontWeight: 600 }}>
                            {rep.category}
                          </span>
                        </td>
                        <td style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 550 }}>{rep.generatedBy}</td>
                        <td style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 550 }}>{rep.dateGenerated}</td>
                        <td>
                          {isProcessing ? (
                            <span style={{ 
                              display: 'inline-flex', alignItems: 'center', gap: '5px', 
                              background: '#fef3c7', color: '#d97706', padding: '3px 8px', 
                              borderRadius: '6px', fontSize: '0.72rem', fontWeight: 700, border: '1px solid #fde68a'
                            }}>
                              <RefreshCw size={11} style={{ animation: 'spin 1.5s linear infinite' }} />
                              Extracting
                            </span>
                          ) : (
                            <span style={{ 
                              display: 'inline-flex', alignItems: 'center', gap: '5px', 
                              background: '#ecfdf5', color: '#059669', padding: '3px 8px', 
                              borderRadius: '6px', fontSize: '0.72rem', fontWeight: 700, border: '1px solid #a7f3d0'
                            }}>
                              Ready
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

          {/* Simple pagination */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '14px', fontSize: '0.76rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
            <span>Showing 1 to {filteredReports.length} of {reports.length} entries</span>
            <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
              <button style={{ border: 'none', background: 'transparent', color: '#cbd5e1', padding: '4px', cursor: 'pointer' }}><ChevronLeft size={13} /></button>
              <button style={{ border: 'none', background: 'var(--primary-glow)', color: '#ffffff', width: '22px', height: '22px', borderRadius: '5px', fontWeight: 700 }}>1</button>
              <button style={{ border: 'none', background: 'transparent', color: '#cbd5e1', padding: '4px', cursor: 'pointer' }}><ChevronRight size={13} /></button>
            </div>
          </div>
        </div>

      </div>

      {/* GENERATE REPORT MODAL */}
      {showGenerateModal && (
        <div className="glass-modal-overlay">
          <div className="glass-modal-box">
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 28px', borderBottom: '1px solid #f1f5f9' }}>
              <div>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Generate Report</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.76rem', fontWeight: 500, marginTop: '2px', margin: 0 }}>Configure report settings and export preferences.</p>
              </div>
              <button 
                onClick={() => !isGenerating && setShowGenerateModal(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: isGenerating ? 'not-allowed' : 'pointer', outline: 'none' }}
                disabled={isGenerating}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmitGenerate}>
              <div style={{ padding: '24px 28px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  
                  {/* Left Column */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '5px' }}>Report Name</label>
                      <input 
                        type="text" 
                        value={genName}
                        onChange={(e) => setGenName(e.target.value)}
                        placeholder="e.g. Sales Ledger Q2"
                        disabled={isGenerating}
                        style={{
                          width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1.5px solid #e8ecf4',
                          fontSize: '0.84rem', color: 'var(--text-primary)', outline: 'none', boxSizing: 'border-box'
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '5px' }}>Report Category</label>
                      <select 
                        value={genCategory} 
                        onChange={(e) => setGenCategory(e.target.value as any)}
                        disabled={isGenerating}
                        style={{
                          width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1.5px solid #e8ecf4',
                          fontSize: '0.84rem', color: 'var(--text-primary)', outline: 'none', boxSizing: 'border-box'
                        }}
                      >
                        <option value="Inventory">Inventory Reports</option>
                        <option value="Sales">Sales Reports</option>
                        <option value="Supplier">Purchase Reports</option>
                        <option value="Customer">Relationship Reports</option>
                        <option value="Financial">Financial Reports</option>
                        <option value="Tax">Tax Compliance Reports</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '5px' }}>Report Type</label>
                      <select 
                        value={genType} 
                        onChange={(e) => setGenType(e.target.value)}
                        disabled={isGenerating}
                        style={{
                          width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1.5px solid #e8ecf4',
                          fontSize: '0.84rem', color: 'var(--text-primary)', outline: 'none', boxSizing: 'border-box'
                        }}
                      >
                        <option value="Summary Report">Summary Report</option>
                        <option value="Detailed Report">Detailed Report</option>
                        <option value="Transaction Report">Transaction Report</option>
                        <option value="Inventory Audit">Inventory Audit</option>
                        <option value="Performance Report">Performance Report</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '5px' }}>Date Range</label>
                      <select 
                        value={genTimeframe} 
                        onChange={(e) => setGenTimeframe(e.target.value)}
                        disabled={isGenerating}
                        style={{
                          width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1.5px solid #e8ecf4',
                          fontSize: '0.84rem', color: 'var(--text-primary)', outline: 'none', boxSizing: 'border-box'
                        }}
                      >
                        <option value="today">Today</option>
                        <option value="yesterday">Yesterday</option>
                        <option value="last7">Last 7 Days</option>
                        <option value="last30">Last 30 Days</option>
                        <option value="custom">Custom Date Range</option>
                      </select>
                    </div>

                    {genTimeframe === 'custom' && (
                      <div style={{ display: 'flex', gap: '8px', animation: 'slideUp 0.2s ease-out' }}>
                        <div style={{ flex: 1 }}>
                          <label style={{ display: 'block', fontSize: '0.68rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '3px' }}>From</label>
                          <input 
                            type="date"
                            value={genStartDate}
                            onChange={(e) => setGenStartDate(e.target.value)}
                            disabled={isGenerating}
                            style={{
                              width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1.5px solid #e8ecf4',
                              fontSize: '0.8rem', color: 'var(--text-primary)', outline: 'none', boxSizing: 'border-box'
                            }}
                          />
                        </div>
                        <div style={{ flex: 1 }}>
                          <label style={{ display: 'block', fontSize: '0.68rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '3px' }}>To</label>
                          <input 
                            type="date"
                            value={genEndDate}
                            onChange={(e) => setGenEndDate(e.target.value)}
                            disabled={isGenerating}
                            style={{
                              width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1.5px solid #e8ecf4',
                              fontSize: '0.8rem', color: 'var(--text-primary)', outline: 'none', boxSizing: 'border-box'
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right Column */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '5px' }}>Export Format</label>
                      <div className="format-selection-group">
                        <div 
                          className={`format-selection-chip ${genFormat === 'pdf' ? 'active' : ''}`}
                          onClick={() => !isGenerating && setGenFormat('pdf')}
                        >
                          PDF
                        </div>
                        <div 
                          className={`format-selection-chip ${genFormat === 'xlsx' ? 'active' : ''}`}
                          onClick={() => !isGenerating && setGenFormat('xlsx')}
                        >
                          Excel
                        </div>
                        <div 
                          className={`format-selection-chip ${genFormat === 'csv' ? 'active' : ''}`}
                          onClick={() => !isGenerating && setGenFormat('csv')}
                        >
                          CSV
                        </div>
                      </div>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '5px' }}>Options</label>
                      <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: '8px', border: '1.5px solid #e8ecf4', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--text-primary)', cursor: 'pointer' }}>
                          <input 
                            type="checkbox" 
                            checked={genIncludeDetails} 
                            onChange={(e) => setGenIncludeDetails(e.target.checked)}
                            disabled={isGenerating}
                            style={{ width: '14px', height: '14px', accentColor: '#7c3aed' }}
                          />
                          Include transaction details
                        </label>
                      </div>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '5px' }}>Scheduled Delivery</label>
                      <div className="custom-toggle-box">
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-primary)' }}>Automatic monthly emails</span>
                        <label className="toggle-switch-el">
                          <input 
                            type="checkbox" 
                            checked={genSchedule}
                            onChange={(e) => setGenSchedule(e.target.checked)}
                            disabled={isGenerating}
                          />
                          <span className="toggle-slider-el"></span>
                        </label>
                      </div>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '5px' }}>Notes</label>
                      <textarea 
                        rows={2}
                        value={genNotes}
                        onChange={(e) => setGenNotes(e.target.value)}
                        placeholder="Add execution reference logs..."
                        disabled={isGenerating}
                        style={{
                          width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1.5px solid #e8ecf4',
                          fontSize: '0.84rem', color: 'var(--text-primary)', outline: 'none', boxSizing: 'border-box',
                          fontFamily: 'inherit', resize: 'none'
                        }}
                      />
                    </div>
                  </div>

                </div>
              </div>

              {/* Footer */}
              <div style={{ padding: '16px 28px', background: '#f8fafc', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'flex-end', gap: '12px', borderBottomLeftRadius: '24px', borderBottomRightRadius: '24px' }}>
                <button 
                  type="button" 
                  onClick={() => setShowGenerateModal(false)}
                  disabled={isGenerating}
                  className="btn-outline-violet"
                  style={{ padding: '8px 16px' }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isGenerating}
                  className="btn-primary-glow"
                  style={{ padding: '8px 20px', minWidth: '120px', justifyContent: 'center' }}
                >
                  {isGenerating ? (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <RefreshCw size={13} className="animate-spin" style={{ animation: 'spin 1.2s linear infinite' }} />
                      Extracting...
                    </span>
                  ) : 'Generate'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE CUSTOM REPORT MODAL */}
      {showCustomModal && (
        <div className="glass-modal-overlay">
          <div className="glass-modal-box" style={{ width: '480px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid #f1f5f9' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Custom Report Builder</h2>
              <button 
                onClick={() => setShowCustomModal(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', outline: 'none' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmitCustom}>
              <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '5px' }}>Report Name</label>
                  <input 
                    type="text" 
                    value={custName}
                    onChange={(e) => setCustName(e.target.value)}
                    placeholder="e.g. Workspace Q3 Procurement Plan"
                    style={{
                      width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1.5px solid #e8ecf4',
                      fontSize: '0.84rem', color: 'var(--text-primary)', outline: 'none', boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '5px' }}>Category</label>
                    <select 
                      value={custCategory} 
                      onChange={(e) => setCustCategory(e.target.value as any)}
                      style={{
                        width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1.5px solid #e8ecf4',
                        fontSize: '0.84rem', color: 'var(--text-primary)', outline: 'none', boxSizing: 'border-box'
                      }}
                    >
                      <option value="Inventory">Inventory Reports</option>
                      <option value="Sales">Sales Reports</option>
                      <option value="Supplier">Purchase Reports</option>
                      <option value="Customer">Relationship Reports</option>
                      <option value="Financial">Financial Reports</option>
                    </select>
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '5px' }}>Format</label>
                    <select 
                      value={exportFormat} 
                      onChange={(e) => setExportFormat(e.target.value as any)}
                      style={{
                        width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1.5px solid #e8ecf4',
                        fontSize: '0.84rem', color: 'var(--text-primary)', outline: 'none', boxSizing: 'border-box'
                      }}
                    >
                      <option value="pdf">PDF</option>
                      <option value="xlsx">Excel (XLSX)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '5px' }}>Timeframe Preset</label>
                  <select 
                    value={custTimeframe} 
                    onChange={(e) => setCustTimeframe(e.target.value)}
                    style={{
                      width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1.5px solid #e8ecf4',
                      fontSize: '0.84rem', color: 'var(--text-primary)', outline: 'none', boxSizing: 'border-box'
                    }}
                  >
                    <option value="today">Today</option>
                    <option value="yesterday">Yesterday</option>
                    <option value="last7">Last 7 Days</option>
                    <option value="last30">Last 30 Days</option>
                    <option value="custom">Custom Range</option>
                  </select>
                </div>

                {custTimeframe === 'custom' && (
                  <div style={{ display: 'flex', gap: '10px', animation: 'slideUp 0.2s ease-out' }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: 'block', fontSize: '0.68rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>From</label>
                      <input 
                        type="date"
                        value={custStartDate}
                        onChange={(e) => setCustStartDate(e.target.value)}
                        style={{
                          width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1.5px solid #e8ecf4',
                          fontSize: '0.82rem', color: 'var(--text-primary)', outline: 'none', boxSizing: 'border-box'
                        }}
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: 'block', fontSize: '0.68rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>To</label>
                      <input 
                        type="date"
                        value={custEndDate}
                        onChange={(e) => setCustEndDate(e.target.value)}
                        style={{
                          width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1.5px solid #e8ecf4',
                          fontSize: '0.82rem', color: 'var(--text-primary)', outline: 'none', boxSizing: 'border-box'
                        }}
                      />
                    </div>
                  </div>
                )}

                <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '10px', border: '1.5px solid #f1f5f9', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--text-primary)', cursor: 'pointer' }}>
                    <input 
                      type="checkbox" 
                      checked={includeGst} 
                      onChange={(e) => setIncludeGst(e.target.checked)}
                      style={{ width: '15px', height: '15px', accentColor: '#7c3aed' }}
                    />
                    Include standard GST compliances
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--text-primary)', cursor: 'pointer' }}>
                    <input 
                      type="checkbox" 
                      checked={includeLedger} 
                      onChange={(e) => setIncludeLedger(e.target.checked)}
                      style={{ width: '15px', height: '15px', accentColor: '#7c3aed' }}
                    />
                    Compile physical branch index
                  </label>
                </div>
              </div>

              <div style={{ padding: '16px 24px', background: '#f8fafc', borderTop: '1px solid #f1f5f9', display: 'flex', gap: '10px', justifyContent: 'flex-end', borderBottomLeftRadius: '24px', borderBottomRightRadius: '24px' }}>
                <button 
                  type="button" 
                  onClick={() => setShowCustomModal(false)}
                  className="btn-outline-violet"
                  style={{ padding: '8px 14px' }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn-primary-glow"
                  style={{ padding: '8px 16px' }}
                >
                  Build Ledger
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DETAIL VIEW DRAWER */}
      {selectedReport && (
        <div className="drawer-backdrop" onClick={() => setSelectedReport(null)}>
          <div className="drawer-slide-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#7c3aed', background: '#f5f3ff', padding: '4px 10px', borderRadius: '6px', textTransform: 'uppercase' }}>
                {selectedReport.category} Scope
              </span>
              <button 
                onClick={() => setSelectedReport(null)}
                style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', outline: 'none' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <div style={{ background: '#f5f3ff', padding: '10px', borderRadius: '12px', color: '#7c3aed' }}>
                <FileText size={22} />
              </div>
              <div>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>{selectedReport.name}</h2>
                <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', fontWeight: 500, marginTop: '2px' }}>
                  Audited Class: {selectedReport.category} • Size: {selectedReport.fileSize}
                </div>
              </div>
            </div>

            <div style={{ height: '1px', background: '#f1f5f9', margin: '18px 0' }}></div>

            <h3 style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 700, marginBottom: '8px' }}>
              Report summary
            </h3>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-primary)', fontWeight: 500, lineHeight: 1.5, marginBottom: '20px' }}>
              {selectedReport.description}
            </p>

            <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '12px', border: '1.5px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase' }}>GENERATED BY</div>
                <div style={{ fontSize: '0.84rem', fontWeight: 650, color: 'var(--text-primary)', marginTop: '3px' }}>{selectedReport.generatedBy}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase' }}>DATE GENERATED</div>
                <div style={{ fontSize: '0.84rem', fontWeight: 650, color: 'var(--text-primary)', marginTop: '3px' }}>{selectedReport.dateGenerated}</div>
              </div>
            </div>

            <div style={{ background: '#ecfdf5', padding: '14px', borderRadius: '12px', border: '1px solid #d1fae5', display: 'flex', gap: '8px', marginBottom: '20px' }}>
              <ShieldCheck size={18} color="#059669" style={{ flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: '0.76rem', color: '#065f46', fontWeight: 700, textTransform: 'uppercase' }}>Audited & Verified</div>
                <p style={{ fontSize: '0.78rem', color: '#047857', fontWeight: 550, margin: '3px 0 0 0', lineHeight: 1.4 }}>Matches standard local accounting protocols and tax audits.</p>
              </div>
            </div>

            <button 
              onClick={() => handleDownload(selectedReport.name)}
              style={{
                marginTop: 'auto', width: '100%', padding: '12px', borderRadius: '12px', border: 'none',
                background: 'var(--primary-glow)', color: '#ffffff',
                fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', outline: 'none',
                boxShadow: '0 4px 12px rgba(124, 58, 237, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
              }}
            >
              <Download size={16} /> Export File
            </button>
          </div>
        </div>
      )}

      {/* TOAST SYSTEM ALERTS */}
      <div className="alert-toasts-box">
        {toasts.map((t) => (
          <div key={t.id} className="alert-toast-item" style={{ borderLeftColor: t.type === 'success' ? '#059669' : t.type === 'warning' ? '#ea580c' : t.type === 'error' ? '#e11d48' : '#7c3aed' }}>
            <span style={{ flex: 1 }}>{t.text}</span>
            <button 
              onClick={() => removeToast(t.id)}
              style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: 0, outline: 'none' }}
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
      
    </div>
  );
};
