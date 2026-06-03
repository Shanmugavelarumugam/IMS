import React from 'react';
import { TrendingUp, CheckCircle2, Clock, ShoppingBag } from 'lucide-react';

interface StatsGridProps {
  totalRevenue: number;
  ordersFulfilled: number;
  outstandingReceivables: number;
  avgOrderValue: number;
  visibleCards: {
    total_revenue: boolean;
    orders_fulfilled: boolean;
    outstanding_receivables: boolean;
    avg_order_value: boolean;
  };
}

export const StatsGrid: React.FC<StatsGridProps> = ({
  totalRevenue,
  ordersFulfilled,
  outstandingReceivables,
  avgOrderValue,
  visibleCards,
}) => {
  const cardDefinitions = [
    {
      id: 'total_revenue',
      label: 'Total Revenue',
      value: `₹${totalRevenue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`,
      subtext: 'Fulfillment sales volume',
      icon: TrendingUp,
      className: 'emerald'
    },
    {
      id: 'orders_fulfilled',
      label: 'Orders Fulfilled',
      value: ordersFulfilled,
      subtext: 'Dispatched sales shipments',
      icon: CheckCircle2,
      className: 'blue'
    },
    {
      id: 'outstanding_receivables',
      label: 'Outstanding Receivables',
      value: `₹${outstandingReceivables.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`,
      subtext: 'Pending client payments',
      icon: Clock,
      className: 'rose'
    },
    {
      id: 'avg_order_value',
      label: 'Avg Order Value (AOV)',
      value: `₹${avgOrderValue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`,
      subtext: 'Average fulfilled sales ticket',
      icon: ShoppingBag,
      className: 'purple'
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
              <div className="stat-card-value">{c.value}</div>
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
