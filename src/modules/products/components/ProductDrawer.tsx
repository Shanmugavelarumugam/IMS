import React from 'react';
import { X, Box, Edit3, Trash2, Layers, Calendar, ShieldCheck, Plus, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import type { Product } from '../types';

interface ProductDrawerProps {
  selectedProduct: Product;
  onClose: () => void;
  onEditSpecs: (prod: Product) => void;
  onDeleteSKU: (prod: Product) => void;
  onRecordAdjustment: (prod: Product) => void;
}

export const ProductDrawer: React.FC<ProductDrawerProps> = ({
  selectedProduct,
  onClose,
  onEditSpecs,
  onDeleteSKU,
  onRecordAdjustment
}) => {
  return (
    <>
      <div className="drawer-overlay" onClick={onClose} />
      <div className="drawer-sheet">
        <div style={{ padding: '24px 32px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)', padding: '10px', borderRadius: '12px', color: '#ffffff' }}>
              <Box size={22} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 900, color: '#0f172a', margin: 0, lineBreak: 'anywhere' }}>
                {selectedProduct.name}
              </h2>
              <code style={{ fontSize: '0.74rem', fontWeight: 800, color: '#4f46e5', marginTop: '2px', display: 'inline-block' }}>
                {selectedProduct.sku}
              </code>
            </div>
          </div>
          <button 
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}
          >
            <X size={24} />
          </button>
        </div>

        {/* Content Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '32px' }}>
          
          {/* Actions Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '32px' }}>
            <button 
              onClick={() => onEditSpecs(selectedProduct)}
              style={{
                background: '#ffffff',
                border: '1.5px solid #e2e8f0',
                padding: '12px',
                borderRadius: '14px',
                fontSize: '0.85rem',
                fontWeight: 800,
                color: '#475569',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.2s'
              }}
            >
              <Edit3 size={16} /> Edit Specs
            </button>
            <button 
              onClick={() => onDeleteSKU(selectedProduct)}
              style={{
                background: '#fff1f2',
                border: '1.5px solid #ffe4e6',
                padding: '12px',
                borderRadius: '14px',
                fontSize: '0.85rem',
                fontWeight: 800,
                color: '#e11d48',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.2s'
              }}
            >
              <Trash2 size={16} /> Delete SKU
            </button>
          </div>

          {/* Status and Ledger Highlights Card */}
          <div style={{ background: '#f8fafc', border: '1.5px solid #f1f5f9', borderRadius: '24px', padding: '24px', marginBottom: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px dashed #e2e8f0', paddingBottom: '16px', marginBottom: '16px' }}>
              <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 700 }}>Stock Availability</span>
              <span style={{ fontSize: '1.4rem', fontWeight: 950, color: selectedProduct.stockQty <= 0 ? '#e11d48' : selectedProduct.stockQty <= selectedProduct.minStockLevel ? '#d97706' : '#059669' }}>
                {selectedProduct.stockQty} U
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px dashed #e2e8f0', paddingBottom: '16px', marginBottom: '16px' }}>
              <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 700 }}>Unit Catalog Price</span>
              <span style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a' }}>
                ₹{selectedProduct.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 700 }}>Minimum Stock Alert Level</span>
              <span style={{ fontSize: '1.0rem', fontWeight: 800, color: '#1e293b' }}>
                {selectedProduct.minStockLevel} U
              </span>
            </div>
          </div>

          {/* Specs List */}
          <h3 style={{ fontSize: '0.85rem', fontWeight: 850, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px' }}>
            Specification Metadata
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '32px' }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <Layers size={16} color="#94a3b8" style={{ marginTop: '3px' }} />
              <div>
                <span style={{ display: 'block', fontSize: '0.74rem', color: '#94a3b8', fontWeight: 700 }}>Classification Category</span>
                <span style={{ fontSize: '0.88rem', color: '#1e293b', fontWeight: 800 }}>{selectedProduct.category?.name || 'Unassigned'}</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <Calendar size={16} color="#94a3b8" style={{ marginTop: '3px' }} />
              <div>
                <span style={{ display: 'block', fontSize: '0.74rem', color: '#94a3b8', fontWeight: 700 }}>Standard UPC/Barcode Code</span>
                <span style={{ fontSize: '0.88rem', color: '#1e293b', fontWeight: 800 }}>{selectedProduct.barcode || 'None Registered'}</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <ShieldCheck size={16} color="#94a3b8" style={{ marginTop: '3px' }} />
              <div>
                <span style={{ display: 'block', fontSize: '0.74rem', color: '#94a3b8', fontWeight: 700 }}>System Integrity Status</span>
                <span style={{ fontSize: '0.88rem', color: '#1e293b', fontWeight: 800 }}>
                  {selectedProduct.status === 'ACTIVE' ? 'Trading Enabled' : 'Temporarily Archived'}
                </span>
              </div>
            </div>
          </div>

          {/* Adjust Stock Trigger */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '0.85rem', fontWeight: 850, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>
              Stock adjustment log
            </h3>
            <button 
              onClick={() => onRecordAdjustment(selectedProduct)}
              style={{
                background: '#6366f1',
                border: 'none',
                color: '#ffffff',
                padding: '8px 16px',
                borderRadius: '10px',
                fontSize: '0.78rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Plus size={14} /> Record Adjustment
            </button>
          </div>

          {/* Stock Ledger Timeline */}
          {selectedProduct.ledger && selectedProduct.ledger.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {selectedProduct.ledger.map((entry) => (
                <div 
                  key={entry.id} 
                  style={{ 
                    background: '#ffffff', 
                    border: '1.5px solid #f1f5f9', 
                    borderRadius: '16px', 
                    padding: '16px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <span style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: '#1e293b' }}>
                      {entry.label}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>
                      {entry.date}
                    </span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span 
                      style={{ 
                        fontSize: '0.95rem', 
                        fontWeight: 900,
                        color: entry.isCredit ? '#059669' : '#dc2626',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      {entry.isCredit ? <ArrowUpRight size={16} /> : <ArrowDownLeft size={16} />}
                      {entry.isCredit ? '+' : '-'}{entry.amount} U
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ background: '#f8fafc', border: '1.5px dashed #e2e8f0', borderRadius: '16px', padding: '24px', textAlign: 'center', color: '#64748b', fontSize: '0.8rem', fontWeight: 600 }}>
              No historical ledger transaction logs found
            </div>
          )}
        </div>
      </div>
    </>
  );
};
