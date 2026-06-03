import React from 'react';
import { X, Trash2, Plus, AlertTriangle } from 'lucide-react';

interface MetricItem {
  id: string;
  label: string;
  value: string | number;
  change: string;
  isPositive: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: any;
  color: string;
  shadow: string;
  sparkline: string;
  delay: string;
}

interface MetricsModalProps {
  showMetricsConfig: boolean;
  setShowMetricsConfig: (show: boolean) => void;
  activeMetricIds: string[];
  setActiveMetricIds: React.Dispatch<React.SetStateAction<string[]>>;
  allMetrics: MetricItem[];
  setAllMetrics: React.Dispatch<React.SetStateAction<MetricItem[]>>;
  iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>>;
  customMetricLabel: string;
  setCustomMetricLabel: (val: string) => void;
  customMetricValue: string;
  setCustomMetricValue: (val: string) => void;
  customMetricChange: string;
  setCustomMetricChange: (val: string) => void;
  customMetricIsPositive: boolean;
  setCustomMetricIsPositive: (val: boolean) => void;
  customMetricIcon: any;
  setCustomMetricIcon: (val: any) => void;
  customMetricColor: string;
  setCustomMetricColor: (val: string) => void;
  modalInputStyle: React.CSSProperties;
}

export const MetricsModal: React.FC<MetricsModalProps> = ({
  showMetricsConfig,
  setShowMetricsConfig,
  activeMetricIds,
  setActiveMetricIds,
  allMetrics,
  setAllMetrics,
  iconMap,
  customMetricLabel,
  setCustomMetricLabel,
  customMetricValue,
  setCustomMetricValue,
  customMetricChange,
  setCustomMetricChange,
  customMetricIsPositive,
  setCustomMetricIsPositive,
  customMetricIcon,
  setCustomMetricIcon,
  customMetricColor,
  setCustomMetricColor,
  modalInputStyle,
}) => {
  if (!showMetricsConfig) return null;

  const isMaxReached = activeMetricIds.length >= 4;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(9, 14, 29, 0.4)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000,
        animation: 'fadeIn 0.2s ease-out',
      }}
    >
      <div
        className="luxury-glass-card"
        style={{
          width: '100%',
          maxWidth: '720px',
          padding: '32px',
          background: '#ffffff',
          border: '1px solid rgba(99, 102, 241, 0.15)',
          boxShadow: '0 30px 70px rgba(9, 14, 29, 0.12)',
          borderRadius: '24px',
          maxHeight: '90vh',
          overflowY: 'auto',
          position: 'relative',
        }}
      >
        <button
          onClick={() => setShowMetricsConfig(false)}
          style={{
            position: 'absolute',
            top: '24px',
            right: '24px',
            background: '#f1f5f9',
            border: 'none',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#64748b',
          }}
        >
          <X size={18} />
        </button>

        <h3
          style={{
            fontSize: '1.4rem',
            fontWeight: 850,
            color: '#0F172A',
            letterSpacing: '-0.02em',
            margin: '0 0 8px 0',
          }}
        >
          Configure Dashboard Cards
        </h3>
        <p style={{ color: '#64748b', fontSize: '0.88rem', fontWeight: 500, margin: '0 0 20px 0' }}>
          Tailor your Command Center overview. Toggle metrics visibility or build a bespoke card
          dynamically.
        </p>

        {/* Warning badge if max limits reached */}
        {isMaxReached && (
          <div
            style={{
              background: '#fffbeb',
              border: '1px solid #fef3c7',
              borderRadius: '12px',
              padding: '10px 14px',
              color: '#b45309',
              fontSize: '0.78rem',
              fontWeight: 700,
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <AlertTriangle size={14} color="#d97706" />
            <span>
              Limit Reached: Exactly 4 active cards are configured. Remove an active card to enable
              adding or creating new highlights.
            </span>
          </div>
        )}

        {/* Grid Layout inside modal */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          {/* Left Column: Manage Active Metrics */}
          <div>
            <h4
              style={{
                fontSize: '0.82rem',
                fontWeight: 800,
                color: '#475569',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: '12px',
              }}
            >
              Active Metrics ({activeMetricIds.length})
            </h4>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                maxHeight: '220px',
                overflowY: 'auto',
                paddingRight: '4px',
              }}
            >
              {allMetrics
                .filter((m) => activeMetricIds.includes(m.id))
                .map((m) => {
                  const IconComponent = m.icon;
                  return (
                    <div
                      key={m.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '10px 14px',
                        background: '#f8fafc',
                        borderRadius: '12px',
                        border: '1px solid #e2e8f0',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                        <div
                          style={{
                            background: `${m.color}10`,
                            color: m.color,
                            padding: '6px',
                            borderRadius: '8px',
                            display: 'flex',
                            flexShrink: 0,
                          }}
                        >
                          <IconComponent size={16} />
                        </div>
                        <span
                          style={{
                            fontSize: '0.86rem',
                            fontWeight: 700,
                            color: '#1e293b',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {m.label}
                        </span>
                      </div>
                      <button
                        onClick={() =>
                          setActiveMetricIds((prev) => prev.filter((id) => id !== m.id))
                        }
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: '#ef4444',
                          cursor: 'pointer',
                          display: 'flex',
                          padding: '4px',
                          flexShrink: 0,
                        }}
                        title="Remove card"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  );
                })}
              {activeMetricIds.length === 0 && (
                <div
                  style={{
                    padding: '20px',
                    textAlign: 'center',
                    color: '#94a3b8',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    border: '1.5px dashed #cbd5e1',
                    borderRadius: '12px',
                  }}
                >
                  No metrics active. Click below to add.
                </div>
              )}
            </div>

            <h4
              style={{
                fontSize: '0.82rem',
                fontWeight: 800,
                color: '#475569',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginTop: '20px',
                marginBottom: '12px',
              }}
            >
              Available to Add
            </h4>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                maxHeight: '180px',
                overflowY: 'auto',
                paddingRight: '4px',
              }}
            >
              {allMetrics
                .filter((m) => !activeMetricIds.includes(m.id))
                .map((m) => {
                  const IconComponent = m.icon;
                  return (
                    <div
                      key={m.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '10px 14px',
                        background: '#ffffff',
                        borderRadius: '12px',
                        border: '1px solid #e2e8f0',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                        <div
                          style={{
                            background: `${m.color}10`,
                            color: m.color,
                            padding: '6px',
                            borderRadius: '8px',
                            display: 'flex',
                            flexShrink: 0,
                          }}
                        >
                          <IconComponent size={16} />
                        </div>
                        <span
                          style={{
                            fontSize: '0.86rem',
                            fontWeight: 700,
                            color: '#475569',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {m.label}
                        </span>
                      </div>
                      <button
                        disabled={isMaxReached}
                        onClick={() => setActiveMetricIds((prev) => [...prev, m.id])}
                        style={{
                          background: isMaxReached ? '#f1f5f9' : 'rgba(99, 102, 241, 0.06)',
                          border: 'none',
                          color: isMaxReached ? '#94a3b8' : '#4f46e5',
                          cursor: isMaxReached ? 'not-allowed' : 'pointer',
                          display: 'flex',
                          padding: '6px',
                          borderRadius: '8px',
                          flexShrink: 0,
                        }}
                        title={isMaxReached ? 'Maximum 4 active metrics allowed' : 'Add card'}
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Right Column: Build Custom Metric Card */}
          <div style={{ borderLeft: '1px solid #f1f5f9', paddingLeft: '24px' }}>
            <h4
              style={{
                fontSize: '0.82rem',
                fontWeight: 800,
                color: '#475569',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: '12px',
              }}
            >
              Create Custom Metric
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    color: '#475569',
                    marginBottom: '4px',
                  }}
                >
                  Card Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Stock Value by Warehouse"
                  value={customMetricLabel}
                  onChange={(e) => setCustomMetricLabel(e.target.value)}
                  style={modalInputStyle}
                />
              </div>

              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    color: '#475569',
                    marginBottom: '4px',
                  }}
                >
                  Metric Value
                </label>
                <input
                  type="text"
                  placeholder="e.g. ₹185,200 or 12 Items"
                  value={customMetricValue}
                  onChange={(e) => setCustomMetricValue(e.target.value)}
                  style={modalInputStyle}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '12px' }}>
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      color: '#475569',
                      marginBottom: '4px',
                    }}
                  >
                    Trend Text
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. +14.2% or Stable"
                    value={customMetricChange}
                    onChange={(e) => setCustomMetricChange(e.target.value)}
                    style={modalInputStyle}
                  />
                </div>
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      color: '#475569',
                      marginBottom: '4px',
                    }}
                  >
                    Trend Direction
                  </label>
                  <select
                    value={customMetricIsPositive ? 'up' : 'down'}
                    onChange={(e) => setCustomMetricIsPositive(e.target.value === 'up')}
                    style={modalInputStyle}
                  >
                    <option value="up">Positive (+)</option>
                    <option value="down">Negative (-)</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      color: '#475569',
                      marginBottom: '4px',
                    }}
                  >
                    Icon Representation
                  </label>
                  <select
                    value={customMetricIcon}
                    onChange={(e) => setCustomMetricIcon(e.target.value)}
                    style={modalInputStyle}
                  >
                    {Object.keys(iconMap).map((key) => (
                      <option key={key} value={key}>
                        {key}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      color: '#475569',
                      marginBottom: '4px',
                    }}
                  >
                    Accent Color
                  </label>
                  <input
                    type="color"
                    value={customMetricColor}
                    onChange={(e) => setCustomMetricColor(e.target.value)}
                    style={{
                      ...modalInputStyle,
                      padding: '4px',
                      height: '36px',
                      cursor: 'pointer',
                    }}
                  />
                </div>
              </div>

              <button
                disabled={isMaxReached}
                onClick={() => {
                  if (!customMetricLabel || !customMetricValue) return;
                  const newId = `custom_${Date.now()}`;
                  const newCard: MetricItem = {
                    id: newId,
                    label: customMetricLabel,
                    value: customMetricValue,
                    change: customMetricChange || '0.0%',
                    isPositive: customMetricIsPositive,
                    icon: iconMap[customMetricIcon] || Plus,
                    color: customMetricColor,
                    shadow: `${customMetricColor}18`,
                    sparkline: 'M 5 25 Q 30 15 60 30 T 110 10 T 155 20 T 195 8',
                    delay: '0s',
                  };
                  setAllMetrics((prev) => [...prev, newCard]);
                  setActiveMetricIds((prev) => [...prev, newId]);
                  // Reset inputs
                  setCustomMetricLabel('');
                  setCustomMetricValue('');
                  setCustomMetricChange('');
                }}
                style={{
                  background: isMaxReached
                    ? '#cbd5e1'
                    : 'linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)',
                  color: isMaxReached ? '#94a3b8' : '#ffffff',
                  border: 'none',
                  padding: '12px',
                  borderRadius: '10px',
                  fontWeight: 800,
                  fontSize: '0.82rem',
                  cursor: isMaxReached ? 'not-allowed' : 'pointer',
                  boxShadow: isMaxReached ? 'none' : '0 8px 20px rgba(79, 70, 229, 0.15)',
                  marginTop: '8px',
                  textAlign: 'center',
                }}
              >
                {isMaxReached ? 'Limit Reached (Max 4)' : 'Add Custom Card'}
              </button>
            </div>
          </div>
        </div>

        <div
          style={{
            marginTop: '28px',
            borderTop: '1px solid #f1f5f9',
            paddingTop: '20px',
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <button
            onClick={() => setShowMetricsConfig(false)}
            style={{
              background: '#111827',
              color: '#ffffff',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '12px',
              fontWeight: 800,
              fontSize: '0.88rem',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            }}
          >
            Apply Changes
          </button>
        </div>
      </div>
    </div>
  );
};
