import re
import os

filepath = '/Users/btc001a/Downloads/MyFolder/inventary-IMS/IMS-FE/src/modules/customers/pages/CustomersPage.tsx'
with open(filepath, 'r') as f:
    content = f.read()

# 1. Update Card Definitions
card_defs_orig = """  const cardDefinitions = [
    {
      id: 'total_clients',
      label: 'Active Clients',
      value: metrics.totalCount,
      subtext: 'Registered trading accounts',
      icon: UserRound,
      color: '#6366f1',
      className: 'blue'
    },
    {
      id: 'total_receivables',
      label: 'Total Receivables',
      value: `₹${metrics.totalReceivables.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      subtext: 'Outstanding credit invoices',
      icon: DollarSign,
      color: '#059669',
      className: 'emerald',
      valueColor: '#059669'
    },
    {
      id: 'total_credit_capacity',
      label: 'Credit Limits',
      value: `₹${metrics.totalLimit.toLocaleString('en-IN', { minimumFractionDigits: 0 })}`,
      subtext: 'Assigned trading capacity',
      icon: CreditCard,
      color: '#8b5cf6',
      className: 'purple'
    },
    {
      id: 'active_overdue',
      label: 'Credit Risk Accounts',
      value: metrics.overdueCount,
      subtext: 'Balances > 70% limit',
      icon: AlertCircle,
      color: '#dc2626',
      className: 'rose',
      valueColor: '#dc2626'
    }
  ];"""

card_defs_new = """  const cardDefinitions = [
    {
      id: 'total_clients',
      label: 'Active Clients',
      value: metrics.totalCount,
      subtext: 'Registered trading accounts',
      trend: '↑ 12% this month',
      trendColor: '#10b981',
      sparkline: 'M0 10 Q5 5 10 12 T20 8 T30 15 T40 5',
      icon: UserRound,
      color: '#6366f1',
      className: 'blue'
    },
    {
      id: 'total_receivables',
      label: 'Total Receivables',
      value: `₹${metrics.totalReceivables.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      subtext: 'Outstanding credit invoices',
      trend: '↓ 4% vs last week',
      trendColor: '#10b981',
      sparkline: 'M0 15 Q10 5 20 12 T30 8 T40 2',
      icon: DollarSign,
      color: '#059669',
      className: 'emerald',
      valueColor: '#059669'
    },
    {
      id: 'total_credit_capacity',
      label: 'Credit Limits',
      value: `₹${metrics.totalLimit.toLocaleString('en-IN', { minimumFractionDigits: 0 })}`,
      subtext: 'Assigned trading capacity',
      trend: '↑ 2 new approvals',
      trendColor: '#6366f1',
      sparkline: 'M0 12 Q10 15 20 8 T30 5 T40 10',
      icon: CreditCard,
      color: '#8b5cf6',
      className: 'purple'
    },
    {
      id: 'active_overdue',
      label: 'Credit Risk Accounts',
      value: metrics.overdueCount,
      subtext: 'Balances > 70% limit',
      trend: '↓ 2 overdue accounts',
      trendColor: '#10b981',
      sparkline: 'M0 2 Q10 5 20 12 T30 15 T40 10',
      icon: AlertCircle,
      color: '#dc2626',
      className: 'rose',
      valueColor: '#dc2626'
    }
  ];"""

content = content.replace(card_defs_orig, card_defs_new)

# 2. Render Card Definitions
card_render_orig = """            <div key={card.id} className="stat-card-premium">
              <div>
                <div className="stat-card-label">{card.label}</div>
                <div className="stat-card-value" style={card.valueColor ? { color: card.valueColor } : {}}>{card.value}</div>
                <div className="stat-card-subtext">{card.subtext}</div>
              </div>
              <div className={`stat-card-icon-wrapper ${card.className}`}>
                <Icon size={20} strokeWidth={2.4} />
              </div>
            </div>"""

card_render_new = """            <div key={card.id} className="stat-card-premium" style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%' }}>
                <div>
                  <div className="stat-card-label">{card.label}</div>
                  <div className="stat-card-value" style={card.valueColor ? { color: card.valueColor } : {}}>{card.value}</div>
                </div>
                <div className={`stat-card-icon-wrapper ${card.className}`}>
                  <Icon size={20} strokeWidth={2.4} />
                </div>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px', width: '100%' }}>
                <div>
                  <div className="stat-card-subtext">{card.subtext}</div>
                  {card.trend && (
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: card.trendColor, marginTop: '4px' }}>
                      {card.trend}
                    </div>
                  )}
                </div>
                {card.sparkline && (
                  <div style={{ height: '24px', width: '60px' }}>
                    <svg viewBox="0 0 40 20" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                      <path d={card.sparkline} fill="none" stroke={card.color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                )}
              </div>
            </div>"""

