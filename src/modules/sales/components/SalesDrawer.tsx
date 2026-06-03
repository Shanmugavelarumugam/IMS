import React from 'react';
import { X, User, Trash2, ShoppingBag } from 'lucide-react';
import type { SalesOrder } from '../types';

interface SalesDrawerProps {
  order: SalesOrder | null;
  onClose: () => void;
  onVoid: () => void;
  onFulfill: () => void;
  onDelete: () => void;
}

export const SalesDrawer: React.FC<SalesDrawerProps> = ({
  order,
  onClose,
  onVoid,
  onFulfill,
  onDelete,
}) => {
  if (!order) return null;

  return (
    <div className="drawer-overlay" onClick={onClose}>
      <div className="drawer-sheet" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <span className={`status-badge ${order.status === 'COMPLETED' ? 'completed' : order.status === 'CANCELLED' ? 'cancelled' : 'pending'}`}>
            {order.status === 'PENDING_DISPATCH' ? 'Pending Dispatch' : order.status}
          </span>
          <button 
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', outline: 'none' }}
          >
            <X size={24} />
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
          <div style={{ background: '#f5f3ff', padding: '12px', borderRadius: '14px', color: '#8b5cf6' }}>
            <ShoppingBag size={24} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>{order.orderNumber}</h2>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 800, marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <User size={12} /> {order.customerName}
            </div>
          </div>
        </div>

        <div style={{ height: '1.5px', background: '#f1f5f9', margin: '24px 0' }}></div>

        <h3 style={{ fontSize: '0.82rem', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 800, marginBottom: '12px' }}>
          Transaction Parameters
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
          <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '16px', border: '1.5px solid #f1f5f9' }}>
            <div style={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase' }}>Payment Mode</div>
            <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#334155', marginTop: '6px' }}>{order.paymentMode}</div>
          </div>
          
          <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '16px', border: '1.5px solid #f1f5f9' }}>
            <div style={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase' }}>Dispatch Target</div>
            <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#334155', marginTop: '6px' }}>{order.dispatchDate}</div>
          </div>
        </div>

        {/* Bill items */}
        <h3 style={{ fontSize: '0.82rem', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 800, marginBottom: '12px' }}>
          Line Items list
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
          {order.items.map((item, idx) => (
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

        {/* Tax and totals */}
        <div style={{ background: '#f8fafc', padding: '18px', borderRadius: '20px', border: '1.5px solid #f1f5f9', display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 700, color: '#64748b' }}>
            <span>Discount applied</span>
            <span style={{ color: '#e11d48' }}>-{order.discountPercentage}%</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 700, color: '#64748b' }}>
            <span>18% Standard GST</span>
            <span>₹{order.taxAmount.toLocaleString('en-IN')}</span>
          </div>
          <div style={{ height: '1px', background: '#e2e8f0', margin: '4px 0' }}></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0f172a' }}>Grand Total</span>
            <span style={{ fontSize: '1.35rem', fontWeight: 950, color: '#059669' }}>
              ₹{order.totalAmount.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {order.notes && (
          <div style={{ background: '#eef2ff', padding: '14px 16px', borderRadius: '16px', border: '1px solid #e0e7ff', marginBottom: '24px', fontSize: '0.84rem', color: '#3730a3', fontWeight: 650, lineHeight: 1.4 }}>
            <span style={{ fontWeight: 800 }}>Notes: </span> {order.notes}
          </div>
        )}

        {/* Actions */}
        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {order.status === 'PENDING_DISPATCH' && (
            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                onClick={onVoid}
                style={{
                  flex: 1, padding: '14px', borderRadius: '14px', border: '1.5px solid #fca5a5',
                  background: '#fff5f5', color: '#c53030', fontWeight: 800, fontSize: '0.88rem',
                  cursor: 'pointer', outline: 'none'
                }}
              >
                Void Invoice
              </button>
              <button 
                onClick={onFulfill}
                style={{
                  flex: 2, padding: '14px', borderRadius: '14px', border: 'none',
                  background: '#059669', color: '#ffffff', fontWeight: 800, fontSize: '0.88rem',
                  cursor: 'pointer', outline: 'none', boxShadow: '0 4px 12px rgba(5, 150, 105, 0.2)'
                }}
              >
                Authorize Dispatch
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
            <Trash2 size={16} /> Delete Sales Record
          </button>
        </div>
      </div>
    </div>
  );
};
