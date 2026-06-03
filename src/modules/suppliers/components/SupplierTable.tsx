import React from 'react';
import { Mail, IndianRupee, Edit3, Trash2 } from 'lucide-react';
import type { Supplier } from '../types';

interface SupplierTableProps {
  suppliers: Supplier[];
  onSelectSupplier: (sup: Supplier) => void;
  onRecordPayment: (sup: Supplier) => void;
  onEditSupplier: (sup: Supplier) => void;
  onDeleteSupplier: (sup: Supplier) => void;
}

export const SupplierTable: React.FC<SupplierTableProps> = ({
  suppliers,
  onSelectSupplier,
  onRecordPayment,
  onEditSupplier,
  onDeleteSupplier
}) => {
  return (
    <div className="premium-table-container">
      <table className="premium-table">
        <thead>
          <tr>
            <th>Supplier</th>
            <th>Primary Contact</th>
            <th>Purchase Orders</th>
            <th style={{ textAlign: 'right' }}>Outstanding Balance</th>
            <th style={{ textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {suppliers.map((sup) => {
            const initialLetter = sup.name.charAt(0).toUpperCase();
            const isDebtPositive = sup.currentBalance > 0;
            
            return (
              <tr key={sup.id} style={{ cursor: 'pointer' }} onClick={() => onSelectSupplier(sup)}>
                {/* 1. Vendor Node / Category */}
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{
                      height: '38px', width: '38px', borderRadius: '10px',
                      background: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)',
                      color: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 800, fontSize: '0.94rem'
                    }}>
                      {initialLetter}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <span style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.88rem' }}>{sup.name}</span>
                      <span style={{
                        alignSelf: 'flex-start',
                        fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase',
                        color: '#4f46e5', background: '#f0f3ff', padding: '2px 8px', borderRadius: '6px'
                      }}>
                        {sup.type}
                      </span>
                    </div>
                  </div>
                </td>

                {/* 2. Principal Contact */}
                <td>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontWeight: 700, color: '#1e293b' }}>{sup.contactPerson}</span>
                    <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 550, display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                      <Mail size={12} color="#94a3b8" /> {sup.email}
                    </span>
                  </div>
                </td>

                {/* 3. Procurement Cycles */}
                <td>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontWeight: 850, color: '#0f172a' }}>{sup.outstandingOrders}</span>
                    <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600 }}>Active POs</span>
                  </div>
                </td>

                {/* 4. Active Balance / Debt */}
                <td style={{ textAlign: 'right' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                    <span style={{
                      fontWeight: 900,
                      fontSize: '0.94rem',
                      color: isDebtPositive ? '#e11d48' : '#059669'
                    }}>
                      ₹{sup.currentBalance.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                    <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600 }}>
                      {isDebtPositive ? 'Outstanding' : 'Settled'}
                    </span>
                  </div>
                </td>

                {/* 5. Quick Actions */}
                <td style={{ textAlign: 'right' }} onClick={(e) => e.stopPropagation()}>
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', alignItems: 'center' }}>
                    <button
                      onClick={() => onRecordPayment(sup)}
                      className="table-action-btn"
                      title="Record Payment"
                      style={{ borderColor: isDebtPositive ? '#fecdd3' : '#e2e8f0', color: isDebtPositive ? '#e11d48' : '#64748b' }}
                    >
                      <IndianRupee size={14} />
                    </button>
                    <button
                      onClick={() => onEditSupplier(sup)}
                      className="table-action-btn"
                      title="Edit Info"
                    >
                      <Edit3 size={14} />
                    </button>
                    <button
                      onClick={() => onDeleteSupplier(sup)}
                      className="table-action-btn"
                      title="Terminate Account"
                      style={{ color: '#ef4444' }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
