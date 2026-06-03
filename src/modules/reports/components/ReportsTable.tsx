import React from 'react';
import { RefreshCw, FileText, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import type { ReportItem } from '../types';

interface ReportsTableProps {
  loading: boolean;
  reports: ReportItem[];
  filteredReports: ReportItem[];
  onSelectReport: (report: ReportItem) => void;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
}

export const ReportsTable: React.FC<ReportsTableProps> = ({
  loading,
  reports,
  filteredReports,
  onSelectReport,
  onToggleFavorite,
}) => {
  return (
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
        <>
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
                    onClick={() => !isProcessing && onSelectReport(rep)}
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
                          onClick={(e) => onToggleFavorite(rep.id, e)}
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

          {/* Simple pagination */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', padding: '14px 18px', fontSize: '0.76rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
            <span>Showing 1 to {filteredReports.length} of {reports.length} entries</span>
            <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
              <button style={{ border: 'none', background: 'transparent', color: '#cbd5e1', padding: '4px', cursor: 'pointer' }}><ChevronLeft size={13} /></button>
              <button style={{ border: 'none', background: 'var(--primary-glow)', color: '#ffffff', width: '22px', height: '22px', borderRadius: '5px', fontWeight: 700 }}>1</button>
              <button style={{ border: 'none', background: 'transparent', color: '#cbd5e1', padding: '4px', cursor: 'pointer' }}><ChevronRight size={13} /></button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
