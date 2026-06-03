import React from 'react';
import type { SalesOrder } from '../types';

interface SalesTableProps {
  filteredSales: SalesOrder[];
  onSelectOrder: (order: SalesOrder) => void;
}

export const SalesTable: React.FC<SalesTableProps> = ({
  filteredSales,
  onSelectOrder,
}) => {
  return (
    <div className="premium-table-container">
      <table className="premium-table">
        <thead>
          <tr>
            <th>Order Number</th>
            <th>Client Name</th>
            <th>Payment Mode</th>
            <th>Created Date</th>
            <th>Dispatch Due</th>
            <th>Total Valuation</th>
            <th>Discount</th>
            <th style={{ textAlign: 'right' }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredSales.map((s) => (
            <tr key={s.id} onClick={() => onSelectOrder(s)}>
              <td style={{ fontFamily: 'monospace', color: '#6366f1', fontWeight: 800, fontSize: '0.8rem' }}>{s.orderNumber}</td>
              <td>{s.customerName}</td>
              <td style={{ color: '#475569', fontWeight: 650 }}>{s.paymentMode}</td>
              <td>{s.createdAt}</td>
              <td>{s.dispatchDate}</td>
              <td style={{ fontWeight: 850, color: '#059669' }}>₹{s.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
              <td style={{ color: '#e11d48' }}>{s.discountPercentage}%</td>
              <td style={{ textAlign: 'right' }}>
                <span className={`status-badge ${s.status === 'COMPLETED' ? 'completed' : s.status === 'CANCELLED' ? 'cancelled' : 'pending'}`}>
                  {s.status === 'PENDING_DISPATCH' ? 'Pending Dispatch' : s.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
