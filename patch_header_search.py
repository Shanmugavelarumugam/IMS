import re

cust_file = '/Users/btc001a/Downloads/MyFolder/inventary-IMS/IMS-FE/src/modules/customers/pages/CustomersPage.tsx'
supp_file = '/Users/btc001a/Downloads/MyFolder/inventary-IMS/IMS-FE/src/modules/suppliers/pages/SuppliersPage.tsx'

with open(cust_file, 'r') as f:
    cust = f.read()

with open(supp_file, 'r') as f:
    supp = f.read()

# 1. Header extraction
supp_header_match = re.search(r'      {/\* HEADER SECTION \*/}\n      <div className="page-header"(.*?)      </div>\n      </div>', supp, re.DOTALL)
supp_header = "      {/* HEADER SECTION */}\n      <div className=\"page-header\"" + supp_header_match.group(1) + "      </div>\n      </div>"

supp_header = supp_header.replace('Supplier Management', 'Client Relationships Directory')
supp_header = supp_header.replace('Track supplier performance, outstanding payments, and purchase activities.', 'Oversee outstanding client balances, establish trading limits, and register payment receipts.')
supp_header = supp_header.replace('handleExportSuppliers', 'handleExportCustomers')
supp_header = supp_header.replace('Add Supplier', 'Onboard Client')

cust_header_match = re.search(r'      {/\* Header Panel \*/}\n      <div style={{ display: \'flex\', justifyContent: \'space-between\', alignItems: \'center\', marginBottom: \'28px\', flexWrap: \'wrap\', gap: \'16px\' }}>(.*?)        </div>\n      </div>', cust, re.DOTALL)
if cust_header_match:
    cust_header_full = "      {/* Header Panel */}\n      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>" + cust_header_match.group(1) + "        </div>\n      </div>"
    cust = cust.replace(cust_header_full, supp_header)

# 2. Search Container extraction
supp_search_match = re.search(r'      {/\* FILTER BAR AND SMART SEARCH \*/}\n      <div className="search-container"(.*?)      </div>\n      </div>', supp, re.DOTALL)
supp_search = "      {/* FILTER BAR AND SMART SEARCH */}\n      <div className=\"search-container\"" + supp_search_match.group(1) + "      </div>\n      </div>"

# Replace specific tabs in search container
tab_section_pattern = re.compile(r'{/\* Tab Controls \*/}.*?</div>\n        </div>', re.DOTALL)

cust_tabs = """{/* Tab Controls */}
          <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '0px' }}>
            <button onClick={() => setActiveTab('all')} className={`filter-tab ${activeTab === 'all' ? 'active' : ''}`}>
              All Accounts
            </button>
            <button onClick={() => setActiveTab('credit')} className={`filter-tab ${activeTab === 'credit' ? 'active' : ''}`}>
              Outstanding Debts
            </button>
            <button onClick={() => setActiveTab('key')} className={`filter-tab ${activeTab === 'key' ? 'active' : ''}`}>
              Key Accounts
            </button>
            <button onClick={() => setActiveTab('distributor')} className={`filter-tab ${activeTab === 'distributor' ? 'active' : ''}`}>
              Distributors
            </button>
            <button onClick={() => setActiveTab('retail')} className={`filter-tab ${activeTab === 'retail' ? 'active' : ''}`}>
              Retail
            </button>
          </div>
        </div>"""

supp_search = tab_section_pattern.sub(cust_tabs, supp_search)
supp_search = supp_search.replace('Search suppliers, contacts, or email...', 'Search clients by name, contact, location or tag...')

cust_search_match = re.search(r'      {/\* Filter and Control Panel \*/}\n      <div className="search-container">(.*?)      </div>\n      </div>', cust, re.DOTALL)
if cust_search_match:
    cust_search_full = "      {/* Filter and Control Panel */}\n      <div className=\"search-container\">" + cust_search_match.group(1) + "      </div>\n      </div>"
    cust = cust.replace(cust_search_full, supp_search)

with open(cust_file, 'w') as f:
    f.write(cust)

print("UI patches applied!")
