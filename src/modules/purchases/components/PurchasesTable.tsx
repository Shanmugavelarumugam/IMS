import React from 'react';
import type { PurchaseOrder } from '../types';

interface PurchasesTableProps {
  filteredPOs: PurchaseOrder[];
  onSelectPO: (po: PurchaseOrder) => void;
}

export const PurchasesTable: React.FC<PurchasesTableProps> = ({
  filteredPOs,
  onSelectPO,
}) => {
  return (
    <div className="premium-table-container">
      <table className="premium-table">
        <thead>
          <tr>
            <th>PO Number</th>
            <th>Supplier Vendor</th>
            <th>Warehouse Branch</th>
            <th>Created Date</th>
            <th>Delivery Due</th>
            <th>Items Qty</th>
            <th>Total Valuation</th>
            <th style={{ textAlign: 'right' }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredPOs.map((po) => (
            <tr key={po.id} onClick={() => onSelectPO(po)}>
              <td style={{ fontFamily: 'monospace', color: '#6366f1', fontWeight: 800, fontSize: '0.8rem' }}>{po.poNumber}</td>
              <td>{po.supplierName}</td>
              <td style={{ color: '#475569', fontWeight: 650 }}>{po.warehouseBranch}</td>
              <td>{po.createdAt}</td>
              <td>{po.deliveryDate}</td>
              <td style={{ fontWeight: 800 }}>{po.items.length} item(s)</td>
              <td style={{ fontWeight: 850, color: '#0f172a' }}>₹{po.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
              <td style={{ textAlign: 'right' }}>
                <span className={`status-badge ${po.status.toLowerCase()}`}>
                  {po.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
