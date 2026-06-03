import React from 'react';
import { Boxes, BarChart2, AlertTriangle, Building2 } from 'lucide-react';

interface StatsGridProps {
  totalStockQty: number;
  netInventoryVal: number;
  lowStockAlerts: number;
  locationsCount: number;
  visibleCards: {
    total_qty: boolean;
    net_value: boolean;
    alerts: boolean;
    locations: boolean;
  };
}

export const StatsGrid: React.FC<StatsGridProps> = ({
  totalStockQty,
  netInventoryVal,
  lowStockAlerts,
  locationsCount,
  visibleCards
}) => {
  const cardDefinitions = [
    {
      id: 'total_qty',
      label: 'Total Stock Quantity',
      value: totalStockQty.toLocaleString('en-IN'),
      subtext: 'Aggregated physical units',
      icon: Boxes,
      className: 'blue',
      color: '#6366f1'
    },
    {
      id: 'net_value',
      label: 'Net Inventory Value',
      value: `₹${netInventoryVal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      subtext: 'Asset valuation',
      icon: BarChart2,
      className: 'emerald',
      color: '#059669'
    },
    {
      id: 'alerts',
      label: 'Critical Shortages',
      value: lowStockAlerts,
      subtext: 'Below minimum thresholds',
      icon: AlertTriangle,
      className: 'rose',
      color: '#e11d48',
      valueColor: lowStockAlerts > 0 ? '#e11d48' : '#0f172a'
    },
    {
      id: 'locations',
      label: 'Warehousing Depots',
      value: locationsCount,
      subtext: 'Active supply branches',
      icon: Building2,
      className: 'purple',
      color: '#8b5cf6'
    }
  ];

  return (
    <div className="stats-grid">
      {cardDefinitions.map((c) => {
        if (!visibleCards[c.id as keyof typeof visibleCards]) return null;
        const Icon = c.icon;
        return (
          <div key={c.id} className="stat-card-premium">
            <div>
              <div className="stat-card-label">{c.label}</div>
              <div className="stat-card-value" style={{ color: c.valueColor || '#0f172a' }}>{c.value}</div>
              <div className="stat-card-subtext">{c.subtext}</div>
            </div>
            <div className={`stat-card-icon-wrapper ${c.className}`}>
              <Icon size={22} />
            </div>
          </div>
        );
      })}
    </div>
  );
};
