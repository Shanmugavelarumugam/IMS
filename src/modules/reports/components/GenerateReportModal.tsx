import React, { useState } from 'react';
import { X, RefreshCw } from 'lucide-react';

interface GenerateReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (data: {
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
  }) => void;
  isGenerating: boolean;
}

export const GenerateReportModal: React.FC<GenerateReportModalProps> = ({
  isOpen,
  onClose,
  onGenerate,
  isGenerating,
}) => {
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

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!genName.trim()) {
      return; // Validation handled in parent via toasts or locally.
    }
    onGenerate({
      name: genName,
      category: genCategory,
      type: genType,
      desc: genDesc,
      timeframe: genTimeframe,
      startDate: genStartDate,
      endDate: genEndDate,
      format: genFormat,
      includeDetails: genIncludeDetails,
      schedule: genSchedule,
      notes: genNotes,
    });
  };

  return (
    <div className="glass-modal-overlay">
      <div className="glass-modal-box">
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 28px', borderBottom: '1px solid #f1f5f9' }}>
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Generate Report</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.76rem', fontWeight: 500, marginTop: '2px', margin: 0 }}>Configure report settings and export preferences.</p>
          </div>
          <button 
            type="button"
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: isGenerating ? 'not-allowed' : 'pointer', outline: 'none' }}
            disabled={isGenerating}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
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
                  <div style={{ display: 'flex', gap: '8px', animation: 'reportsSlideUp 0.2s ease-out' }}>
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
              onClick={onClose}
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
  );
};
