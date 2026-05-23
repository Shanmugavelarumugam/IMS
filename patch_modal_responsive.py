import re

dash_path = '/Users/btc001a/Downloads/MyFolder/inventary-IMS/IMS-FE/src/modules/dashboard/pages/DashboardPage.tsx'

with open(dash_path, 'r') as f:
    content = f.read()

# 1. Update the grid layout container
content = content.replace(
    "<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>",
    "<div className=\"config-modal-grid\" style={{ display: 'grid', gap: '24px' }}>"
)

# 2. Update the right column container
content = content.replace(
    "<div style={{ borderLeft: '1px solid #f1f5f9', paddingLeft: '24px' }}>",
    "<div className=\"config-modal-right\">"
)

# 3. Add base styles outside media query
base_css = """
        /* Configure Modal Layout */
        .config-modal-grid {
          grid-template-columns: 1fr 1fr;
        }
        .config-modal-right {
          border-left: 1px solid #f1f5f9;
          padding-left: 24px;
        }
"""
content = content.replace("/* Stunning Luxury Dashboard Theme */", "/* Stunning Luxury Dashboard Theme */\n" + base_css)

# 4. Add mobile styles inside media query (max-width: 768px)
mobile_css = """
          .config-modal-grid {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
          }
          .config-modal-right {
            border-left: none !important;
            padding-left: 0 !important;
            border-top: 1px solid #f1f5f9 !important;
            padding-top: 24px !important;
          }
"""

content = content.replace("          .op-highlights-header {", mobile_css + "          .op-highlights-header {")

with open(dash_path, 'w') as f:
    f.write(content)

print("Modal responsive styling applied!")
