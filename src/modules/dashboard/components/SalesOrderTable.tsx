import React from 'react';
import { Layers, CheckCircle, Clock } from 'lucide-react';

interface SalesOrder {
  id: string;
  customer: string;
  date: string;
  amount: number;
  status: 'All' | 'Pending' | 'Shipped' | 'Delivered' | 'Cancelled';
  itemsCount: number;
}

interface SalesOrderTableProps {
  salesOrders: SalesOrder[];
  filteredOrders: SalesOrder[];
  activeOrderTab: 'All' | 'Pending' | 'Shipped' | 'Delivered' | 'Cancelled';
  setActiveOrderTab: (
    tab: 'All' | 'Pending' | 'Shipped' | 'Delivered' | 'Cancelled'
  ) => void;
}

export const SalesOrderTable: React.FC<SalesOrderTableProps> = ({
  salesOrders,
  filteredOrders,
  activeOrderTab,
  setActiveOrderTab,
}) => {
  return (
    <div className="luxury-glass-card" style={{ padding: '28px' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div>
          <h3
            style={{
              fontSize: '1.35rem',
              fontWeight: 850,
              color: '#0F172A',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              letterSpacing: '-0.02em',
            }}
          >
            <Layers size={22} color="#a855f7" /> Sales Order Summary
          </h3>
          <p style={{ color: '#64748B', fontSize: '0.88rem', marginTop: '2px' }}>
            Comprehensive ledger of order dispatch pipeline & client invoices
          </p>
        </div>

        {/* Filter pill tabs */}
        <div
          className="custom-scroll-bar"
          style={{
            display: 'flex',
            gap: '6px',
            overflowX: 'auto',
            paddingBottom: '4px',
          }}
        >
          {(['All', 'Pending', 'Shipped', 'Delivered', 'Cancelled'] as const).map(
            (tab) => {
              const count =
                tab === 'All'
                  ? salesOrders.length
                  : salesOrders.filter((o) => o.status === tab).length;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveOrderTab(tab)}
                  className={`action-tab-pill ${activeOrderTab === tab ? 'active' : ''}`}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '10px',
                    fontSize: '0.78rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    flexShrink: 0,
                  }}
                >
                  <span>{tab}</span>
                  <span
                    style={{
                      background:
                        activeOrderTab === tab
                          ? 'rgba(255,255,255,0.22)'
                          : 'rgba(0,0,0,0.06)',
                      padding: '2px 6px',
                      borderRadius: '5px',
                      fontSize: '0.7rem',
                    }}
                  >
                    {count}
                  </span>
                </button>
              );
            }
          )}
        </div>
      </div>

      {/* Dynamic summary subgrid */}
      <div
        className="summary-subgrid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: '16px',
          background:
            'linear-gradient(135deg, rgba(248, 250, 252, 0.8) 0%, rgba(241, 245, 249, 0.8) 100%)',
          padding: '20px',
          borderRadius: '18px',
          border: '1px solid rgba(226, 232, 240, 0.7)',
          marginBottom: '24px',
        }}
      >
        <div>
          <span
            style={{
              color: '#64748b',
              fontSize: '0.76rem',
              fontWeight: 700,
              letterSpacing: '0.04em',
            }}
          >
            PENDING ORDER VALUE
          </span>
          <div style={{ fontSize: '1.3rem', fontWeight: 850, color: '#0F172A', marginTop: '6px' }}>
            ₹{salesOrders.reduce((sum, o) => sum + o.amount, 0).toLocaleString()}
          </div>
        </div>
        <div>
          <span
            style={{
              color: '#d97706',
              fontSize: '0.76rem',
              fontWeight: 700,
              letterSpacing: '0.04em',
            }}
          >
            PENDING DISPATCH VALUE
          </span>
          <div style={{ fontSize: '1.3rem', fontWeight: 850, color: '#d97706', marginTop: '6px' }}>
            ₹
            {salesOrders
              .filter((o) => o.status === 'Pending')
              .reduce((sum, o) => sum + o.amount, 0)
              .toLocaleString()}
          </div>
        </div>
        <div>
          <span
            style={{
              color: '#059669',
              fontSize: '0.76rem',
              fontWeight: 700,
              letterSpacing: '0.04em',
            }}
          >
            FULFILLMENT RATIO
          </span>
          <div style={{ fontSize: '1.3rem', fontWeight: 850, color: '#059669', marginTop: '6px' }}>
            {Math.round(
              (salesOrders.filter((o) => o.status === 'Delivered').length /
                salesOrders.length) *
                100
            )}
            %
          </div>
        </div>
        <div>
          <span
            style={{
              color: '#6366f1',
              fontSize: '0.76rem',
              fontWeight: 700,
              letterSpacing: '0.04em',
            }}
          >
            AVERAGE ORDER VALUE
          </span>
          <div style={{ fontSize: '1.3rem', fontWeight: 850, color: '#6366f1', marginTop: '6px' }}>
            ₹
            {Math.round(
              salesOrders.reduce((sum, o) => sum + o.amount, 0) / salesOrders.length
            ).toLocaleString()}
          </div>
        </div>
      </div>

      {/* Backlog Table */}
      <div className="custom-scroll-bar" style={{ overflowX: 'auto', width: '100%' }}>
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            textAlign: 'left',
            minWidth: '600px',
          }}
        >
          <thead>
            <tr style={{ borderBottom: '1.5px solid rgba(226, 232, 240, 0.8)' }}>
              <th
                style={{
                  padding: '12px 16px',
                  color: '#64748b',
                  fontSize: '0.76rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  whiteSpace: 'nowrap',
                }}
              >
                Order ID
              </th>
              <th
                style={{
                  padding: '12px 16px',
                  color: '#64748b',
                  fontSize: '0.76rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  whiteSpace: 'nowrap',
                }}
              >
                Client Customer
              </th>
              <th
                style={{
                  padding: '12px 16px',
                  color: '#64748b',
                  fontSize: '0.76rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  whiteSpace: 'nowrap',
                }}
              >
                Fulfillment Date
              </th>
              <th
                style={{
                  padding: '12px 16px',
                  color: '#64748b',
                  fontSize: '0.76rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  whiteSpace: 'nowrap',
                }}
              >
                Quantity
              </th>
              <th
                style={{
                  padding: '12px 16px',
                  color: '#64748b',
                  fontSize: '0.76rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  whiteSpace: 'nowrap',
                }}
              >
                Net Value
              </th>
              <th
                style={{
                  padding: '12px 16px',
                  color: '#64748b',
                  fontSize: '0.76rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  whiteSpace: 'nowrap',
                }}
              >
                Fulfillment Status
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <tr
                  key={order.id}
                  className="premium-tr"
                  style={{ borderBottom: '1px solid rgba(226, 232, 240, 0.4)' }}
                >
                  <td
                    style={{
                      padding: '16px',
                      fontWeight: 850,
                      color: '#6366f1',
                      fontFamily: 'monospace',
                      fontSize: '0.88rem',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {order.id}
                  </td>
                  <td
                    style={{
                      padding: '16px',
                      fontWeight: 750,
                      color: '#0F172A',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      maxWidth: '180px',
                    }}
                    title={order.customer}
                  >
                    {order.customer}
                  </td>
                  <td
                    style={{
                      padding: '16px',
                      color: '#64748b',
                      fontSize: '0.85rem',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {order.date}
                  </td>
                  <td
                    style={{
                      padding: '16px',
                      fontWeight: 600,
                      color: '#475569',
                      fontSize: '0.88rem',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {order.itemsCount} items
                  </td>
                  <td
                    style={{
                      padding: '16px',
                      fontWeight: 850,
                      color: '#0f172a',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    ₹{order.amount.toLocaleString()}
                  </td>
                  <td style={{ padding: '16px', whiteSpace: 'nowrap' }}>
                    <span
                      className={`badge-capsule ${
                        order.status === 'Delivered'
                          ? 'badge-capsule-success'
                          : order.status === 'Shipped'
                            ? 'badge-capsule-info'
                            : order.status === 'Pending'
                              ? 'badge-capsule-warning'
                              : 'badge-capsule-danger'
                      }`}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {order.status === 'Delivered' && <CheckCircle size={13} />}
                      {order.status === 'Pending' && <Clock size={13} />}
                      <span>{order.status}</span>
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={6}
                  style={{ textAlign: 'center', padding: '36px', color: '#64748b', fontSize: '0.92rem' }}
                >
                  No orders matched selected filter pipeline.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
