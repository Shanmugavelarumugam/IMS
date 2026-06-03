import React from 'react';

interface CardDefinition {
  id: string;
  label: string;
  value: string | number;
  subtext: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: any;
  color: string;
  className: string;
  valueColor?: string;
}

interface StatsGridProps {
  cardDefinitions: CardDefinition[];
  activeCardIds: string[];
}

export const StatsGrid: React.FC<StatsGridProps> = ({
  cardDefinitions,
  activeCardIds,
}) => {
  return (
    <div className="stats-grid">
      {cardDefinitions
        .filter((c) => activeCardIds.includes(c.id))
        .map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.id} className="stat-card-premium">
              <div>
                <div className="stat-card-label">{card.label}</div>
                <div
                  className="stat-card-value"
                  style={card.valueColor ? { color: card.valueColor } : {}}
                >
                  {card.value}
                </div>
                <div className="stat-card-subtext">{card.subtext}</div>
              </div>
              <div className={`stat-card-icon-wrapper ${card.className}`}>
                <Icon size={20} strokeWidth={2.4} />
              </div>
            </div>
          );
        })}
    </div>
  );
};
