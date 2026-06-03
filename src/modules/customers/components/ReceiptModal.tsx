import React from 'react';
import { X } from 'lucide-react';

interface LedgerEntry {
  id: string;
  date: string;
  type: 'invoice' | 'receipt';
  label: string;
  amount: number;
  isCredit: boolean;
}

interface Customer {
  id: string;
  name: string;
  currentBalance: number;
  ledger: LedgerEntry[];
}

interface ReceiptModalProps {
  showReceiptModal: boolean;
  setShowReceiptModal: (show: boolean) => void;
  selectedCustomer: Customer | null;
  receiptAmount: string;
  setReceiptAmount: (val: string) => void;
  receiptRef: string;
  setReceiptRef: (val: string) => void;
  receiptNotes: string;
  setReceiptNotes: (val: string) => void;
  handleRecordReceipt: (e: React.FormEvent) => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  showReceiptModal,
  setShowReceiptModal,
  selectedCustomer,
  receiptAmount,
  setReceiptAmount,
  receiptRef,
  setReceiptRef,
  receiptNotes,
  setReceiptNotes,
  handleRecordReceipt,
}) => {
  if (!showReceiptModal || !selectedCustomer) return null;

  return (
    <div className="premium-modal-overlay">
      <div className="premium-modal-content" style={{ maxWidth: '440px' }}>
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid #f1f5f9',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <h2 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>
            Record Customer Payment Receipt
          </h2>
          <button
            onClick={() => setShowReceiptModal(false)}
            style={{
              border: 'none',
              background: '#f1f5f9',
              width: '30px',
              height: '30px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#64748b',
            }}
          >
            <X size={14} />
          </button>
        </div>

        <form onSubmit={handleRecordReceipt} style={{ padding: '24px' }}>
          <div
            style={{
              background: '#f0fdf4',
              border: '1px solid #dcfce7',
              borderRadius: '14px',
              padding: '14px 16px',
              marginBottom: '20px',
            }}
          >
            <span
              style={{
                fontSize: '0.72rem',
                color: '#166534',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
              }}
            >
              Current Receivable Balance
            </span>
            <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#15803d', marginTop: '2px' }}>
              ₹
              {selectedCustomer.currentBalance.toLocaleString('en-IN', {
                minimumFractionDigits: 2,
              })}
            </div>
          </div>

          <div className="premium-input-group">
            <label>Amount Received (₹) *</label>
            <input
              type="number"
              className="premium-input"
              placeholder="e.g. 50000"
              value={receiptAmount}
              onChange={(e) => setReceiptAmount(e.target.value)}
              max={selectedCustomer.currentBalance}
              required
            />
          </div>

          <div className="premium-input-group">
            <label>Transaction Ref / Receipt Code</label>
            <input
              type="text"
              className="premium-input"
              placeholder="e.g. UPI Ref 990142"
              value={receiptRef}
              onChange={(e) => setReceiptRef(e.target.value)}
            />
          </div>

          <div className="premium-input-group">
            <label>Payment Mode / Reference Memo</label>
            <input
              type="text"
              className="premium-input"
              placeholder="e.g. NEFT Bank Transfer from HDFC"
              value={receiptNotes}
              onChange={(e) => setReceiptNotes(e.target.value)}
            />
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '12px',
              marginTop: '20px',
            }}
          >
            <button
              type="button"
              onClick={() => setShowReceiptModal(false)}
              style={{
                padding: '11px 18px',
                background: '#f1f5f9',
                border: 'none',
                borderRadius: '10px',
                fontWeight: 700,
                fontSize: '0.82rem',
                color: '#475569',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                padding: '11px 22px',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                border: 'none',
                borderRadius: '10px',
                fontWeight: 700,
                fontSize: '0.82rem',
                color: '#ffffff',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)',
              }}
            >
              Record Receipt
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
