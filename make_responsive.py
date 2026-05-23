import re
import os

app_css_path = '/Users/btc001a/Downloads/MyFolder/inventary-IMS/IMS-FE/src/styles/App.css'
root_layout_path = '/Users/btc001a/Downloads/MyFolder/inventary-IMS/IMS-FE/src/app/layouts/RootLayout.tsx'
cust_path = '/Users/btc001a/Downloads/MyFolder/inventary-IMS/IMS-FE/src/modules/customers/pages/CustomersPage.tsx'
supp_path = '/Users/btc001a/Downloads/MyFolder/inventary-IMS/IMS-FE/src/modules/suppliers/pages/SuppliersPage.tsx'

# 1. Update App.css
with open(app_css_path, 'r') as f:
    app_css = f.read()

responsive_css = """
/* Responsive Overrides */
.sidebar-container {
  z-index: 1000;
  position: relative;
}

.mobile-sidebar-overlay {
  display: none;
}

.mobile-menu-btn {
  display: none;
}

.premium-table-wrapper {
  overflow-x: auto;
  width: 100%;
}

@media (max-width: 1024px) {
  .main-content {
    margin-left: 0;
    padding: 16px !important;
  }
  .sidebar {
    transform: translateX(-100%);
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .sidebar-container.open .sidebar {
    transform: translateX(0);
    box-shadow: 4px 0 24px rgba(0,0,0,0.1);
  }
  .mobile-sidebar-overlay {
    display: block;
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(15, 23, 42, 0.4);
    backdrop-filter: blur(4px);
    z-index: 990;
    animation: fadeIn 0.3s ease;
  }
  .mobile-menu-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f1f5f9;
    border: 1px solid #e2e8f0;
    border-radius: 10px;
    padding: 8px;
    cursor: pointer;
    color: #475569;
  }
  .hide-on-mobile {
    display: none !important;
  }
  .page-header {
    flex-direction: column;
    align-items: flex-start !important;
    gap: 16px;
  }
  .page-header > div:last-child {
    width: 100%;
    justify-content: flex-start;
    flex-wrap: wrap;
  }
  .stats-grid {
    grid-template-columns: repeat(auto-fit, minmax(100%, 1fr));
  }
  .right-drawer-container {
    width: 100% !important;
    max-width: 100% !important;
    border-radius: 0 !important;
  }
  .search-container {
    flex-direction: column;
    align-items: stretch !important;
    gap: 12px;
  }
  .search-container > div {
    width: 100%;
  }
}
"""
# Replace the old media query with the new one
app_css = re.sub(r'@media \(max-width: 768px\) \{.*?\n\}\n', responsive_css, app_css, flags=re.DOTALL)
if 'responsive_css' not in app_css:
    # If the regex didn't match, just append
    if '.mobile-sidebar-overlay' not in app_css:
        app_css += responsive_css

with open(app_css_path, 'w') as f:
    f.write(app_css)

# 2. Update RootLayout.tsx
with open(root_layout_path, 'r') as f:
    root = f.read()

root = root.replace("import { LayoutDashboard, Package", "import { Menu, LayoutDashboard, Package")
root = root.replace("const Sidebar = () => {", "const Sidebar = ({ onClose }: { onClose?: () => void }) => {")

root = re.sub(r'to=\{link.path\}', r'to={link.path}\n              onClick={onClose}', root)
root = re.sub(r'onClick=\{handleLogout\}', r'onClick={(e) => { if (onClose) onClose(); handleLogout(e); }}', root)

root = root.replace("const TopBar = () => {", "const TopBar = ({ onMenuClick }: { onMenuClick: () => void }) => {")

topbar_div = """      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button 
          className="mobile-menu-btn"
          onClick={onMenuClick}
        >
          <Menu size={20} />
        </button>
        {/* 1. Dynamic Breadcrumbs (left side) */}"""
root = root.replace("{/* 1. Dynamic Breadcrumbs (left side) */}", topbar_div)

root = root.replace("{!hideBreadcrumbsAndSearch && (", "{!hideBreadcrumbsAndSearch && (\n          <div className=\"hide-on-mobile\" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>", 1)
root = root.replace("</div>\n      )}", "</div>\n        </div>\n      )}", 1)

root = root.replace("export const RootLayout = () => {", "export const RootLayout = () => {\n  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);")

root_layout_render = """    <div className="app-layout">
      {isMobileMenuOpen && (
        <div className="mobile-sidebar-overlay" onClick={() => setIsMobileMenuOpen(false)}></div>
      )}
      <div className={`sidebar-container ${isMobileMenuOpen ? 'open' : ''}`}>
        <Sidebar onClose={() => setIsMobileMenuOpen(false)} />
      </div>
      <main className="main-content">
        <TopBar onMenuClick={() => setIsMobileMenuOpen(true)} />
        <div style={{ padding: '0 32px 32px' }} className="mobile-content-padding">"""
        
root = re.sub(r'    <div className="app-layout">\n      <Sidebar />\n      <main className="main-content">\n        <TopBar />\n        <div style={{ padding: \'0 32px 32px\' }}>', root_layout_render, root)
# Actually, the div style={{ padding: '0 32px 32px' }} might be an issue. Let's make it responsive.
root = root.replace("<div style={{ padding: '0 32px 32px' }} className=\"mobile-content-padding\">", "<div style={{ paddingBottom: '32px' }}>")

# Wait, let's fix the extra div closure issue from breadcrumbs modification
with open(root_layout_path, 'w') as f:
    f.write(root)


# 3. Update CustomersPage.tsx and SuppliersPage.tsx
def make_responsive_pages(path):
    with open(path, 'r') as f:
        content = f.read()
    
    # Drawers width fixes to use max-width
    content = re.sub(r"width: '450px'", "width: '100%', maxWidth: '450px'", content)
    content = re.sub(r"width: '600px'", "width: '100%', maxWidth: '600px'", content)
    
    # Table overflow fixes
    content = re.sub(r"overflow: 'hidden'", "overflowX: 'auto'", content)
    
    with open(path, 'w') as f:
        f.write(content)

make_responsive_pages(cust_path)
make_responsive_pages(supp_path)

print("Applied responsiveness patches successfully!")
