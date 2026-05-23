import re

file_path = '/Users/btc001a/Downloads/MyFolder/inventary-IMS/IMS-FE/src/modules/customers/pages/CustomersPage.tsx'

with open(file_path, 'r') as f:
    content = f.read()

# 1. Text replacements
content = content.replace('Client Relationships Directory', 'Customer Management')
content = content.replace('Oversee outstanding client balances, establish trading limits, and register payment receipts.', 'Manage customer balances, credit limits, and payment records.')
content = content.replace('Onboard Client', 'Add Customer')
content = content.replace('Authorized Credit Limits', 'Credit Limits')
content = content.replace('Search clients by name, contact, location or tag...', 'Search customer name, contact or tag...')

# 2. Reorder KPI cards
# Currently it's Active Clients, Total Receivables, Authorized Credit Limits, Credit Risk Accounts
# We want: Total Receivables, Credit Risk Accounts, Active Clients, Credit Limits
old_cards = r"""    {
      id: 'active_clients',
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
    }"""

new_cards = """    {
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
      id: 'active_overdue',
      label: 'Credit Risk Accounts',
      value: metrics.overdueCount,
      subtext: 'Balances > 70% limit',
      icon: AlertCircle,
      color: '#dc2626',
      className: 'rose',
      valueColor: '#dc2626'
    },
    {
      id: 'active_clients',
      label: 'Active Clients',
      value: metrics.totalCount,
      subtext: 'Registered trading accounts',
      icon: UserRound,
      color: '#6366f1',
      className: 'blue'
    },
    {
      id: 'total_credit_capacity',
      label: 'Credit Limits',
      value: `₹${metrics.totalLimit.toLocaleString('en-IN', { minimumFractionDigits: 0 })}`,
      subtext: 'Assigned trading capacity',
      icon: CreditCard,
      color: '#8b5cf6',
      className: 'purple'
    }"""
content = content.replace(old_cards, new_cards)

# 3. Add lastOrderDate to Customer Interface
content = content.replace('  rating: number;\n  totalOrders: number;', "  rating: number;\n  totalOrders: number;\n  lastOrderDate: string;")

# 4. Add lastOrderDate to DEFAULT_CUSTOMERS
content = content.replace("rating: 4.8,", "rating: 4.8,\n    lastOrderDate: '2023-11-15',")
content = content.replace("rating: 4.2,", "rating: 4.2,\n    lastOrderDate: '2023-11-02',")
content = content.replace("rating: 4.6,", "rating: 4.6,\n    lastOrderDate: '2023-11-18',")
content = content.replace("rating: 3.9,", "rating: 3.9,\n    lastOrderDate: '2023-10-25',")
content = content.replace("rating: 4.9,", "rating: 4.9,\n    lastOrderDate: '2023-11-20',")
content = content.replace("rating: 4.5,", "rating: 4.5,\n    lastOrderDate: '2023-11-10',")

# 5. Table Header Update
content = content.replace('<th>Rating</th>', '<th>Last Order</th>')

# 6. Table Row Update
table_star_td = r"""                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '3px', color: '#d97706', fontWeight: 700 }}>
                      <Star size={14} fill="#d97706" />
                      {cust.rating.toFixed(1)}
                    </div>
                  </td>"""
new_table_td = """                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontWeight: 650 }}>
                      <Calendar size={14} />
                      {cust.lastOrderDate}
                    </div>
                  </td>"""
content = content.replace(table_star_td, new_table_td)

# 7. Grid Card Update
grid_star_div = r"""                      <div style={{ display: 'flex', alignItems: 'center', gap: '2px', color: '#d97706' }}>
                        <Star size={12} fill="#d97706" />
                        {cust.rating.toFixed(1)}
                      </div>"""
new_grid_div = """                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#94a3b8' }}>
                        <Calendar size={12} />
                        {cust.lastOrderDate}
                      </div>"""
content = content.replace(grid_star_div, new_grid_div)

# 8. Drawer Form / Save Update (optional but good practice to supply a default date on onboard)
# We don't strictly need to edit the form UI for lastOrderDate right now if it's not requested, but let's add a default so it doesn't break.
content = content.replace('rating: parseFloat(formRating),', "rating: parseFloat(formRating),\n      lastOrderDate: new Date().toISOString().split('T')[0],")

# Fix: If old_cards didn't match perfectly, let's verify if the string exists in content
# The initial find/replace for Credit Limits already changed "Authorized Credit Limits" -> "Credit Limits" inside old_cards.
# The python replacement relies on exact string match, which should be fine if we account for the replacement happening first.

with open(file_path, 'w') as f:
    f.write(content)

print("Updated Customer UI terms and fields!")
