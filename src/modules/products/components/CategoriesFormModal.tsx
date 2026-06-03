import React from 'react';
import { X } from 'lucide-react';
import type { Category } from '../types';

interface CategoriesFormModalProps {
  editingCategory: Category | null;
  formName: string;
  formCode: string;
  formDesc: string;
  formTax: string;
  formStatus: 'ACTIVE' | 'INACTIVE';
  formNotes: string;
  onFormNameChange: (v: string) => void;
  onFormCodeChange: (v: string) => void;
  onFormDescChange: (v: string) => void;
  onFormTaxChange: (v: string) => void;
  onFormStatusChange: (v: 'ACTIVE' | 'INACTIVE') => void;
  onFormNotesChange: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '12px 14px', borderRadius: '12px', border: '1.5px solid #e2e8f0',
  fontSize: '0.88rem', fontWeight: 650, color: '#1e293b', outline: 'none', boxSizing: 'border-box'
};

const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: '0.74rem', color: '#64748b', fontWeight: 800,
  textTransform: 'uppercase', marginBottom: '6px'
};

export const CategoriesFormModal: React.FC<CategoriesFormModalProps> = ({
  editingCategory,
  formName, formCode, formDesc, formTax, formStatus, formNotes,
  onFormNameChange, onFormCodeChange, onFormDescChange,
  onFormTaxChange, onFormStatusChange, onFormNotesChange,
  onSubmit, onClose
}) => {
  return (
    <div className="cat-premium-modal-overlay">
      <div className="cat-premium-modal-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>
            {editingCategory ? 'Modify Category' : 'Register New Category'}
          </h2>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', outline: 'none' }}
          >
            <X size={22} />
          </button>
        </div>

        <form onSubmit={onSubmit}>
          <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
            <div style={{ flex: 2 }}>
              <label style={labelStyle}>Category Name</label>
              <input
                type="text"
                value={formName}
                onChange={(e) => onFormNameChange(e.target.value)}
                placeholder="e.g. Storage Inbound Nodes"
                style={inputStyle}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Code</label>
              <input
                type="text"
                value={formCode}
                onChange={(e) => onFormCodeChange(e.target.value)}
                style={{ ...inputStyle, fontFamily: 'monospace', fontWeight: 700, color: '#475569' }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>Tax Rate Bracket</label>
            <select
              value={formTax}
              onChange={(e) => onFormTaxChange(e.target.value)}
              style={{ ...inputStyle, fontWeight: 700 }}
            >
              <option value="0">0% (Exempt)</option>
              <option value="5">5% GST (Essential Goods)</option>
              <option value="12">12% GST (Physical Utilities)</option>
              <option value="18">18% GST (Standard Services/HW)</option>
              <option value="28">28% GST (Luxury Items)</option>
            </select>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>Description</label>
            <textarea
              rows={3}
              value={formDesc}
              onChange={(e) => onFormDescChange(e.target.value)}
              placeholder="Summarize taxonomy scope..."
              style={{ ...inputStyle, fontFamily: 'inherit', resize: 'none', fontWeight: 600 }}
            />
          </div>

          <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Status</label>
              <select
                value={formStatus}
                onChange={(e) => onFormStatusChange(e.target.value as 'ACTIVE' | 'INACTIVE')}
                style={{ ...inputStyle, fontWeight: 700 }}
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
              </select>
            </div>
            <div style={{ flex: 2 }}>
              <label style={labelStyle}>Internal Note</label>
              <input
                type="text"
                value={formNotes}
                onChange={(e) => onFormNotesChange(e.target.value)}
                placeholder="Internal tags/warnings..."
                style={inputStyle}
              />
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
              Save Category
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
