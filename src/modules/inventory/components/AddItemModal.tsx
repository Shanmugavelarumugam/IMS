import React, { useState } from 'react';
import { X } from 'lucide-react';

interface AddItemModalProps {
  onClose: () => void;
  onSubmit: (
    sku: string,
    name: string,
    category: string,
    qty: string,
    price: string,
    minStock: string,
    warehouse: string
  ) => void;
}

export const AddItemModal: React.FC<AddItemModalProps> = ({
  onClose,
  onSubmit
}) => {
  const [addSku, setAddSku] = useState('');
  const [addName, setAddName] = useState('');
  const [addCategory, setAddCategory] = useState('Hardware & Devices');
  const [addQty, setAddQty] = useState('');
  const [addPrice, setAddPrice] = useState('');
  const [addMinStock, setAddMinStock] = useState('10');
  const [addWarehouse, setAddWarehouse] = useState('Mumbai Central Hub');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(
      addSku,
      addName,
      addCategory,
      addQty,
      addPrice,
      addMinStock,
      addWarehouse
    );
  };

  return (
    <div className="premium-modal-overlay">
      <div className="premium-modal-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>Register Inventory Item</h2>
          <button 
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', outline: 'none' }}
          >
            <X size={22} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '0.74rem', color: '#64748b', fontWeight: 800, textTransform: 'uppercase', marginBottom: '6px' }}>SKU Code</label>
              <input 
                type="text" 
                value={addSku}
                onChange={(e) => setAddSku(e.target.value)}
                placeholder="e.g. SKU-DELL-32"
                style={{
                  width: '100%', padding: '12px 14px', borderRadius: '12px', border: '1.5px solid #e2e8f0',
                  fontSize: '0.88rem', fontWeight: 700, color: '#1e293b', outline: 'none', boxSizing: 'border-box',
                  fontFamily: 'monospace'
                }}
              />
            </div>
            <div style={{ flex: 2 }}>
              <label style={{ display: 'block', fontSize: '0.74rem', color: '#64748b', fontWeight: 800, textTransform: 'uppercase', marginBottom: '6px' }}>Item Name</label>
              <input 
                type="text" 
                value={addName}
                onChange={(e) => setAddName(e.target.value)}
                placeholder="Dell UltraSharp 32'' Monitor"
                style={{
                  width: '100%', padding: '12px 14px', borderRadius: '12px', border: '1.5px solid #e2e8f0',
                  fontSize: '0.88rem', fontWeight: 650, color: '#1e293b', outline: 'none', boxSizing: 'border-box'
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.74rem', color: '#64748b', fontWeight: 800, textTransform: 'uppercase', marginBottom: '6px' }}>Category</label>
            <select 
              value={addCategory} 
              onChange={(e) => setAddCategory(e.target.value)}
              style={{
                width: '100%', padding: '12px 14px', borderRadius: '12px', border: '1.5px solid #e2e8f0',
                fontSize: '0.88rem', fontWeight: 700, color: '#1e293b', outline: 'none', boxSizing: 'border-box'
              }}
            >
              <option value="Hardware & Devices">Hardware & Devices</option>
              <option value="Office Peripherals">Office Peripherals</option>
              <option value="Cloud & Infrastructure">Cloud & Infrastructure</option>
              <option value="Corporate Workspace">Corporate Workspace</option>
              <option value="Enterprise Software">Enterprise Software</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '0.74rem', color: '#64748b', fontWeight: 800, textTransform: 'uppercase', marginBottom: '6px' }}>Initial Qty</label>
              <input 
                type="number" 
                value={addQty}
                onChange={(e) => setAddQty(e.target.value)}
                placeholder="e.g. 50"
                style={{
                  width: '100%', padding: '12px 14px', borderRadius: '12px', border: '1.5px solid #e2e8f0',
                  fontSize: '0.88rem', fontWeight: 650, color: '#1e293b', outline: 'none', boxSizing: 'border-box'
                }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '0.74rem', color: '#64748b', fontWeight: 800, textTransform: 'uppercase', marginBottom: '6px' }}>Unit Price (₹)</label>
              <input 
                type="number" 
                value={addPrice}
                onChange={(e) => setAddPrice(e.target.value)}
                placeholder="e.g. 74900"
                style={{
                  width: '100%', padding: '12px 14px', borderRadius: '12px', border: '1.5px solid #e2e8f0',
                  fontSize: '0.88rem', fontWeight: 650, color: '#1e293b', outline: 'none', boxSizing: 'border-box'
                }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '0.74rem', color: '#64748b', fontWeight: 800, textTransform: 'uppercase', marginBottom: '6px' }}>Min Stock level</label>
              <input 
                type="number" 
                value={addMinStock}
                onChange={(e) => setAddMinStock(e.target.value)}
                style={{
                  width: '100%', padding: '12px 14px', borderRadius: '12px', border: '1.5px solid #e2e8f0',
                  fontSize: '0.88rem', fontWeight: 650, color: '#1e293b', outline: 'none', boxSizing: 'border-box'
                }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '0.74rem', color: '#64748b', fontWeight: 800, textTransform: 'uppercase', marginBottom: '6px' }}>Initial Depot</label>
              <select 
                value={addWarehouse} 
                onChange={(e) => setAddWarehouse(e.target.value)}
                style={{
                  width: '100%', padding: '12px 14px', borderRadius: '12px', border: '1.5px solid #e2e8f0',
                  fontSize: '0.88rem', fontWeight: 700, color: '#1e293b', outline: 'none', boxSizing: 'border-box'
                }}
              >
                <option value="Mumbai Central Hub">Mumbai Central Hub</option>
                <option value="Bangalore Tech Park Depot">Bangalore Tech Park Depot</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button 
              type="button" 
              onClick={onClose}
              style={{
                flex: 1, padding: '14px', borderRadius: '14px', border: '1.5px solid #e2e8f0',
                background: '#ffffff', color: '#475569', fontWeight: 700, fontSize: '0.88rem',
                cursor: 'pointer', outline: 'none'
              }}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              style={{
                flex: 2, padding: '14px', borderRadius: '14px', border: 'none',
                background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', color: '#ffffff',
                fontWeight: 800, fontSize: '0.88rem', cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(99, 102, 241, 0.2)', outline: 'none'
              }}
            >
              Register Item
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
