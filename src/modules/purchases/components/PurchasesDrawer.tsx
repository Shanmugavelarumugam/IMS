import React from 'react';
import { X, User, Trash2, ShoppingCart } from 'lucide-react';
import type { PurchaseOrder } from '../types';

interface PurchasesDrawerProps {
  po: PurchaseOrder | null;
  onClose: () => void;
  onStatusUpdate: (status: 'PENDING' | 'COMPLETED' | 'CANCELLED') => void;
  onDelete: () => void;
}

export const PurchasesDrawer: React.FC<PurchasesDrawerProps> = ({
  po,
  onClose,
  onStatusUpdate,
  onDelete,
}) => {
  if (!po) return null;

  return (
    <div className="drawer-overlay" onClick={onClose}>
      <div className="drawer-sheet" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <span className={`status-badge ${po.status.toLowerCase()}`}>
            {po.status} Procurement Node
          </span>
          <button 
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', outline: 'none' }}
          >
            <X size={24} />
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
          <div style={{ background: '#f0f3ff', padding: '12px', borderRadius: '14px', color: '#6366f1' }}>
            <ShoppingCart size={24} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>{po.poNumber}</h2>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 800, marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <User size={12} /> {po.supplierName}
            </div>
          </div>
        </div>

        <div style={{ height: '1.5px', background: '#f1f5f9', margin: '24px 0' }}></div>

        <h3 style={{ fontSize: '0.82rem', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 800, marginBottom: '12px' }}>
          Depot Routing & Schedule
        </h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
          <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '16px', border: '1.5px solid #f1f5f9' }}>
            <div style={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase' }}>Target Warehouse</div>
            <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#334155', marginTop: '6px' }}>{po.warehouseBranch}</div>
          </div>
          
          <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '16px', border: '1.5px solid #f1f5f9' }}>
            <div style={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase' }}>Delivery Schedule</div>
            <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#334155', marginTop: '6px' }}>{po.deliveryDate}</div>
          </div>
        </div>

        {/* Items table */}
        <h3 style={{ fontSize: '0.82rem', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 800, marginBottom: '12px' }}>
          Line Items list
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
          {po.items.map((item, idx) => (
            <div key={idx} style={{ background: '#ffffff', padding: '14px', borderRadius: '14px', border: '1.5px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#1e293b' }}>{item.name}</div>
                <div style={{ fontSize: '0.76rem', color: '#94a3b8', fontWeight: 700, marginTop: '4px' }}>
                  {item.qty} units × ₹{item.unitPrice.toLocaleString('en-IN')}
                </div>
              </div>
              <span style={{ fontSize: '0.94rem', fontWeight: 850, color: '#0f172a' }}>
                ₹{(item.qty * item.unitPrice).toLocaleString('en-IN')}
              </span>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', padding: '18px 24px', borderRadius: '20px', border: '1.5px solid #f1f5f9', marginBottom: '24px' }}>
          <span style={{ fontSize: '0.84rem', fontWeight: 800, color: '#64748b' }}>Total Gross Value</span>
          <span style={{ fontSize: '1.4rem', fontWeight: 950, color: '#6366f1' }}>
            ₹{po.totalAmount.toLocaleString('en-IN')}
          </span>
        </div>

        {po.notes && (
          <div style={{ background: '#eef2ff', padding: '14px 16px', borderRadius: '16px', border: '1px solid #e0e7ff', marginBottom: '24px', fontSize: '0.84rem', color: '#3730a3', fontWeight: 650, lineHeight: 1.4 }}>
            <span style={{ fontWeight: 800 }}>Notes: </span> {po.notes}
          </div>
        )}

        {/* Actions */}
        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {po.status === 'DRAFT' && (
            <button 
              onClick={() => onStatusUpdate('PENDING')}
              style={{
                width: '100%', padding: '14px', borderRadius: '14px', border: 'none',
                background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', color: '#ffffff',
                fontWeight: 800, fontSize: '0.88rem', cursor: 'pointer', outline: 'none',
                boxShadow: '0 4px 12px rgba(99, 102, 241, 0.25)'
              }}
            >
              Submit Purchase Invoice
            </button>
          )}

          {po.status === 'PENDING' && (
            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                onClick={() => onStatusUpdate('CANCELLED')}
                style={{
                  flex: 1, padding: '14px', borderRadius: '14px', border: '1.5px solid #fca5a5',
                  background: '#fff5f5', color: '#c53030', fontWeight: 800, fontSize: '0.88rem',
                  cursor: 'pointer', outline: 'none'
                }}
              >
                Void Order
              </button>
              <button 
                onClick={() => onStatusUpdate('COMPLETED')}
                style={{
                  flex: 2, padding: '14px', borderRadius: '14px', border: 'none',
                  background: '#059669', color: '#ffffff', fontWeight: 800, fontSize: '0.88rem',
                  cursor: 'pointer', outline: 'none', boxShadow: '0 4px 12px rgba(5, 150, 105, 0.2)'
                }}
              >
                Authorize Fulfillment
              </button>
            </div>
          )}

          <button 
            onClick={onDelete}
            style={{ 
              width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', 
              padding: '12px', borderRadius: '14px', border: '1.5px solid #e2e8f0', background: '#ffffff',
              color: '#be123c', fontWeight: 700, fontSize: '0.86rem', cursor: 'pointer', outline: 'none'
            }}
          >
            <Trash2 size={16} /> Delete Registry Record
          </button>
        </div>
      </div>
    </div>
  );
};
