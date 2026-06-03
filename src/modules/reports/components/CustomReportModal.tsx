import React, { useState } from 'react';
import { X } from 'lucide-react';

interface CustomReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    category: 'Inventory' | 'Sales' | 'Supplier' | 'Customer' | 'Financial' | 'Tax';
    includeGst: boolean;
    includeLedger: boolean;
    timeframe: string;
    startDate: string;
    endDate: string;
    format: 'pdf' | 'xlsx';
  }) => void;
}

export const CustomReportModal: React.FC<CustomReportModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [custName, setCustName] = useState('');
  const [custCategory, setCustCategory] = useState<'Inventory' | 'Sales' | 'Supplier' | 'Customer' | 'Financial' | 'Tax'>('Inventory');
  const [includeGst, setIncludeGst] = useState(true);
  const [includeLedger, setIncludeLedger] = useState(true);
  const [custTimeframe, setCustTimeframe] = useState('today');
  const [custStartDate, setCustStartDate] = useState('');
  const [custEndDate, setCustEndDate] = useState('');
  const [exportFormat, setExportFormat] = useState<'pdf' | 'xlsx'>('pdf');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!custName.trim()) return;
    onSubmit({
      name: custName,
      category: custCategory,
      includeGst,
      includeLedger,
      timeframe: custTimeframe,
      startDate: custStartDate,
      endDate: custEndDate,
      format: exportFormat,
    });
  };

  return (
    <div className="glass-modal-overlay">
      <div className="glass-modal-box" style={{ width: '480px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid #f1f5f9' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Custom Report Builder</h2>
          <button 
            type="button"
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', outline: 'none' }}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
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
              <div style={{ display: 'flex', gap: '10px', animation: 'reportsSlideUp 0.2s ease-out' }}>
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
              onClick={onClose}
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
  );
};
