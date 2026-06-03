import React from 'react';
import { X, CheckCircle2, Settings } from 'lucide-react';

interface CardDefinition {
  id: string;
  label: string;
  subtext: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: any;
}

interface MetricsConfigModalProps {
  showMetricsConfig: boolean;
  setShowMetricsConfig: (show: boolean) => void;
  cardDefinitions: CardDefinition[];
  activeCardIds: string[];
  setActiveCardIds: React.Dispatch<React.SetStateAction<string[]>>;
}

export const MetricsConfigModal: React.FC<MetricsConfigModalProps> = ({
  showMetricsConfig,
  setShowMetricsConfig,
  cardDefinitions,
  activeCardIds,
  setActiveCardIds,
}) => {
  if (!showMetricsConfig) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(15, 23, 42, 0.6)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          background: '#ffffff',
          borderRadius: '24px',
          width: '90%',
          maxWidth: '500px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          overflow: 'hidden',
          animation: 'modalSlideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <div
          style={{
            padding: '24px 32px',
            borderBottom: '1px solid #f1f5f9',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: '#f8fafc',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ background: '#e0e7ff', padding: '8px', borderRadius: '12px' }}>
              <Settings size={20} color="#4f46e5" />
            </div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              Configure Cards
            </h2>
          </div>
          <button
            onClick={() => setShowMetricsConfig(false)}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <X size={24} />
          </button>
        </div>

        <div style={{ padding: '32px' }}>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '24px', lineHeight: 1.5 }}>
            Select the key performance indicators you want to monitor on your main operational
            dashboard.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {cardDefinitions.map((card) => {
              const isActive = activeCardIds.includes(card.id);
              const Icon = card.icon;
              return (
                <label
                  key={card.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '16px',
                    border: `2px solid ${isActive ? '#6366f1' : '#e2e8f0'}`,
                    borderRadius: '16px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    background: isActive ? '#f5f7ff' : '#ffffff',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: isActive ? 'rgba(99, 102, 241, 0.1)' : '#f1f5f9',
                        color: isActive ? '#6366f1' : '#64748b',
                      }}
                    >
                      <Icon size={20} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' }}>
                        {card.label}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '2px' }}>
                        {card.subtext}
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '6px',
                      border: `2px solid ${isActive ? '#6366f1' : '#cbd5e1'}`,
                      background: isActive ? '#6366f1' : 'transparent',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.2s',
                    }}
                  >
                    {isActive && <CheckCircle2 size={16} color="#ffffff" strokeWidth={3} />}
                  </div>
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setActiveCardIds((prev) => [...prev, card.id]);
                      } else {
                        if (activeCardIds.length > 1) {
                          setActiveCardIds((prev) => prev.filter((id) => id !== card.id));
                        }
                      }
                    }}
                    style={{ display: 'none' }}
                  />
                </label>
              );
            })}
          </div>
        </div>

        <div
          style={{
            padding: '24px 32px',
            borderTop: '1px solid #f1f5f9',
            display: 'flex',
            justifyContent: 'flex-end',
            background: '#f8fafc',
          }}
        >
          <button
            onClick={() => setShowMetricsConfig(false)}
            style={{
              background: '#0f172a',
              color: '#ffffff',
              border: 'none',
              padding: '12px 32px',
              borderRadius: '12px',
              fontSize: '0.95rem',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(15, 23, 42, 0.2)',
              transition: 'all 0.2s',
            }}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
