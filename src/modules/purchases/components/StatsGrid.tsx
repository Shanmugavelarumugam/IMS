import React from 'react';
import { Clock, DollarSign, AlertTriangle, Activity } from 'lucide-react';

interface StatsGridProps {
  activeDrafts: number;
  historicSpend: number;
  outstandingPayables: number;
  fulfillmentRate: number;
  visibleCards: {
    active_drafts: boolean;
    historic_exp: boolean;
    accounts_payable: boolean;
    fulfillment_rate: boolean;
  };
}

export const StatsGrid: React.FC<StatsGridProps> = ({
  activeDrafts,
  historicSpend,
  outstandingPayables,
  fulfillmentRate,
  visibleCards,
}) => {
  const cardDefinitions = [
    {
      id: 'active_drafts',
      label: 'Active Drafts',
      value: activeDrafts,
      subtext: 'Unsubmitted purchase cycles',
      icon: Clock,
      className: 'blue'
    },
    {
      id: 'historic_exp',
      label: 'Historic Expenditure',
      value: `₹${historicSpend.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`,
      subtext: 'Completed acquisitions valuation',
      icon: DollarSign,
      className: 'emerald'
    },
    {
      id: 'accounts_payable',
      label: 'Accounts Payable',
      value: `₹${outstandingPayables.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`,
      subtext: 'Pending vendor invoices',
      icon: AlertTriangle,
      className: 'rose'
    },
    {
      id: 'fulfillment_rate',
      label: 'Fulfillment Rate',
      value: `${fulfillmentRate}%`,
      subtext: 'Completed vs total PO matrix',
      icon: Activity,
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
