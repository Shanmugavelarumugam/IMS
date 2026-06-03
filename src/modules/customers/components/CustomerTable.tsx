import React from 'react';
import { Calendar, Edit3 } from 'lucide-react';

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

interface CustomerTableProps {
  filteredCustomers: Customer[];
  formatRelativeDate: (date: string) => string;
  setSelectedCustomer: (cust: Customer) => void;
  handleOpenEdit: (cust: Customer) => void;
}

export const CustomerTable: React.FC<CustomerTableProps> = ({
  filteredCustomers,
  formatRelativeDate,
  setSelectedCustomer,
  handleOpenEdit,
}) => {
  return (
    <div className="premium-table-container">
      <table className="premium-table">
        <thead>
          <tr>
            <th>Customer</th>
            <th>Category</th>
            <th>Risk Level</th>
            <th>Status</th>
            <th>Amount Due</th>
            <th>Credit Limit</th>
            <th>Last Purchase</th>
            <th style={{ textAlign: 'center' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredCustomers.map((cust) => {
            const utilRatio = cust.creditLimit > 0 ? cust.currentBalance / cust.creditLimit : 0;
            let risk = 'Low';
            let riskColor = '#10b981';
            let riskBg = '#ecfdf5';
            if (utilRatio > 0.7) {
              risk = 'High';
              riskColor = '#ef4444';
              riskBg = '#fef2f2';
            } else if (utilRatio > 0.4) {
              risk = 'Medium';
              riskColor = '#f59e0b';
              riskBg = '#fffbeb';
            }

            let status = 'Paid';
            let statusColor = '#10b981';
            if (cust.currentBalance > 0 && utilRatio > 0.7) {
              status = 'Overdue';
              statusColor = '#ef4444';
            } else if (cust.currentBalance > 0) {
              status = 'Partial';
              statusColor = '#f59e0b';
            }

            return (
              <tr
                key={cust.id}
                style={{ cursor: 'pointer' }}
                onClick={() => setSelectedCustomer(cust)}
              >
                <td style={{ fontWeight: 850 }}>
                  <div style={{ color: '#0f172a' }}>{cust.name}</div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600, marginTop: '2px' }}>
                    {cust.contactPerson}
                  </div>
                </td>
                <td>
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
                </td>
                <td>
                  <span
                    style={{
                      background: riskBg,
                      color: riskColor,
                      padding: '4px 8px',
                      borderRadius: '6px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                    }}
                  >
                    {risk} Risk
                  </span>
                </td>
                <td>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      color: statusColor,
                      fontWeight: 700,
                      fontSize: '0.85rem',
                    }}
                  >
                    <div
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: statusColor,
                      }}
                    ></div>
                    {status}
                  </div>
                </td>
                <td
                  style={{
                    color: cust.currentBalance > 0 ? '#b91c1c' : '#16a34a',
                    fontWeight: 850,
                  }}
                >
                  ₹{cust.currentBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </td>
                <td style={{ color: '#64748b' }}>
                  ₹{cust.creditLimit.toLocaleString('en-IN')}
                </td>
                <td>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      color: '#64748b',
                      fontWeight: 650,
                    }}
                  >
                    <Calendar size={14} />
                    {formatRelativeDate(cust.lastOrderDate)}
                  </div>
                </td>
                <td onClick={(e) => e.stopPropagation()}>
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                    <button className="table-action-btn" onClick={() => handleOpenEdit(cust)}>
                      <Edit3 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
