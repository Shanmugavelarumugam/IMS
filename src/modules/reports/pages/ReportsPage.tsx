import React, { useState, useEffect } from 'react';
import type { ReportItem, ToastMessage } from '../types';

// Import subcomponents
import { ReportsHeader } from '../components/ReportsHeader';
import { SidebarNav } from '../components/SidebarNav';
import { SearchFilterBar } from '../components/SearchFilterBar';
import { ReportsTable } from '../components/ReportsTable';
import { ReportDrawer } from '../components/ReportDrawer';
import { GenerateReportModal } from '../components/GenerateReportModal';
import { CustomReportModal } from '../components/CustomReportModal';
import { ToastContainer } from '../components/ToastContainer';

// Import styles
import '../styles/reports.css';
import '../styles/metrics.css';
import '../styles/table.css';
import '../styles/modal.css';
import '../styles/responsive.css';

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

export const ReportsPage: React.FC = () => {
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

  // Processing state
  const [isGenerating, setIsGenerating] = useState(false);

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

  const handleGenerateReport = (data: {
    name: string;
    category: 'Inventory' | 'Sales' | 'Supplier' | 'Customer' | 'Financial' | 'Tax';
    type: string;
    desc: string;
    timeframe: string;
    startDate: string;
    endDate: string;
    format: 'pdf' | 'xlsx' | 'csv';
    includeDetails: boolean;
    schedule: boolean;
    notes: string;
  }) => {
    if (data.timeframe === 'custom' && !data.startDate && !data.endDate) {
      addToast('error', 'Please specify at least one date limit');
      return;
    }

    setIsGenerating(true);
    addToast('info', 'Starting background report extraction...');

    const formatExt = data.format;
    const tfLabel = getTimeframeLabel(data.timeframe, data.startDate, data.endDate);
    const reportTitle = `${data.name.trim()} (${data.format.toUpperCase()})`;
    const reportId = `rep-${Math.random().toString(36).substring(2, 9)}`;

    const newReport: ReportItem = {
      id: reportId,
      name: reportTitle,
      category: data.category,
      generatedBy: 'Self Admin',
      dateGenerated: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      frequency: data.timeframe === 'custom' ? 'Custom' : 'Daily',
      fileSize: `${(1.5 + Math.random() * 4).toFixed(1)} MB`,
      status: 'Processing',
      favorite: false,
      description: `${data.desc.trim() || 'Custom operational summary ledger extraction.'} [Type: ${data.type}] [Detailed: ${data.includeDetails ? 'Yes' : 'No'}] [Scheduled: ${data.schedule ? 'Yes' : 'No'}] Range: ${tfLabel}. format: ${formatExt.toUpperCase()}. ${data.notes ? 'Notes: ' + data.notes : ''}`
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
    }, 3000);
  };

  const handleCustomReport = (data: {
    name: string;
    category: 'Inventory' | 'Sales' | 'Supplier' | 'Customer' | 'Financial' | 'Tax';
    includeGst: boolean;
    includeLedger: boolean;
    timeframe: string;
    startDate: string;
    endDate: string;
    format: 'pdf' | 'xlsx';
  }) => {
    const tfLabel = getTimeframeLabel(data.timeframe, data.startDate, data.endDate);
    const reportTitle = `${data.name.trim()} (${data.format.toUpperCase()})`;

    const newReport: ReportItem = {
      id: `rep-${Math.random().toString(36).substring(2, 9)}`,
      name: reportTitle,
      category: data.category,
      generatedBy: 'Advanced Builder',
      dateGenerated: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      frequency: 'Custom',
      fileSize: `${(2.2 + Math.random() * 8).toFixed(1)} MB`,
      status: 'Ready',
      favorite: false,
      description: `Custom data extraction parameters: Include GST: ${data.includeGst ? 'Yes' : 'No'} | Detailed Ledger: ${data.includeLedger ? 'Yes' : 'No'} | Period: ${tfLabel}.`
    };

    updateCachedReports([newReport, ...reports]);
    addToast('success', `Custom report "${data.name}" created`);
    setShowCustomModal(false);
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
    <div className="reports-fade-in">
      {/* HEADER SECTION */}
      <ReportsHeader
        onExportAll={handleExportAll}
        onOpenCustomModal={() => setShowCustomModal(true)}
        onOpenGenerateModal={() => setShowGenerateModal(true)}
      />

      {/* 3-COLUMN ZOHO SPLIT LAYOUT */}
      <div className="reports-grid-split">
        {/* Left column: Zoho navigation groups */}
        <SidebarNav
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          activeViewGroup={activeViewGroup}
          setActiveViewGroup={setActiveViewGroup}
        />

        {/* Right side: Central list feed & filter controls */}
        <div className="feed-container-premium">
          <SearchFilterBar
            activeTab={activeTab}
            activeViewGroup={activeViewGroup}
            filteredCount={filteredReports.length}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            reportType={reportType}
            setReportType={setReportType}
            dateRange={dateRange}
            setDateRange={setDateRange}
            onRefresh={() => addToast('success', 'Synchronized reports index')}
          />

          {/* Table display */}
          <ReportsTable
            loading={loading}
            reports={reports}
            filteredReports={filteredReports}
            onSelectReport={setSelectedReport}
            onToggleFavorite={toggleFavorite}
          />
        </div>
      </div>

      {/* GENERATE REPORT MODAL */}
      <GenerateReportModal
        isOpen={showGenerateModal}
        onClose={() => setShowGenerateModal(false)}
        onGenerate={handleGenerateReport}
        isGenerating={isGenerating}
      />

      {/* CREATE CUSTOM REPORT MODAL */}
      <CustomReportModal
        isOpen={showCustomModal}
        onClose={() => setShowCustomModal(false)}
        onSubmit={handleCustomReport}
      />

      {/* DETAIL VIEW DRAWER */}
      <ReportDrawer
        report={selectedReport}
        onClose={() => setSelectedReport(null)}
        onDownload={handleDownload}
      />

      {/* TOAST SYSTEM ALERTS */}
      <ToastContainer
        toasts={toasts}
        onRemoveToast={removeToast}
      />
    </div>
  );
};
