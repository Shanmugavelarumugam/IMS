import React from 'react';
import { X, ShieldCheck, Star, UserRound, Mail, ExternalLink, Phone, MapPin, IndianRupee, ArrowUpRight, ArrowDownLeft, Calendar, Edit3, Trash2 } from 'lucide-react';
import type { Supplier } from '../types';

interface SupplierDrawerProps {
  selectedSupplier: Supplier;
  onClose: () => void;
  onRecordPayment: (sup: Supplier) => void;
  onEditSupplier: (sup: Supplier) => void;
  onDeleteSupplier: (sup: Supplier) => void;
}

export const SupplierDrawer: React.FC<SupplierDrawerProps> = ({
  selectedSupplier,
  onClose,
  onRecordPayment,
  onEditSupplier,
  onDeleteSupplier
}) => {
  return (
    <div className="right-drawer-overlay" onClick={onClose}>
      <div className="right-drawer-container" onClick={(e) => e.stopPropagation()}>
        {/* Drawer Header */}
        <div style={{ 
          padding: '24px 30px', 
          borderBottom: '1px solid #f1f5f9', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          background: '#f8fafc' 
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShieldCheck size={20} color="#6366f1" />
            <span style={{ fontWeight: 850, fontSize: '1rem', color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Supplier Profile</span>
          </div>
          <button 
            onClick={onClose}
            style={{ background: '#ffffff', border: '1px solid #e2e8f0', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b' }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Drawer Content (Scrollable) */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '30px' }}>
          
          {/* Profile Card Header */}
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '28px' }}>
            <div style={{ 
              height: '70px', width: '70px', 
              background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', 
              color: '#ffffff', borderRadius: '22px', 
              display: 'flex', alignItems: 'center', justifyContent: 'center', 
              fontWeight: 900, fontSize: '1.8rem',
              boxShadow: '0 8px 20px -6px rgba(99, 102, 241, 0.4)'
            }}>
              {selectedSupplier.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>{selectedSupplier.name}</h2>
              <span className="type-pill type-oem" style={{ marginTop: '6px' }}>{selectedSupplier.type}</span>
            </div>
          </div>

          {/* Rating & Action Summary */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', background: '#f8fafc', padding: '16px', borderRadius: '16px', border: '1px solid #f1f5f9', marginBottom: '32px' }}>
            <div style={{ textAlign: 'center', borderRight: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>Supplier Score</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#d97706', marginTop: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                <Star size={16} fill="#d97706" color="#d97706" /> {selectedSupplier.rating.toFixed(1)}
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>Purchase Invoices</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a', marginTop: '4px' }}>
                {selectedSupplier.outstandingOrders} Active
              </div>
            </div>
          </div>

          {/* Contact Information block */}
          <div style={{ marginBottom: '36px' }}>
            <h4 style={{ fontSize: '0.8rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em', margin: '0 0 16px 0', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
              Administrative Directory
            </h4>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', gap: '12px' }}>
                <UserRound size={18} color="#94a3b8" style={{ marginTop: '2px' }} />
                <div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>Principal Contact</div>
                  <div style={{ fontSize: '0.9rem', color: '#1e293b', fontWeight: 650, marginTop: '2px' }}>{selectedSupplier.contactPerson}</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <Mail size={18} color="#94a3b8" style={{ marginTop: '2px' }} />
                <div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>Email</div>
                  <a href={`mailto:${selectedSupplier.email}`} style={{ fontSize: '0.9rem', color: '#6366f1', fontWeight: 650, marginTop: '2px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    {selectedSupplier.email} <ExternalLink size={12} />
                  </a>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <Phone size={18} color="#94a3b8" style={{ marginTop: '2px' }} />
                <div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>Phone</div>
                  <div style={{ fontSize: '0.9rem', color: '#1e293b', fontWeight: 650, marginTop: '2px' }}>{selectedSupplier.phone || 'N/A'}</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <MapPin size={18} color="#94a3b8" style={{ marginTop: '2px' }} />
                <div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>Address</div>
                  <div style={{ fontSize: '0.85rem', color: '#475569', fontWeight: 600, marginTop: '2px', lineHeight: 1.4 }}>{selectedSupplier.address}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Outstanding Debt & Payment box */}
          <div style={{ background: '#fff1f2', border: '1px solid #ffe4e6', padding: '20px', borderRadius: '20px', marginBottom: '36px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#f43f5e', textTransform: 'uppercase', letterSpacing: '0.02em' }}>Outstanding</span>
                  <h3 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#e11d48', margin: '2px 0 0 0' }}>
                    ₹{selectedSupplier.currentBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </h3>
                </div>
                {selectedSupplier.currentBalance > 0 && (
                  <div style={{ display: 'flex', gap: '12px', fontSize: '0.82rem', fontWeight: 750, color: '#9f1239', marginTop: '4px' }}>
                    <span>Due in: 8 Days</span>
                  </div>
                )}
              </div>
              {selectedSupplier.currentBalance > 0 && (
                <button 
                  onClick={() => onRecordPayment(selectedSupplier)}
                  style={{ background: '#e11d48', color: '#ffffff', border: 'none', borderRadius: '12px', padding: '10px 18px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', boxShadow: '0 4px 12px rgba(225, 29, 72, 0.25)' }}
                >
                  <IndianRupee size={14} /> Record Payment
                </button>
              )}
            </div>
          </div>

          {/* Ledger ledger history timeline */}
          <div>
            <h4 style={{ fontSize: '0.8rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em', margin: '0 0 18px 0', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
              Procurement Ledger Timeline
            </h4>
            
            {selectedSupplier.ledger.length === 0 ? (
              <p style={{ color: '#94a3b8', fontSize: '0.85rem', fontStyle: 'italic', margin: 0 }}>No transaction history on ledger.</p>
            ) : (
              <div className="ledger-timeline">
                {selectedSupplier.ledger.map((item) => (
                  <div key={item.id} className={`ledger-item ${item.isCredit ? 'credit' : 'debit'}`}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 750, color: '#1e293b' }}>
                        {item.label}
                      </span>
                      <span style={{ 
                        fontSize: '0.82rem', 
                        fontWeight: 800, 
                        color: item.isCredit ? '#e11d48' : '#059669',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '2px'
                      }}>
                        {item.isCredit ? <ArrowUpRight size={14} /> : <ArrowDownLeft size={14} />}
                        {item.isCredit ? '+' : '-'}₹{item.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700 }}>
                      <Calendar size={12} /> {item.date}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Bottom Drawer Actions */}
        <div style={{ 
          padding: '20px 30px', 
          borderTop: '1px solid #f1f5f9', 
          background: '#f8fafc',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <button 
            onClick={() => onEditSupplier(selectedSupplier)}
            style={{ 
              flex: 1,
              background: '#ffffff', 
              color: '#475569', 
              border: '1.5px solid #e2e8f0', 
              padding: '12px 18px', 
              borderRadius: '12px', 
              fontWeight: 700, 
              fontSize: '0.88rem', 
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <Edit3 size={16} /> Edit Supplier
          </button>
          
          <div style={{ position: 'relative', marginLeft: '12px' }}>
            <button 
              onClick={() => onDeleteSupplier(selectedSupplier)}
              style={{ 
                background: '#ffffff', 
                color: '#e11d48', 
                border: '1.5px solid #fecdd3', 
                padding: '12px', 
                borderRadius: '12px', 
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              title="Delete Supplier"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