content = content.replace(card_render_orig, card_render_new)

# 3. Add table columns for Risk Profile and Collection Status
table_head_orig = """                <th>Customer Name</th>
                <th>Category</th>
                <th>Primary Contact</th>
                <th>Receivable Due</th>
                <th>Credit Limit</th>
                <th>Orders</th>
                <th>Last Order</th>
                <th style={{ textAlign: 'center' }}>Actions</th>"""

table_head_new = """                <th>Customer Name</th>
                <th>Category</th>
                <th>Risk Profile</th>
                <th>Status</th>
                <th>Receivable Due</th>
                <th>Credit Limit</th>
                <th>Last Order</th>
                <th style={{ textAlign: 'center' }}>Actions</th>"""

content = content.replace(table_head_orig, table_head_new)

# 4. Table Row Data (Add calculations for Risk and Status)
table_row_orig = """              {filteredCustomers.map((cust) => (
                <tr key={cust.id} style={{ cursor: 'pointer' }} onClick={() => setSelectedCustomer(cust)}>
                  <td style={{ fontWeight: 850 }}>{cust.name}</td>
                  <td>
                    <span className={`type-pill ${cust.type === 'Key Account' ? 'type-key' : cust.type === 'Distributor' ? 'type-distributor' : cust.type === 'Wholesaler' ? 'type-wholesaler' : 'type-retail'}`}>
                      {cust.type}
                    </span>
                  </td>
                  <td>{cust.contactPerson}</td>
                  <td style={{ color: cust.currentBalance > 0 ? '#b91c1c' : '#16a34a', fontWeight: 850 }}>
                    ₹{cust.currentBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </td>
                  <td style={{ color: '#64748b' }}>₹{cust.creditLimit.toLocaleString('en-IN')}</td>
                  <td>{cust.totalOrders} orders</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontWeight: 650 }}>
                      <Calendar size={14} />
                      {formatRelativeDate(cust.lastOrderDate)}
                    </div>
                  </td>
                  <td onClick={(e) => e.stopPropagation()}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                      <button className="table-action-btn" onClick={() => handleOpenEdit(cust)}>
                        <Edit3 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}"""

table_row_new = """              {filteredCustomers.map((cust) => {
                const utilRatio = cust.creditLimit > 0 ? (cust.currentBalance / cust.creditLimit) : 0;
                let risk = 'Low';
                let riskColor = '#10b981';
                let riskBg = '#ecfdf5';
                if (utilRatio > 0.7) { risk = 'High'; riskColor = '#ef4444'; riskBg = '#fef2f2'; }
                else if (utilRatio > 0.4) { risk = 'Medium'; riskColor = '#f59e0b'; riskBg = '#fffbeb'; }
                
                let status = 'Paid';
                let statusColor = '#10b981';
                if (cust.currentBalance > 0 && utilRatio > 0.7) { status = 'Overdue'; statusColor = '#ef4444'; }
                else if (cust.currentBalance > 0) { status = 'Partial'; statusColor = '#f59e0b'; }

                return (
                <tr key={cust.id} style={{ cursor: 'pointer' }} onClick={() => setSelectedCustomer(cust)}>
                  <td style={{ fontWeight: 850 }}>
                    <div style={{ color: '#0f172a' }}>{cust.name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600, marginTop: '2px' }}>{cust.contactPerson}</div>
                  </td>
                  <td>
                    <span className={`type-pill ${cust.type === 'Key Account' ? 'type-key' : cust.type === 'Distributor' ? 'type-distributor' : cust.type === 'Wholesaler' ? 'type-wholesaler' : 'type-retail'}`}>
                      {cust.type}
                    </span>
                  </td>
                  <td>
                    <span style={{ background: riskBg, color: riskColor, padding: '4px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700 }}>
                      {risk} Risk
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: statusColor, fontWeight: 700, fontSize: '0.85rem' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: statusColor }}></div>
                      {status}
                    </div>
                  </td>
                  <td style={{ color: cust.currentBalance > 0 ? '#b91c1c' : '#16a34a', fontWeight: 850 }}>
                    ₹{cust.currentBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </td>
                  <td style={{ color: '#64748b' }}>₹{cust.creditLimit.toLocaleString('en-IN')}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontWeight: 650 }}>
                      <Calendar size={14} />
                      {formatRelativeDate(cust.lastOrderDate)}
                    </div>
                  </td>
                  <td onClick={(e) => e.stopPropagation()}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                      <button className="table-action-btn" onClick={() => handleOpenEdit(cust)}>
                        <Edit3 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              )})}"""

content = content.replace(table_row_orig, table_row_new)

with open(filepath, 'w') as f:
    f.write(content)

print("CustomersPage.tsx patched successfully.")
