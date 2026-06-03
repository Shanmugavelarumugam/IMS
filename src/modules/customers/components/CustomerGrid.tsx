import React from 'react';
import { UserRound, Phone, Mail, Calendar, Edit3 } from 'lucide-react';

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
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  currentBalance: number;
  creditLimit: number;
  type: 'Distributor' | 'Wholesaler' | 'Retail Partner' | 'Key Account';
  rating: number;
  totalOrders: number;
  lastOrderDate: string;
  ledger: LedgerEntry[];
}

interface CustomerGridProps {
  filteredCustomers: Customer[];
  formatRelativeDate: (date: string) => string;
  setSelectedCustomer: (cust: Customer) => void;
  handleOpenEdit: (cust: Customer) => void;
}

export const CustomerGrid: React.FC<CustomerGridProps> = ({
  filteredCustomers,
  formatRelativeDate,
  setSelectedCustomer,
  handleOpenEdit,
}) => {
  return (
    <div className="customer-grid">
      {filteredCustomers.map((cust) => {
        const utilizationRatio =
          cust.creditLimit > 0 ? (cust.currentBalance / cust.creditLimit) * 100 : 0;
        const isHighRisk = utilizationRatio > 70;
        return (
          <div
            key={cust.id}
            className="customer-card-premium"
            onClick={() => setSelectedCustomer(cust)}
          >
            {/* Card Header */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '16px',
              }}
            >
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 850, color: '#0f172a', margin: '0 0 4px' }}>
                  {cust.name}
                </h3>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    color: '#64748b',
                    fontSize: '0.8rem',
                    fontWeight: 650,
                  }}
                >
                  <span
                    className={`type-pill ${
                      cust.type === 'Key Account'
                        ? 'type-key'
                        : cust.type === 'Distributor'
                          ? 'type-distributor'
                          : cust.type === 'Wholesaler'
                            ? 'type-wholesaler'
                            : 'type-retail'
                    }`}
                  >
                    {cust.type}
                  </span>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      color: '#94a3b8',
                    }}
                  >
                    <Calendar size={12} />
                    {formatRelativeDate(cust.lastOrderDate)}
                  </div>
                </div>
              </div>
              <button
                className="table-action-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpenEdit(cust);
                }}
              >
                <Edit3 size={14} />
              </button>
            </div>

            {/* Card Body Contacts */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                marginBottom: '20px',
                fontSize: '0.82rem',
                color: '#475569',
                fontWeight: 600,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <UserRound size={14} color="#94a3b8" />
                <span>{cust.contactPerson}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Phone size={14} color="#94a3b8" />
                <span>{cust.phone}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Mail size={14} color="#94a3b8" />
                <span
                  style={{
                    textOverflow: 'ellipsis',
                    overflowX: 'auto',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {cust.email}
                </span>
              </div>
            </div>

            {/* Credit Limit / Utilization */}
            <div style={{ marginBottom: '16px' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '0.74rem',
                  color: '#64748b',
                  fontWeight: 800,
                  marginBottom: '6px',
                }}
              >
                <span>CREDIT UTILIZATION</span>
                <span style={isHighRisk ? { color: '#dc2626' } : {}}>
                  {utilizationRatio.toFixed(0)}% Used
                </span>
              </div>
              <div style={{ height: '6px', background: '#f1f5f9', borderRadius: '10px', overflowX: 'auto' }}>
                <div
                  style={{
                    width: `${Math.min(100, utilizationRatio)}%`,
                    height: '100%',
                    background: isHighRisk
                      ? '#ef4444'
                      : 'linear-gradient(90deg, #6366f1, #9333ea)',
                    borderRadius: '10px',
                  }}
                ></div>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '0.72rem',
                  color: '#94a3b8',
                  fontWeight: 600,
                  marginTop: '4px',
                }}
              >
                <span>Limit: ₹{cust.creditLimit.toLocaleString('en-IN')}</span>
                <span>Orders: {cust.totalOrders}</span>
              </div>
            </div>

            {/* Card Ledger Receivable Summary */}
            <div className="receivable-pill-premium">
              <div>
                <div
                  style={{
                    fontSize: '0.68rem',
                    color: '#64748b',
                    fontWeight: 850,
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                  }}
                >
                  Outstanding Credit
                </div>
                <div style={{ fontSize: '0.74rem', color: '#94a3b8', fontWeight: 600 }}>
                  Active trading liability
                </div>
              </div>
              <div className={`receivable-value ${cust.currentBalance > 0 ? 'positive' : 'neutral'}`}>
                ₹{cust.currentBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
