import React, { useState } from 'react';
import { X } from 'lucide-react';
import type { Supplier } from '../types';

interface SupplierFormModalProps {
  editingSupplier: Supplier | null;
  onClose: () => void;
  onSubmit: (
    name: string,
    contact: string,
    email: string,
    phone: string,
    type: string,
    rating: string,
    address: string
  ) => void;
}

export const SupplierFormModal: React.FC<SupplierFormModalProps> = ({
  editingSupplier,
  onClose,
  onSubmit
}) => {
  const [formName, setFormName] = useState(editingSupplier?.name || '');
  const [formContact, setFormContact] = useState(editingSupplier?.contactPerson || '');
  const [formEmail, setFormEmail] = useState(editingSupplier?.email || '');
  const [formPhone, setFormPhone] = useState(editingSupplier?.phone || '');
  const [formType, setFormType] = useState(editingSupplier?.type || 'OEM Manufacturer');
  const [formRating, setFormRating] = useState(editingSupplier?.rating.toString() || '4.5');
  const [formAddress, setFormAddress] = useState(editingSupplier?.address || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(
      formName,
      formContact,
      formEmail,
      formPhone,
      formType,
      formRating,
      formAddress
    );
  };

  return (
    <div className="premium-modal-overlay">
      <div className="premium-modal-content">
        <div style={{ 
          padding: '24px 30px', 
          borderBottom: '1px solid #f1f5f9', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          background: '#f8fafc' 
        }}>
          <h3 style={{ margin: 0, fontWeight: 900, fontSize: '1.25rem', color: '#0f172a', letterSpacing: '-0.02em' }}>
            {editingSupplier ? 'Edit Supplier' : 'Add Supplier'}
          </h3>
          <button 
            onClick={onClose}
            style={{ background: '#ffffff', border: '1px solid #e2e8f0', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b' }}
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '30px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            
            {/* Name & Contact */}
            <div className="form-grid">
              <div className="premium-input-group">
                <label>Supplier Name *</label>
                <input 
                  type="text" 
                  required
                  placeholder="Apex Core Corp"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="premium-field"
                />
              </div>
              
              <div className="premium-input-group">
                <label>Primary Contact</label>
                <input 
                  type="text" 
                  placeholder="Sarah Jenkins"
                  value={formContact}
                  onChange={(e) => setFormContact(e.target.value)}
                  className="premium-field"
                />
              </div>
            </div>

            {/* Email & Phone */}
            <div className="form-grid">
              <div className="premium-input-group">
                <label>Email Address</label>
                <input 
                  type="email" 
                  placeholder="admin@corp.com"
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  className="premium-field"
                />
              </div>
              
              <div className="premium-input-group">
                <label>Phone Number</label>
                <input 
                  type="text" 
                  placeholder="+1 (555) 019-2834"
                  value={formPhone}
                  onChange={(e) => setFormPhone(e.target.value)}
                  className="premium-field"
                />
              </div>
            </div>

            {/* Type & Rating */}
            <div className="form-grid">
              <div className="premium-input-group">
                <label>Supplier Type</label>
                <select 
                  value={formType}
                  onChange={(e) => setFormType(e.target.value)}
                  className="premium-field"
                  style={{ cursor: 'pointer' }}
                >
                  <option value="Manufacturer">Manufacturer</option>
                  <option value="Distributor">Distributor</option>
                  <option value="Wholesaler">Wholesaler</option>
                  <option value="Logistics">Logistics</option>
                  <option value="Raw Materials">Raw Materials</option>
                  <option value="OEM Manufacturer">OEM Manufacturer</option>
                  <option value="Technology OEM">Technology OEM</option>
                  <option value="Third-Party Logistics">Third-Party Logistics</option>
                  <option value="Logistics Broker">Logistics Broker</option>
                </select>
              </div>
              
              <div className="premium-input-group">
                <label>Supplier Rating (optional)</label>
                <input 
                  type="number" 
                  step="0.1"
                  min="1"
                  max="5"
                  placeholder="4.5"
                  value={formRating}
                  onChange={(e) => setFormRating(e.target.value)}
                  className="premium-field"
                />
              </div>
            </div>

            {/* HQ Address */}
            <div className="premium-input-group">
              <label>Business Address</label>
              <textarea 
                rows={2}
                placeholder="1044 Industrial Parkway, Suite 7, Chicago, IL"
                value={formAddress}
                onChange={(e) => setFormAddress(e.target.value)}
                className="premium-field"
                style={{ fontFamily: 'inherit', resize: 'vertical' }}
              />
            </div>

          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '28px', borderTop: '1px solid #f1f5f9', paddingTop: '20px' }}>
            <button 
              type="button"
              onClick={onClose}
              style={{ background: '#ffffff', color: '#475569', border: '1.5px solid #e2e8f0', padding: '12px 20px', borderRadius: '12px', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer' }}
            >
              Cancel
            </button>
            <button 
              type="submit"
              style={{ background: 'var(--primary-glow)', color: '#ffffff', border: 'none', padding: '12px 24px', borderRadius: '12px', fontWeight: 800, fontSize: '0.9rem', cursor: 'pointer', boxShadow: '0 4px 12px rgba(99, 102, 241, 0.2)' }}
            >
              Save Supplier
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
