import re

customers_path = '/Users/btc001a/Downloads/MyFolder/inventary-IMS/IMS-FE/src/modules/customers/pages/CustomersPage.tsx'
suppliers_path = '/Users/btc001a/Downloads/MyFolder/inventary-IMS/IMS-FE/src/modules/suppliers/pages/SuppliersPage.tsx'

with open(suppliers_path, 'r') as f:
    supp_content = f.read()
    
with open(customers_path, 'r') as f:
    cust_content = f.read()

# Extract the <style> block from Suppliers
style_match = re.search(r'<style>{`\n(.*?)`}</style>', supp_content, re.DOTALL)
if style_match:
    supp_style = style_match.group(1)
    
    # Replace supplier specific classes in the style with customer specific
    supp_style = supp_style.replace('.supplier-', '.customer-')
    supp_style = supp_style.replace('.debt-pill-premium', '.receivable-pill-premium')
    supp_style = supp_style.replace('.debt-value', '.receivable-value')
    # Types
    supp_style = supp_style.replace('.type-oem', '.type-key')
    supp_style = supp_style.replace('.type-logistics', '.type-distributor')
    
    # Now replace the <style> block in Customers
    cust_content = re.sub(r'<style>{`\n(.*?)`}</style>', f'<style>{{`\n{supp_style}`}}</style>', cust_content, flags=re.DOTALL)

# Write it back for now to see if style updates
with open(customers_path, 'w') as f:
    f.write(cust_content)

print("Style updated")

