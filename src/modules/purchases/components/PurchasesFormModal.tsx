import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';
import type { POItem } from '../types';

interface PurchasesFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    supplierName: string;
    warehouseBranch: string;
    deliveryDate: string;
    items: POItem[];
    notes: string;
  }) => void;
  onErrorToast: (msg: string) => void;
}

export const PurchasesFormModal: React.FC<PurchasesFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  onErrorToast,
}) => {
  const [formSupplier, setFormSupplier] = useState('Acme Hardware Corporates');
  const [formBranch, setFormBranch] = useState('Mumbai Central Hub');
  const [formDeliveryDate, setFormDeliveryDate] = useState('');
  const [formNotes, setFormNotes] = useState('');
  const [formItems, setFormItems] = useState<POItem[]>([
    { name: 'MacBook Pro 16" M3 Max', qty: 5, unitPrice: 289900 }
  ]);

  if (!isOpen) return null;

  const addFormItemField = () => {
    setFormItems([...formItems, { name: '', qty: 1, unitPrice: 1000 }]);
  };

  const removeFormItemField = (idx: number) => {
    if (formItems.length === 1) return;
    setFormItems(formItems.filter((_, i) => i !== idx));
  };

  const updateFormItemField = (idx: number, field: keyof POItem, value: string | number) => {
    const next = formItems.map((item, i) => {
      if (i === idx) {
        return { ...item, [field]: value };
      }
      return item;
    });
    setFormItems(next);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formItems.some(i => !i.name.trim() || i.qty <= 0 || i.unitPrice <= 0)) {
      onErrorToast('Please configure valid items, quantities, and prices');
      return;
    }

    onSubmit({
      supplierName: formSupplier,
      warehouseBranch: formBranch,
      deliveryDate: formDeliveryDate,
      items: formItems,
      notes: formNotes.trim(),
    });

    // Reset
    setFormItems([{ name: 'MacBook Pro 16" M3 Max', qty: 5, unitPrice: 289900 }]);
    setFormNotes('');
    setFormDeliveryDate('');
  };

  return (
    <div className="premium-modal-overlay">
      <div className="premium-modal-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>Create Purchase Order</h2>
          <button 
            type="button"
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', outline: 'none' }}
          >
            <X size={22} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ maxHeight: '420px', overflowY: 'auto', paddingRight: '6px' }}>
          <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '0.74rem', color: '#64748b', fontWeight: 800, textTransform: 'uppercase', marginBottom: '6px' }}>Supplier / Vendor</label>
              <select 
                value={formSupplier} 
                onChange={(e) => setFormSupplier(e.target.value)}
                style={{
                  width: '100%', padding: '12px 14px', borderRadius: '12px', border: '1.5px solid #e2e8f0',
                  fontSize: '0.88rem', fontWeight: 700, color: '#1e293b', outline: 'none', boxSizing: 'border-box'
                }}
              >
                <option value="Acme Hardware Corporates">Acme Hardware Corporates</option>
                <option value="Logitech Retail Distributors">Logitech Retail Distributors</option>
                <option value="Global SaaS Providers">Global SaaS Providers</option>
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '0.74rem', color: '#64748b', fontWeight: 800, textTransform: 'uppercase', marginBottom: '6px' }}>Target Warehouse</label>
              <select 
                value={formBranch} 
                onChange={(e) => setFormBranch(e.target.value)}
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

          <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '0.74rem', color: '#64748b', fontWeight: 800, textTransform: 'uppercase', marginBottom: '6px' }}>Delivery Target</label>
              <input 
                type="date" 
                value={formDeliveryDate}
                onChange={(e) => setFormDeliveryDate(e.target.value)}
                style={{
                  width: '100%', padding: '12px 14px', borderRadius: '12px', border: '1.5px solid #e2e8f0',
                  fontSize: '0.88rem', fontWeight: 700, color: '#1e293b', outline: 'none', boxSizing: 'border-box'
                }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '0.74rem', color: '#64748b', fontWeight: 800, textTransform: 'uppercase', marginBottom: '6px' }}>Internal Notes</label>
              <input 
                type="text" 
                value={formNotes}
                onChange={(e) => setFormNotes(e.target.value)}
                placeholder="Ref. setups/cycles..."
                style={{
                  width: '100%', padding: '12px 14px', borderRadius: '12px', border: '1.5px solid #e2e8f0',
                  fontSize: '0.88rem', fontWeight: 650, color: '#1e293b', outline: 'none', boxSizing: 'border-box'
                }}
              />
            </div>
          </div>

          {/* Items Dynamic Group */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h4 style={{ fontSize: '0.8rem', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 800, margin: 0 }}>Configure Line Items</h4>
            <button 
              type="button" 
              onClick={addFormItemField}
              style={{
                background: 'none', border: 'none', color: '#6366f1', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer', outline: 'none', display: 'flex', alignItems: 'center', gap: '4px'
              }}
            >
              <Plus size={14} /> Add Item
            </button>
          </div>

          {formItems.map((item, idx) => (
            <div key={idx} style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '12px' }}>
              <input 
                type="text" 
                placeholder="Product Name"
                value={item.name}
                onChange={(e) => updateFormItemField(idx, 'name', e.target.value)}
                style={{
                  flex: 2, padding: '10px 12px', borderRadius: '10px', border: '1.5px solid #e2e8f0',
                  fontSize: '0.84rem', fontWeight: 650, color: '#1e293b', outline: 'none', boxSizing: 'border-box'
                }}
              />
              <input 
                type="number" 
                placeholder="Qty"
                value={item.qty}
                onChange={(e) => updateFormItemField(idx, 'qty', parseInt(e.target.value, 10) || 0)}
                style={{
                  width: '60px', padding: '10px 12px', borderRadius: '10px', border: '1.5px solid #e2e8f0',
                  fontSize: '0.84rem', fontWeight: 700, color: '#1e293b', outline: 'none', boxSizing: 'border-box'
                }}
              />
              <input 
                type="number" 
                placeholder="Unit Price"
                value={item.unitPrice}
                onChange={(e) => updateFormItemField(idx, 'unitPrice', parseFloat(e.target.value) || 0)}
                style={{
                  width: '100px', padding: '10px 12px', borderRadius: '10px', border: '1.5px solid #e2e8f0',
                  fontSize: '0.84rem', fontWeight: 700, color: '#1e293b', outline: 'none', boxSizing: 'border-box'
                }}
              />
              <button 
                type="button" 
                onClick={() => removeFormItemField(idx)}
                disabled={formItems.length === 1}
                style={{
                  background: 'none', border: 'none', color: formItems.length === 1 ? '#cbd5e1' : '#be123c', cursor: 'pointer', padding: '6px', outline: 'none'
                }}
              >
                <X size={16} />
              </button>
            </div>
          ))}

          <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
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
              Create Purchase Order
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
