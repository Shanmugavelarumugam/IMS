import re

customers_path = '/Users/btc001a/Downloads/MyFolder/inventary-IMS/IMS-FE/src/modules/customers/pages/CustomersPage.tsx'
suppliers_path = '/Users/btc001a/Downloads/MyFolder/inventary-IMS/IMS-FE/src/modules/suppliers/pages/SuppliersPage.tsx'

with open(suppliers_path, 'r') as f:
    supp_content = f.read()
    
with open(customers_path, 'r') as f:
    cust_content = f.read()

# Extract Drawer from Suppliers
supp_drawer_match = re.search(r'      {/\* ========================================= \*/}\n      {/\* SLIDE OVER RIGHT DETAIL DRAWER \*/}\n      {/\* ========================================= \*/}\n      {selectedSupplier && \((.*?)\n      {/\* ========================================= \*/}\n      {/\* CREATION & ONBOARD WIZARD DIALOG MODAL', supp_content, re.DOTALL)

if not supp_drawer_match:
    print("Failed to find supplier drawer")
    exit(1)

supp_drawer = "      {selectedCustomer && (" + supp_drawer_match.group(1)

# Transform
supp_drawer = supp_drawer.replace('selectedSupplier', 'selectedCustomer')
supp_drawer = supp_drawer.replace('Supplier Profile', 'Customer Profile')
supp_drawer = supp_drawer.replace('Supplier Score', 'Trust Rating')
supp_drawer = supp_drawer.replace('Purchase Invoices', 'Sales Orders')
supp_drawer = supp_drawer.replace('outstandingOrders', 'totalOrders')
supp_drawer = supp_drawer.replace('type-oem', 'type-key')
supp_drawer = supp_drawer.replace('setShowPaymentModal', 'setShowReceiptModal')
supp_drawer = supp_drawer.replace('Record Payment', 'Record Receipt')
supp_drawer = supp_drawer.replace('IndianRupee size={14}', 'CheckCircle2 size={16}')
supp_drawer = supp_drawer.replace('Edit Supplier', 'Edit Customer')
supp_drawer = supp_drawer.replace('Delete Supplier', 'Delete Customer')

# In Suppliers: {selectedSupplier.name.charAt(0).toUpperCase()}
# Already replaced by selectedCustomer above.

# Extract Customers drawer
cust_drawer_match = re.search(r'      {/\* DRAWER VIEW - CUSTOMER PROFILE & LEDGER \*/}\n      {selectedCustomer && \((.*?)\n      {/\* MODAL 1 - ONBOARD / EDIT CUSTOMER PROFILE \*/}', cust_content, re.DOTALL)

if not cust_drawer_match:
    print("Failed to find customer drawer")
    exit(1)

# Replace
cust_content = cust_content.replace(
    '      {/* DRAWER VIEW - CUSTOMER PROFILE & LEDGER */}\n      {selectedCustomer && (' + cust_drawer_match.group(1),
    '      {/* ========================================= */}\n      {/* SLIDE OVER RIGHT DETAIL DRAWER */}\n      {/* ========================================= */}\n' + supp_drawer
)

with open(customers_path, 'w') as f:
    f.write(cust_content)

print("Drawer updated")

