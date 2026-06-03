import React from 'react';
import { Tags, CheckSquare, BookOpen, Folder } from 'lucide-react';
import type { Category } from '../types';

interface CategoriesStatsGridProps {
  categories: Category[];
  visibleCards: {
    total_categories: boolean;
    total_skus: boolean;
    avg_skus: boolean;
    active_tax: boolean;
  };
}

export const CategoriesStatsGrid: React.FC<CategoriesStatsGridProps> = ({
  categories,
  visibleCards
}) => {
  const totalSKUs = categories.reduce((sum, c) => sum + c.totalProducts, 0);
  const avgSKUs = categories.length > 0 ? Math.round(totalSKUs / categories.length) : 0;
  const activeTax = categories.filter(c => c.status === 'ACTIVE').length;

  const cardDefinitions = [
    {
      id: 'total_categories',
      label: 'Total Categories',
      value: categories.length,
      subtext: 'Primary asset groups',
      icon: Tags,
      className: 'blue'
    },
    {
      id: 'total_skus',
      label: 'Linked Inventory SKUs',
      value: totalSKUs,
      subtext: 'Total catalog products',
      icon: CheckSquare,
      className: 'emerald'
    },
    {
      id: 'avg_skus',
      label: 'Avg Products/Category',
      value: avgSKUs,
      subtext: 'Catalog load density',
      icon: BookOpen,
      className: 'purple'
    },
    {
      id: 'active_tax',
      label: 'Active Categories',
      value: activeTax,
      subtext: 'Operational taxonomy nodes',
      icon: Folder,
      className: 'rose'
    }
  ];

  return (
    <div className="cat-stats-grid">
      {cardDefinitions.map((c) => {
        if (!visibleCards[c.id as keyof typeof visibleCards]) return null;
        const Icon = c.icon;
        return (
          <div key={c.id} className="cat-stat-card-premium">
            <div>
              <div className="cat-stat-card-label">{c.label}</div>
              <div className="cat-stat-card-value">{c.value}</div>
              <div className="cat-stat-card-subtext">{c.subtext}</div>
            </div>
            <div className={`cat-stat-card-icon-wrapper ${c.className}`}>
              <Icon size={22} />
            </div>
          </div>
        );
      })}
    </div>
  );

};
